/* A single coordinate space for the whole body. Each chapter traverses one
   anatomical interval; scrolling can reverse without changing the anatomy. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.BODY_ROUTE = api;
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  // SVG coordinates are normalized to the illustration's 1000 x 1500 canvas.
  // Final control points are aligned to the saved contiguous-body illustration.
  const stages = [
    { id: "ingestion", label: "Mouth & esophagus", curves: [
      [275, 180, 315, 177, 365, 178],
      [407, 180, 422, 187, 433, 211],
      [453, 244, 464, 280, 478, 320],
      [504, 390, 513, 514, 513, 595],
      [512, 665, 541, 704, 597, 735]
    ] },
    { id: "stomach", label: "Stomach", curves: [
      [649, 691, 734, 755, 686, 843],
      [657, 904, 557, 913, 510, 869],
      [474, 833, 439, 846, 446, 888],
      [446, 920, 495, 942, 486, 960]
    ] },
    { id: "intestine", label: "Intestinal absorption", curves: [
      [472, 1002, 436, 1031, 408, 1017],
      [350, 1008, 376, 1068, 436, 1080],
      [478, 1090, 386, 1121, 408, 1154],
      [430, 1190, 491, 1222, 476, 1170],
      [446, 1111, 504, 1079, 530, 1130],
      [546, 1170, 625, 1214, 607, 1160],
      [600, 1142, 574, 1134, 573, 1115]
    ] },
    { id: "portal", label: "Portal circulation", curves: [
      [548, 1096, 525, 1043, 509, 994],
      [503, 958, 477, 930, 457, 915],
      [431, 887, 438, 864, 441, 832]
    ] },
    { id: "liver", label: "Liver", curves: [
      [445, 809, 437, 794, 420, 785],
      [395, 775, 380, 752, 353, 738]
    ] }
  ];
  function build() {
    let previous = { x: 225, y: 180 }, distance = 0;
    const samples = [{ ...previous, distance: 0 }], phases = [];
    let d = `M ${previous.x} ${previous.y}`;
    for (const stage of stages) {
      const start = distance;
      for (const c of stage.curves) {
        d += ` C ${c.join(" ")}`;
        const origin = previous;
        for (let i = 1; i <= 64; i++) {
          const t = i / 64, u = 1 - t;
          const point = {
            x: u ** 3 * origin.x + 3 * u ** 2 * t * c[0] + 3 * u * t ** 2 * c[2] + t ** 3 * c[4],
            y: u ** 3 * origin.y + 3 * u ** 2 * t * c[1] + 3 * u * t ** 2 * c[3] + t ** 3 * c[5]
          };
          const last = samples[samples.length - 1];
          distance += Math.hypot(point.x - last.x, point.y - last.y);
          samples.push({ ...point, distance });
        }
        previous = { x: c[4], y: c[5] };
      }
      phases.push({ id: stage.id, label: stage.label, start, end: distance });
    }
    return { d, samples, phases, totalLength: distance };
  }
  function pointAtDistance(route, distance) {
    const value = clamp(distance, 0, route.totalLength), samples = route.samples;
    let low = 0, high = samples.length - 1;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (samples[mid].distance < value) low = mid + 1;
      else high = mid;
    }
    const next = samples[low], prev = samples[Math.max(0, low - 1)];
    const t = next.distance === prev.distance ? 0 : (value - prev.distance) / (next.distance - prev.distance);
    return { x: prev.x + (next.x - prev.x) * t, y: prev.y + (next.y - prev.y) * t };
  }
  function pose(route, distance, direction = 1) {
    const point = pointAtDistance(route, distance);
    const before = pointAtDistance(route, distance - 2), after = pointAtDistance(route, distance + 2);
    // Original bottle photo points up: +90 aligns its red cap to the tangent.
    const angle = Math.atan2((after.y - before.y) * direction, (after.x - before.x) * direction) * 180 / Math.PI + 90;
    return { ...point, angle };
  }
  function distanceAtScroll(route, stops, scroll) {
    if (scroll <= stops[0]) return 0;
    for (let i = 0; i < route.phases.length; i++) {
      if (scroll <= stops[i + 1]) {
        const t = clamp((scroll - stops[i]) / Math.max(1, stops[i + 1] - stops[i]), 0, 1);
        return route.phases[i].start + t * (route.phases[i].end - route.phases[i].start);
      }
    }
    return route.totalLength;
  }
  return { build, pointAtDistance, pose, distanceAtScroll };
});
