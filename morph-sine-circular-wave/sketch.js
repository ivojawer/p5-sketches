let radius;
let x = 0
let turn = 0;
let turnSpeed
let amplitude
let ballsAmt
let polygonCorners
let morphSpeed
function setup() {
  createCanvas(800, 800);
  ballsAmt = max(width, height) / 2
  polygonCorners = createSlider(2, 10, 5, 1)
  morphSpeed = createSlider(0, 0.01, 0.001, 0.001)
  amplitude = createSlider(10, height / 8, 30, 1)
  radius = createSlider(10, height / 2, height/2.5, 5)
  turnSpeed = createSlider(0, 0.005, 0.001, 0.0005)
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  x += morphSpeed.value() * deltaTime
  turn += turnSpeed.value() * deltaTime

  let polygon = polygonCorners.value()//ceil(sin(x * 0.1) * polygonCorners.value()/2 + polygonCorners.value()/2)

  beginShape()
  for (let i = 0; i < ballsAmt; i++) {
    let angle = map(i, 0, ballsAmt - 1, 0, TWO_PI)
    let wave = sin(angle * polygon) * amplitude.value() * (sin(x)+ 1)
    // console.log(i,polygon,wave)

    let mag = radius.value() + wave
    let clockHand = p5.Vector.fromAngle(angle + turn).setMag(mag)



    fill(
      map(noise(x * 0.1, 0, 0), 0, 1, 0, 255),
      map(noise(0, x * 0.1, 0), 0, 1, 0, 255),
      map(noise(0, 0, x * 0.1), 0, 1, 0, 255),
    )

    // circle(ballVector.x, ballVector.y, 10)
    vertex(clockHand.x, clockHand.y)
  }
  endShape()
  if (millis() > 10000) {
    // noLoop()
  }
}

function keyPressed() {
  if (key == 's') {
    noLoop()
  }
}


function roundness(num) {
  return num - floor(num)
}