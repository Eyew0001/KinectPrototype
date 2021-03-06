var gif_createImg;
var ctx;

var trackedArray = []; // stores index number of bodies that are tracked

var colourArray = []; // stores rgb values that are randomised for each person

//deep pink, darkturquoise, lime, lightpink, mediumorchid, lightskyblue, palevioletred, yellow, lightsalmon
var colourArray1 = [255, 20, 147, 0, 206, 209, 0, 255, 0, 255, 182, 193, 186, 85, 211, 135, 206, 250, 219, 112, 147, 255, 255, 0, 255, 160, 122];

var trailColourArray = ["aqua", "magenta", "springgreen", "yellow", "orange", "plum"]; // possible trail colours

var jointNums = [11, 7]; // index number of right and left hand according to kinect documentation

var particleSmoke = []; // declare array for storing particles

var strokeLineArray = []; // declare array for storing particles

var sinWaveArray = []; // declare array for storing particles

var trailDotArray = []; // declare array for drawing trail particles

var redLightTimeReset = 100; // time left for red light

var greenLightTimeReset = 2; // time left for green light

var redLightTime = redLightTimeReset; // variable used to reger to red light time left

var greenLightTime = greenLightTimeReset; // variable used to reger to green light time left

var scrollPos; // first scrolling text

var scrollPos2; // second scrolling text

var scroll1End = false; // don't start second scrolling text until first one has finished

var offsetX = 900; // offset for joint.depthX

var offsetY = 500; // offset for joint.depthY

function preload() {
    gif_createImg = createImg("greenmanblack.gif");

}


function setup() {
    var socket = io.connect('localhost:8000'); // connect to ip address
    // var socket = io.connect('10.17.58.115:8000');

    socket.on('bodyFrame', interpretData); // listens for incoming messages named “bodyFrame”.
    ctx = createCanvas(windowWidth, windowHeight);
    background(0);

    scrollPos = windowWidth + 300; // starting position of scoll text 1
    scrollPos2 = windowWidth + 300; //starting position of scroll text 2



}

