var ctx;

function setup() {
  var socket = io.connect('http://localhost:8000');
  //listens for incoming messages named “bodyFrame”.
  socket.on('bodyFrame', interpretData);
  canvas = createCanvas(windowWidth, windowHeight);
  background(0);
  ctx = document.getElementById('canvas').getContext('2d');

}

function draw() {
  // interpretData();
  if (frameCount % 5 == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

}


//Inside the interpretData function we can pass in the a variable which will contain the received
// message, which is the JSON formatted skeleton data in our case:
function interpretData(bodyFrame) {
  //console.log(bodyFrame);      

  ctx.fillStyle = "red";
  for (var i = 0; i < bodyFrame.bodies.length; i++) {
    if (bodyFrame.bodies[i].tracked == true) {
      // console.log('tracked');
      for (var j = 0; j < bodyFrame.bodies[i].joints.length; j++) {
        var joint = bodyFrame.bodies[i].joints[11];
        canvas.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(joint.depthX * 400, joint.depthY * 400, 10, 0, Math.PI * 2,
          true
        ); //multiplied with static integer 400 in order to adjust position on canvas as without it 
        //skeleton projection formed is only visible in a corner as DepthX values were always less than 1
        ctx.closePath();
        ctx.fill(); //drawing a circle for each joint on the canvas 
      }
    }
  }


}