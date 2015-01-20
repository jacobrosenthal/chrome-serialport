'use strict';

var EE = require('events').EventEmitter;
var util = require('util');

var SerialPort = function (path, options, openImmediately, callback) {

  EE.call(this);

  var self = this;
  self.port = {};

  var args = Array.prototype.slice.call(arguments);
  callback = args.pop();
  if (typeof(callback) !== 'function') {
    callback = null;
  }

  this.options = (typeof options !== 'function') && options || {};

  openImmediately = (openImmediately === undefined || openImmediately === null) ? true : openImmediately;

  callback = callback || function (err) {
    if (err) {
      if (self._events.error) {
        self.emit('error', err);
      } else {
        //factory doesnt exist atm
        // factory.emit('error', err);
      }
    }
  };

  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'construct', path: path, options: this.options},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(chrome.runtime.lastError);
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      if (openImmediately) {
        process.nextTick(function () {
          self.open(callback);
        });
      }
    });

};
util.inherits(SerialPort, EE);

//always open immediately
SerialPort.prototype.open = function (callback) {
  if(!callback) { callback = function () {}; }

  var self = this;

  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'open'},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(chrome.runtime.lastError);
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      self.port = chrome.runtime.connect(SerialPortFactory.extensionId);
      if(chrome.runtime.lastError)
      {
        //any other cleanup?
        return callback(chrome.runtime.lastError);
      }

      var handleMessage = function (msg) {

        console.log(msg, 'received');

        var cmds = {
          onOpen:function (){
            self.emit('open');
          },
          onDisconnect:function (){
            self.emit('disconnect', msg.error);
          },
          onError:function (){
            self.emit('error', msg.error);
          },
          onClose:function (){
            self.emit('close');
          },
          data:function (){
            self.emit('data', msg.data);
          }
        };

        if (!cmds.hasOwnProperty(msg.op)) {
          console.log('unknown op');
        }

        cmds[msg.op]();
      };

      self.port.onMessage.addListener(handleMessage);
      callback();
    });
};

SerialPort.prototype.write = function (buffer, callback) {
  if(!callback) { callback = function () {}; }

  this.port.postMessage(buffer);

  callback(chrome.runtime.lastError);
};

SerialPort.prototype.flush = function (callback) {
  if(!callback) { callback = function () {}; }

  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'flush'},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(chrome.runtime.lastError);
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      callback(null, response.data);
    });
};

SerialPort.prototype.drain = function (callback) {
  if(!callback) { callback = function () {}; }

  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'drain'},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(chrome.runtime.lastError);
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      callback(null, response.data);
    });
};

SerialPort.prototype.close = function (callback) {
  if(!callback) { callback = function () {}; }

  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'close'},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(chrome.runtime.lastError);
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      callback();
    });
};

var list = function(callback) {
  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'list'},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(chrome.runtime.lastError);
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      callback(null, response.data);
    });
};

function isInstalled(callback)
{
  if(typeof chrome.runtime === 'undefined')
  {
    return callback(new Error('chrome-serialport not installed'));
  }

  getManifest(function(err){
    if(err){
      return err;
    }

    callback();
  });
}

/*
input none
callback callback
*/
function getManifest(callback)
{
  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'getManifest'},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(chrome.runtime.lastError);
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      callback(null, response.data);

    });
}

var SerialPortFactory = {
  SerialPort: SerialPort,
  list: list,
  isInstalled: isInstalled
};

module.exports = SerialPortFactory;