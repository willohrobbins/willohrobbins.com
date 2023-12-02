let startTime;
let colorStopsStart = []; // Start gradient colors
let colorStopsEnd = []; // End gradient colors
let stars = []; // Array to hold the stars

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  startTime = millis();

  // Manually define color stops for the starting ombre (sunrise)
  colorStopsStart = [
    color(255, 189, 109), // Replace with sunrise colors
    color(255, 112, 67),
    color(255, 84, 78),
  ];

  // Manually define color stops for the ending ombre (sunset)
  colorStopsEnd = [
    color(64, 164, 223), // Replace with sunset colors
    color(75, 119, 190),
    color(52, 92, 150),
  ];

  // Define the boundaries of the text box to avoid placing stars
  let textBoxTop = height / 2 - 50;
  let textBoxBottom = height / 2 + 50;
  let textBoxLeft = width / 2 - 100;
  let textBoxRight = width / 2 + 100;

  // Add stars around the text, avoiding the rectangular area in the middle
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 3);
    if (y < textBoxTop || y > textBoxBottom || x < textBoxLeft || x > textBoxRight) {
      stars.push(new Star(x, y, size));
    }
  }
}

function draw() {
  let cycleDuration = 60000; // 1 minute cycle for a full transition
  let halfCycle = cycleDuration / 2; // Half cycle for transition back
  let elapsedTime = (millis() - startTime) % cycleDuration;
  let lerpValue = elapsedTime < halfCycle ? map(elapsedTime, 0, halfCycle, 0, 1) : map(elapsedTime, halfCycle, cycleDuration, 1, 0);

  drawGradient(lerpValue);

  // Display the stars
  for (let star of stars) {
    star.display();
  }
}

function drawGradient(t) {
  for (let i = 0; i <= height; i++) {
    let interA = lerpColor(colorStopsStart[0], colorStopsEnd[0], t);
    let interB = lerpColor(colorStopsStart[1], colorStopsEnd[1], t);
    let interC = lerpColor(colorStopsStart[2], colorStopsEnd[2], t);

    let colorAtHeight = lerpColor(interA, interB, i / height);
    colorAtHeight = lerpColor(colorAtHeight, interC, i / height);

    stroke(colorAtHeight);
    line(0, i, width, i);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Define the Star class
class Star {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.twinkleFactor = random(150, 255);
  }

  display() {
    noStroke();
    fill(255, this.twinkleFactor);
    circle(this.x, this.y, this.size);
    this.twinkle();
  }

  twinkle() {
    this.twinkleFactor += random(-20, 20);
    this.twinkleFactor = constrain(this.twinkleFactor, 150, 255);
  }
}
