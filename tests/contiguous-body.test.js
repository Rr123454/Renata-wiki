"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const api = require("../js/contiguous-route.js");
const route = api.build();
const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");

test("Home loads the continuous body implementation with the shared theme last", () => {
  const html = read("index.html");
  assert.match(html, /css\/body-home.css\?v=20261001-contiguous1/);
  assert.match(html, /js\/contiguous-route.js\?v=20261001-contiguous1/);
  assert.match(html, /js\/body-home.js\?v=20261001-contiguous1/);
  assert.doesNotMatch(html, /(?:space-home|tissue-route)\.(?:js|css)/);
  assert.ok(html.indexOf("css/cosmic-theme.css") > html.indexOf("css/body-home.css"));
});

test("one anatomical asset replaces the disconnected organs and external tubes", () => {
  const js = read("js/body-home.js");
  assert.equal((js.match(/assets\/tissues\//g) || []).length, 1);
  assert.match(js, /assets\/tissues\/contiguous-body.png/);
  assert.doesNotMatch(js, /body-passage|space-body-map|space-tissue|space-maneuver/);
  assert.match(js, /assets\/yakult-bottle.png/);
  assert.match(js, /viewBox="89 180 152 294"/);
  assert.ok(fs.statSync(path.join(__dirname, "../assets/tissues/contiguous-body.png")).size > 100000);
});

test("anatomical phases remain connected in a single SVG path", () => {
  assert.deepEqual(route.phases.map(p => p.id), ["ingestion", "stomach", "intestine", "portal", "liver"]);
  assert.equal((route.d.match(/M/g) || []).length, 1);
  for (let i = 0; i < route.phases.length; i++) {
    assert.ok(route.phases[i].end > route.phases[i].start);
    if (i) assert.equal(route.phases[i].start, route.phases[i - 1].end);
  }
  assert.equal(route.phases.at(-1).end, route.totalLength);
});

test("the route fits the illustration at all scales", () => {
  for (const sample of route.samples) {
    assert.ok(sample.x >= 0 && sample.x <= 1000);
    assert.ok(sample.y >= 0 && sample.y <= 1500);
    assert.ok(Number.isFinite(sample.distance));
  }
  for (let i = 1; i < route.samples.length; i++) {
    assert.ok(route.samples[i].distance > route.samples[i - 1].distance);
  }
});

test("portal blood moves back upward from intestine to the liver", () => {
  const portal = route.phases[3];
  const start = api.pointAtDistance(route, portal.start);
  const end = api.pointAtDistance(route, portal.end);
  assert.ok(end.y < start.y - 200);
  const arrival = api.pointAtDistance(route, route.totalLength);
  assert.ok(arrival.x >= 270 && arrival.x <= 540 && arrival.y >= 680 && arrival.y <= 900);
});

test("scroll mapping is continuous, reversible and reaches each phase", () => {
  const stops = [0, 1000, 2100, 3200, 4300, 4900];
  let previous = -1;
  for (let y = -100; y <= 5100; y += 10) {
    const d = api.distanceAtScroll(route, stops, y);
    assert.ok(d >= previous);
    assert.ok(d >= 0 && d <= route.totalLength);
    previous = d;
  }
  for (let i = 0; i < route.phases.length; i++) {
    assert.equal(api.distanceAtScroll(route, stops, stops[i]), route.phases[i].start);
    assert.equal(api.distanceAtScroll(route, stops, stops[i + 1]), route.phases[i].end);
  }
});

test("red cap points along movement in both scroll directions", () => {
  for (let d = 0; d <= route.totalLength; d += 7) {
    const before = api.pointAtDistance(route, d - 2), after = api.pointAtDistance(route, d + 2);
    const dx = after.x - before.x, dy = after.y - before.y, len = Math.hypot(dx, dy);
    for (const direction of [-1, 1]) {
      const p = api.pose(route, d, direction), angle = p.angle * Math.PI / 180;
      // Transform the original up-pointing cap vector (0, -1).
      const dot = Math.sin(angle) * dx / len * direction - Math.cos(angle) * dy / len * direction;
      assert.ok(dot > .999999);
    }
  }
});

test("the anatomy is sticky within the journey and mobile copy has its own space", () => {
  const css = read("css/body-home.css"), js = read("js/body-home.js");
  assert.match(css, /\.body-visual\s*\{\s*position: sticky/);
  assert.doesNotMatch(css, /position:\s*fixed/);
  assert.match(css, /padding: calc\(var\(--body-mobile-stage\) \+ 22px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(js, /if \(!paused\) current = target/);
  assert.ok(js.indexOf('class="body-arrival"') > js.indexOf('class="body-chapters"'));
});
