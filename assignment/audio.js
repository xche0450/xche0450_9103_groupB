// Audio for the Heaven / Hell project

// Background music
let heavenSound;
let hellSound;

// Short sound effects
let chimeSound;
let plopSound;
let glitchSound;
let swapSound;

// Audio controls
let audioButton;
let volumeSlider;

// Sound data for the shared visual animation
let amp;
let fft;

// Load every sound before the sketch starts
function preloadAudio() {
  heavenSound = loadSound("sounds/heaven.mp3");
  hellSound = loadSound("sounds/hell.mp3");
  chimeSound = loadSound("sounds/chime.mp3");
  plopSound = loadSound("sounds/plop.mp3");
  glitchSound = loadSound("sounds/glitch.mp3");
  swapSound = loadSound("sounds/swap.mp3");
}

// Create the play button and volume slider
function setupAudio() {
  audioButton = createButton("PLAY");
  audioButton.mousePressed(togglePlaying);

  volumeSlider = createSlider(0, 1, 0.6, 0.02);

  amp = new p5.Amplitude();
  fft = new p5.FFT(0.8, 256);
}

// Use the sound level to animate both worlds
function updateAudioValues() {
  let level = amp.getLevel();
  let glow = map(level, 0, 0.3, 0, 1);
  glow = limitAudioValue(glow);

  heavenAnim.sway = Math.sin(frameCount * 0.05) * level * 0.08;
  hellAnim.sway = Math.sin(frameCount * 0.06) * level * 0.08;
  heavenAnim.glow = glow;
  hellAnim.glow = glow;
}

// Play or pause both background sounds
function togglePlaying() {
  if (heavenSound.isPlaying() == false) {
    heavenSound.loop();
    hellSound.loop();
    audioButton.html("PAUSE");
  } else {
    heavenSound.stop();
    hellSound.stop();
    audioButton.html("PLAY");
  }
}

// Update volume and stereo position every frame
function updateSounds() {
  let volume = volumeSlider.value();

  // The vertical mouse position mixes Heaven and Hell
  let topShare = map(
    mouseY,
    topH - height * 0.3,
    topH + height * 0.3,
    1,
    0
  );

  topShare = limitAudioValue(topShare);

  let heavenShare = topShare;

  // Reverse the mix after the two worlds swap
  if (swapped == true) {
    heavenShare = 1 - topShare;
  }

  heavenSound.setVolume(
    volume * (0.25 + heavenShare * 0.75)
  );

  hellSound.setVolume(
    volume * (0.25 + (1 - heavenShare) * 0.75)
  );

  let panValue = panFromMouse();
  heavenSound.pan(panValue);
  hellSound.pan(panValue);
}

// Change the sound position from left to right
function panFromMouse() {
  let panValue = map(mouseX, 0, width, -1, 1);

  if (panValue < -1) {
    panValue = -1;
  }

  if (panValue > 1) {
    panValue = 1;
  }

  return panValue;
}

// Play one short sound effect
function playEffect(sound, loudness) {
  sound.setVolume(volumeSlider.value() * loudness);
  sound.pan(panFromMouse());
  sound.play();
}

// Keep a value between 0 and 1
function limitAudioValue(value) {
  if (value < 0) {
    value = 0;
  }

  if (value > 1) {
    value = 1;
  }

  return value;
}
