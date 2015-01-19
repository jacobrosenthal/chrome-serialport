/*global describe, it:true*/
'use strict';
var chai = require('chai');
var expect = chai.expect;

var SerialPort = require('../');
SerialPort.extensionId = 'glbcoioheoliejkddbfabekjgmebfbog';

describe('SerialPort', function () {

  console.log(chrome);
  describe('Factory', function () {

    it('is installed', function (done) {
      console.log(SerialPort);
      SerialPort.isInstalled(SerialPort.extensionId, function(err){
        expect(err).to.not.be.ok;
        done();
      });
    });

    it('lists ports', function (done) {
      SerialPort.list(function(err, data){
        expect(err).to.not.be.ok;
        expect(data).to.exist;
        done();
      });
    });

  });

  describe('Constructor', function () {

    it('errors with invalid stopbits', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = SerialPort.SerialPort('/dev/exists', { stopBits : 19 }, false, errorCallback);
    });

  });

});