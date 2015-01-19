/*global describe, it:true*/
'use strict';
var chai = require('chai');
var expect = chai.expect;

var SerialPortFactory = require('../');
SerialPortFactory.extensionId = 'glbcoioheoliejkddbfabekjgmebfbog';

var SerialPort = SerialPortFactory.SerialPort;


describe('SerialPort', function () {

  var port;
  afterEach(function (done) {
    if(!port){ return done(); }

    //closing on non open ports otherwise never returns...
    port = null;
    done();

    // port.close();
    // port.on('close', function(){
    //   return done();
    // });
  });

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
      port = new SerialPort('/dev/tty.usbmodem1411', function (err) {
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

      port = new SerialPort('/dev/johnJacobJingleheimerSchmidt');
    });

    it('emits an error on the serialport when explicit error handler present', function (done) {
      port = new SerialPort('/dev/johnJacobJingleheimerSchmidt');

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

      port = new SerialPort('/dev/exists', { stopBits : 19 }, false, errorCallback);
    });

    it('errors with invalid stopbits', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      port = new SerialPort('/dev/exists', { stopBits : 19 }, false, errorCallback);
    });

    it('errors with invalid parity', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      port = new SerialPort('/dev/exists', { parity : 'something' }, false, errorCallback);
    });

    it('errors with invalid path', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      port = new SerialPort(null, false, errorCallback);
    });

    it('allows optional options', function (done) {
      port = new SerialPort('/dev/exists', function () {});
      expect(typeof port.options).to.eq('object');
      done();
    });

  });
});