// Temporary preview for the input and audio branches.
// The canvas team can replace this with the shared final sketch when merging.

let topH;
let swapped = false;
let transition = 0;

function preload() {
  preloadAudio();
}

function setup() {
  createCanvas(400, 400);
  topH = height / 2;
  setupAudio();
}

function draw() {
  background(220);

  updateSounds();
  updateWaves();
}

// Temporary swap function for testing the audio branch.
function startSwap() {
  swapped = !swapped;
  playEffect(swapSound, 0.8);
}
