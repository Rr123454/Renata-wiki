/* Anatomy-led geometry. DOM measurements keep the route inside illustration lanes. */
(function (root) {
  "use strict";
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const unit = ({ x, y }) => { const length = Math.hypot(x, y) || 1; return { x: x / length, y: y / length }; };

  // Normalized anchors match the actual cutaways in assets/tissues.
  // Guide positions advance with scrolling even when the anatomical route turns upward.
  const anatomy = [
    { id: "stomach", entry: [.38, .03], curves: [
      [[.40, .18], [.49, .24], [.58, .32], .29],
      [[.77, .42], [.78, .68], [.60, .72], .48],
      [[.47, .76], [.43, .64], [.28, .65], .70],
      [[.22, .73], [.23, .83], [.23, .91], .88]
    ] },
    { id: "intestine", entry: [.29, .20], curves: [
      [[.44, .18], [.64, .30], [.60, .40], .39],
      [[.60, .47], [.55, .51], [.55, .60], .62],
      [[.59, .65], [.67, .65], [.71, .70], .85]
    ] },
    { id: "portal", entry: [.18, .18], curves: [
      [[.24, .25], [.33, .29], [.42, .39], .38],
      [[.52, .47], [.43, .63], [.56, .70], .63],
      [[.62, .74], [.69, .77], [.75, .77], .85]
    ] },
    { id: "liver", entry: [.55, .70], curves: [
      [[.54, .64], [.52, .55], [.49, .50], .59],
      [[.45, .48], [.41, .44], [.40, .40], .85]
    ] }
  ];

  function build({ width, viewportHeight, heroHeight, stations, compact, ingestion }) {
    const head = ingestion || { x: width * .55, y: 140, width: width * .4, height: width * .4 };
    const headAt = ([x, y]) => ({ x: head.x + x * head.width, y: head.y + y * head.height });
    let point = headAt([.12, .36]);
    let tangent = { x: 1, y: 0 };
    let distance = 0;
    let d = `M${point.x},${point.y}`;
    const samples = [{ ...point, distance: 0 }];
    const startGuide = Math.max(point.y, viewportHeight * .55);
    const swallowGuide = Math.max(head.y + head.height * .96, startGuide + 260);
    const stops = [{ guide: startGuide, distance: 0 }];
    const phases = [];
    const connectors = [];

    function cubic(c1, c2, end, guide) {
      const start = point;
      d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`;
      for (let i = 1; i <= 48; i += 1) {
        const t = i / 48, u = 1 - t;
        const next = {
          x: u ** 3 * start.x + 3 * u ** 2 * t * c1.x + 3 * u * t ** 2 * c2.x + t ** 3 * end.x,
          y: u ** 3 * start.y + 3 * u ** 2 * t * c1.y + 3 * u * t ** 2 * c2.y + t ** 3 * end.y
        };
        const previous = samples[samples.length - 1];
        distance += Math.hypot(next.x - previous.x, next.y - previous.y);
        samples.push({ ...next, distance });
      }
      tangent = unit({ x: end.x - c2.x, y: end.y - c2.y });
      point = end;
      stops.push({ guide, distance });
    }

    function travel(end, guide = end.y, incoming = { x: 0, y: 1 }) {
      const reach = Math.min(Math.hypot(end.x - point.x, end.y - point.y) * .34, width * .20, 220);
      const direction = unit(incoming);
      cubic({ x: point.x + tangent.x * reach, y: point.y + tangent.y * reach },
        { x: end.x - direction.x * reach, y: end.y - direction.y * reach }, end, guide);
    }

    // Enter through the lips, pass above the tongue, then follow the esophagus.
    travel(headAt([.25, .36]), startGuide + (swallowGuide - startGuide) * .16, { x: 1, y: 0 });
    const doseEnd = distance;
    cubic(headAt([.31, .32]), headAt([.43, .29]), headAt([.49, .35]), startGuide + (swallowGuide - startGuide) * .38);
    cubic(headAt([.53, .40]), headAt([.52, .46]), headAt([.55, .57]), startGuide + (swallowGuide - startGuide) * .62);
    cubic(headAt([.59, .71]), headAt([.61, .84]), headAt([.61, .965]), swallowGuide);
    phases.push({ id: "ingestion", start: 0, end: distance });
    let passageStart = { ...point };
    let passageOffset = d.length;
    stations.forEach((station, index) => {
      const shape = anatomy[index];
      const art = station.art;
      const at = ([x, y]) => ({ x: art.x + x * art.width, y: art.y + y * art.height });
      const entry = at(shape.entry);
      // Cross the page only in the empty transition between subjects.
      travel({ x: entry.x, y: station.top - 60 });
      travel(entry, art.y + art.height * .20, index === 3 ? { x: 0, y: -1 } : { x: 0, y: 1 });
      connectors.push({ kind: index < 2 ? "digestive" : "blood", d: `M${passageStart.x},${passageStart.y}${d.slice(passageOffset)}` });
      const start = distance;
      shape.curves.forEach(([c1, c2, end, guide]) => cubic(at(c1), at(c2), at(end), art.y + art.height * guide));
      phases.push({ id: shape.id, start, end: distance });
      passageStart = { ...point };
      passageOffset = d.length;
      if (index < stations.length - 1) {
        // Captions and stacked mobile copy have a dedicated clear lane beside them.
        const lane = compact ? width - 24 : index % 2 ? art.x + art.width + 28 : art.x - 28;
        if (compact) {
          // Turn toward the side before reaching the caption, with a short exit handle.
          const exit = { x: lane, y: art.y + art.height * .94 };
          cubic({ x: point.x + tangent.x * 8, y: point.y + tangent.y * 8 },
            { x: lane, y: exit.y - 40 }, exit, art.y + art.height * .98);
        } else travel({ x: lane, y: art.y + art.height * .98 });
        travel({ x: lane, y: station.top + station.height + 30 });
      }
    });
    return { d, samples, stops, phases, connectors, doseEnd, totalLength: distance };
  }

  function bracket(items, value, key) {
    let low = 0, high = items.length - 1;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (items[mid][key] < value) low = mid + 1;
      else high = mid;
    }
    const b = items[low], a = items[Math.max(0, low - 1)];
    const mix = clamp((value - a[key]) / (b[key] - a[key] || 1), 0, 1);
    return { a, b, mix };
  }
  function distanceAtScroll(route, guide) {
    const { a, b, mix } = bracket(route.stops, guide, "guide");
    return a.distance + (b.distance - a.distance) * mix;
  }
  function pointAtDistance(route, distance) {
    const { a, b, mix } = bracket(route.samples, distance, "distance");
    return { x: a.x + (b.x - a.x) * mix, y: a.y + (b.y - a.y) * mix };
  }
  const api = { build, distanceAtScroll, pointAtDistance };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SPACE_ROUTE = api;
})(typeof window !== "undefined" ? window : globalThis);
