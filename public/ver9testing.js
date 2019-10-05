//credits https://www.openprocessing.org/sketch/748902

function setup() {
    createCanvas(S = 500, S);
    oldX = mouseX;
    oldY = mouseY;
}

function draw() {
    background(255, 10);
    drawLine(mouseX, mouseY, pmouseX, pmouseY);
}

function drawLine(x, y, x1, y1) {
    var li = new brushLine(x, y, x1, y1);
    li.update();
    li.show();


    // oldX = x;
    // oldY = y;

}

class brushLine {
    constructor(x, y, x1, y1) {
        this.x = x;
        this.y = y;
        this.oldX = x1;
        this.oldY = y1;
        this.d = random(10, 50);
    }

    update() {

    }

    show() {
        fill(random(200, 255), random(200, 255), random(200, 255), 120);


        for (var a = 0; a < 4 * PI; a += PI / 4) {
            ellipse(this.x + cos(a + PI / 3) * this.d, this.y + sin(a + PI / 3) * this.d, this.d, this.d);
            triangle(this.x, this.y, this.x + cos(a) * this.d, this.y + sin(a) * this.d, this.x + cos(a + PI / 6) * this.d, this.y + sin(a + PI / 6) * this.d);
        }

    }

}
}