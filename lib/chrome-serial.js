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


function SerialPort(path, options, openImmediately, callback) {

  EE.call(this);
  var self = this;

  //need to options juggle, sigh

  chrome.runtime.sendMessage(this.extensionId, {op: 'open', path: path, options: options},
    function(response) {
      if(chrome.runtime.lastError){
        return callback(new Error(chrome.runtime.lastError.message));
      }

      if(response && response.error){
        return callback(new Error(response.error));
      }

      //send options too somehow, always open immediately
      self.port = chrome.runtime.connect();
      //does chrome even give you an error for connects?
      if(chrome.runtime.lastError)
      {
        //any other cleanup?
        return callback(new Error(chrome.runtime.lastError.message));
      }

      self.port.onMessage.addListener(handleMessage);

      callback();
    });
}
util.inherits(SerialPort, EE);


//always open immediately
SerialPort.prototype.open = function (callback) {
  callback(new Error('We dont support lazy opening'));
};


SerialPort.prototype.write = function (buffer, callback) {
  chrome.runtime.sendMessage(this.extensionId, {op: 'write', data: buffer},
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
  chrome.runtime.sendMessage(this.extensionId, {op: 'write', data: buffer},
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
  chrome.runtime.sendMessage(this.extensionId, {op: 'write', data: buffer},
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
  chrome.runtime.sendMessage(this.extensionId, {op: 'write', data: buffer},
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
  chrome.runtime.sendMessage(this.extensionId, {op: 'list'},
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

function isInstalled(extensionId, done)
{
  if(typeof chrome.runtime === 'undefined')
  {
    return done(new Error('chrome-serialport not installed'));
  }

  getManifest(extensionId, function(err){
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
function getManifest(extensionId, done)
{
  chrome.runtime.sendMessage(extensionId, {op: 'getManifest'},
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


module.exports = {
  SerialPort: SerialPort,
  list: list,
  isInstalled: isInstalled
};