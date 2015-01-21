#chrome-serialport
Exposes a chrome extension with serial permissions as a fully compliant node-serial interface. Uses [Google Chrome Messaging](https://developer.chrome.com/extensions/messaging) to pass data from USB devices to front end code. 

##install
To install the serialport require, simply
```
npm install chrome-serialport
```

##use
Only one change to node-serialport, you need to set the extension id on the factory for the extension that you're communicating to. See below for more info on that.
```js
var SerialPortFactory = require('chrome-serialport');
var SerialPort = SerialPortFactory.SerialPort;
//only difference 
SerialPortFactory.extensionId = 'glbcoioheoliejkddbfabekjgmebfbog';
```
Theres one additional function not found in node-serialport. Its handy to know if the library could actually find your chrome extension
```js
SerialPortFactory.isInstalled(function(err){
 if(err){
   console.log(err);
 }
 console.log('Chrome extension installed!');
});
```
Other than that we're working for 100% compatibility with [node-serial](https://github.com/voodootikigod/node-serialport) so see their docs.

##official chrome extension
But you're not done there. You'll need our chrome extension installed. Find it in the store at xxx and you're all set, or build from scratch.

##build chrome extension
```
npm i && gulp
```
Then navigate to chrome://extensions/ and check developer mode in the upper right corner. Click load unpacked extension and choose the build directory. You'll see it was assigned an extension id like 'glbcoioheoliejkddbfabekjgmebfbog', copy that string. Go into tests/basic.js and replace SerialPort.extensionId = '' with your string.

##tests
```js
npm test
```
And load up http://127.0.0.1:8080/ in your browser

##make it your own
Edit manifest.json to change the package name, description etc and add another entry in the manifest.json under matches for your own domain. Then see [Google Developer Pages](https://developer.chrome.com/webstore) for how to get your app uploaded.