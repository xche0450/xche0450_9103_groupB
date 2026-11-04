

// Grid variables 
// Divide the canvas
let COLS = 30;

// Width and height of each image segment
let segW;
let segH;

// Water line.
let TOP_ROWS;

// Rows
let ROWS;

// Store all image segments
let allSegmentInfo = [];


// Mouse timing 

// A segment stays open 
let FLIP_FRAMES = 110;

// Control sound play
let lastBlipFrame = 0;

// Store  previous click
let lastClickFrame = -100;

// Store  click ripples
let waves = [];


// Image segment class 

class imageSegment {
  constructor(x, y, w, h, row) {
    // Position of this segment
    this.x = x;
    this.y = y;

    // Size of this segment
    this.w = w;
    this.h = h;

    // Row number of this segment
    this.row = row;

    // Segment should close.
    this.flipUntil = 0;

    // Matching pieces from the two worlds
    this.pieceA = null;
    this.pieceB = null;
  }

  // Check segment is open.
  isFlipped() {
    if (frameCount < this.flipUntil) {
      return true;
    } else {
      return false;
    }
  }

  // Draw a piece from the other world
  drawSegment() {
    let offset = rowOffset(this.row);

    if (swapped == true) {
      image(
        this.pieceA,
        this.x + offset,
        this.y
      );
    } else {
      image(
        this.pieceB,
        this.x + offset,
        this.y
      );
    }
  }
}


// Create the image grid
function makeSegments() {
  // Calculate the width of one segment
  segW = width / COLS;

  // Calculate how many rows are above the water
  TOP_ROWS = Math.round(topH / segW);

  // Make the rows end at the water line
  segH = topH / TOP_ROWS;

  // Calculate the total number of rows
  ROWS = Math.floor(height / segH);

  // Add one more row
  if (ROWS * segH < height) {
    ROWS = ROWS + 1;
  }

  // Clear the old segment array
  allSegmentInfo = [];

  // Create each row
  for (let r = 0; r < ROWS; r++) {
    let y = rowTop(r);
    let nextY = rowTop(r + 1);
    let h = nextY - y;

    // Create each column
    for (let c = 0; c < COLS; c++) {
      let x = Math.round(c * segW);
      let nextX = Math.round((c + 1) * segW);
      let w = nextX - x;

      // Create one new image segment
      let segment = new imageSegment(
        x,
        y,
        w,
        h,
        r
      );

      // Take the matching image piece from world A.
      segment.pieceA = compA.get(
        x,
        y,
        w,
        h
      );

      // Take the matching image piece from world B.
      segment.pieceB = compB.get(
        x,
        y,
        w,
        h
      );

      // Segment to the array
      allSegmentInfo.push(segment);
    }
  }
}
//  Click ripples

function updateWaves() {
  // Store the ripples that are still visible
  let stillAlive = [];

  // Width of the visible ripple edge
  let band = segW * 1.3;

  // Check every active ripple
  for (let i = 0; i < waves.length; i++) {
    let wave = waves[i];

    // Make the ripple larger over time
    let age = frameCount - wave.startFrame;
    let radius = age * width * 0.007;

    // Check every image segment
    for (
      let j = 0;
      j < allSegmentInfo.length;
      j++
    ) {
      let segment = allSegmentInfo[j];

      // Find the centre of the segment.
      let centreX = segment.x + segW / 2;
      let centreY = segment.y + segH / 2;

      // Find the distance from the click
      let distanceFromClick = dist(
        centreX,
        centreY,
        wave.x,
        wave.y
      );

      // Find the distance from the ripple edge
      let gap = abs(
        distanceFromClick - radius
      );

      // Reveal segments close to the ripple edge
      if (gap < band) {
        if (
          segment.flipUntil <
          frameCount + 30
        ) {
          segment.flipUntil =
            frameCount + 30;
        }
      }
    }

    // Keep the ripple while it is still visible
    if (radius < height * 1.2) {
      stillAlive.push(wave);
    }
  }

  // Remove finished ripples
  waves = stillAlive;
}

// Check the mouse position

function mouseInCanvas() {
  if (
    mouseX >= 0 &&
    mouseX <= width &&
    mouseY >= 0 &&
    mouseY <= height
  ) {
    return true;
  } else {
    return false;
  }
}

// Mouse movement

function mouseMoved() {
  // Stop the mouse 
  if (mouseInCanvas() == false) {
    return;
  }

  // Wait until the canvas team has created the image segments.
  if (allSegmentInfo.length == 0) {
    return;
  }

  // Stop mouse input during the transition
  if (transition > 0) {
    return;
  }

  // Radius of the circular mouse lens
  let lensRadius = width * 0.1;

  // Count newly revealed segments
  let newFlips = 0;

  // Check every image segment
  for (
    let i = 0;
    i < allSegmentInfo.length;
    i++
  ) {
    let segment = allSegmentInfo[i];

    // Find the centre of the segment
    let centreX = segment.x + segW / 2;
    let centreY = segment.y + segH / 2;

    // Find the distance from the mouse
    let distanceFromMouse = dist(
      centreX,
      centreY,
      mouseX,
      mouseY
    );

    // Reveal segments inside the mouse lens
    if (distanceFromMouse < lensRadius) {
      if (segment.isFlipped() == false) {
        newFlips = newFlips + 1;
      }

      segment.flipUntil =
        frameCount + FLIP_FRAMES;
    }
  }

  // Play the chime 
  if (newFlips > 0) {
    if (
      frameCount - lastBlipFrame > 8
    ) {
      lastBlipFrame = frameCount;

      playEffect(
        chimeSound,
        0.3
      );
    }
  }
}

// Mouse click 
function mousePressed() {
  // Stop if the mouse is outside the canvas.
  if (mouseInCanvas() == false) {
    return;
  }

  // Wait until the canvas team has created the image segments.
  if (allSegmentInfo.length == 0) {
    return;
  }

  // Create a new ripple.
  let newWave = {
    x: mouseX,
    y: mouseY,
    startFrame: frameCount
  };

  // Add the ripple to the array
  waves.push(newWave);

  // Play the stone-drop sound
  playEffect(
    plopSound,
    1
  );

  // Check for a quick second click
  if (
    frameCount - lastClickFrame < 18
  ) {
    // Swap Heaven and Hell
    startSwap();

    // Reset the click timer
    lastClickFrame = -100;
  } else {
    // Remember the first click.
    lastClickFrame = frameCount;
  }
}
