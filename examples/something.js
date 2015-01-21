var async = require('async');
var SerialPort = require('serialport');

var Device = require('pinoccio-serial-unofficial');


function diffPorts(a,b){
  return a.filter(function(aElement){
      return b.filter(function(bElement){
          return aElement.comName === bElement.comName;
        }).length === 0;
    });
}


function go(done){
  var url = 'http://guarded-journey-2862.herokuapp.com/static/Bootstrap.cpp.hex';
  var ssid ='Filthy Worm Babies';
  var pass = 'mart88@Qatar';
  var timeout = 30000;

  var path;
  var report;
  var ports;
  var port;

  async.series([
    function(cbStep){
      //ask to unplug device
      console.log('please make sure device is not plugged in');
      setTimeout(cbStep, 5000);
    },
    function(cbStep){
      console.log('looking at plugged in devices');
      Device.listPorts(function(err, before) {
        if(err){
          return cbStep(err);
        }

        ports = before;
        cbStep();
      });
    },
    function(cbStep){
      console.log('please plug in device');
      setTimeout(cbStep, 5000);
    },
    function(cbStep){
      console.log('looking for difference');
      Device.listPorts(function(err, after) {
        if(err){
          return cbStep(err);
        }

        ports = diffPorts(after, ports);

        if(ports.length<1){
          return cbStep(new Error('No Ports Found'));
        }

        //todo foreach over ports? or just regex the one we want
        path = ports[0].comName;
        console.log('found', path);

        cbStep();
      });
    },
    function(cbStep){
      console.log('get version');

      var cmds = {
        timeout: 10000,
        cmd: 'scout.report'
      };

      //need to keep options local and recreate as node serial alters it
      var options = {baudrate: 115200};

      Device.statelessSend(path, options, cmds, 1000, function(err, results){
        if(err){
          return cbStep(err);
        }

        console.log(results);
        report = results;
        cbStep();
      });
    },
    // function(cbStep){
    //   //if report.whatever, bootload
    //   Device.bootload(path, url, function(err){
    //     if(err){
    //       return cbStep(err);
    //     }

    //     cbStep();
    //   });
    // },
    // //add timeout to avoid reboots from close/open transition too quickly
    // function(cbStep){
    //   setTimeout(cbStep, 5000);
    // },
    function(cbStep){
      console.log('open up');

      //need to keep options local and recreate as node serial alters it
      var options = {baudrate: 115200};

      Device.open(path, options, function(err, results){
        if(err){
          return cbStep(err);
        }

        port = results;
        cbStep();
      });
    },
    function(cbStep){
      console.log('finding wifi');
      Device.findWifi(port, timeout, function(err, results){
        if(err){
          return cbStep(err);
        }
        console.log(results);
        cbStep();
      });
    },
    function(cbStep){
      console.log('programming wifi');
      Device.programWifi(port, ssid, pass, cbStep);
    },

  ],
  function(err) {
    if(port) {
      port.close();
    }

    done(err);
  });
}