/*global chrome, document:false */
'use strict';

var SerialPort = require('browser-serialport');

//can't be global
var serialPort;

//data channel
chrome.runtime.onConnectExternal.addListener(function(port) {
  console.log('socket opened');

  serialPort.on('disconnect', function (err) {
    console.log('serialport disconnected', err);
    var resp = {};
    resp.op = 'onDisconnect';
    port.postMessage(resp);
  });

  //collapse into .error field?
  serialPort.on('error', function (err) {
    console.log('serialport errored', err);
    var resp = {};
    resp.op = 'onError';
    port.postMessage(resp);
  });

  serialPort.on('close', function () {
    console.log('serialport closed');
    // let other end emit close when it notices port disconnect
    var resp = {};
    resp.op = 'onClose';
    port.postMessage(resp);
  });

  serialPort.on('data', function (data) {
    console.log('serialport data');
    var resp = {};
    resp.op = 'data';
    resp.data = data;
    port.postMessage(resp);
  });

  port.onMessage.addListener(function (msg) {
    console.log('socket received', msg);
    //check for string as well? or force buffer sends from other side...
    if(msg && msg.hasOwnProperty('data')){
      var buffer = new Buffer(msg.data);
      console.log('writing to serial', buffer.toString('utf-8'));
      serialPort.write(buffer, function(err, results){
        console.log(err, results);
      });
    }
  });

  port.onDisconnect.addListener(function () {
    console.log('socket disconnected');
    serialPort.close();
  });

});

//command channel
chrome.runtime.onMessageExternal.addListener(function(msg, sender, responder) {

  console.log(msg);

  var cmds = {
    getManifest:function(){
      var resp = {};
      resp.data = chrome.runtime.getManifest();
      responder(resp);
    },
    list:function(){
      SerialPort.list(function (err, data) {
        console.log(msg.op, 'err:', err, data);
        var resp = {};
        if (err){ resp.error = err.message; }
        if (data){ resp.data = data; }
        responder(resp);
      });
    },
    construct:function(){
      console.log('construct');
      var resp = {};
      serialPort = new SerialPort.SerialPort(msg.path, msg.options, false, function(err){
        console.log(msg.op, 'err:', err);
        if (err){ resp.error = err.message; }
      });
      responder(resp);
    },
    open:function(){
      serialPort.open(function(err){
        console.log(msg.op, 'err:', err);
        var resp = {};
        if (err){ resp.error = err.message; }
        responder(resp);
      });
    },
    close:function(){
      serialPort.close(function (err){
        console.log(msg.op, 'err:', err);
        var resp = {};
        if (err){ resp.error = err.message; }
        responder(resp);
      });
    },
    drain:function(){
      serialPort.drain(function (err, data){
        console.log(msg.op, 'err:', err, data);
        var resp = {};
        if (err){ resp.error = err.message; }
        if (data){ resp.data = data; }
        responder(resp);
      });
    },
    flush:function(){
      serialPort.flush(function (err, data){
        console.log(msg.op, 'err:', err, data);
        var resp = {};
        if (err){ resp.error = err.message; }
        if (data){ resp.data = data; }
        responder(resp);
      });
    }
  };

  if (!cmds.hasOwnProperty(msg.op)) {
    return responder({error:'Unknown op'});
  }

  cmds[msg.op]();

  return true; // required if we want to respond after the listener
});

chrome.app.runtime.onLaunched.addListener(function() {
  var a = document.createElement('a');
  a.href = 'http://127.0.0.1:8080/';
  a.target='_blank';
  a.click();
});