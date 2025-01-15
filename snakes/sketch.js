let snakes = [];
const snakesAmnt = 30;
var snakeShader, rippleShader;

function preload() {
  snakeShader = loadShader(
    "shaders/snake/snake.vert",
    "shaders/snake/snake.frag"
  );

  rippleShader = loadShader(
    "shaders/ripple/ripple.vert",
    "shaders/ripple/ripple.frag"
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // let group = createDiv("");
  // group.position(30, 30);

  // stepSpeed = createSlider(0, 0.01, 0.003, 0.001);
  // stepSpeed.parent(group);
  // let speedLabel = createSpan("Speed");
  // speedLabel.style("color: white;");
  // speedLabel.parent(group);

  for (let i = 0; i < snakesAmnt; i++) {
    snakes.push(
      new Snake(
        random(0.0001, 0.004),
        ceil(random(10, 30)),
        random(4, 10),
        snakeShader,
        10,
        0.002,
        [random(0, 1), random(0, 1), random(0, 1)],
        { amplitude: random(0, 30), frequency: random(0, 0.1) }
      )
    );
  }
}

function draw() {
  background(30);
  for (let i = 0; i < snakes.length; i++) {
    snakes[i].step();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
