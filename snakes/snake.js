class Snake {
  /**
   * @param {number} length
   * @param {number} width
   * @param {Shader} shader
   * @param {number} pointsQty
   */
  constructor(
    speed = 0.003,
    length = 30,
    width = 10,
    shader,
    pointsQty = 10,
    segmentLength = 0.005,
    color = [1, 1, 1],
    snaking = {
      amplitude: 15.0,
      frequency: 0.1,
    }
  ) {
    this.length = length;
    this.segmentLength = segmentLength;
    this.width = width;
    this.shader = shader;
    this.speed = speed;
    this.snaking = snaking;
    this.pointsQty = pointsQty;
    this.loop();
    this.color = color;
    this.ripples = [];
  }

  step() {
    if (this.offset >= 1) {
      this.loop();
    }

    this.ripples = this.ripples.filter((ripple) => !ripple.isDone());
    this.ripples.forEach((ripple) =>
      ripple.step(this.snaking.amplitude, this.snaking.frequency)
    );
    this.draw();

    this.offset += this.speed;
  }

  draw() {
    // fill("green");
    // noFill();
    noStroke();
    shader(this.shader);
    this.shader.setUniform("uTime", millis());
    this.shader.setUniform("uResolution", [width, height]);
    this.shader.setUniform("uAmplitude", this.snaking.amplitude);
    this.shader.setUniform("uFrequency", this.snaking.frequency);
    this.shader.setUniform("uColor", this.color);

    strokeWeight(1);
    beginShape("quad_strip");
    let from = bezierPointAt(this.offset, this.points);
    let head = null;
    for (
      let i = 1;
      // `to` point cant be out of bounds (< 1)
      i < this.length && this.offset + i * this.segmentLength < 1;
      i++
    ) {
      const segmentOffset = this.offset + i * this.segmentLength;

      const to = bezierPointAt(segmentOffset, this.points);

      const vFrom = createVector(from.x, from.y);
      const vTo = createVector(to.x, to.y);
      const vSegment = vFrom.sub(vTo);
      // to calculate snake's width angle rotate the segment 90 degrees
      const width = vSegment.copy().rotate(HALF_PI).setMag(this.width);
      head = width
        .copy()
        .setMag(this.width / 2)
        .add(vTo);
      if (i === 0) {
        // on first iteration draw entire quad
        vertex(from.x, from.y);
        vertex(from.x + width.x, from.y + width.y);
      }
      vertex(to.x + width.x, to.y + width.y);
      vertex(to.x, to.y);

      // next quad shares `to` point with previous quad
      from = to;
    }
    endShape();

    // ripples

    if (head !== null) {
      // `from` is the head of the snake
      this.ripples.push(
        new Ripple(0.5, this.width * 5, new Point(head.x, head.y))
      );
    }
  }

  generatePoints() {
    this.points = [];
    for (let i = 0; i <= this.pointsQty; i++) {
      this.points.push(
        new Point(
          i * (width / this.pointsQty) -
            width / 2 +
            (i === 0 ? -20 : i === this.pointsQty ? 20 : 0),
          random(-height / 2, height / 2)
        )
      );
    }
  }

  startingOffset() {
    return -this.length / 100;
  }

  drawPoints() {
    for (const p of this.points) {
      console.log(p);
      stroke("red");
      strokeWeight(6);
      point(p.x, p.y);
      strokeWeight(1);
      stroke(255);
      text(`(${ceil(p.x)}, ${ceil(p.y)})`, p.x + 5, p.y - 5);
    }
  }

  loop() {
    this.offset = this.startingOffset();
    this.generatePoints();
  }
}

class Ripple {
  constructor(expansionSpeed, maxRadius, origin) {
    this.expansionSpeed = expansionSpeed;
    this.maxRadius = maxRadius;
    this.origin = origin;
    this.radius = min(maxRadius, 5);
  }

  step(amplitude, frequency) {
    this.draw(amplitude, frequency);
    if (this.radius < this.maxRadius) {
      this.radius += this.expansionSpeed;
    }
  }

  draw(amplitude, frequency) {
    stroke(255, map(this.maxRadius - this.radius, 0, this.maxRadius, 0, 255));
    strokeWeight(1);
    rippleShader.setUniform("uCenterPos", [this.origin.x, this.origin.y]);
    shader(rippleShader);
    circle(
      this.origin.x,
      this.origin.y + sin(this.origin.x * frequency) * amplitude,
      this.radius
    );
  }

  isDone() {
    return this.radius >= this.maxRadius;
  }
}
