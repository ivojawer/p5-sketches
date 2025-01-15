let minBranchLength = 2;
let branchAmt = 1;
let addBranchNextDraw = false;
let maxBranches = 9;
let minBranchesForLeafs = 3;
let leafColors;
let branchLengthRatio;
let curliness;
let growthSpeed;
let baseLength;
function setup() {
  createCanvas(400, 400);
  resizeCanvas(windowWidth, windowHeight);
  curliness = sliderDiv("curliness", 0, HALF_PI, 0.01, PI / 6);
  growthSpeed = sliderDiv("growth speed", 0, 4, 0.1, 1);
  branchLengthRatio = sliderDiv("branch length ratio", 0, 1, 0.01, 0.6);
  randomizeLeafs();
  baseLength = sliderDiv("trunk length", 0, 1 / 2, 0.01, 1 / 3);
}

function draw() {
  translate(width / 2, height);
  rotate(PI);
  background(0);
  stroke(255);
  // line(0, 0, 0, (height * 1) / 3);

  minBranchLength += growthSpeed.value();
  fill(255, 0, 0);
  // rotate(-PI);
  // text(branchAmt, 20, -baseLength);
  // rotate(PI);
  drawBranch(createVector(0, 0), createVector(0, baseLength.value() * height));
  if (addBranchNextDraw && branchAmt < maxBranches) {
    branchAmt++;
    addBranchNextDraw = false;
    minBranchLength = 0;
  }
}
function drawBranch(origin, target, currBranch = 1) {
  let branch = p5.Vector.sub(target, origin);
  if (currBranch === branchAmt) {
    if (branch.mag() > minBranchLength) {
      branch.setMag(minBranchLength);
    } else if (branchAmt < maxBranches) {
      addBranchNextDraw = true;
    }
  }

  if (currBranch > branchAmt) {
    if (currBranch >= minBranchesForLeafs) {
      noStroke();
      fill(leafColors);
      circle(origin.x, origin.y, constrain(branch.mag() / 2, 5, 10));
    }
  } else {
    stroke(255);
    let girth = map(branch.mag(), 1, 200, 1, 10);
    strokeWeight(girth);
    target = p5.Vector.add(origin, branch);
    line(origin.x, origin.y, target.x, target.y);

    let nextBranchR = calculateBranch(branch, 1);
    drawBranch(target, p5.Vector.add(target, nextBranchR), currBranch + 1);

    let nextBranchL = calculateBranch(branch, -1);
    drawBranch(target, p5.Vector.add(target, nextBranchL), currBranch + 1);
  }
}

function calculateBranch(prevBranch, angleFactor) {
  let size = prevBranch.mag() * branchLengthRatio.value();
  return prevBranch
    .copy()
    .rotate(angleFactor * curliness.value())
    .setMag(size);
}

function keyPressed() {
  if (key === "r") {
    branchAmt = 1;
    minBranchLength = 0;
    randomizeLeafs();
  }
}

function randomizeLeafs() {
  leafColors = color(random(255), random(255), random(255));
}

function sliderDiv(label, min, max, step, value) {
  const slider = createSlider(min, max, value, step);
  const div = createDiv();
  div.child(createElement("p", label), slider);
  return slider;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
