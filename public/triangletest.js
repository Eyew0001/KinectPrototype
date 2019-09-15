var ctx;

function setup() {
    var socket = io.connect('192.168.86.115:8000');

    //listens for incoming messages named “bodyFrame”.
    socket.on('bodyFrame', interpretData);
    ctx = createCanvas(windowWidth, windowHeight);
    background(0);
    //    ctx = document.getElementById('canvas').getContext('2d');

}
var allParticles = [];
var maxLevel = 5;
var useFill = false;

function Particle(x, y, level) {

    this.level = level;
    this.life = 0;

    this.pos = new p5.Vector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(map(this.level, 0, maxLevel, 5, 2));

    this.move = function () {
        this.life++;

        // Add friction.
        this.vel.mult(0.9);

        this.pos.add(this.vel);

        // Spawn a new particle if conditions are met.
        if (this.life % 10 == 0) {
            if (this.level > 0) {
                this.level -= 1;
                var newParticle = new Particle(this.pos.x, this.pos.y, this.level - 1);
                allParticles.push(newParticle);
            }
        }
    }
}

function draw() {
    // interpretData();
    // if (frameCount % 5 == 0) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    fill(0, 30);
    rect(0, 0, width, height);

    // }
    noStroke();

    // Move and spawn particles.
    // Remove any that is below the velocity threshold.
    for (var i = allParticles.length - 1; i > -1; i--) {
        allParticles[i].move();

        if (allParticles[i].vel.mag() < 0.01) {
            allParticles.splice(i, 1);
        }
    }

    if (allParticles.length > 0) {
        // Run script to get points to create triangles with.
        data = Delaunay.triangulate(allParticles.map(function (pt) {
            return [pt.pos.x, pt.pos.y];
        }));

        strokeWeight(1);

        // Display triangles individually.
        for (var i = 0; i < data.length; i += 3) {
            // Collect particles that make this triangle.
            var p1 = allParticles[data[i]];
            var p2 = allParticles[data[i + 1]];
            var p3 = allParticles[data[i + 2]];

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



            // Base its hue by the particle's life.
            if (useFill) {
                noStroke();
                fill(165 + p1.life * 1.5, 360, 360);
            } else {
                noFill();

                stroke(150, 360, 360);

            }

            triangle(p1.pos.x, p1.pos.y,
                p2.pos.x, p2.pos.y,
                p3.pos.x, p3.pos.y);
        }
    }
}
var rightHX = [];
var rightHY = [];


var head = [];
var neck = [];
var spine = [];
var rightH = [];
var leftH = [];
var rightE = [];
var leftE = [];
var rightHip = [];
var leftHip = [];


var jointsCombo = [head, spine, rightH, leftH, rightHip, leftHip];
for (i = 0; i < jointsCombo.length; i++) {
    for (j = 0; j < 2; j++) {
        var temp = jointsCombo[i];
        temp[j] = [];
    }
}

console.log(jointsCombo);

var jointNums = [3, 1, 11, 7, 16, 12];

//Inside the interpretData function we can pass in the a variable which will contain the received
// message, which is the JSON formatted skeleton data in our case:
function interpretData(bodyFrame) {
    //console.log(bodyFrame);      

    // ctx.fillStyle = "red";
    for (var i = 0; i < bodyFrame.bodies.length; i++) {
        if (bodyFrame.bodies[i].tracked == true) {
            
            // console.log('tracked');
            // for (var j = 0; j < bodyFrame.bodies[i].joints.length; j++) {
                // console.log("sds+" + joint);
                for (var j = 0; j < jointNums.length; j++) {
                    
                var joint = bodyFrame.bodies[i].joints[jointNums[j]];
                
               

                jointsCombo[j].push(Math.round(joint.depthX * 100) / 100);
                jointsCombo[j].push(Math.round(joint.depthY * 100) / 100);
                // console.log(joint);
                fill('green');
                ellipse(joint.depthX * 400, joint.depthY * 400, 20, 20);
                
                if (jointsCombo[0][rightH.length - 1] != rightH[0][rightH.length - 2] && rightH[0][rightH.length - 1] != rightH[0][rightH.length - 2]) {
                    allParticles.push(new Particle(joint.depthX * 400, joint.depthY * 400, 3));
                }
            }
        }
    }


}