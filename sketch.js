let emitters = [];
let G;

function setup() {
  createCanvas(400, 600);
  emitters.push(new Emitter(width / 2, 30));
  G = createVector(0, 0.1);
  ellipseMode(RADIUS);
  noStroke();
}

function draw() {
  background(220);
  for (let e of emitters) {
    e.update();
  }
}

class Emitter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    for (let i = 0; i < 20; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }
  }

  update() {
    this.particles = this.particles.filter(p => !p.isDead());

  
    for (let p of this.particles) {
      p.applyForce(G);
      p.update();
      p.draw();
    }


    this.particles.push(new Particle(this.x, this.y));
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-2, 0));
    this.acc = createVector(0, 0);
    this.lifespan = 255;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 2;
  }

  draw() {
    fill(0, this.lifespan);
    ellipse(this.pos.x, this.pos.y, 8, 8);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

function mouseClicked() {
  emitters.push(new Emitter(mouseX, mouseY));
}
