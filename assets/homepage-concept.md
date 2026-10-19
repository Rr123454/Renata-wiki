# Into orbit — alternate homepage

Open `home-orbit.html`, choose **02 Into orbit** on the original homepage, or use **Compare Renata — Into orbit** in VS Code. Home 01 remains available for comparison.

## Current sequence

1. **Look closer:** Renata exits to the right while the camera zooms into the supplied SulFlux bottle. PCS context enters from the left. The spacecraft begins as a blueprint aligned with the bottle label.
2. **Form and launch:** details progressively appear inside the outline. The same spacecraft remains registered to the bottle until it lifts away. The bottle then fades into space.
3. **Direct flight:** the ship follows a continuous curve through space to the gallbladder illustration. This replaces the earlier stomach–intestine–portal route on Home 02.
4. **The story:** illustrated sections explain the gallbladder, symptoms after removal, human SULT2A1, LCA/DCA, native BtSULT, and Renata’s proposed engineered SulFlux system. Text enters from alternating sides. Before/after buttons change the gallbladder schematic; a slider explores the proposed enzyme fit.
5. **Continue exploring:** project, laboratory, and team links lead into the matching illustrated chapter pages.

The flight is a visual metaphor, not a biological delivery route. The homepage uses the current research status: SulFlux binding, conversion, delivery, and benefit remain proposed or unconfirmed. The unsupported “60 million” estimate is omitted. Background sources are linked in the page’s research notes.

## Motion and accessibility

Native scrolling drives a damped camera; scrolling backward retraces the flight. Motion off, reduced-motion preferences, short viewports, and JavaScript-disabled browsers retain the complete static story. The animation frame loop sleeps when settled and stops in hidden tabs. Chapter links and Skip the launch bypass the introduction.

Every page has a short, skippable loader with real image completion, a JavaScript timeout, and an independent CSS fallback. The team deck retains its original interaction and profile dialogs, with slower curved flights and no snapping during small scrolls.

## Files

- `home-orbit.html`: static story, inline vector compositions, citations, and controls.
- `css/mission-home.css` and `js/mission-home.js`: current layout, bottle registration, direct flight, narrative reveals, and interactions.
- `js/mission-art.js`: source functions for the inline SVG compositions. After editing a composition, replace its corresponding markup in the static page; the mission tests verify the bottle and ship remain synchronized.
- `assets/story/`: unchanged copies of the five supplied PNGs. SVG clipping frames the bottle and rocket without editing their source pixels.
- `css/orbit-pages.css` and `js/orbit-pages.js`: shared illustrated chapter heroes, orbital scenes, reading progress, and content reveals.
- `css/loading-screen.css` and `js/loading-screen.js`: shared loading screen.
- `css/navigation.css` and `js/navigation.js`: shared illustrated dropdown navigation.
- `js/team-deal.js`: the team’s dedicated card-dealing controller.

`css/orbit-home.css` still supplies the alternate homepage’s header/footer foundation. The earlier `js/orbit-home.js` flight model and `assets/orbit/` illustrations are retained but no longer drive Home 02. Chapter heroes reuse the small vector spacecraft.

## Verification

Run the Node test files under `tests/`. `mission-home.test.js` checks the live homepage’s composition, continuous and reversible flight at desktop/phone sizes, real controller behavior, and static fallbacks. `orbit-pages.test.js`, `loading-screen.test.js`, `navigation.test.js`, and `team-deal.test.js` cover the shared interactions. These use local DOM/frame-clock fixtures, require no service or network, and do not replace a browser visual review.
