// The complete broadcast code

// First we load all the necessary library:
var Kinect2 = require('kinect2');
express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

// We also need an instance of the Kinect 2 library:
var kinect = new Kinect2();

// Next, we call kinect.open() and in the same line we are also waiting for the response 
// to be true in case powering up and accessing the Kinect sensor was successful:
if (kinect.open()) {
    app.use(express.static('public'));

    // Inside this condition we start our server:
    server.listen(8000);
    console.log('Server listening on port 8000');
    // console.log('Point your browser to http://www.webondevices.com');

    // The following expression will serve the index.html file inside the public folder. 
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });


    // responsible for actually listening for received bodyFrames from the Kinect sensor 
    // which is one frame worth of skeleton data formatted into JSON
    // This is what we start sending through the web socket with the io.sockets.emit() command:
    kinect.on('bodyFrame', function (bodyFrame) {
        io.sockets.emit('bodyFrame', bodyFrame);
    });

    // Finally, to kick off the whole process, we call the openBodyReader() function:
    kinect.openBodyReader();
}