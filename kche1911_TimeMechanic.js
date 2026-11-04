
 // ===============================================================
 // time.js — Time
 // Owner: kche1911
 // Time-based animation and reflection ripples.
 // ===============================================================

 let ripplePhase = 0;

 // Update animation values once per frame
 function updateTimeValues() {
   heavenAnim.breathe = Math.sin(frameCount * 0.03);
   heavenAnim.flag = frameCount * 0.08;

   hellAnim.breathe = Math.sin(frameCount * 0.025 + 1);
   hellAnim.flicker = frameCount * 0.06;

   // NEW: Sound affects the speed of reflection ripples
   let soundLevel = amp.getLevel();
   ripplePhase += 0.025 + soundLevel * 0.08;
 }

 // Reflection ripples respond to time, sound, and depth
 function rowOffset(row) {
   if (row < TOP_ROWS) return 0;

   let depth = (row - TOP_ROWS + 1) / (ROWS - TOP_ROWS);
   let soundLevel = amp.getLevel();

   // Use the updated phase for smooth wave movement
   let wave = Math.sin(ripplePhase + row * 0.6);

   // Louder sound creates stronger ripples
   let strength = 0.012 + soundLevel * 0.15;

   return Math.round(wave * width * strength * (0.3 + depth));
 }
