let cellSide = 40;
const cellsX = 27,
  cellsY = 48;

/**
 * @type Shape[]
 */
const shapes = [];

function setup() {
  const canvas = createCanvas(cellsX * cellSide, cellsY * cellSide);
  frameRate(30);
  const recording = record(document.getElementById("defaultCanvas0"), 10000);
  // play it on another video element
  var video$ = document.createElement("video");

  document.body.appendChild(video$);
  recording.then((url) => video$.setAttribute("src", url));

  // download it
  var link$ = document.createElement("a");
  link$.setAttribute("download", "squares-vid");
  recording.then((url) => {
    link$.setAttribute("href", url);
    link$.click();
  });

  perCell((x, y) =>
    shapes.push(
      new Shape(x + cellSide / 2, y + cellSide / 2, width / 2, height / 2)
    )
  );
}

function draw() {
  background(19);

  // draw grid
  // perCell((x, y) => {
  // fill(1, 1, 1, 0);
  // stroke(255);
  // square(x, y, cellSide);
  // });
  for (const shape of shapes) {
    shape.show(millis() / 1000);
  }
}

function perCell(cb) {
  for (let x = 0; x < cellsX * cellSide; x += cellSide) {
    for (let y = 0; y < cellsY * cellSide; y += cellSide) {
      cb(x, y);
    }
  }
}
class Shape {
  constructor(centerX, centerY, targetX, targetY) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.targetX = targetX;
    this.targetY = targetY;
  }
  show(t) {
    push();
    translate(this.centerX, this.centerY);
    rectMode("center");
    fill(mapColorX(this.centerX), 10, mapColorY(this.centerY));
    // fill(255, 0, 0);
    noStroke();
    const padding = cellSide * (2 / 5);
    const angle =
      t * 1.5 +
      dist(this.centerX, this.centerY, this.targetX, this.targetY) / 200;
    rotate(angle);
    rect(0, 0, cellSide - padding + sin(angle) * (padding - 5));
    pop();
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("squares", 15, { delay: 2 });
  }
}
const mapColorX = colorComponentClampedInScreen(cellsX);
const mapColorY = colorComponentClampedInScreen(cellsY);

function colorComponentClampedInScreen(cellsInDir) {
  return function (val) {
    return map(val, 0, cellsX * cellSide, 50, 200);
  };
}

function record(canvas, time) {
  var recordedChunks = [];
  return new Promise(function (res, rej) {
    var stream = canvas.captureStream(30 /*fps*/);
    const mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 15000000,
      mimeType: "video/mp4",
    });

    //ondataavailable will fire in interval of `time || 4000 ms`
    mediaRecorder.start(time || 4000);

    mediaRecorder.ondataavailable = function (event) {
      recordedChunks.push(event.data);
      // after stop `dataavilable` event run one more time
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };

    mediaRecorder.onstop = function (event) {
      var blob = new Blob(recordedChunks, { type: "video/webm" });
      var url = URL.createObjectURL(blob);
      res(url);
    };
  });
}
