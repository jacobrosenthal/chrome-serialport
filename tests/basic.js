/*global describe, it:true*/
'use strict';
var chai = require('chai');
var expect = chai.expect;
// var sinon = require('sinon'); //doesnt appear to browserify? using hosted version

var SerialPortFactory = require('../');
SerialPortFactory.extensionId = 'glbcoioheoliejkddbfabekjgmebfbog';

var SerialPort = SerialPortFactory.SerialPort;

var exists = '/dev/tty.usbmodem1411';

describe('SerialPort', function () {
  var sandbox;
  var port;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function (done) {
    sandbox.restore();

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
      port = new SerialPort(exists, function (err) {
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

    it('errors with invalid databits', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      port = new SerialPort(exists, { databits : 19 }, false, errorCallback);
    });

    it('errors with invalid stopbits', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      port = new SerialPort(exists, { stopBits : 19 }, false, errorCallback);
    });

    it('errors with invalid parity', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      port = new SerialPort(exists, { parity : 'something' }, false, errorCallback);
    });

    it('errors with invalid path', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      port = new SerialPort(null, false, errorCallback);
    });

    it('allows optional options', function (done) {
      port = new SerialPort(exists, function () {});
      expect(typeof port.options).to.eq('object');
      done();
    });

  });

  describe.skip('reading data', function () {

    it('emits data events by default', function (done) {
      var testData = new Buffer('I am a really short string');
      var port = new SerialPort(exists, options, function () {
        port.once('data', function(recvData) {
          expect(recvData).to.eql(testData);
          done();
        });
        hardware.emitData(testData);
      });
    });

    it('calls the dataCallback if set', function (done) {
      var testData = new Buffer('I am a really short string');
      var options = {};
      options.dataCallback = function (recvData) {
          expect(recvData).to.eql(testData);
          done();
        };

      var port = new SerialPort('exists', options, function () {
        hardware.emitData(testData);
      });
    });

  });

  describe.skip('#open', function () {

    it('passes the port to the bindings', function (done) {
      var openSpy = sandbox.spy(options.serial, 'connect');
      var port = new SerialPort(exists, options, false);
      port.open(function (err) {
        expect(err).to.not.be.ok;
        expect(openSpy.calledWith('/dev/exists'));
        done();
      });
    });

    it('calls back an error when opening an invalid port', function (done) {
      var port = new SerialPort(exists, options, false);
      port.open(function (err) {
        expect(err).to.be.ok;
        done();
      });
    });

    it("emits data after being reopened", function (done) {
      var data = new Buffer("Howdy!");
      var port = new SerialPort(exists, options, function () {
        port.close();
        port.open(function () {
          port.once('data', function (res) {
            expect(res).to.eql(data);
            done();
          });
          hardware.emitData(data);
        });
      });
    });

  });

  describe('close', function () {
    it("fires a close event when it's closed", function (done) {
      var port = new SerialPort(exists, function () {
        var closeSpy = sandbox.spy();
        port.on('close', closeSpy);
        port.close();
        expect(closeSpy.calledOnce);
        done();
      });
    });

    it("fires a close event after being reopened", function (done) {
      var port = new SerialPort(exists, function () {
        var closeSpy = sandbox.spy();
        port.on('close', closeSpy);
        port.close();
        port.open();
        port.close();
        expect(closeSpy.calledTwice);
        done();
      });
    });

    it("errors when closing an invalid port", function (done) {
      var port = new SerialPort(exists, function(){
        port.on('close', function(){

          port.close(function(err){
            expect(err).to.be.ok;
            done();
          });

        });
        port.close();
      });
    });

  });

  describe('#send', function () {

    it("errors when writing a closed port", function (done) {
      var port = new SerialPort(exists, function(){
        port.on('close', function(){

          port.write(new Buffer(""), function(err){
            expect(err).to.be.ok;
            done();
          });

        });
        port.close();
      });
    });


  });

  describe.skip('disconnect', function () {
    it("fires a disconnect event", function (done) {
      var options = {};
      options.disconnectedCallback = function (err) {
          expect(err).to.be.ok;
          done();
        };
      var port = new SerialPort(exists, options, function () {
        hardware.disconnect('/dev/exists');
      });
    });
  });

});