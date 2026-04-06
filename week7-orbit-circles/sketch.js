let particles = [];
let numParticles = 100;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.maxForce = 0.1;
    this.size = random(5, 15);
    this.hue = random(360);
  }

  update() {
    let mouse = createVector(mouseX, mouseY);
    let force = p5.Vector.sub(mouse, this.pos);
    force.setMag(0.5);
    this.acc.add(force);

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Wrap around edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    fill(this.hue, 80, 100, 80);
    noStroke();
    circle(this.pos.x, this.pos.y, this.size);
  }
}

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 0, 0, 10); // Semi-transparent black for trails

  for (let p of particles) {
    p.update();
    p.show();
  }
}
