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
      // Entrance beneath the transverse bowel, then the visible left coils.
      [482, 987, 462, 1026, 439, 1024],
      [420, 1023, 402, 1009, 386, 1011],
      [367, 1013, 366, 1028, 383, 1037],
      [403, 1047, 404, 1063, 388, 1065],
      [375, 1067, 365, 1069, 368, 1080],
      [371, 1093, 396, 1104, 417, 1099],
      [430, 1096, 434, 1107, 425, 1115],
      [416, 1123, 405, 1120, 412, 1134],
      [418, 1146, 430, 1145, 419, 1159],
      [410, 1169, 395, 1167, 407, 1180],
      [415, 1188, 440, 1183, 445, 1197],
      [450, 1210, 428, 1225, 441, 1225],
      // Follow the long lower loop up its left leg, over the arch and right.
      [459, 1224, 472, 1194, 473, 1173],
      [474, 1154, 466, 1123, 486, 1117],
      [510, 1108, 520, 1124, 526, 1145],
      [532, 1164, 555, 1172, 575, 1167],
      [589, 1164, 598, 1165, 600, 1159],
      // One schematic lining crossing into the existing mesenteric vessel route.
      [604, 1146, 589, 1122, 573, 1115]
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
    const value = clamp(distance, 0, route.totalLength);
    const point = pointAtDistance(route, value);
    const before = pointAtDistance(route, value - 2), after = pointAtDistance(route, value + 2);
    // At the starting position, face the mouth even after scrolling backward.
    const facing = value === 0 ? 1 : direction;
    // Original bottle photo points up: +90 aligns its red cap to the tangent.
    const angle = Math.atan2((after.y - before.y) * facing, (after.x - before.x) * facing) * 180 / Math.PI + 90;
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
  function camera(width, height, focus, compact = false) {
    // The artwork fills the backdrop. Follow the bottle horizontally as well
    // as vertically, leaving both outer thirds available for editorial copy.
    const aspect = Math.max(1, width) / Math.max(1, height);
    const viewWidth = compact ? 700 * aspect : Math.max(1000, 440 * aspect);
    const viewHeight = viewWidth / aspect;
    return {
      x: focus.x - viewWidth * .5,
      // Mobile reserves the lower view for text, including at the final organs.
      y: compact ? Math.max(0, focus.y - viewHeight * .23) : clamp(focus.y - viewHeight * .48, 0, Math.max(0, 1500 - viewHeight)),
      width: viewWidth,
      height: viewHeight
    };
  }
  return { build, pointAtDistance, pose, distanceAtScroll, camera };
});
