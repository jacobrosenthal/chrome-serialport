'use strict';

var EE = require('events').EventEmitter;
var util = require('util');

var handleMessage = function (msg) {
  var self = this;

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


var SerialPort = function (path, options, openImmediately, callback) {

  console.log(this); //undefined?!?
  EE.call(this);

  var self = this;
  self.port = {};

  var args = Array.prototype.slice.call(arguments);
  callback = args.pop();
  if (typeof(callback) !== 'function') {
    callback = null;
  }

  options = (typeof options !== 'function') && options || {};

  openImmediately = true;

  callback = callback || function (err) {
    if (err) {
      if (self._events.error) {
        self.emit('error', err);
      } else {
        factory.emit('error', err);
      }
    }
  };

  console.log(path, options, openImmediately, callback);

  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'open', path: path, options: options},
    function(response) {
      console.log(response);
      console.log(chrome.runtime.lastError);
      if(chrome.runtime.lastError){
        return callback(new Error(chrome.runtime.lastError.message));
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      self.port = chrome.runtime.connect(SerialPortFactory.extensionId);

      //does chrome even give you an error for connects?
      if(chrome.runtime.lastError)
      {
        //any other cleanup?
        return callback(new Error(chrome.runtime.lastError.message));
      }
      console.log('here');

      self.port.onMessage.addListener(handleMessage);
      console.log('here');

      callback();
    });
}
util.inherits(SerialPort, EE);


//always open immediately
SerialPort.prototype.open = function (callback) {
  callback(new Error('We dont support lazy opening'));
};


SerialPort.prototype.write = function (buffer, callback) {
  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'write', data: buffer},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(new Error(chrome.runtime.lastError.message));
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      callback(null, response.data);
    });
};

SerialPort.prototype.flush = function (callback) {
  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'flush'},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(new Error(chrome.runtime.lastError.message));
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      callback(null, response.data);
    });
};

SerialPort.prototype.drain = function (callback) {
  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'drain'},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(new Error(chrome.runtime.lastError.message));
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      callback(null, response.data);
    });
};

SerialPort.prototype.close = function (callback) {
  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'close'},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(new Error(chrome.runtime.lastError.message));
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
        return callback(new Error(chrome.runtime.lastError.message));
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      callback(null, response.data);
    });
};

function isInstalled(done)
{
  if(typeof chrome.runtime === 'undefined')
  {
    return done(new Error('chrome-serialport not installed'));
  }

  getManifest(function(err){
    if(err){
      return err;
    }

    done();
  });
}

/*
input none
done callback
*/
function getManifest(done)
{
  chrome.runtime.sendMessage(SerialPortFactory.extensionId, {op: 'getManifest'},
    function(response) {
      if(chrome.runtime.lastError){
        return done(new Error(chrome.runtime.lastError.message));
      }

      if(response && response.error){
        return done(new Error(response.error));
      }

      done(null, response.data);

    });
}

var SerialPortFactory = {
  SerialPort: SerialPort,
  list: list,
  isInstalled: isInstalled
};

module.exports = SerialPortFactory;