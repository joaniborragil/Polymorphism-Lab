let emitters = [];
let G;

function setup() {
  createCanvas(400, 600);
  G = createVector(0, 0.1);
  ellipseMode(RADIUS);
  noStroke();
  emitters.push(new Emitter(width / 2, 30)); 
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
  
    let numParticles = int(random(10, 30));
    for (let i = 0; i < numParticles; i++) {
      this.particles.push(new EmitterParticle(this.x, this.y));
    }
    this.particleSpawnRate = random(0.1, 1); 
  }

  update() {
    this.particles = this.particles.filter((p) => !p.isDead());

  
    for (let p of this.particles) {
      p.applyForce(G);
      p.update();
      p.draw();
    }

    
    if (random(1) < this.particleSpawnRate) {
      this.particles.push(new EmitterParticle(this.x, this.y));
    }
  }
}

class EmitterParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    
    this.vel = createVector(random(-1, 1), random(-2, 0));
    this.acc = createVector(0, 0);
    this.lifespan = 255;
    
    this.color = color(random(255), random(255), random(255));
    
    this.size = random(5, 10);
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
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

function mouseClicked() {
  emitters.push(new Emitter(mouseX, mouseY));
}


