"use strict";
// Run: node --test tests/space-route.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { build, distanceAtScroll, pointAtDistance } = require("../js/space-route.js");

function fixture(width, viewportHeight) {
  const compact = width <= 1000;
  const heroHeight = compact ? 1040 : Math.max(943, viewportHeight - 69);
  const stationHeight = compact ? 980 : Math.max(780, viewportHeight * .85);
  const gapHeight = compact ? Math.max(340, Math.min(480, viewportHeight * .52)) : Math.max(420, Math.min(640, viewportHeight * .64));
  let top = heroHeight;
  const stations = [], maneuvers = [];
  for (let i = 0; i < 4; i++) {
    maneuvers.push({ top, height: gapHeight });
    top += gapHeight;
    stations.push({ top, height: stationHeight });
    top += stationHeight;
  }
  return { width, viewportHeight, heroHeight, stations, maneuvers, compact };
}

for (const [width, height] of [[320, 640], [390, 844], [760, 1024], [768, 768], [1024, 768], [1440, 900], [1920, 1080], [2560, 1440]]) {
  test(`continuous, reversible route at ${width} x ${height}`, () => {
    const input = fixture(width, height), route = build(input);
    assert.ok(route.totalLength > 0);
    for (let i = 1; i < route.stops.length; i++) {
      assert.ok(route.stops[i].guide > route.stops[i - 1].guide, "scroll guide must always advance through a loop");
      assert.ok(route.stops[i].distance > route.stops[i - 1].distance);
    }
    assert.deepEqual(route.tricks.map(t => t.kind), ["loop", "figure-eight", "loop"]);
    for (const trick of route.tricks) {
      const start = pointAtDistance(route, trick.start), end = pointAtDistance(route, trick.end);
      assert.ok(Math.hypot(start.x - end.x, start.y - end.y) < .01, "trick closes smoothly");
      const points = route.samples.filter(p => p.distance >= trick.start && p.distance <= trick.end);
      assert.ok(points.some((p, i) => i && p.y < points[i - 1].y), "loop contains upward movement");
    }
    for (const point of route.samples) {
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
      assert.ok(point.x >= 0 && point.x <= width, "route stays within screen");
    }
    let previous = 0;
    for (let y = 0; y < input.stations[3].top + input.stations[3].height + 100; y += 4) {
      const current = distanceAtScroll(route, y);
      assert.ok(current >= previous, "scrolling forward must never jump backward on the route");
      const position = pointAtDistance(route, current);
      distanceAtScroll(route, y + 100);
      assert.deepEqual(pointAtDistance(route, distanceAtScroll(route, y)), position, "scrolling back restores position");
      previous = current;
    }
    assert.equal(distanceAtScroll(route, -1e5), 0);
    assert.equal(distanceAtScroll(route, 1e5), route.totalLength);
  });
}

// Optional browser-measured fixtures include the real font/layout dimensions.
const fixtureDir = path.join(__dirname, "../tmp");
const fixtureFiles = fs.existsSync(fixtureDir) ? fs.readdirSync(fixtureDir).filter(name => /^bottle-layout-.*\.json$/.test(name)) : [];
for (const file of fixtureFiles) {
  test(`bottle clears text, art, and screen edges: ${file}`, () => {
    const input = JSON.parse(fs.readFileSync(path.join(fixtureDir, file), "utf8"));
    const route = build(input), w = input.bottleWidth, h = w * 294 / 152;
    const collisions = new Set();
    for (let d = 0; d <= route.totalLength; d += 5) {
      const p = pointAtDistance(route, d), q = pointAtDistance(route, Math.min(route.totalLength, d + 1));
      const angle = Math.atan2(q.y - p.y, q.x - p.x) - Math.PI / 2;
      const rx = Math.abs(Math.cos(angle)) * w / 2 + Math.abs(Math.sin(angle)) * h / 2;
      const ry = Math.abs(Math.sin(angle)) * w / 2 + Math.abs(Math.cos(angle)) * h / 2;
      if (p.x - rx < 0 || p.x + rx > input.width) collisions.add("screen edge");
      for (const box of input.boxes) {
        if (p.x + rx > box.x && p.x - rx < box.x + box.width && p.y + ry > box.y && p.y - ry < box.y + box.height) collisions.add(box.name);
      }
    }
    assert.deepEqual([...collisions], []);
  });
}