function draw() {

    noStroke();

    // black rectangle background for text so text is not affected by the fading background
    fill(0);
    rect(0, 0, width, 130);

    // swapping between green and red light timer text
    // timertext continues to change even if no one is in view
    var timertext = redLightTimer();
    if (redLightTime == -1) {
        background(0);
        timertext = greenLightTimer();

    }
    if (greenLightTime == -1) { // if green countdown finish, reset both red and green
        redLightTime = redLightTimeReset;
        greenLightTime = greenLightTimeReset;
    }

    // if no body is in view then show screensaver text
    if (trackedArray.length == 0) {
        particleSmoke = []; // reset and empty arrays if no one is there
        strokeLineArray = [];
        sinWaveArray = [];
        trailDotArray = [];

        background(0, 30);
        textStyle(BOLD);
        textSize(60);
        if (redLightTime != -1) { // if no one there and still red light
            background(0);
            fill("white");
            textAlign(CENTER);
            text("Wave your hands to begin", width / 2, height / 2);
        }

    } else { // if people are tracked, AND is red light is still on
        if (redLightTime > -1) {
            fill("white");
            textAlign(CENTER);
            textSize(50);
            scrollingText();
            text("Wave your hands to draw", scrollPos, 100); // two scrolling texts for continuous look
            text("Wave your hands to draw", scrollPos2, 100);
        }

    }

    // regardless of if body is in view or not
    if (redLightTime > -1) { //if light is red show timertext up top
        fill("black");
        rect(windowWidth - 200, 0, 180, 180); // black rectangle behind red timer so text isn't seen going through it

        textSize(30);
        fill("black");
        stroke("red");
        strokeWeight(10);
        ellipse(windowWidth - 120, 100, 120, 120); // red timer circle

        noStroke();
        fill("red");
        textSize(70);
        text(timertext, windowWidth - 120, 123); // red countdown numbers

        gif_createImg.hide();

    } else { //if green show crossing animation
        background(0);
        var gifWidth = (windowWidth / gif_createImg.width) * gif_createImg.width / 3;

        stroke("green");
        strokeWeight(15);
        noFill();
        ellipse(windowWidth / 2, 150, 200, 200); // green timer circle

        noStroke();
        fill("green");
        textSize(130);
        textAlign(CENTER);
        text(timertext, width / 2, 190); //green countdown numbers

        //show gif
        gif_createImg.position(windowWidth / 2 - gifWidth / 2 - 35, windowHeight / 2 - gifWidth / 4);
        gif_createImg.size(gifWidth, gifWidth);
        gif_createImg.show();
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

                    if (trackedArray.length == 1) { // if first person to be tracked
                        // make new randomised colours for that person and store in colour array
                        r = Math.round(random(40, 360) * 10) / 10;
                        g = Math.round(random(40, 360) * 10) / 10;
                        b = Math.round(random(40, 360) * 10) / 10;
                        colourArray.push(r);
                        colourArray.push(g);
                        colourArray.push(b);

                    } else { // if not first person to be tracked
                        var index = trackedArray.indexOf(parseInt(i));
                        index = index - 1;
                        if (colourArray[index * 3] > 340) { // if last person's colour is higher than 340, bring back down to 40
                            r = Math.round(random(40, 360) * 10) / 10;
                            g = Math.round(random(40, 360) * 10) / 10;
                            b = Math.round(random(40, 360) * 10) / 10;
                            colourArray.push(r);
                            colourArray.push(g);
                            colourArray.push(b);
                        } else { // if not higher than 40, make new random number between last person's colour and 360
                            r = Math.round(random(colourArray[index * 3], 360) * 10) / 10;
                            g = Math.round(random(colourArray[index * 3 + 1], 360) * 10) / 10;
                            b = Math.round(random(colourArray[index * 3 + 2], 360) * 10) / 10;
                            colourArray.push(r);
                            colourArray.push(g);
                            colourArray.push(b);
                        }

                    }


                }
                // console.log(trackedArray);

                for (var j = 0; j < jointNums.length; j++) {

                    var joint = bodyFrame.bodies[i].joints[jointNums[j]]; // get index number of joint from the joint array

                    // offset joint positions
                    joint.depthX *= offsetX; 
                    joint.depthY *= offsetY;

                    // fill('pink');
                    // noStroke();
                    // ellipse(joint.depthX, joint.depthY, 20, 20);
                    // console.log(trailColourArray[i]);
                    drawTrail(joint.depthX, joint.depthY, i); // draw trail
                    // var temp = jointsCombo[j]
                    var index = trackedArray.indexOf(parseInt(i));


                    if (i < 2) {
                        particleDraw(joint.depthX, joint.depthY, colourArray[index * 3], colourArray[(index * 3) + 1], colourArray[(index * 3) + 2]);
                        // console.log("colour " + colourArray[index*3]);

                    } else if (i > 1 && i < 4) {


                        drawLine(joint.depthX, joint.depthY, colourArray[index * 3], colourArray[(index * 3) + 1], colourArray[(index * 3) + 2]);
                        // console.log(jointsCombo[j][0][0]);
                    } else {
                        strokeDraw(joint.depthX, joint.depthY, colourArray[index * 3], colourArray[(index * 3) + 1], colourArray[(index * 3) + 2]);

                    }

                }

            } else { //if the index number is not currently being tracked, and it is present in trackedArray
                var index = trackedArray.indexOf(parseInt(i));
                if (index !== -1) { //if it is not present, index number will be -1
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
        this.x = jointX;
        this.y = jointY;
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
        this.x = jointX;
        this.y = jointY;
        this.alpha = 255;
        this.r = red;
        this.g = green;
        this.b = blue;
        this.x1 = this.x;
        this.y1 = this.y;
        this.sWeight = random(-10, 10);
    }

    finished() {
        return this.alpha < 0;
    }

    update() {
        // this.sWeight += random(-25,25);
        this.x1 += sin(0);
        this.y1 += random(-10, 10);
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
        line(this.x, this.y, this.x1, this.y1, );
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

function drawLine(jointX, jointY, red, green, blue) {

    background(0, 20);
    for (let i = 0; i < 1; i++) { //how many particles at one time
        let p = new sinWaves(jointX, jointY, red, green, blue);
        sinWaveArray.push(p);
    }
    for (let i = sinWaveArray.length - 1; i >= 0; i--) {
        sinWaveArray[i].update();
        sinWaveArray[i].show();
        if (sinWaveArray[i].finished()) {
            // remove this particle
            sinWaveArray.splice(i, 2);
        }
    }

}


class sinWaves {
    constructor(x, y, red, green, blue) {
        this.x = x;
        this.y = y;
        // this.oldX = x1 * 900 + 200;
        // this.oldY = y1 * 500;
        // console.log("ddsaa" + this.y/500);
        // console.log(this.oldY);
        this.vx = random(-1, 1.5);
        this.vy = random(0, -1);
        this.alpha = 255;
        this.accel = random(0, 0.1);
        this.radius = random(8, 20);
        this.theta = 0.3;
        this.token = 20;
        this.tokeny = random(-50, 50)
        this.r = red;
        this.g = green;
        this.b = blue;
    }


    update() {
        // if (this.x )
        this.theta += 0.2;

        this.x += ((sin((this.theta / 1.2) - 200) * 50) * this.accel);
        this.y += this.token * this.accel;
        this.r += random(-8, 8);
        this.g += random(-8, 8);
        this.b += random(-8, 8);

        // this.y += cos(60) *20 * this.accel;
        this.alpha -= 3.5;
        if (this.radius > 0) {
            this.radius -= 0.08;
        }
    }

    finished() {
        return this.alpha < 0;
    }

    show() {
        noStroke();

        fill(this.r, this.g, this.b, this.alpha);
        // stroke(0, 0, 255);
        // strokeWeight(10);
        // // line(this.x, this.y, this.oldX, this.oldY);
        // push();
        // noStroke();
        // blendMode(ADD);
        // fill(255, 5);
        // fill([100, 0, 0, 10]);
        // pop();
        ellipse(this.x, this.y, this.radius);
    }
}
class trailDot {
    constructor(jointX, jointY, index) {
        this.x = jointX;
        this.y = jointY;
        this.alpha = 255;
        this.radius = 15;
        this.colour = index;
    }

    finished() {
        return this.alpha < 0;
    }

    update() {
        this.alpha -= 5;
        if (this.radius > 0) {
            this.radius -= 0.2;
        }
    }

    show() {
        fill(trailColourArray[this.colour]);
        ellipse(this.x, this.y, this.radius);
    }

}

function drawTrail(jointX, jointY, index) {

    background(0, 20);
    for (let i = 0; i < 1; i++) { //how many particles at one time
        let p = new trailDot(jointX, jointY, index);
        trailDotArray.push(p);
    }
    for (let i = trailDotArray.length - 1; i >= 0; i--) {
        trailDotArray[i].update();
        trailDotArray[i].show();
        if (trailDotArray[i].finished()) {
            // remove this particle
            trailDotArray.splice(i, 2);
        }
    }

}

function redLightTimer() {
    if (frameCount % 60 == 0 && redLightTime > -1) { // countdown red timer until 0
        redLightTime--;
    }
    return redLightTime;
}

function greenLightTimer() {
    if (frameCount % 60 == 0 && greenLightTime > -1) { // countdown green timer until 0
        greenLightTime--;
    }
    return greenLightTime;
}

function scrollingText() {
    if (scrollPos > -300) { // scroll first text
        scrollPos -= 2;
    } else {
        scrollPos = windowWidth + 1000; // when reach end start again
    }

    if (scrollPos < 300) { // if first text reaches more than halfway, raise flag to start second text
        scroll1End = true;

    }
    if (scroll1End) { // if flag raised start second text
        scrollPos2 -= 2;
    }
    if (scrollPos2 < -300) {
        scrollPos2 = windowWidth + 1000; // when reach end start again
    }
}