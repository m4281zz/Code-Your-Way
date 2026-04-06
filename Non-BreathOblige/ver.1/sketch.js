let centerDot = { x: 0, y: 0, radius: 10 };
let particles = [];
let lastRenderedText = "";

const textConfig = {
  maxLayers: 11,
  layerSpacing: 24,
  fillColor: [255, 255, 255]
};

const lineConfig = {
  strokeWeight: 1,
  strokeColor: [255, 255, 255, 80],
  drawLines: true
};

class Particle {
  constructor(char, x, y, angle, delay) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.angle = angle;
    this.delay = delay;
    this.createdTime = millis();
    this.flyStartTime = this.createdTime + delay;
    this.isFlying = false;
    this.vx = 0;
    this.vy = 0;
    this.lineLength = 34;
  }

  update() {
    if (millis() > this.flyStartTime && !this.isFlying) {
      this.isFlying = true;
      this.vx = random(-0.8, 2.2);
      this.vy = random(-3.4, -0.8);
    }

    if (this.isFlying) {
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  display(cx, cy) {
    let drawX = this.x;
    let drawY = this.y;

    if (!this.isFlying) {
      const t = millis() * 0.001;
      drawX = this.baseX + sin(t + this.baseX * 0.02) * 2.8;
      drawY = this.baseY + cos(t * 0.8 + this.baseY * 0.02) * 2.8;
    }

    if (lineConfig.drawLines) {
      stroke(...lineConfig.strokeColor);
      strokeWeight(lineConfig.strokeWeight);

      if (this.isFlying) {
        const speed = sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0) {
          const lineEndX = drawX - (this.vx / speed) * this.lineLength;
          const lineEndY = drawY - (this.vy / speed) * this.lineLength;
          line(drawX, drawY, lineEndX, lineEndY);
        }
      } else {
        line(cx, cy, drawX, drawY);
      }
    }

    push();
    translate(drawX, drawY);
    rotate(radians(this.angle + 90));
    noStroke();
    fill(...textConfig.fillColor);
    textSize(18);
    text(this.char, 0, 0);
    pop();
  }

  isOffScreen() {
    return (
      this.x < -120 ||
      this.x > width + 120 ||
      this.y < -120 ||
      this.y > height + 120
    );
  }
}

function setup() {
  const canvas = createCanvas(900, 620);
  canvas.parent("canvasContainer");
  textAlign(CENTER, CENTER);

  centerDot.x = width / 2;
  centerDot.y = height * 0.28;
}

function draw() {
  background(241, 241, 241);

  drawStem();
  drawCenter();

  const spokenText =
    window.appState && window.appState.transcript
      ? window.appState.transcript
      : "";

  if (spokenText !== lastRenderedText) {
    if (spokenText.trim().length === 0) {
      particles = [];
    } else {
      generateParticles(spokenText);
    }
    lastRenderedText = spokenText;
  }

  particles = particles.filter((p) => !p.isOffScreen());

  for (const p of particles) {
    p.update();
    p.display(centerDot.x, centerDot.y);
  }

  drawHint(spokenText);
}

function drawStem() {
  push();
  stroke(255);
  strokeWeight(2.2);
  noFill();

  beginShape();
  vertex(centerDot.x, centerDot.y);
  bezierVertex(
    centerDot.x + 6,
    centerDot.y + 100,
    centerDot.x - 88,
    centerDot.y + 240,
    centerDot.x - 28,
    height - 18
  );
  endShape();

  pop();
}

function drawCenter() {
  push();
  noStroke();
  fill(255);
  circle(centerDot.x, centerDot.y, centerDot.radius * 2);
  pop();
}

function drawHint(spokenText) {
  if (spokenText.trim().length > 0) return;

  push();
  fill(255, 220);
  noStroke();
  textSize(18);
  text("Press Start Speaking to begin", width / 2, height * 0.82);
  pop();
}

function calculateCharPositions(text, cx, cy) {
  const charPositions = [];
  const chars = [...text];
  const totalChars = chars.length;

  randomSeed(totalChars);

  let charIndex = 0;

  for (let layer = 1; layer <= textConfig.maxLayers && charIndex < totalChars; layer++) {
    const radius = layer * textConfig.layerSpacing + centerDot.radius + 16;
    const spacing = 9;
    let currentAngle = -90 + random(0, 26);

    while (currentAngle < 270 && charIndex < totalChars) {
      const rad = radians(currentAngle);

      charPositions.push({
        char: chars[charIndex],
        x: cx + cos(rad) * radius,
        y: cy + sin(rad) * radius,
        angle: currentAngle
      });

      charIndex++;
      currentAngle += spacing;
    }
  }

  return charPositions;
}

function generateParticles(text) {
  particles = [];
  const positions = calculateCharPositions(text, centerDot.x, centerDot.y);

  for (const pos of positions) {
    const particle = new Particle(
      pos.char,
      pos.x,
      pos.y,
      pos.angle,
      random(2800, 5200)
    );
    particles.push(particle);
  }
}

function windowResized() {
  const container = document.getElementById("canvasContainer");
  const targetWidth = Math.min(container.offsetWidth, 900);

  resizeCanvas(targetWidth, 620);

  centerDot.x = width / 2;
  centerDot.y = height * 0.28;

  if (lastRenderedText.trim().length > 0) {
    generateParticles(lastRenderedText);
  }
}