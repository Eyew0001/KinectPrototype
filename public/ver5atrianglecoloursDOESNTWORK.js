var ctx;

var trackedArray = []; // stores index number of bodies that are tracked

var colourArray = []; // stores rgb values that are randomised for each person

var jointNums = [11, 7]; // index number of right and left hand according to kinect documentation

var redLightTimeReset = 5; // time left for red light

var greenLightTimeReset = 4; // time left for green light

var redLightTime = redLightTimeReset; // variable used to reger to red light time left

var greenLightTime = greenLightTimeReset; // variable used to reger to green light time left

var allTriangleLines = [];
var maxLevel = 5;
var useFill = false;

var token = 0.5;
var num = Math.floor(Math.random() * (40 - 360 + 1)) + 360;
var num1 = Math.floor(Math.random() * (30 - 360 + 1)) + 360;
var num2 = Math.floor(Math.random() * (50 - 360 + 1)) + 360;

class TriangleLine {
    constructor(x, y, level, red, blue, green) {
        this.level = level;
        this.life = 0;

        this.pos = new p5.Vector(x, y);
        this.vel = p5.Vector.random2D();
        this.vel.mult(map(this.level, 0, maxLevel, 5, 2));

        this.r = red;
        this.g = green;
        this.b = blue;

    }

    update() {
        if (this.r < 255) {
            this.r += 0.5;
        }
        if (this.r > 240 || this.r < 40) {
            this.r -= 0.5;
        }
        if (this.g < 255) {
            this.g += 0.5;
        }
        if (this.g > 240 || this.g < 40) {
            this.g -= 0.5;
        }
        if (this.b < 255) {
            this.b += 0.5;
        }
        if (this.b > 240 || this.b < 40) {
            this.b -= 0.5;
        }

        this.life++;

        // Add friction.
        this.vel.mult(0.9);

        this.pos.add(this.vel);

        // Spawn a new TriangleLine if conditions are met.
        if (this.life % 10 == 0) {
            if (this.level > 0) {
                this.level -= 1;
                var newTriangleLine = new TriangleLine(this.pos.x, this.pos.y, this.level - 1);
                allTriangleLines.push(newTriangleLine);
            }
        }

    }

    show() {
        if (allTriangleLines.length > 0) {
            var data;
            // Run script to get points to create triangles with.
            data = Delaunay.triangulate(allTriangleLines.map(function (pt) {
                return [pt.pos.x, pt.pos.y];
            }));
    
            strokeWeight(1);
    
            // Display triangles individually.
            for (var i = 0; i < data.length; i += 3) {
                // Collect TriangleLines that make this triangle.
                var p1 = allTriangleLines[data[i]];
                var p2 = allTriangleLines[data[i + 1]];
                var p3 = allTriangleLines[data[i + 2]];
    
                // Don't draw triangle if its area is too big.
                var distThresh = 75;
    
                if (dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThresh) {
                    continue;
                }
    
                if (dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
                    continue;
                }
    
                if (dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
                    continue;
                }
    
                // Base its hue by the TriangleLine's life.
    
                noFill();
    
                stroke(200,200,200 );
    
                triangle(p1.pos.x, p1.pos.y,
                    p2.pos.x, p2.pos.y,
                    p3.pos.x, p3.pos.y);
            }
        }
    }

}



function setup() {
    var socket = io.connect('localhost:8000'); // connect to ip address
    // var socket = io.connect('10.17.58.115:8000');

    socket.on('bodyFrame', interpretData); // listens for incoming messages named “bodyFrame”.
    ctx = createCanvas(windowWidth, windowHeight);
    background(0);

}




