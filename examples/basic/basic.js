'use strict';
//example ripped from the front page of node-serial

var SerialPortFactory = require('../../');
var SerialPort = SerialPortFactory.SerialPort;
//only difference 
SerialPortFactory.extensionId = 'glbcoioheoliejkddbfabekjgmebfbog';

// might want to wrap your code in this to make sure
// chrome extension is installed and listening
// SerialPortFactory.isInstalled(function(err){
//   if(err){
//     console.log(err);
//   }
//   console.log('Chrome extension installed!');
// });

var serialPort = new SerialPort('/dev/tty-usbserial1', {
  baudrate: 57600
});

serialPort.on('open', function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });
  serialPort.write('ls\n', function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});