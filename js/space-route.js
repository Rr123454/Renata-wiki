/* Pure route geometry, shared by the browser and the Node regression tests. */
(function (root) {
  "use strict";
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const unit = ({ x, y }) => { const length = Math.hypot(x, y) || 1; return { x: x / length, y: y / length }; };

  function build({ width, viewportHeight, heroHeight, stations, maneuvers, compact }) {
    let point = { x: width * (compact ? 0.68 : 0.76), y: compact ? heroHeight - 166 : heroHeight * 0.49 };
    let tangent = { x: 0, y: 1 };
    let distance = 0;
    let d = `M${point.x},${point.y}`;
    const samples = [{ ...point, distance: 0 }];
    const stops = [{ guide: point.y, distance: 0 }];
    const tricks = [];

    function cubic(c1, c2, end) {
      const start = point;
      d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`;
      for (let i = 1; i <= 36; i += 1) {
        const t = i / 36;
        const u = 1 - t;
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
    }

    function travel(end, guide = end.y, incoming = { x: 0, y: 1 }) {
      const reach = Math.min(Math.hypot(end.x - point.x, end.y - point.y) * 0.36, width * 0.27, 260);
      const direction = unit(incoming);
      cubic({ x: point.x + tangent.x * reach, y: point.y + tangent.y * reach },
        { x: end.x - direction.x * reach, y: end.y - direction.y * reach }, end);
      stops.push({ guide, distance });
    }

    function loop({ cx, cy, rx, ry, figureEight = false, reverse = false }) {
      const sign = reverse ? -1 : 1;
      const at = (t) => figureEight
        ? { x: cx + rx * Math.sin(t), y: cy + ry * Math.sin(2 * t) }
        : { x: cx + rx * Math.cos(t - Math.PI / 2), y: cy + ry * Math.sin(t - Math.PI / 2) };
      const derivative = (t) => figureEight
        ? { x: rx * Math.cos(t) * sign, y: 2 * ry * Math.cos(2 * t) * sign }
        : { x: -rx * Math.sin(t - Math.PI / 2) * sign, y: ry * Math.cos(t - Math.PI / 2) * sign };
      travel(at(0), cy - ry, derivative(0));
      const startDistance = distance;
      const step = Math.PI * 2 / 32;
      for (let i = 0; i < 32; i += 1) {
        const t0 = i * step * sign;
        const t1 = (i + 1) * step * sign;
        const a = at(t0), b = at(t1), da = derivative(t0), db = derivative(t1);
        cubic({ x: a.x + da.x * step / 3, y: a.y + da.y * step / 3 },
          { x: b.x - db.x * step / 3, y: b.y - db.y * step / 3 }, b);
      }
      stops.push({ guide: cy + ry, distance });
      tricks.push({ start: startDistance, end: distance, kind: figureEight ? "figure-eight" : "loop" });
    }

    stations.forEach((station, index) => {
      const gap = maneuvers[index];
      const centerY = gap.top + gap.height * 0.5;
      if (index === 1) {
        // A broad S-turn opens up the page between the two oval maneuvers.
        travel({ x: width * (compact ? 0.26 : 0.76), y: gap.top + gap.height * 0.28 });
        travel({ x: width * (compact ? 0.7 : 0.34), y: gap.top + gap.height * 0.7 });
      } else {
        const figureEight = index === 2;
        const rx = compact ? width * (figureEight ? 0.26 : 0.21)
          : Math.min(width * [0.19, 0, 0.26, 0.1][index], figureEight ? 340 : 250);
        loop({ cx: width * (compact ? 0.5 : [0.55, 0.5, 0.5, 0.61][index]), cy: centerY,
          rx, ry: Math.min(viewportHeight * (figureEight ? 0.09 : 0.105), compact ? 70 : 100), figureEight, reverse: index === 3 });
      }
      const lane = compact ? width - 44 : width * [0.09, 0.91, 0.14, 0.9][index];
      travel({ x: lane, y: station.top + 48 });
      // On phones, finish passing the copy before banking into the next gap.
      travel({ x: lane, y: station.top + station.height + (compact ? 16 : -65) });
    });
    const last = stations[stations.length - 1];
    travel({ x: width * 0.5, y: last.top + last.height + (compact ? 100 : 65) });
    return { d, samples, stops, tricks, totalLength: distance };
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
