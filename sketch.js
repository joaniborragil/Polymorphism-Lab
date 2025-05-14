let emitters = [];
let G;
let img;
let imgLoaded = false;

function setup() {
  createCanvas(400, 600);
  G = createVector(0, 0.1);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  noStroke();

  // Load a working PNG image (safe from CORS issues)
  loadImage("https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png", (loadedImg) => {
    img = loadedImg;
    imgLoaded = true;
  });

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
      this.particles.push(this.createRandomParticle());
    }

    this.particleSpawnRate = random(0.1, 1);
  }

  createRandomParticle() {
    let r = random(1);
    if (r < 0.33) {
      return new CircleParticle(this.x, this.y);
    } else if (r < 0.66) {
      return new SquareParticle(this.x, this.y);
    } else {
      return new ImageParticle(this.x, this.y);
    }
  }

  update() {
    this.particles = this.particles.filter((p) => !p.isDead());

    for (let p of this.particles) {
      p.applyForce(G);
      p.update();
      p.draw();
    }

    if (random(1) < this.particleSpawnRate) {
      this.particles.push(this.createRandomParticle());
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

class CircleParticle extends EmitterParticle {
  draw() {
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

class SquareParticle extends EmitterParticle {
  draw() {
    rectMode(CENTER);
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    rect(this.pos.x, this.pos.y, this.size * 2, this.size * 2);
  }
}

class ImageParticle extends EmitterParticle {
  draw() {
    if (imgLoaded) {
      tint(255, this.lifespan);
      image(img, this.pos.x, this.pos.y, this.size * 4, this.size * 4);
    }
  }
}

function mouseClicked() {
  emitters.push(new Emitter(mouseX, mouseY));
}
