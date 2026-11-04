# Heaven / Hell

**IDEA9103 Creative Coding · Group B**

Heaven / Hell is an interactive p5.js artwork inspired by Hieronymus Bosch's *The Garden of Earthly Delights*. A bright pink castle stands above a reflective waterline, while a dark red castle appears in the inverted world below. Mouse interaction, time-based animation, Perlin noise and sound continuously pull the two worlds into each other.

The project focuses on a single cohesive scene rather than reproducing Bosch's entire triptych. Heaven and Hell were drawn as original p5.js scenes using geometric shapes, transformations, colour and animation.

## Interaction instructions

1. Open `assignment/index.html` with a local web server such as **Live Server**. The audio files will not load correctly if the HTML file is opened directly.
2. Click **PLAY** below the artwork to start the music. Use the slider to adjust the overall volume.
3. Move the mouse slowly across the canvas. The area around the pointer temporarily reveals fragments of the opposite world.
4. Move the mouse vertically to change the balance between the Heaven and Hell tracks.
5. Move the mouse horizontally to move the sound between the left and right stereo channels.
6. Click once on the canvas to create a circular ripple and play a water-drop sound.
7. Click twice quickly to exchange Heaven and Hell.
8. Continue watching: a short signal-loss effect appears at timed intervals. Louder audio produces stronger glow, sway and reflection movement.

Browsers normally block audio until the viewer presses PLAY or interacts with the page.

## Inspiration

### The Garden of Earthly Delights

Our main inspiration is Hieronymus Bosch's *The Garden of Earthly Delights*. We were interested in its contrast between Paradise and punishment, its fantastical architecture and the way separate worlds coexist within one composition. We translated these ideas into two simplified coded environments divided by water.

