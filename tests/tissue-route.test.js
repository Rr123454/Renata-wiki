"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const geometry = require("../js/tissue-route.js");

function fixture(width, viewportHeight) {
  const compact = width <= 1000;
  const heroHeight = compact ? 1400 : Math.max(1000, viewportHeight * 1.12);
  const headSize = compact ? Math.min(width - 48, 560) : Math.min(width * .43, 690);
  const ingestion = { x: compact ? (width - headSize) / 2 : width * .74 - headSize / 2,
    y: compact ? heroHeight - headSize - 80 : heroHeight * .51 - headSize / 2, width: headSize, height: headSize };
  const image = compact ? Math.min(width, 620) : Math.min(width * .4, 680);
  const gap = compact ? Math.max(180, Math.min(viewportHeight * .26, 300)) : Math.max(250, Math.min(viewportHeight * .35, 420));
  const height = compact ? image + 660 : Math.max(980, viewportHeight * 1.05);
  const stations = Array.from({ length: 4 }, (_, i) => {
    const top = heroHeight + gap + i * (gap + height);
    return { top, height, art: { x: compact ? (width - image) / 2 : width * (i % 2 ? .72 : .28) - image / 2,
      y: compact ? top + 32 : top + (height - image - 106) / 2, width: image, height: image } };
  });
  return { width, viewportHeight, heroHeight, compact, stations, ingestion };
}

function checkRoute(input) {
  const route = geometry.build(input);
  assert.deepEqual(route.phases.map(p => p.id), ["ingestion", "stomach", "intestine", "portal", "liver"]);
  assert.ok(route.doseEnd > 0 && route.doseEnd < route.phases[0].end);
  assert.equal(route.connectors.length, 4);
  assert.deepEqual(route.connectors.map(c => c.kind), ["digestive", "digestive", "blood", "blood"]);
  const beginning = geometry.pointAtDistance(route, 0);
  assert.ok(Math.abs(beginning.x - (input.ingestion.x + .12 * input.ingestion.width)) < .001);
  assert.ok(Math.abs(beginning.y - (input.ingestion.y + .36 * input.ingestion.height)) < .001);
  for (let i = 1; i < route.stops.length; i++) {
    assert.ok(route.stops[i].guide > route.stops[i - 1].guide, `scroll guide ${i} must advance`);
    assert.ok(route.stops[i].distance > route.stops[i - 1].distance, `arc length ${i} must advance`);
  }
  for (const sample of route.samples) {
    assert.ok(Number.isFinite(sample.x) && Number.isFinite(sample.y));
    assert.ok(sample.x >= 0 && sample.x <= input.width, `route stays in screen: ${sample.x}`);
  }
  route.phases.forEach((phase, i) => {
    const art = i === 0 ? input.ingestion : input.stations[i - 1].art;
    for (const sample of route.samples.filter(s => s.distance >= phase.start && s.distance <= phase.end)) {
      assert.ok(sample.x >= art.x && sample.x <= art.x + art.width);
      assert.ok(sample.y >= art.y && sample.y <= art.y + art.height);
    }
  });
  const final = geometry.pointAtDistance(route, route.totalLength);
  const liver = input.stations[3].art;
  assert.ok(Math.abs(final.x - (liver.x + .4 * liver.width)) < .001);
  assert.ok(Math.abs(final.y - (liver.y + .4 * liver.height)) < .001);
  assert.equal(geometry.distanceAtScroll(route, -10000), 0);
  assert.equal(geometry.distanceAtScroll(route, 100000), route.totalLength);
  let previous = route.totalLength;
  for (let guide = route.stops.at(-1).guide; guide >= 0; guide -= 17) {
    const distance = geometry.distanceAtScroll(route, guide);
    assert.ok(distance <= previous, "reverse scrolling retraces the same route");
    previous = distance;
  }
  return route;
}

for (const [width, height] of [[320, 844], [390, 844], [768, 1024], [1000, 800], [1024, 768], [1280, 720], [1920, 1080], [2560, 1440]]) {
  test(`anatomical route at ${width} x ${height}`, () => checkRoute(fixture(width, height)));
}

test("bottle cap follows the tangent in either scroll direction", () => {
  const route = geometry.build(fixture(1920, 1080));
  for (const direction of [1, -1]) {
    for (let distance = 2; distance < route.totalLength - 2; distance += 29) {
      const next = geometry.pointAtDistance(route, distance + 2);
      const previous = geometry.pointAtDistance(route, distance - 2);
      const dx = (next.x - previous.x) * direction, dy = (next.y - previous.y) * direction;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      // Original cap vector is (0,-1), transformed by CSS rotation.
      const dot = (Math.sin(angle) * dx - Math.cos(angle) * dy) / Math.hypot(dx, dy);
      assert.ok(dot > .999999, "cap must point forward");
    }
  }
});

test("homepage keeps the bottle and removes replacement-marker markup", () => {
  const js = fs.readFileSync(path.join(__dirname, "../js/space-home.js"), "utf8");
  assert.ok(js.includes('href="assets/yakult-bottle.png"'));
  assert.ok(js.includes("scale(${scale})"));
  assert.ok(js.includes("travelDirection = delta > 0 ? 1 : -1"));
  assert.ok(!js.includes("space-drug-marker"));
});

// Browser-measured layouts are optional local fixtures, saved after visual checks.
const tmp = path.join(__dirname, "../tmp");
if (fs.existsSync(tmp)) for (const name of fs.readdirSync(tmp).filter(name => /^body-layout-.*\.json$/.test(name))) {
  test(`measured route and text clearance: ${name}`, () => {
    const input = JSON.parse(fs.readFileSync(path.join(tmp, name), "utf8"));
    const route = checkRoute(input);
    const boxes = [...input.texts, ...input.stations.flatMap(s => [s.copy, {
      x: s.caption.x + 24, y: s.caption.y + (input.compact ? 8 : 16),
      width: s.caption.width - 24 - (input.compact ? 51.2 : 24), height: s.caption.height - (input.compact ? 8 : 16)
    }])];
    for (const sample of route.samples) {
      const shrink = Math.max(0, Math.min(1, (sample.distance / route.doseEnd - .4) / .6));
      const base = input.compact ? 32 : Math.min(86, Math.max(58, input.width * .06));
      const scale = 1 - shrink * (1 - (input.compact ? .55 : .36));
      const radius = Math.hypot(base, base * 294 / 152) * scale / 2;
      for (const box of boxes) {
        const dx = Math.max(box.x - sample.x, 0, sample.x - (box.x + box.width));
        const dy = Math.max(box.y - sample.y, 0, sample.y - (box.y + box.height));
        assert.ok(Math.hypot(dx, dy) >= radius, `bottle overlaps text at ${sample.x},${sample.y}`);
      }
    }
  });
}
