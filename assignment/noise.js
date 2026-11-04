let transition = 0;
let transitionLength = 150;
let goingToHell = false;
let transitionSeed = 0;
let oldPicture = null;
let newPicture = null;

let glitchStartFrame = -1000;
let glitchNumber = 0;
let glitchRow = 0;
let glitchLength = 50;

let particles = [];

class Particle {
  constructor(isPetal) {
    this.isPetal = isPetal;
    this.x = random(width);
    if (isPetal) {
      this.y = random(0, topH / 2);
    } else {
      this.y = random(topH / 2, topH);
    }
    this.seed = random(1000);
    this.size = random(3, 6);
    this.speed = random(0.3, 0.8);
    this.alpha = 255;
  }

  move() {
    if (this.isPetal) {
      this.y = this.y + this.speed;
    } else {
      this.y = this.y - this.speed;
    }
    let drift = noise(this.seed, frameCount * 0.01);
    this.x = this.x + map(drift, 0, 1, -0.8, 0.8);
    this.alpha = this.alpha - 0.8;
  }

  show() {
    if (this.isPetal) {
      fill(255, 214, 226, this.alpha);
      ellipse(this.x, this.y, this.size * 1.8, this.size);
    } else {
      fill(255, 140, 40, this.alpha * 0.3);
      circle(this.x, this.y, this.size * 3);
      fill(255, 111, 24, this.alpha);
      circle(this.x, this.y, this.size);
    }
  }

  isGone() {
    if (this.alpha <= 0) {
      return true;
    }
    if (this.y < 0 || this.y > topH) {
      return true;
    }
    return false;
  }
}

function updateParticles() {
  if (random() < 0.12) {
    particles.push(new Particle(!swapped));
  }

  let keep = [];
  for (let p of particles) {
    p.move();
    p.show();
    if (!p.isGone()) {
      keep.push(p);
    }
  }
  particles = keep;
}

function checkGlitchTimer() {
  if (frameCount % 600 == 0 && transition == 0) {
    glitchStartFrame = frameCount;
    glitchNumber = glitchNumber + 1;
    glitchRow = Math.floor(noise(glitchNumber, 50) * ROWS);
    playEffect(glitchSound, 0.35);
  }
}

function glitchStrength() {
  let framesPassed = frameCount - glitchStartFrame;
  if (framesPassed > glitchLength) {
    return 0;
  }
  return Math.sin(Math.PI * framesPassed / glitchLength);
}

function glitchShift(row) {
  let strength = glitchStrength();
  if (strength == 0) {
    return 0;
  }
  if (row < glitchRow - 8 || row > glitchRow + 8) {
    return 0;
  }
  let block = Math.floor(row / 2);
  let n = noise(block * 1.3, frameCount * 0.04 + glitchNumber * 10);
  return Math.round(map(n, 0, 1, -1, 1) * width * 0.35 * strength);
}

function applyRowOffsets() {
  let firstRow = TOP_ROWS;
  if (glitchStrength() > 0) {
    firstRow = 0;
  }

  let startY = rowTop(firstRow);
  let picture = get(0, startY, width, height - startY);

  for (let r = firstRow; r < ROWS; r++) {
    let shift = rowOffset(r) + glitchShift(r);
    if (shift != 0) {
      let y = rowTop(r);
      let h = rowTop(r + 1) - y;
      drawRow(picture, y - startY, y, h, shift);
    }
  }
}

function drawRow(picture, pictureY, y, h, shift) {
  image(picture, shift, y, width, h, 0, pictureY, width, h);
  if (shift > 0) {
    image(picture, shift - width, y, width, h, 0, pictureY, width, h);
  } else {
    image(picture, shift + width, y, width, h, 0, pictureY, width, h);
  }
}

function startSwap() {
  if (transition > 0) {
    return;
  }
  goingToHell = !swapped;
  swapped = !swapped;
  transition = transitionLength;
  transitionSeed = random(1000);
  oldPicture = null;
  particles = [];
  playEffect(swapSound, 1);
  playEffect(glitchSound, 0.2);
}

function drawTransition() {
  if (oldPicture == null) {
    drawLiveFrame(!swapped);
    oldPicture = get();
    drawLiveFrame(swapped);
    newPicture = get();
  }

  let progress = 1 - transition / transitionLength;
  let strength = Math.sin(Math.PI * progress);

  background(14, 24, 35);

  for (let r = 0; r < ROWS; r++) {
    let y = rowTop(r);
    let h = rowTop(r + 1) - y;

    let picture = oldPicture;
    if (noise(r * 0.15, transitionSeed) < progress * 1.5 - 0.25) {
      picture = newPicture;
    }

    let block = Math.floor(r / 2);
    let n = noise(block * 1.3, frameCount * 0.03 + transitionSeed);
    let shift = Math.round(map(n, 0, 1, -1, 1) * width * 0.3 * strength);

    drawRow(picture, y, y, h, shift);
  }

  if (goingToHell) {
    fill(70, 12, 8, 150 * strength);
  } else {
    fill(255, 240, 235, 110 * strength);
  }
  rect(0, 0, width, height);

  transition = transition - 1;
}
