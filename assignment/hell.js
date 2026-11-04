const R_DARK = [143, 19, 12];
const R_GLOW = [235, 55, 24];

// Draw the fixed background for the hell scene.
function drawHellScenery() {
  background(14, 24, 35);
  noStroke();

  fill(255, 238, 180, 120);
  for (let i = 0; i < 40; i++) {
    let x = noise(i * 0.7, 10) * 1200 - 150;
    let y = noise(i * 0.7, 20) * 900;
    rect(x, y, 3, 3);
  }

  fill(60, 20, 22, 120);
  rect(0, 900, 900, 195);

  fill(60, 22, 24);
  triangle(-60, 1095, 60, 820, 180, 1095);
  triangle(640, 1095, 760, 860, 900, 1095);
  triangle(180, 1095, 230, 960, 290, 1095);
  fill(91, 28, 25);
  triangle(20, 925, 116, 768, 300, 1095);
  triangle(750, 1070, 863, 838, 1010, 1080);
  fill(110, 34, 28);
  triangle(116, 768, 140, 805, 100, 795);
  triangle(863, 838, 885, 880, 845, 870);

  fill(36, 35, 44);
  ellipse(32, 985, 225, 220);
  ellipse(820, 1032, 210, 195);
  fill(24, 24, 33);
  ellipse(102, 1093, 175, 184);

  drawDeadTree(70, 1000, 1);
  drawDeadTree(840, 990, -1);

  fill(91, 28, 25);
  circle(844, 1094, 153);
}

// Draw a dead tree using its base position and branch direction.
function drawDeadTree(x, y, dir) {
  stroke(20, 18, 24);
  strokeWeight(10);
  line(x, y + 95, x, y - 40);
  strokeWeight(6);
  line(x, y, x + 40 * dir, y - 50);
  line(x, y - 20, x - 30 * dir, y - 70);
  strokeWeight(4);
  line(x + 40 * dir, y - 50, x + 55 * dir, y - 80);
  line(x + 40 * dir, y - 50, x + 70 * dir, y - 45);
  line(x - 30 * dir, y - 70, x - 25 * dir, y - 100);
  noStroke();
}

// Draw the moving moon, castle, and bats.
function drawHellLive(anim) {
  noStroke();

  let moonY = 320 + Math.sin(frameCount * 0.01) * 10;
  drawMoon(707, moonY, 224 + anim.glow * 30, anim.glow);

  let castle = new Castle();
  castle.display(450, 1095, 1, anim);

  let flockX = 1250 - ((frameCount * 1.2) % 1700);
  for (let i = 0; i < 4; i++) {
    let bx = flockX + i * 70;
    let by = 420 + i * 30 + Math.sin(frameCount * 0.06 + i) * 14;
    drawBat(bx, by, 0.9, Math.sin(frameCount * 0.35 + i * 1.7));
  }
}

// Draw the moon and adjust its size and light with the music.
function drawMoon(x, y, d, glow) {
  fill(255, 66, 27, 30 + glow * 60);
  circle(x, y, d * 1.35);
  fill(255, 66 + glow * 40, 27);
  circle(x, y, d);
  fill(220, 50, 22);
  circle(x - d * 0.2, y - d * 0.12, d * 0.2);
  circle(x + d * 0.18, y + d * 0.15, d * 0.14);
  circle(x + d * 0.05, y - d * 0.28, d * 0.08);
  fill(255, 120, 70, 90);
  circle(x - d * 0.24, y - d * 0.16, d * 0.07);
}

// Draw a bat with wings that move as flap changes.
function drawBat(x, y, s, flap) {
  push();
  translate(x, y);
  scale(s);
  fill(8, 10, 16);
  let tipY = -30 + flap * 30;
  beginShape();
  vertex(0, 0);
  vertex(-18, -10);
  vertex(-48, tipY);
  vertex(-40, tipY + 22);
  vertex(-28, tipY + 14);
  vertex(-20, tipY + 26);
  vertex(-8, 6);
  endShape();
  beginShape();
  vertex(0, 0);
  vertex(18, -10);
  vertex(48, tipY);
  vertex(40, tipY + 22);
  vertex(28, tipY + 14);
  vertex(20, tipY + 26);
  vertex(8, 6);
  endShape();
  ellipse(0, 2, 16, 22);
  triangle(-6, -6, -3, -16, 0, -6);
  triangle(6, -6, 3, -16, 0, -6);
  fill(255, 90, 40);
  circle(-3, 0, 3);
  circle(3, 0, 3);
  pop();
}

