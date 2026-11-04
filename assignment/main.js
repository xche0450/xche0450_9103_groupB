let heavenTopImg;
let heavenBottomImg;
let hellTopImg;
let hellBottomImg;
let compA;
let compB;

let heavenScale;
let hellScale;
let topH;
let botH;

let swapped = false;

let heavenAnim = { sway: 0, breathe: 0, flag: 0, glow: 0 };
let hellAnim = { sway: 0, breathe: 0, glow: 0, flicker: 0 };

// Set up the canvas and start the shared audio controls.
function setup() {
  let h = windowHeight - 70;
  let w = Math.floor(h * 928 / 1998);
  createCanvas(w, h);
  pixelDensity(1);
  buildWorlds();
  setupAudio();
}

// Draw both worlds, their reflections, and the starting frames.
function buildWorlds() {
  heavenScale = width / 928;
  hellScale = width / 900;
  topH = Math.round(982 * heavenScale);
  botH = height - topH;

  push();
  translate(0, topH - 1092 * heavenScale);
  scale(heavenScale);
  drawHeavenScenery();
  pop();
  heavenTopImg = get(0, 0, width, topH);

  push();
  translate(0, topH + 1092 * heavenScale);
  scale(heavenScale, -heavenScale);
  drawHeavenScenery();
  pop();
  heavenBottomImg = get(0, topH, width, botH);

  push();
  translate(0, topH - 1095 * hellScale);
  scale(hellScale);
  drawHellScenery();
  pop();
  hellTopImg = get(0, 0, width, topH);

  push();
  translate(0, topH + 1095 * hellScale);
  scale(hellScale, -hellScale);
  drawHellScenery();
  pop();
  hellBottomImg = get(0, topH, width, botH);

  drawLiveFrame(false);
  compA = get();
  drawLiveFrame(true);
  compB = get();

  makeSegments();
}

// Return the pixel position at the top of a grid row.
function rowTop(r) {
  let y = Math.round(r * segH);
  if (y > height) {
    y = height;
  }
  return y;
}

// Draw one world above the water and the other as its reflection.
function drawLiveFrame(hellOnTop) {
  noStroke();
  if (hellOnTop) {
    image(heavenBottomImg, 0, topH);
    drawHeavenPart(true);
    drawWaterTint();
    image(hellTopImg, 0, 0);
    drawHellPart(false);
  } else {
    image(hellBottomImg, 0, topH);
    drawHellPart(true);
    drawWaterTint();
    image(heavenTopImg, 0, 0);
    drawHeavenPart(false);
  }
}

// Add a light blue tint to the reflection area.
function drawWaterTint() {
  fill(24, 163, 239, 40);
  rect(0, topH, width, botH);
}

// Draw the moving heaven scene, flipped when it is below the water.
function drawHeavenPart(upsideDown) {
  push();
  if (upsideDown) {
    translate(0, topH + 1092 * heavenScale);
    scale(heavenScale, -heavenScale);
  } else {
    translate(0, topH - 1092 * heavenScale);
    scale(heavenScale);
  }
  drawHeavenLive(heavenAnim);
  pop();
}

// Draw the moving hell scene, flipped when it is below the water.
function drawHellPart(upsideDown) {
  push();
  if (upsideDown) {
    translate(0, topH + 1095 * hellScale);
    scale(hellScale, -hellScale);
  } else {
    translate(0, topH - 1095 * hellScale);
    scale(hellScale);
  }
  drawHellLive(hellAnim);
  pop();
}

// Update and draw one frame of the animation.
function draw() {
  updateTimeValues();
  updateAudioValues();
  noStroke();

  if (transition > 0) {
    drawTransition();
  } else {
    drawLiveFrame(swapped);
    applyRowOffsets();
    for (let segment of allSegmentInfo) {
      if (segment.isFlipped()) {
        segment.drawSegment();
      }
    }
    updateParticles();
  }

  let lineH = 2 + amp.getLevel() * 12;
  fill(200, 239, 255);
  rect(0, topH - lineH / 2, width, lineH);

  updateWaves();
  checkGlitchTimer();
  updateSounds();
}

// Keep a blend amount between 0 and 1.
function limit01(v) {
  if (v < 0) {
    return 0;
  }
  if (v > 1) {
    return 1;
  }
  return v;
}

// Blend two RGB colors by amount t.
function mixColor(c1, c2, t) {
  t = limit01(t);
  let r = c1[0] + (c2[0] - c1[0]) * t;
  let g = c1[1] + (c2[1] - c1[1]) * t;
  let b = c1[2] + (c2[2] - c1[2]) * t;
  return [r, g, b];
}

// Resize the canvas and rebuild the scenes to fit the window.
function windowResized() {
  let h = windowHeight - 70;
  let w = Math.floor(h * 928 / 1998);
  resizeCanvas(w, h);
  buildWorlds();
}
