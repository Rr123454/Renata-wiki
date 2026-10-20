# ULP-CA / SulFlux homepage

Open `index.html` using **Run Renata Wiki** in VS Code. `home-orbit.html` remains a compatibility redirect to this one homepage.

## Sequence

1. The ULP-CA title moves right while the camera approaches the new SulFlux bottle.
2. The bottle’s orange spacecraft emblem develops into the supplied exterior spaceship. The layers share the emblem’s position and scale until the bottle fades.
3. A second zoom reveals `spaceship_inside.png`, including its cockpit and controls.
4. Three selectable planets surround the ship: Gallbladder, SULT2A1, and LCA & DCA. Each is a normal link to its description, and each description links back to the planet view.
5. The linear reading route continues through BtSULT, SulFlux, and the supplied probiotic paragraph with the drinking illustration.

Native scrolling drives the camera. The transition retraces when scrolling backward. Reduced-motion preferences, short viewports, and disabled JavaScript show a static, readable version with the three destination links. Animation frames stop when the camera settles or the tab is hidden. Keyboard and touch users can select the same planets as mouse users.

## Authored content and artwork

`assets/story/home-copy.json` contains the seven paragraphs supplied on October 19, verbatim, with HTML entities decoded. The homepage repeats the first paragraph during the bottle zoom and in the gallbladder section. Scientific names retain their requested italics. The body copy’s “Renata” wording is deliberately preserved; the homepage identity is ULP-CA.

`node scripts/build-home.js` regenerates `index.html` from that content, the supplied artwork, and the static template. The build helper also contains the SVG frames around the original PNGs; the files’ source pixels are unchanged. It requires only Node, with no dependencies or external services.

- `css/mission-home.css`: launch scene, planets, destination layouts.
- `js/mission-home.js`: camera state, layered zooms, chapter reveals, return navigation, and reduced-motion handling.
- `js/mission-art.js`: retained SVG illustration helpers, including the LCA/DCA characters.
- `js/team-deal.js`: existing roster controller plus a detailed five-finger SVG hand. The wrist and fingers release one batch of cards together; the card faces, roster order, and Show all behavior are preserved.

## Checks

`tests/mission-home.test.js` checks the two zoom transitions, reversible motion, verbatim copy, planet destinations, actual controller behavior, keyboard return focus, and static fallbacks. `tests/team-deal.test.js` checks card continuity, articulated fingers, cancellation, focus, and reduced motion. These local fixtures do not replace a browser visual review.

Decorative chapter titles and taglines use Lorem Ipsum for the team to replace; the supplied science paragraphs remain verbatim. The shared reading outline is in `js/project-outline.js` / `css/project-outline.css`. Notebook is a separate Lab Work destination. The full-resolution bird rocket cursor is in `js/rocket-cursor.js` / `css/rocket-cursor.css`, with a short thruster and three small sparks.
