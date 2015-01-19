var SerialPort = require('browser-serialport');

var serialPort;

//data channel
chrome.runtime.onConnectExternal.addListener(function(port) {
  console.log(port, 'opened');

  serialPort.on('open', function () {
    console.log(port.name, 'opened');
    var resp = {};
    resp.op = 'onOpen';
    port.postMessage(resp);
  });

  serialPort.on('disconnect', function (err) {
    console.log(port.name, 'disconnected', err);
    var resp = {};
    resp.op = 'onDisconnect';
    port.postMessage(resp);
  });

  //collapse into .error field?
  serialPort.on('error', function (err) {
    console.log(port.name, 'errored', err);
    var resp = {};
    resp.op = 'onError';
    port.postMessage(resp);
  });

  serialPort.on('close', function () {
    console.log(port.name, 'closed');
    var resp = {};
    resp.op = 'onClose';
    port.postMessage(resp);
  });

  serialPort.on('data', function (data) {
    console.log(port.name, 'data');
    var resp = {};
    resp.op = 'data';
    resp.data = data;
    port.postMessage(resp);
  });

  port.onMessage.addListener(function (msg) {
    console.log(msg, 'received');
    serialPort.write(msg);
  });

  port.onDisconnect.addListener(function () {
    console.log(port, 'disconnected');
    serialPort.close();
  });

});

//command channel
chrome.runtime.onMessageExternal.addListener(function(msg, sender, responder) {

  var cmds = {
    getManifest:function(){
      var resp = {};
      resp.data = chrome.runtime.getManifest();
      responder(resp);
    },
    list:function(){
      SerialPort.list(function (err, data) {
        console.log(err, data);
        var resp = {};
        if (err){ resp.error = err.message; }
        if (data){ resp.data = data; }
        responder(resp);
      });
    },
    open:function(){
      var serialPort = new SerialPort.SerialPort(msg.path, msg.options, function(err){
        console.log(err);
        var resp = {};
        if (err){ resp.error = err.message; }
        responder(resp);
      });
    },
    close:function(){
      serialPort.close(function (err){
        console.log(err);
        var resp = {};
        if (err){ resp.error = err.message; }
        responder(resp);
      });
    },
    drain:function(){
      serialPort.drain(function (err, data){
        console.log(err, data);
        var resp = {};
        if (err){ resp.error = err.message; }
        if (data){ resp.data = data; }
        responder(resp);
      });
    },
    flush:function(){
      serialPort.flush(function (err, data){
        console.log(err, data);
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

chrome.app.runtime.onLaunched.addListener(function(data) {
  var a = document.createElement('a');
  a.href = 'http://127.0.0.1:8080/';
  a.target='_blank';
  a.click();
});