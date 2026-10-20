# Supplied story artwork

The active homepage uses unchanged copies of these supplied image files:

| Repository file | Original filename |
| --- | --- |
| `bottle-new.png` | `New Sulfluxbottle.png` |
| `spaceship.png` | `New Spaceship.png` |
| `spaceship-inside.png` | `spaceship_inside.png` |
| `liver.png` | `liver.png` |
| `planet-1.png` | `Planet 1.png` |
| `planet-2.png` | `Planet 2.png` |
| `planet-3.png` | `Planet 3.png` |
| `person-drinking.png` | `person_drinking_yakult.png` |
| `sult2a1.png` | `Sult2A1.png` |
| `btsult.png` | `Btsult.png` |
| `lca-dca.webp` | `LCA_DCA.png` |

The SVG compositions are included directly in `index.html`. View boxes and clip paths frame the supplied artwork without modifying its pixels. Adjust those frames in `scripts/build-home.js`, then regenerate the page with Node. The LCA/DCA file is actually WebP despite its supplied `.png` name; its repository copy has the correct extension. The export also corrects the extensions of earlier mislabeled files while retaining originals.

The exterior rocket's registration matrix in `js/mission-home.js` maps the supplied tilted artwork onto the bottle emblem. That shared matrix drives both the SVG frame and animation. The rocket stays attached until the bottle disappears, turns upright, then zooms toward its window before the interior is revealed.

`home-copy.json` preserves the seven supplied science paragraphs. Rebuild after editing this file. Earlier bottle and rocket illustrations remain in this directory for reference but do not drive the current homepage.
