/*global describe, it:true*/
'use strict';
var chai = require('chai');
var expect = chai.expect;

var SerialPortFactory = require('../');
SerialPortFactory.extensionId = 'glbcoioheoliejkddbfabekjgmebfbog';

var SerialPort = SerialPortFactory.SerialPort;


describe('SerialPort', function () {

  describe('Factory', function () {

    it('is installed', function (done) {
      SerialPortFactory.isInstalled(function(err){
        expect(err).to.not.be.ok;
        done();
      });
    });

    it('lists ports', function (done) {
      SerialPortFactory.list(function(err, data){
        expect(err).to.not.be.ok;
        expect(data).to.exist;
        done();
      });
    });

  });

  describe('Constructor', function () {

    it('opens the port immediately', function (done) {
      var port = SerialPort('/dev/exists', function (err) {
        expect(err).to.not.be.ok;
        done();
      });
    });

    it.skip('emits an error on the factory when erroring without a callback', function (done) {
      // finish the test on error
      SerialPortFactory.once('error', function (err) {
        chai.assert.isDefined(err, "didn't get an error");
        done();
      });

      var port = SerialPort('/dev/johnJacobJingleheimerSchmidt');
    });

    it('emits an error on the serialport when explicit error handler present', function (done) {
      var port = new SerialPort('/dev/johnJacobJingleheimerSchmidt', options);

      port.once('error', function(err) {
        chai.assert.isDefined(err);
        done();
      });
    });

    it('errors with invalid stopbits', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = SerialPort('/dev/exists', { stopBits : 19 }, false, errorCallback);
    });

    it('errors with invalid stopbits', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = new SerialPort('/dev/exists', { stopBits : 19 }, false, errorCallback);
    });

    it('errors with invalid parity', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = new SerialPort('/dev/exists', { parity : 'something' }, false, errorCallback);
    });

    it('errors with invalid path', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = new SerialPort(null, false, errorCallback);
    });

    it('allows optional options', function (done) {
      global.chrome.serial = options.serial;
      var cb = function () {};
      var port = new SerialPort('/dev/exists', cb);
      // console.log(port);
      expect(typeof port.options).to.eq('object');
      delete global.chrome.serial;
      done();
    });

  });
});