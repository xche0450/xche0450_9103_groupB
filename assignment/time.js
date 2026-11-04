// ===============================================================
// time.js — Time
// Owner: kche1911
// Time values and reflection ripples.
// Moving parts in heaven (clouds, flags, waterfall, birds) are in heaven.js.
// ==============================================================

// Update every frame: time values for castle breathing,
 // flag movement, and torch flickering
 function updateTimeValues() {
   heavenAnim.breathe = Math.sin(frameCount * 0.03);
   heavenAnim.flag = frameCount * 0.08;
   hellAnim.breathe = Math.sin(frameCount * 0.025 + 1);
   hellAnim.flicker = frameCount * 0.06;
 }

 // Reflection ripples: stronger with depth and louder sound
 // Wave speed is half as fast as before
 function rowOffset(row) {
   if (row < TOP_ROWS) return 0;
   let depth = (row - TOP_ROWS + 1) / (ROWS - TOP_ROWS);
   let wave = Math.sin(frameCount * 0.025 + row * 0.6);
   let strength = 0.012 + amp.getLevel() * 0.1;
   return Math.round(wave * width * strength * (0.3 + depth));
 }