// Draw the hell castle and its glowing details.
class Castle {
  // Place, scale, and animate the castle.
  display(x, y, size, anim) {
    let red = mixColor(R_DARK, R_GLOW, anim.glow);
    let door = mixColor([228, 48, 18], [255, 140, 40], anim.glow);

    push();
    translate(x, y);
    rotate(anim.sway);
    scale(size, size * (1 + anim.breathe * 0.012));

    fill(43, 27, 33);
    rect(-180, -290, 95, 290);
    rect(85, -290, 95, 290);
    rect(-85, -165, 170, 165);
    fill(30, 20, 26);
    drawSpikes(-180, -290, 95, 5, 22);
    drawSpikes(85, -290, 95, 5, 22);

    fill(55, 33, 38);
    for (let i = 0; i < 5; i++) {
      rect(-170 + (i % 2) * 30, -260 + i * 45, 26, 10);
      rect(110 + (i % 2) * 30, -250 + i * 45, 26, 10);
    }

    fill(130, 24, 19);
    triangle(-180, -52, -103, -165, -85, 0);
    triangle(-103, -165, -85, -165, -85, 0);
    triangle(85, -165, 103, -165, 180, -52);
    triangle(85, -165, 180, -52, 85, 0);

    fill(red);
    rect(-33, -690, 66, 145);
    fill(78, 27, 26);
    triangle(-49, -690, 0, -760, 49, -690);
    fill(250, 53, 24);
    rect(-22, -800, 44, 44);
    triangle(-22, -800, 22, -800, 0, -830);
    this.drawWindow(-11, -666, 22, anim, 0);

    fill(200, 30, 20);
    rect(-46, -660, 13, 50);
    rect(33, -660, 13, 50);
    fill(14, 24, 35);
    triangle(-46, -610, -33, -610, -39.5, -620);
    triangle(33, -610, 46, -610, 39.5, -620);

    fill(111, 28, 23);
    rect(-49, -548, 98, 213);
    fill(44, 27, 32);
    triangle(-49, -548, 0, -620, 49, -548);
    drawSpikes(-49, -548, 98, 4, 14);
    this.drawWindow(-11, -512, 22, anim, 1);
    this.drawWindow(-30, -460, 16, anim, 2);
    this.drawWindow(14, -460, 16, anim, 3);

    fill(113, 28, 22);
    rect(-169, -402, 58, 112);
    rect(111, -402, 58, 112);
    fill(80, 22, 20);
    drawSpikes(-169, -402, 58, 3, 16);
    drawSpikes(111, -402, 58, 3, 16);
    this.drawWindow(-151, -365, 22, anim, 4);
    this.drawWindow(129, -365, 22, anim, 5);
    drawTorch(-141, -444, 1, anim.flicker);
    drawTorch(141, -444, 1, anim.flicker + 3);

    fill(48, 25, 28);
    triangle(-65, -334, 0, -444, 65, -334);
    fill(104, 30, 23);
    rect(-85, -334, 170, 169);
    fill(red);
    circle(0, -249, 168);
    fill(14, 24, 35);
    circle(0, -249, 78);
    fill(255, 90, 30, anim.glow * 220);
    circle(0, -249, 70);
    stroke(red);
    strokeWeight(6);
    for (let i = 0; i < 8; i++) {
      let angle = i * Math.PI / 4;
      line(0, -249, Math.cos(angle) * 39, -249 + Math.sin(angle) * 39);
    }
    noStroke();
    fill(60, 14, 10);
    for (let i = 0; i < 12; i++) {
      let angle = i * Math.PI / 6;
      circle(Math.cos(angle) * 70, -249 + Math.sin(angle) * 70, 9);
    }

    fill(118, 29, 19);
    triangle(-49, -112, 0, -165, 49, -112);
    fill(door);
    rect(-49, -112, 98, 112);
    stroke(40, 18, 20);
    strokeWeight(5);
    for (let i = 0; i < 5; i++) {
      line(-36 + i * 18, -112, -36 + i * 18, 0);
    }
    line(-49, -70, 49, -70);
    line(-49, -30, 49, -30);
    noStroke();

    fill(55, 28, 29);
    rect(-264, -67, 65, 67);
    rect(199, -67, 65, 67);
    fill(40, 22, 25);
    drawSpikes(-264, -67, 65, 3, 14);
    drawSpikes(199, -67, 65, 3, 14);
    drawTorch(-232, -139, 1.03, anim.flicker + 1.5);
    drawTorch(232, -133, 1, anim.flicker + 4.5);
    pop();
  }

  // Draw a window whose light flickers over time.
  drawWindow(x, y, size, anim, index) {
    let light = noise(index * 10, anim.flicker * 0.5);
    fill(255, 200 + light * 50, 120 + light * 80);
    rect(x, y, size, size);
    fill(14, 24, 35, 120);
    rect(x + size / 2 - 1, y, 2, size);
    rect(x, y + size / 2 - 1, size, 2);
  }
}

// Draw evenly spaced spikes along a horizontal edge.
function drawSpikes(x, y, w, count, h) {
  let step = w / count;
  for (let i = 0; i < count; i++) {
    triangle(x + i * step, y, x + (i + 1) * step, y, x + i * step + step / 2, y - h);
  }
}

// Use Perlin noise to vary the flame. Source: https://p5js.org/reference/p5/noise/
function drawTorch(x, y, size, t) {
  push();
  translate(x, y);
  scale(size);

  fill(61, 27, 29);
  rect(-43, 0, 86, 10);
  triangle(-43, 10, 43, 10, 0, 42);

  let flame = 0.8 + noise(t) * 0.5;
  fill(255, 140, 40, 60);
  circle(0, -34, 90 * flame);
  fill(255, 111, 24);
  circle(0, -28, 54 * flame);
  fill(255, 67, 28);
  triangle(-20 * flame, -55, 0, -55 - 50 * flame, 20 * flame, -55);
  fill(255, 220, 120);
  circle(0, -24, 20 * flame);
  pop();
}
