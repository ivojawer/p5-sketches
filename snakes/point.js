class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mult(scalar) {
    return new Point(this.x * scalar, this.y * scalar);
  }

  add(p) {
    return new Point(this.x + p.x, this.y + p.y);
  }
}
