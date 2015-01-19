#chrome-serial
Exposes a chrome extension with serial permissions as a fully compliant node-serial interface. Uses [Google Chrome Messaging](https://developer.chrome.com/extensions/messaging) to pass data from USB devices to front end code. 

##install
To install the serialport require, simply
```
npm install chrome-serialport
```

##use
Just like node-serialport
```js
var SerialPort = require("chrome-serialport").SerialPort
var serialPort = new SerialPort("/dev/tty-usbserial1", {
  baudrate: 57600
});
serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });
  serialPort.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});

```

##official chrome extension
But you're not done there. You'll need our chrome extension installed. Find it in the store at xxx and you're all set, or build from scratch.

##build chrome extension
```
npm i && gulp
```
Then navigate to chrome://extensions/ and check developer mode in the upper right corner. Click load unpacked extension and choose the build directory. You'll see it was assigned an extension id like 'glbcoioheoliejkddbfabekjgmebfbog', copy that string. Go into tests/basic.js and replace SerialPort.extensionId = '' with your string.

##tests
```js
gulp tests && beefy --index=index.html --cwd=tests/build/ 8080
```
And load up http://127.0.0.1:8080/ in your browser

##make it your own
Edit manifest.json to change the package name, description etc and add another entry in the manifest.json under matches for your own domain. Then see [Google Developer Pages](https://developer.chrome.com/webstore) for how to get your app uploaded.