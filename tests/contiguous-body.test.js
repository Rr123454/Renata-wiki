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
  assert.match(html, /css\/body-home.css\?v=20261001-backdrop1/);
  assert.match(html, /js\/contiguous-route.js\?v=20261001-intestine1/);
  assert.match(html, /js\/body-home.js\?v=20261001-backdrop1/);
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

test("intestinal route follows the traced image coils and keeps its existing connections", () => {
  const phase = route.phases.find(p => p.id === "intestine");
  const samples = route.samples.filter(p => p.distance >= phase.start && p.distance <= phase.end);
  assert.deepEqual(api.pointAtDistance(route, phase.start), { x: 486, y: 960 });
  assert.deepEqual(api.pointAtDistance(route, phase.end), { x: 573, y: 1115 });
  // Centers picked on the unchanged illustration in its 1000 x 1500 space.
  const coilCenters = [[386,1011],[396,1051],[398,1096],[416,1143],[410,1182],[442,1220],[477,1128],[520,1130],[568,1167]];
  for (const [x, y] of coilCenters) {
    const gap = Math.min(...samples.map(p => Math.hypot(p.x - x, p.y - y)));
    assert.ok(gap < 10, `route misses image coil at ${x},${y} by ${gap}`);
  }
});

test("intestinal folds have no accidental self-crossing loops", () => {
  const phase = route.phases.find(p => p.id === "intestine");
  const points = route.samples.filter(p => p.distance >= phase.start && p.distance <= phase.end);
  const side = (a,b,c) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  for (let i = 1; i < points.length; i++) {
    for (let j = i + 2; j < points.length; j++) {
      const [a,b,c,d] = [points[i-1],points[i],points[j-1],points[j]];
      const crosses = side(a,b,c)*side(a,b,d) < -1e-9 && side(c,d,a)*side(c,d,b) < -1e-9;
      assert.ok(!crosses, `segments ${i} and ${j} cross`);
    }
  }
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

test("red cap faces the mouth at the start even after returning backward", () => {
  const forward = api.pose(route, 0, 1);
  for (const distance of [-100, -1, 0]) {
    for (const direction of [-1, 1]) {
      const p = api.pose(route, distance, direction);
      assert.deepEqual(p, forward);
      const angle = p.angle * Math.PI / 180;
      assert.ok(Math.sin(angle) > .999, "red cap points right toward the mouth");
    }
  }
});

test("red cap points along movement in both scroll directions away from the start", () => {
  for (let d = .1; d <= route.totalLength; d += 7) {
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

test("the anatomy stays behind the copy within the journey on every screen size", () => {
  const css = read("css/body-home.css"), js = read("js/body-home.js");
  assert.match(css, /\.body-visual\s*\{\s*position: sticky/);
  assert.doesNotMatch(css, /position:\s*fixed/);
  assert.match(css, /padding: max\(35svh, 220px\) var\(--body-gutter\) 52px/);
  assert.doesNotMatch(css, /body-mobile-stage|\.body-visual::after/);
  assert.match(css, /\.body-chapter-copy::before[^}]+background: #fff4e3fa/);
  assert.match(js, /body-chapter--\$\{i % 2 \? "right" : "left"\}/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(js, /if \(!paused\) current = target/);
  assert.ok(js.indexOf('class="body-arrival"') > js.indexOf('class="body-chapters"'));
});

test("backdrop camera keeps the bottle between desktop copy areas and above mobile copy", () => {
  for (const [width, height, compact] of [[320,774,true],[391,774,true],[768,954,true],[1024,696,false],[1440,820,false],[1920,903,false],[2560,1360,false]]) {
    for (let distance = 0; distance <= route.totalLength; distance += 10) {
      const p = api.pointAtDistance(route, distance);
      const view = api.camera(width, height, p, compact);
      assert.ok(Math.abs(view.width / view.height - width / height) < 1e-9, "uniform scale");
      const x = (p.x - view.x) / view.width;
      const y = (p.y - view.y) / view.height;
      assert.ok(Math.abs(x - .5) < 1e-9, "bottle stays centered between the text areas");
      assert.ok(y > .03 && y < .96, "bottle stays in the full-screen backdrop");
      if (compact) assert.ok(Math.abs(y - .23) < 1e-9, "bottle stays above the text");
      else assert.ok(view.y >= 0 && view.y <= Math.max(0, 1500 - view.height));
    }
  }
});

test("the stage covers the viewport and camera freezes with the bottle", () => {
  const css = read("css/body-home.css"), js = read("js/body-home.js");
  assert.match(css, /height: calc\(100svh - var\(--body-header\)\);\s*width: 100%;\s*grid-area: 1 \/ 1/);
  assert.match(css, /width: min\(30vw, 560px\)/);
  assert.match(css, /\.body-hud[^}]+z-index: 4; pointer-events: none/);
  assert.match(js, /BODY_ROUTE.camera\(artWidth, artHeight, p, compact.matches\)/);
  assert.match(js, /if \(paused \|\| document.hidden\) return/);
});
