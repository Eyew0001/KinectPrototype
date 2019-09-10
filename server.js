var Kinect2 = require('kinect2'),
            express = require('express'),
            app = express(),
            server = require('http').createServer(app),
            io = require('socket.io').listen(server);

          var kinect = new Kinect2();

          app.use(express.static(__dirname + '/View'));
          app.use(express.static(__dirname + '/Script'));

          if(kinect.open()) {

            console.log('kinect opened');
            server.listen(8000);
            console.log('Server listening on port 8000');

            kinect.on('bodyFrame', function(bodyFrame){
              io.sockets.emit('bodyFrame', bodyFrame);
            });

            kinect.openBodyReader();

            app.get('/', function(req, res) {

              res.sendFile(__dirname + '/View/output.html');
            });

            setTimeout(function(){
              kinect.close();
              console.log("Kinect Closed");
            }, 100000);
           }