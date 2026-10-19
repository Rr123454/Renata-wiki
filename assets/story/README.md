# Supplied story artwork

These are unchanged copies of the team’s supplied PNG files:

| Repository file | Original filename |
| --- | --- |
| `rocket-left.png` | `rocket_l.png` |
| `rocket-right.png` | `rocket_r.png` |
| `sult2a1.png` | `Sult2A1.png` |
| `sulflux-bottle.png` | `sulflux bottle.png` |
| `btsult.png` | `Btsult.png` |

`rocket-cutout.png` is the transparent cutout selected in chat on 18 October 2026. It is an unchanged copy of that generated output; the source `rocket-left.png` and `rocket-right.png` files remain available. The cutout is used for the homepage flight, return link, and chapter orbits.

The homepage uses an SVG clip path for the bottle and the cutout's alpha channel for its orange spacecraft emblem. Both the emblem and detailed ship share the same image geometry, so the ship can develop on the bottle before departure. No image-generation service or external image host is needed at runtime.

The other story illustrations are editable SVG compositions authored in `js/mission-art.js` and included directly in `index.html`, the sole homepage. The SulFlux fit illustration represents a proposed design, not a confirmed experimental result.
