// ===============================================================
 // heaven.js — Heaven
 // Canvas size: 928 x 1648. Water level (castle base) at y = 1092.
 //
 // Two main parts:
 //   drawHeavenScenery()  Static background: sky, hills, trees, bushes
 //                        (drawn once and saved as an image).
 //   drawHeavenLive(a)    Animated elements: clouds, sun, castle, birds
 //                        (redrawn every frame).
 //   a = heavenAnim, containing animation values such as sway,
 //       brightness and flag movement.
 // ===============================================================

 // ---------- Color palette (based on the original image) ----------
 const H_PINK = [255, 159, 184];      // Light pink: main castle structure
 const H_PINK_MID = [238, 112, 153];  // Medium pink: columns
 const H_PINK_DEEP = [239, 82, 145];  // Dark pink: background structures
 const H_PINK_GLOW = [255, 222, 234]; // Castle color when music is louder
 const H_YELLOW = [255, 233, 105];
 const H_DARK = [30, 48, 62];
 const H_WATER = [139, 218, 251];


 // ===============================================================
 // 1. STATIC BACKGROUND
 // ===============================================================
 function drawHeavenScenery() {
   background(48, 176, 241);
   noStroke();

   // The sky becomes lighter near the horizon.
   fill(66, 186, 244);
   rect(0, 620, 928, 480);
   fill(88, 196, 247);
   rect(0, 860, 928, 240);

   // Light blue hills in the distance.
   fill(118, 206, 246);
   ellipse(120, 1010, 520, 250);
   ellipse(810, 1020, 540, 230);
   fill(132, 214, 248);
   ellipse(470, 1060, 760, 170);

   // Two large trees in their original positions.
   drawHeavenTree(130, 816, 206, 1060);
   drawHeavenTree(800, 847, 192, 1010);

   // Dark green bushes in the background.
   drawBush(12, 1060, 215, [32, 95, 62], [52, 128, 78]);
   drawBush(320, 987, 195, [32, 95, 62], [52, 128, 78]);
   drawBush(607, 988, 195, [32, 95, 62], [52, 128, 78]);
   drawBush(920, 1060, 180, [32, 95, 62], [52, 128, 78]);

   // Light green bushes and small flowers in the foreground.
   drawBush(186, 1077, 205, [151, 210, 99], [182, 228, 128]);
   drawBush(738, 1076, 205, [151, 210, 99], [182, 228, 128]);
   drawFlowers(120, 1010, 9);
   drawFlowers(680, 1012, 9);
 }


 // Draw a tree with a trunk, branches, three layers of leaves,
 // highlights and small fruits.
 function drawHeavenTree(x, y, d, trunkBottom) {
   // Tree trunk and two branches.
   fill(146, 78, 35);
   rect(x - 18, y, 36, trunkBottom - y);
   triangle(x - 6, y + 70, x - 70, y + 10, x - 58, y);
   triangle(x + 6, y + 50, x + 66, y - 5, x + 56, y - 14);
   fill(120, 62, 28);
   rect(x + 6, y + 10, 8, trunkBottom - y - 10);

   // Tree leaves: dark green, medium green and highlights.
   fill(34, 95, 62);
   circle(x, y, d);
   circle(x - d * 0.36, y + d * 0.16, d * 0.62);
   circle(x + d * 0.36, y + d * 0.18, d * 0.58);
   fill(52, 128, 78);
   circle(x - d * 0.12, y - d * 0.1, d * 0.62);
   circle(x + d * 0.25, y + d * 0.05, d * 0.4);
   fill(92, 168, 92);
   circle(x - d * 0.22, y - d * 0.24, d * 0.22);
   circle(x + d * 0.08, y - d * 0.3, d * 0.12);

   // Small yellow fruits.
   fill(255, 231, 101);
   circle(x - d * 0.3, y + d * 0.12, d * 0.07);
   circle(x + d * 0.2, y - d * 0.12, d * 0.07);
   circle(x + d * 0.38, y + d * 0.26, d * 0.07);
   circle(x - d * 0.05, y + d * 0.3, d * 0.07);
 }


 // Draw a bush using a large circle and a highlight.
 function drawBush(x, y, d, dark, light) {
   fill(dark);
   circle(x, y, d);
   fill(light);
   circle(x - d * 0.18, y - d * 0.2, d * 0.42);
   fill(dark);
   circle(x - d * 0.05, y - d * 0.05, d * 0.36);
 }


 // Draw a row of small white and pink flowers.
 function drawFlowers(x, y, count) {
   for (let i = 0; i < count; i++) {
     let fx = x + i * 14;
     let fy = y + (i % 3) * 10;
     fill(255);
     circle(fx, fy, 9);
     fill(255, 159, 184);
     circle(fx, fy, 4);
   }
 }


 // ===============================================================
 // 2. ANIMATED ELEMENTS (REDRAWN EVERY FRAME)
 // ===============================================================
 function drawHeavenLive(a) {
   noStroke();

   // Clouds slowly move to the right.
   for (let i = 0; i < 3; i++) {
     let x = ((frameCount * 0.25 + i * 430) % 1300) - 200;
     let y = 120 + i * 120;
     drawCloud(x, y, 0.8 + i * 0.25);
   }

   // The sun's rays rotate slowly.
   // Louder music makes the sun brighter and larger.
   drawHeavenSun(736, 260, 210 + a.glow * 40, frameCount * 0.004, a.glow);

   // Draw the animated castle.
   drawHeavenCastle(a);

   // The large bird flies in a small circle while flapping its wings.
   let birdX = 210 + Math.sin(frameCount * 0.012) * 45;
   let birdY = 397 + Math.sin(frameCount * 0.024) * 18;
   drawHeavenBird(birdX, birdY, 1, Math.sin(frameCount * 0.18), 1);

   // A group of small birds flies from left to right.
   let flockX = ((frameCount * 1.4) % 1700) - 350;
   for (let i = 0; i < 4; i++) {
     let bx = flockX - i * 75;
     let by = 520 + i * 28 + Math.sin(frameCount * 0.05 + i) * 12;
     drawHeavenBird(bx, by, 0.32, Math.sin(frameCount * 0.3 + i * 1.3), 1);
   }
 }

 function drawCloud(x, y, s) {
   fill(255, 255, 255, 220);
   ellipse(x, y, 160 * s, 60 * s);
   circle(x - 35 * s, y - 15 * s, 70 * s);
   circle(x + 20 * s, y - 25 * s, 90 * s);
   fill(232, 246, 255, 220);
   ellipse(x, y + 12 * s, 150 * s, 26 * s);
 }


 // Draw the sun with 12 rays, an outer glow,
 // a main circle and an inner highlight.
 function drawHeavenSun(x, y, d, turn, glow) {
   push();
   translate(x, y);

   // Outer glow.
   fill(255, 240, 150, 50 + glow * 70);
   circle(0, 0, d * 1.45);

   // Use cos() and sin() to position 12 rays around a circle,
   // similar to the clock example.
   fill(255, 226, 90);
   for (let i = 0; i < 12; i++) {
     let angle = turn + i * (Math.PI * 2 / 12);
     let r1 = d * 0.55;
     let r2 = d * (0.72 + glow * 0.12);
     let side = 0.09;
     triangle(
       Math.cos(angle - side) * r1, Math.sin(angle - side) * r1,
       Math.cos(angle + side) * r1, Math.sin(angle + side) * r1,
       Math.cos(angle) * r2, Math.sin(angle) * r2
     );
   }

   // The sun becomes closer to white as the music gets louder
   // by adjusting its RGB color values.
   fill(255, 234 + glow * 18, 105 + glow * 120);
   circle(0, 0, d);
   fill(255, 245, 170);
   circle(-d * 0.15, -d * 0.15, d * 0.35);
   pop();
 }


 // Blend two RGB colors using t (0 to 1).
 // Return the result as [r, g, b].
 function mixColor(c1, c2, t) {
   if (t < 0) t = 0;
   if (t > 1) t = 1;
   return [
     c1[0] + (c2[0] - c1[0]) * t,
     c1[1] + (c2[1] - c1[1]) * t,
     c1[2] + (c2[2] - c1[2]) * t
   ];
 }


 // ---------- CASTLE ----------
 // a.sway    Side-to-side rotation controlled by music.
 //           It is 0 when the music is quiet.
 // a.breathe Small continuous breathing motion controlled by time.
 // a.flag    Animation phase for flag movement, controlled by time.
 // a.glow    Value from 0 to 1. Louder music makes the castle brighter.
 function drawHeavenCastle(a) {
   let pink = mixColor(H_PINK, H_PINK_GLOW, a.glow * 0.8);
   let pinkMid = mixColor(H_PINK_MID, H_PINK, a.glow * 0.6);
   let wave = Math.sin(a.flag);

   push();
   // Rotate and scale the castle around its bottom center
   // to create swaying and breathing effects.
   translate(465, 1092);
   rotate(a.sway);
   scale(1, 1 + a.breathe * 0.012);
   translate(-465, -1092);

   // --- Dark pink background structure and battlements ---
   fill(H_PINK_DEEP);
   rect(390, 650, 150, 440);
   rect(427, 373, 76, 377);
   drawBattlements(390, 632, 150, 6, 18);

   // --- Two side towers ---
   drawSideTower(333, pink, pinkMid, wave);
   drawSideTower(597, pink, pinkMid, -wave);

   // --- Bridge connecting the two towers ---
   fill(pink);
   rect(321, 717, 288, 43);
   drawBattlements(321, 701, 288, 9, 16);
   fill(H_DARK);
   for (let i = 0; i < 4; i++) {
     arc(352 + i * 75, 762, 30, 40, Math.PI, Math.PI * 2);
   }

   // --- Main central tower ---
   // Pointed roof, flagpole and flag.
   fill(pinkMid);
   rect(451, 180, 28, 110);
   triangle(441, 190, 489, 190, 465, 150);
   fill(H_DARK);
   rect(462, 104, 5, 50);
   fill(H_YELLOW);
   circle(464, 104, 14);
   triangle(467, 108, 467, 136, 515 + wave * 10, 120 + wave * 6);
   rect(441, 186, 48, 10);

   // Upper onion-shaped dome.
   fill(pink);
   rect(447, 290, 36, 100);
   circle(465, 300, 81);
   fill(255, 214, 226);
   circle(452, 286, 22);

   // Tower body, lower structure and arched windows.
   fill(pink);
   rect(441, 370, 48, 380);
   rect(433, 540, 63, 250);
   drawArchWindow(465, 410, 16, 30, H_DARK);
   drawArchWindow(465, 650, 16, 30, H_DARK);

   // Large central sphere and rose window.
   fill(pink);
   circle(465, 513, 124);
   fill(pinkMid);
   circle(465, 513, 92);
   fill(H_YELLOW);
   circle(465, 513, 54);
   stroke(pinkMid);
   strokeWeight(4);
   for (let i = 0; i < 8; i++) {
     let angle = i * Math.PI / 4;
     line(465, 513, 465 + Math.cos(angle) * 27, 513 + Math.sin(angle) * 27);
   }
   noStroke();

   // Balcony.
   fill(pinkMid);
   rect(425, 590, 80, 12);
   drawBattlements(425, 578, 80, 4, 12);

   // Two small central spires.
   drawSmallSpire(408, pink, pinkMid);
   drawSmallSpire(522, pink, pinkMid);

   // --- Large circular frame and entrance ---
   fill(pink);
   circle(465, 850, 224);
   noFill();
   stroke(pinkMid);
   strokeWeight(8);
   circle(465, 850, 196);
   noStroke();

   // Small circular decorations around the frame.
   fill(255, 214, 226);
   for (let i = 0; i < 16; i++) {
     let angle = i * Math.PI * 2 / 16;
     circle(465 + Math.cos(angle) * 108, 850 + Math.sin(angle) * 108, 8);
   }

   // Entrance.
   fill(H_DARK);
   circle(465, 844, 98);
   rect(416, 844, 98, 44);
   fill(48, 72, 90);
   arc(465, 844, 70, 70, Math.PI, Math.PI * 2);

   // --- Castle base ---
   fill(pink);
   rect(342, 984, 74, 108);
   rect(513, 984, 74, 108);
   drawBattlements(342, 970, 74, 3, 14);
   drawBattlements(513, 970, 74, 3, 14);
   drawArchWindow(379, 1020, 14, 26, H_DARK);
   drawArchWindow(550, 1020, 14, 26, H_DARK);
   rect(287, 1056, 350, 36);
   fill(pinkMid);
   rect(300, 1078, 324, 14);

   // --- Waterfall: continuous downward movement controlled by time ---
   fill(H_WATER);
   rect(433, 885, 64, 207);
   fill(220, 245, 255);
   for (let i = 0; i < 6; i++) {
     let y = 885 + ((frameCount * 1.2 + i * 36) % 190);
     rect(440 + (i % 3) * 18, y, 6, 18);
   }
   fill(200, 239, 255);
   rect(394, 1054, 141, 39);

   pop();
 }


 // Draw battlements as a row of small rectangles.
 function drawBattlements(x, y, w, count, size) {
   let gap = (w - count * size) / (count - 1);
   for (let i = 0; i < count; i++) {
     rect(x + i * (size + gap), y, size, size);
   }
 }


 // Draw an arched window using a rectangle and a circle.
 function drawArchWindow(cx, top, w, h, c) {
   fill(c);
   rect(cx - w / 2, top, w, h);
   circle(cx, top, w);
 }


 // Draw a side tower with its body, battlements,
 // onion-shaped dome, pointed roof and moving flag.
 function drawSideTower(x, pink, pinkMid, wave) {
   fill(pink);
   rect(x - 20, 580, 40, 180);
   fill(pinkMid);
   rect(x - 30, 576, 60, 10);
   drawBattlements(x - 30, 564, 60, 4, 11);
   drawArchWindow(x, 630, 14, 26, H_DARK);
   drawArchWindow(x, 690, 14, 26, H_DARK);

   fill(pink);
   circle(x, 535, 66);
   fill(255, 214, 226);
   circle(x - 12, 524, 16);
   fill(pinkMid);
   triangle(x - 10, 508, x + 10, 508, x, 462);
   fill(H_DARK);
   rect(x - 2, 430, 4, 36);
   fill(H_YELLOW);
   circle(x, 430, 10);
   triangle(x + 2, 434, x + 2, 456, x + 36 + wave * 8, 445 + wave * 5);
 }


 // Draw a small central spire.
 function drawSmallSpire(x, pink, pinkMid) {
   fill(pink);
   rect(x - 13, 620, 26, 110);
   fill(pinkMid);
   triangle(x - 18, 622, x + 18, 622, x, 566);
   fill(H_YELLOW);
   circle(x, 566, 10);
   drawArchWindow(x, 660, 9, 18, H_DARK);
 }


 // ---------- BIRDS ----------
 // s = size, flap = wing movement from -1 to 1,
 // dir = 1 means facing right.
 function drawHeavenBird(x, y, s, flap, dir) {
   push();
   translate(x, y);
   scale(s * dir, s);

   // Back wing in a darker blue.
   fill(108, 190, 236);
   triangle(-20, -8, -40, -70 + flap * 45, 10, -26);

   // Tail with three feather shapes.
   fill(255);
   triangle(-37, 11, -98, -1, -91, 50);
   fill(226, 242, 252);
   triangle(-37, 14, -92, 30, -78, 56);

   // Body and white belly.
   fill(255);
   ellipse(0, 0, 86, 78);
   fill(240, 248, 255);
   ellipse(6, 14, 60, 40);

   // Head, pink cheek and eye with a highlight.
   fill(255);
   circle(31, -26, 46);
   fill(255, 190, 205);
   circle(36, -12, 12);
   fill(25, 42, 52);
   circle(31, -26, 20);
   fill(255);
   circle(35, -30, 6);

   // Beak with upper and lower parts.
   fill(255, 104, 93);
   triangle(48, -32, 89, -13, 48, -19);
   fill(230, 80, 72);
   triangle(48, -19, 82, -13, 48, -12);

   // Front wing with two feather layers.
   // The flap value controls the up-and-down wing movement.
   fill(143, 216, 251);
   triangle(-35, -18, -63, -94 + flap * 70, 2, -41);
   fill(190, 232, 252);
   triangle(-28, -20, -44, -70 + flap * 50, -2, -36);
   pop();
 }