function draw() {

   

    // fill(0, 30);
    // rect(0, 0, width, height);
  
   



    // console.log(trackedArray.length);
    // fill(0, 50);
    // rect(0, 0, width, height);
    noStroke();

    // black rectangle background for text so text is not affected by the fading background
    fill(0);
    rect(0, 0, width, 120);

    // swapping between green and red light timer text
    // timertext continues to change even if no one is in view
    var timertext = "redlight time left: " + redLightTimer();
    if (redLightTime == -1) {
        background(0, 45);
        timertext = "CROSS!! greenlight time left: " + greenLightTimer();
    }
    if (greenLightTime == -1) {
        timertext = "redlight time left: " + redLightTimer();
        redLightTime = redLightTimeReset;
        greenLightTime = greenLightTimeReset;
    }

    // if no body is in view then show screensaver text
    if (trackedArray.length == 0) {
        TriangleLineSmoke = [];
        background(0, 30);
        // console.log("length is 0");
        // stroke(360, 360, 360);
        textStyle(BOLD);
        textSize(60);
        if (redLightTime != -1) {
            fill("white");
            textAlign(CENTER);
            text("Wave your hands to begin", width / 2, height / 2);
        }

    }

    // regardless of if body is in view or not
    if (redLightTime > -1) { //if light is red show timertext up top
        fill("red");
        textSize(30);
        text(timertext, width / 2, 100);
    } else { //if green show crossing text in middle
        fill("green");
        textSize(60);
        textAlign(CENTER);
        text(timertext, width / 2, height / 2);
    }




}

// declare variable for randomising colours
var r;
var g;
var b;


/*credits to http://www.webondevices.com/get-started-with-xbox-kinect-2-javascript-development/*/
//Inside the interpretData function we can pass in the a variable which will contain the received
// message, which is the JSON formatted skeleton data in our case:
function interpretData(bodyFrame) {

    if (redLightTime != -1) {
        // console.log(trackedArray);


        for (var i = 0; i < bodyFrame.bodies.length; i++) {

            if (bodyFrame.bodies[i].tracked == true) {
                if (!trackedArray.includes(i)) { // if new body is in view add index to the array
                    trackedArray.push(i);
                    // console.log("pushed: " + i);

                    // make new randomised colours for that person and store in colour array
                    r = Math.round(random(40, 360) * 10) / 10;
                    g = Math.round(random(40, 360) * 10) / 10;
                    b = Math.round(random(40, 360) * 10) / 10;
                    colourArray.push(r);
                    colourArray.push(g);
                    colourArray.push(b);
                }
                // console.log(trackedArray);

                for (var j = 0; j < jointNums.length; j++) {

                    var joint = bodyFrame.bodies[i].joints[jointNums[j]]; // get index number of joint from the joint array

                    /* just realised don't need to store position values
                    jointsCombo[j][0].push(Math.round(joint.depthX * 10) / 10);
                    jointsCombo[j][1].push(Math.round(joint.depthY * 10) / 10);

                    jointsCombo[j][0].splice(0, 1);
                    jointsCombo[j][1].splice(0, 1);

                    console.log(jointsCombo[j][0].length);
                    */


                    fill('pink');
                    noStroke();
                    ellipse(joint.depthX * 900 + 200, joint.depthY * 500, 20, 20);
                    // var temp = jointsCombo[j]
                    var index = trackedArray.indexOf(parseInt(i));

                    if (frameCount % 1.5 == 0) {
                        TriangleDraw(joint.depthX * 900 + 200, joint.depthY * 500, 3, colourArray[index * 3], colourArray[(index * 3) + 1], colourArray[(index * 3) + 2])
                       

                    }
                    if (allTriangleLines.length > 30) {
                        allTriangleLines.splice(0, 2);
                    }

                }

            } else {
                var index = trackedArray.indexOf(parseInt(i));
                // console.log("colour: " +  colourArray);
                // console.log("i: " + i);
                // console.log("else track :" + trackedArray);
                // console.log("index: " + index);
                if (index !== -1) {
                    trackedArray.splice(index, 1);
                    colourArray.splice(index * 3, 3);
                }

            }

        }
    }

}

function TriangleDraw(jointX, jointY, red, green, blue) {
    background(0, 20);
    allTriangleLines.push(new TriangleLine(jointX, jointY));

    for (var i = allTriangleLines.length - 1; i > -1; i--) {
        allTriangleLines[i].update();
        allTriangleLines[i].show();

        if (allTriangleLines[i].vel.mag() < 0.01) {
            allTriangleLines.splice(i, 5);
        }
    }

}


function redLightTimer() {
    if (frameCount % 60 == 0 && redLightTime > -1) {
        redLightTime--;
    }
    return redLightTime;
}

function greenLightTimer() {
    if (frameCount % 60 == 0 && greenLightTime > -1) {
        greenLightTime--;
    }
    return greenLightTime;
}