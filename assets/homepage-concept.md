# Into orbit — alternate homepage

Open `home-orbit.html`, choose **02 Into orbit** on the original homepage, or use the **Compare Renata — Into orbit** VS Code launch configuration. The alternate page links back to Home 01 in its header and footer.

## Visual reference

The current design follows the supplied **Screen Recording 2026-10-18 at 11.28.21 AM.mov**: a deep-blue starfield, Sulflux wordmark, blue-and-yellow outlined RENATA title, red-capped illustrated bottle, blue spacecraft, warm peach body scenes, and a bottom chapter tracker with replay.

The initial frame and frames at approximately 2.2, 4.4, 6.6, and 8.5 seconds were inspected. Artwork is newly authored SVG inspired by those frames, rather than extracted screenshots. The reference recording is not a runtime dependency.

## Sequence

1. **Launch:** the Sulflux bottle sits in front of the starfield. Its small emblem uses the same spacecraft artwork as the flight. Scrolling moves the bottle and camera together; the emblem lifts away along a curved path, grows, turns downward, and ignites its engines before the bottle fades. The extended opening gives this transition room to unfold.
2. **Stomach:** the craft enters a coral-and-gold schematic world.
3. **Small intestine:** large looping shapes continue the visual journey.
4. **Portal circulation:** vessel branches connect the next scene.
5. **Liver:** the flight settles over the final illustration, with a link to the project research.

The chapter dots are real section links. Organ text slides in from alternating sides, with staggered headings, paragraphs, and labels. The intestine chapter places its text on the right on desktop. Organ illustrations, background particles, and microbes move at different speeds for subtle depth. The ship banks along a continuous curved route, and its engine trail reacts to scroll speed.

A damped animation clock softens trackpad and mouse-wheel steps without changing native page scrolling. The route retraces when scrolling backward. Pause freezes the moving artwork and keeps all chapter text readable; Replay resumes motion and returns to the opening. Reduced-motion settings, short screens, and JavaScript-disabled browsers show the complete static story with a spacecraft in each world. The animation loop sleeps when settled and stops when the tab is hidden.

## Source and artwork

- `home-orbit.html`: static, accessible page content, navigation, chapter links, and research context.
- `css/orbit-home.css`: page-scoped illustration layout, responsive styles, and colors.
- `js/orbit-home.js`: scroll-driven scene state, chapter tracking, pause/replay, and motion preferences.
- `assets/orbit/`: editable bottle, spacecraft, stomach, intestine, vessel, and liver SVGs. Each includes a title and description. The bottle's emblem is composited in the HTML SVG so its live coordinate system can match the flying spacecraft exactly.
- `assets/sulflux.svg`: the earlier cleaned bird mascot remains available as a separate asset.

This is a visual metaphor, not a validated anatomical diagram or a demonstrated delivery mechanism. The final section distinguishes Renata’s proposed LCA-sulfation design from established results; the reference’s health-benefit tagline and placeholder headings are replaced with project-appropriate copy.

The original homepage remains at `index.html`. The alternate page uses its own static header and footer, so its visual changes do not alter the original homepage or other wiki pages.

## Local verification

`tests/orbit-home.test.js` checks the bottle/emblem alignment at multiple sizes, continuous launch and chapter motion, reversible scrolling, staggered text entrances, frame-rate-independent damping, and the actual controller's pause, resume, replay, reduced-motion, and hidden-tab behavior. The controller checks use a local DOM/frame-clock harness and require no browser, service, or network access.
