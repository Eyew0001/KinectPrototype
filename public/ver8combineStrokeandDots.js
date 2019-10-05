var ctx;

var trackedArray = []; // stores index number of bodies that are tracked

var colourArray = []; // stores rgb values that are randomised for each person


/* just realised don't need to store position values at all

var rightH = []; // declare array for storing positions of rightHand
var leftH = []; // declare array for storing positions of leftHand

var jointsCombo = [rightH, leftH]; // create double array for each hand for storing x and y position
for (i = 0; i < jointsCombo.length; i++) {
    for (j = 0; j < 2; j++) {
        var temp = jointsCombo[i];
        temp[j] = [];
    }
}

// console.log(jointsCombo);

*/

var jointNums = [11, 7]; // index number of right and left hand according to kinect documentation

var particleSmoke = []; // declare array for storing particles

var strokeLineArray = []; // declare array for storing particles

var redLightTimeReset = 100; // time left for red light

var greenLightTimeReset = 4; // time left for green light

var redLightTime = redLightTimeReset; // variable used to reger to red light time left

var greenLightTime = greenLightTimeReset; // variable used to reger to green light time left


function setup() {
    var socket = io.connect('localhost:8000'); // connect to ip address
    // var socket = io.connect('10.17.58.115:8000');

    socket.on('bodyFrame', interpretData); // listens for incoming messages named “bodyFrame”.
    ctx = createCanvas(windowWidth, windowHeight);
    background(0);

}

function draw() {



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
        particleSmoke = [];
        strokeLineArray = [];
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

                    if (i < 0) {
                        particleDraw(joint.depthX, joint.depthY, colourArray[index * 3], colourArray[(index * 3) + 1], colourArray[(index * 3) + 2]);
                        // console.log("colour " + colourArray[index*3]);
                  
                    }
                    else {
                        strokeDraw(joint.depthX, joint.depthY, colourArray[index * 3], colourArray[(index * 3) + 1], colourArray[(index * 3) + 2]);
                   
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

/* credits to coding train */
class Particle {

    constructor(jointX, jointY, red, green, blue) {
        this.x = jointX * 900 + 200;
        this.y = jointY * 500;
        this.vx = random(-1, 1.5);
        this.vy = random(0, -1);
        this.alpha = 255;
        this.accel = random(0, 1);
        this.radius = random(8, 20);
        this.r = red;
        this.g = green;
        this.b = blue;

    }

    finished() {
        return this.alpha < 0;
    }

    update() {
        this.x += this.vx * this.accel;
        this.y += this.vy * this.accel;
        this.alpha -= 5;
        if (this.radius > 0) {
            this.radius -= 0.08;
        }
        this.r += random(-8, 8);
        this.g += random(-8, 8);
        this.b += random(-8, 8);
    }

    show() {
        noStroke();
        fill(this.r, this.g, this.b, this.alpha);
        ellipse(this.x, this.y, this.radius);
    }

}

function particleDraw(jointX, jointY, red, green, blue) {
    background(0, 20);
    for (let i = 0; i < 1; i++) { //how many particles at one time
        let p = new Particle(jointX, jointY, red, green, blue);
        particleSmoke.push(p);
    }
    for (let i = particleSmoke.length - 1; i >= 0; i--) {
        particleSmoke[i].update();
        particleSmoke[i].show();
        if (particleSmoke[i].finished()) {
            // remove this particle
            particleSmoke.splice(i, 2);
        }
    }
}

class StrokeLines {

    constructor(jointX, jointY, red, green, blue) {
        this.x = jointX * 900 + 200;
        this.y = jointY * 500;
        this.vx = random(-1, 1.5);
        this.vy = random(0, -1);
        this.alpha = 255;
        this.accel = random(0, 1);
        this.radius = random(8, 20);
        this.r = red;
        this.g = green;
        this.b = blue;
        this.x1 = this.x;
        this.y1 = this.y;
        this.sWeight= random(-10,10);
    }

    finished() {
        return this.alpha < 0;
    }

    update() {
        // this.sWeight += random(-25,25);
        this.x1 += sin(0);
        this.y1 += random(-10,10);
        // this.x += this.vx * this.accel;
        // this.y += this.vy * this.accel;
        this.alpha -= 5;
        if (this.radius > 0) {
            this.radius -= 0.08;
        }
        this.r += random(-8, 8);
        this.g += random(-8, 8);
        this.b += random(-8, 8);
    }

    show() {
        strokeWeight(this.sWeight);
        // noStroke();
        stroke(this.r, this.g, this.b, this.alpha);
        line(this.x, this.y, this.x1, this.y1,);
    }

}

function strokeDraw(jointX, jointY, red, green, blue) {
    background(0, 20);
    for (let i = 0; i < 1; i++) { //how many particles at one time
        let p = new StrokeLines(jointX, jointY, red, green, blue);
        strokeLineArray.push(p);
    }
    for (let i = strokeLineArray.length - 1; i >= 0; i--) {
        strokeLineArray[i].update();
        strokeLineArray[i].show();
        if (strokeLineArray[i].finished()) {
            // remove this particle
            strokeLineArray.splice(i, 2);
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