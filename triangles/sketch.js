let p1;
let p2;
let p3;
let t0;
let x = 0;
let lastTriangle;
let distanceFromClick = 60;
let gap = 15;

let stripeAmt;

let trianglesPerStripe;

function setup() {
  createCanvas(800, 800);

  t0 = new Triangle(
    createVector(width / 2, height),
    createVector(width / 2 - 25, height + 50),
    createVector(width / 2 + 25, height + 50),
    color(255, 0, 0)
  );

  trianglesPerStripe = createSlider(1, 35, 35, 1);
  stripeAmt = createSlider(1, 35, 35, 1);
}

function draw() {
  x += 0.01;
  background(0);

  stroke("red");
  line(width / 2, 0, width / 2, height);

  t0.p1 = p5.Vector.add(
    t0.middleBase,
    t0.height.copy().setMag(39 + sin(x) * gap)
  );
  // let moveBase = t0.height
  //   .copy()
  //   .setMag(40 + sin(x) * gap)
  //   .mult(-1);
  // t0.p2 = p5.Vector.add(t0.p2, moveBase);
  // t0.p3 = p5.Vector.add(t0.p3, moveBase);

  for (let j = 1; j <= stripeAmt.value(); j++) {
    let triangle = t0.copy();
    triangle.move(triangle.height.copy().mult(j));
    triangle.color = color(255, 25 * j, 0);
    drawStripe(
      triangle,
      color(
        map(j, 1, stripeAmt.value(), 0, 255),
        map(j, 1, stripeAmt.value(), 255, 0),
        0
        // map(j, 1, stripeAmt.value(), 0, 255),
        // map(j, 1, stripeAmt.value(), 0, 255)
      ),
      color(0, 0, map(j, 1, stripeAmt.value(), 0, 255))
    );

    drawStripe(
      triangle,
      color(
        map(j, 1, stripeAmt.value(), 0, 255),
        map(j, 1, stripeAmt.value(), 255, 0),
        0
        // map(j, 1, stripeAmt.value(), 0, 255),
        // map(j, 1, stripeAmt.value(), 0, 255)
      ),
      color(0, 0, map(j, 1, stripeAmt.value(), 0, 255)),
      "left"
    );

    // triangle.draw();
  }
}

class Triangle {
  get middleBase() {
    return p5.Vector.add(this.p2, this.p3).div(2);
  }

  get height() {
    return p5.Vector.sub(this.p1, this.middleBase);
  }

  get perimiter() {
    return (
      this.p1.dist(this.p2) + this.p2.dist(this.p3) + this.p3.dist(this.p1)
    );
  }

  constructor(p1, p2, p3, color) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.color = color;
  }

  draw() {
    noStroke();
    fill(this.color);
    triangle(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
  }

  inverse() {
    return new Triangle(
      p5.Vector.add(this.middleBase, this.height.mult(-1)),
      this.p3.copy(),
      this.p2.copy(),
      this.color
    );
  }

  move(vector) {
    this.p1.add(vector);
    this.p2.add(vector);
    this.p3.add(vector);
  }

  copy() {
    return new Triangle(
      this.p1.copy(),
      this.p2.copy(),
      this.p3.copy(),
      this.color
    );
  }
}

function mouseDragged(evt) {
  // let mouse = createVector(mouseX, mouseY);

  // let closesVertex = [p1, p2, p3].sort(
  //   (a, b) => a.dist(mouse) - b.dist(mouse)
  // )[0];
  // if (closesVertex.dist(mouse) < distanceFromClick) {
  //   closesVertex.set(mouse);
  // }

  if (mouseX > width || mouseY > height || mouseX < 0 || mouseY < 0) {
    return;
  }
  let movement = createVector(evt.movementX, evt.movementY);
  t0.move(movement);
  // console.log(evt.movementX, evt.movementY);
}

/**
 *
 * @param {*} baseTriangle
 * @param {*} startColor
 * @param {*} endColor
 * @param {'right' | 'left'} direction
 */
function drawStripe(baseTriangle, startColor, endColor, direction = "right") {
  for (let i = 0; i < trianglesPerStripe.value(); i++) {
    let t2R;
    let angleFactor = i % 2 == 0 ? -1 : 1;
    if (direction === "left") {
      angleFactor *= -1;
    }
    let tColor = lerpColor(
      startColor,
      endColor,
      i / trianglesPerStripe.value()
    );
    t2R = baseTriangle.inverse();
    t2R.color = tColor;
    t2R.move(baseTriangle.height);
    t2R.move(t2R.height.copy().rotate(angleFactor * HALF_PI));
    t2R.draw();
    baseTriangle = t2R;
  }
}
