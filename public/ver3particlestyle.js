var ctx;

var trackedArray = [];

var colourArray = [];

var bodycount = 0;

var rightH = [];
var leftH = [];

var jointsCombo = [rightH, leftH];
for (i = 0; i < jointsCombo.length; i++) {
    for (j = 0; j < 2; j++) {
        var temp = jointsCombo[i];
        temp[j] = [];
    }
}

console.log(jointsCombo);

var jointNums = [11, 7];

var particleSmoke = [];

function setup() {
    var socket = io.connect('localhost:8000');
    // var socket = io.connect('10.17.58.115:8000');
    //listens for incoming messages named “bodyFrame”.
    socket.on('bodyFrame', interpretData);
    ctx = createCanvas(windowWidth, windowHeight);
    background(0);

}

function draw() {

    console.log(trackedArray.length);
    // fill(0, 50);
    // rect(0, 0, width, height);
    noStroke();

    if (trackedArray.length == 0) {
        particleSmoke = [];
        background(0,30);
        console.log("length is 0");
        stroke(360, 360, 360);
        textStyle(BOLD);
        fill("white");
        textSize(60);
        text("Wave your hands to begin", width/2-400, height / 2);
    }


}

var r;
var g;
var b;

//Inside the interpretData function we can pass in the a variable which will contain the received
// message, which is the JSON formatted skeleton data in our case:
function interpretData(bodyFrame) {


    // console.log(trackedArray);


    for (var i = 0; i < bodyFrame.bodies.length; i++) {

        if (bodyFrame.bodies[i].tracked == true) {
            if (!trackedArray.includes(i)) {
                trackedArray.push(i);
                console.log("pushed: " + i);
                r = Math.round(random(40,360) * 10) / 10;
                g = Math.round(random(40,360) * 10) / 10;
                b = Math.round(random(40,360) * 10) / 10;
                colourArray.push(r);
                colourArray.push(g);
                colourArray.push(b);
            }
            // console.log(trackedArray);

            for (var j = 0; j < jointNums.length; j++) {

                var joint = bodyFrame.bodies[i].joints[jointNums[j]];

                jointsCombo[j][0].push(Math.round(joint.depthX * 10) / 10);
                jointsCombo[j][1].push(Math.round(joint.depthY * 10) / 10);

                fill('pink');
                noStroke();
                ellipse(joint.depthX * 900 + 200, joint.depthY * 500, 20, 20);
                // var temp = jointsCombo[j]
                var index = trackedArray.indexOf(parseInt(i));
          
                particleDraw(joint.depthX, joint.depthY, colourArray[index*3], colourArray[(index*3)+1],colourArray[(index*3)+2]);
                console.log("colour " + colourArray[index*3]);
            }

        } else {
            var index = trackedArray.indexOf(parseInt(i));
            console.log("colour: " +  colourArray);
            // console.log("i: " + i);
            // console.log("else track :" + trackedArray);
            // console.log("index: " + index);
            if (index !== -1) {
                trackedArray.splice(index, 1);
                colourArray.splice(index*3,3);
            }

        }

    }
}
class Particle {

    constructor(jointX, jointY, red, green, blue) {
        this.x = jointX * 900 + 200;
        this.y = jointY * 500;
        this.vx = random(-1, 1.5);
        this.vy = random(0, -1);
        this.alpha = 255;
        this.accel = random(0, 1);
        this.radius = random(8,20); 
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