- [Hieronymus Bosch, The Garden of Earthly Delights Triptych, Museo Nacional del Prado](https://www.museodelprado.es/en/the-collection/art-work/triptych-garden-earthly-delights/02388242-6d6a-4e9e-a992-e1311eab3609)

### Reflections in water

A still lake shows the world upside down. We use the waterline as the boundary between Heaven and Hell, turning the reflection into a window to the opposite world.

### Silent Hill

The transition between the normal world and the Otherworld in *Silent Hill* influenced the exchange between Heaven and Hell. Our scene changes in irregular horizontal rows instead of switching with a single flash. This is a visual reference only; no game code or assets were copied.

- [Silent Hill, Konami](https://www.konami.com/games/eu/en/products/silenthill/)

### Analogue television signal loss

The horizontal displacement of a damaged analogue television signal inspired the timed glitch effect. Rows of the image slide by different amounts, briefly splitting objects across the screen.

## Mechanic ownership

The project implements all four mechanic categories in the brief. Responsibilities are shown below.

**xche0450 — User input and audio**

Files: `input.js`, `audio.js`

Mouse movement reveals the opposite world, a click creates a ripple, and a quick double click exchanges Heaven and Hell. Audio provides atmosphere and interaction feedback, while measured amplitude drives glow, sway and reflection changes.

**Ruilin1130 — Perlin noise and randomness**

Files: `noise.js`, `main.js`, `hell.js`

Developed the Hell scene, shared framework, particles, row displacement, periodic glitch and the noise-driven transition.

**kche1911 — Time-based**

Files: `time.js`, `heaven.js`

Developed the Heaven scene and repeated animation for castles, flags, birds, torches and reflective water.

Audio is a distinct project mechanic as well as part of the atmosphere. `p5.Amplitude()` measures the sound level and uses it to drive visual glow, castle sway, waterline thickness and reflection strength. Mouse position also changes the balance and stereo position of the Heaven and Hell tracks.

## Techniques

### Building the two worlds

- Static scenery is drawn when the worlds are built and saved using `get()`.
- Animated elements such as castles, the sun, moon, birds and bats are redrawn every frame.
- `push()`, `translate()`, `scale()` and `rotate()` position the scenes and create the inverted reflection.
- The source-rectangle form of `image()` redraws small horizontal sections of a saved image to create reflection and glitch displacement.

### User input

`input.js` divides the canvas into a grid of image segments. `mouseMoved()` measures the distance between the pointer and each segment, temporarily revealing nearby parts of the opposite world. `mousePressed()` creates expanding ripples. A short frame timer detects a quick second click and starts the world-swap transition.

### Perlin noise and randomness

`noise.js` uses `noise()` and `random()` to create smooth particles, distortion and transition timing. During a world swap, Perlin noise controls when image rows change, producing an irregular transition rather than a uniform wipe. A timed glitch also moves selected rows sideways like a damaged television signal.

### Time-based animation

`time.js` uses `frameCount` and `Math.sin()` to generate repeated breathing, flag, torch and reflection movement. These animations continue without direct input from the viewer.

### Audio

`audio.js` uses the p5.sound library to load two background tracks and several short effects. Mouse position controls stereo panning and the balance between the two tracks. `p5.Amplitude()` measures overall sound level and maps it to subtle glow, sway, waterline thickness and reflection strength.

### Main p5.js techniques

- `noise()` in `noise.js` and `hell.js`: smooth particles, distortion and non-uniform transitions.
- `random()` in `noise.js`: particle position, size and movement variation.
- `frameCount` in `time.js`, `noise.js` and `input.js`: repeated animation, timed events and double-click detection.
- `get()` and `image()` in `main.js`, `noise.js` and `input.js`: saving scenes, extracting segments and redrawing shifted rows.
- `push()`, `translate()`, `scale()` and `rotate()` in `main.js`, `heaven.js` and `hell.js`: positioning, reflection, animation and castle movement.
- Classes in `input.js`, `noise.js` and `hell.js`: image segments, particles and Hell castle structure.
- `loadSound()`, `p5.Amplitude()` and `map()` in `audio.js`: sound playback, volume analysis and audio-driven visual response.

## Key decisions

- **Mouse-only interaction:** the project can be explored immediately without learning keyboard controls.
- **Noise instead of random flashing:** smooth row displacement creates an organic transition and avoids rapidly flashing blocks.
- **Sound supports the image:** audio is not only background music. Overall level influences subtle visual movement and brightness.
- **One descriptive module per mechanic:** input, audio, noise and time behaviour are separated into clearly named JavaScript files so individual contributions remain visible.
- **Responsive rebuilding:** `windowResized()` resizes the canvas and rebuilds the world when the browser height changes.

## Code structure

`main.js`: Creates the canvas, builds both worlds and combines all modules in the main draw loop.

`heaven.js`: Draws and animates the Heaven environment.

`hell.js`: Draws and animates the Hell environment.

`input.js`: Mouse reveal, click ripples and double-click detection.

`noise.js`: Perlin noise, randomness, particles, glitches and world transitions.

`time.js`: Time-based animation values and reflection offsets.

`audio.js`: Sound loading, playback, volume, stereo panning and amplitude analysis.

`index.html`: Loads p5.js, p5.sound and the project modules in the required order.

### How the main functions and classes work

`main.js`

- `preload()` calls the audio module before setup so every sound file is ready before interaction begins.
- `setup()` creates a responsive canvas, prepares the audio controls and builds the first version of both worlds.
- `buildWorlds()` draws the static scenery, captures Heaven and Hell as p5 images, and passes the two compositions to the image-segment grid.
- `drawLiveFrame()` draws the current Heaven/Hell arrangement and reverses it after a world swap.
- `draw()` updates time and audio values, draws the live scene or transition, applies reflection offsets, particles, ripples and glitches, and then updates sound.
- `windowResized()` calculates a new canvas size and rebuilds the worlds so the composition remains proportional.

`input.js`

- `imageSegment` stores the position and two possible images for one grid cell. `flipUntil` records how long the opposite world remains visible.
- `makeSegments()` divides both completed world images into a shared 30-column grid and saves the corresponding image pieces.
- `updateWaves()` expands each click ripple and temporarily flips image segments close to its moving edge.
- `mouseMoved()` measures the distance between the mouse and every segment, revealing nearby pieces and playing a controlled chime sound.
- `mousePressed()` creates a ripple, plays the water-drop effect and uses frame timing to detect a quick second click.

`noise.js`

- `Particle` represents either a Heaven petal or Hell ember with its own position, speed, size and lifetime.
- `updateParticles()` creates, moves, displays and removes particles without allowing expired particles to remain in memory.
- `checkGlitchTimer()` starts a short signal-loss effect at a regular frame interval and selects a displaced row using noise.
- `applyRowOffsets()` captures the reflection and redraws selected rows with horizontal offsets from time and Perlin noise.
- `startSwap()` records the old and new world states, resets transition data and starts the swap sound effects.
- `drawTransition()` uses Perlin noise to decide when each horizontal row changes from the old world to the new world.

`time.js`

- `updateTimeValues()` uses repeating sine values to update castle breathing, flags and flickering elements.
- `rowOffset()` calculates a time-based reflection offset that becomes stronger with water depth and audio level.

`audio.js`

- `preloadAudio()` loads the two background tracks and four interaction effects.
- `setupAudio()` creates the PLAY button, volume slider and amplitude analyser.
- `updateAudioValues()` maps measured loudness to a limited glow value and subtle castle sway.
- `updateSounds()` changes track balance from vertical mouse position, reverses it after a swap and applies stereo panning.
- `playEffect()` applies the current volume and stereo position before playing an interaction sound.

`heaven.js` drawing functions build the Heaven background, castle, trees, sun, clouds, flags and birds from p5.js shapes.

`hell.js` uses `Castle` and drawing functions to build the Hell background and animate its castle, moon, torches, windows and bats.

### Module connection

`index.html` loads the drawing and mechanic files before `main.js`. This gives the main program access to their shared functions and variables. `main.js` then calls each module in a controlled order: time and audio values are updated first, the two worlds are drawn, image segments and reflections are applied, and particles, ripples, glitches and sounds are updated last.

## Git contribution history

The final `integration` branch preserves the original authors of the individual mechanic commits. At the time of final integration, Git history showed at least three commits for each member:

- `xche0450`: user input, audio support and project integration;
- `Ruilin1130`: main framework, Hell scene, Perlin noise and randomness;
- `kche1911`: Heaven scene and time-based mechanic.

The separate mechanic branches were merged into `integration` instead of copying only their final files, so the individual author history remains visible.

## How to run

1. Clone or download this repository.
2. Open the repository folder in Visual Studio Code.
3. Open `assignment/index.html`.
4. Start a local server, such as the VS Code Live Server extension.
5. Open the localhost address displayed by the server.
6. Click PLAY to enable the audio.

The repository includes local copies of p5.js and p5.sound in `assignment/libraries`.

## AI acknowledgement

OpenAI ChatGPT and Codex were used to identify missing connections between `index.html`, the separate mechanic files and the shared main program. This included checking script-loading order, connecting audio preload and setup functions, identifying shared variable dependencies and testing the integrated branch. The team reviewed, tested and edited the final integration.

### AI-generated audio

The following audio files in `assignment/sounds/` were generated using an AI audio generation tool specifically for this project. Prompts requested contrasting Heaven and Hell atmospheres and short sounds for reveal, ripple, swap and glitch interactions:

- `heaven.mp3`
- `hell.mp3`
- `chime.mp3`
- `plop.mp3`
- `swap.mp3`
- `glitch.mp3`

The team selected the generated audio and connected it to the project using the p5.sound library.

## External references

- [The Garden of Earthly Delights, Museo Nacional del Prado](https://www.museodelprado.es/en/the-collection/art-work/triptych-garden-earthly-delights/02388242-6d6a-4e9e-a992-e1311eab3609): main artistic inspiration.
- [Silent Hill, Konami](https://www.konami.com/games/eu/en/products/silenthill/): visual inspiration for the world transition.
- [p5.js `image()` reference](https://p5js.org/reference/p5/image/): redrawing source rectangles and shifted image rows.
- [p5.js `noise()` reference](https://p5js.org/reference/p5/noise/): Perlin noise for smooth visual variation.
- [p5.sound `p5.Amplitude` reference](https://p5js.org/reference/p5.sound/p5.Amplitude/): measuring overall audio level.
- IDEA9103 Week 7 tutorial: image-segment class and nested grid loops.
- IDEA9103 Week 10 tutorial: sound loading, volume, panning, buttons and sliders.
- IDEA9103 Week 11 tutorial: timing with `frameCount`.

## Team contributions

### xche0450

- Developed the user-input mechanic.
- Implemented image-segment reveal, click ripples and double-click swapping.
- Developed and connected the audio mechanic.
- Integrated the team branches and tested the combined project.

### Ruilin1130

- Designed and programmed the Hell environment.
- Developed the Perlin noise and randomness mechanic.
- Implemented particles, glitch displacement, transitions and the shared main framework.

### kche1911

- Designed and programmed the Heaven environment.
- Developed the time-based mechanic.
- Implemented repeated movement for Heaven elements and reflective water.
