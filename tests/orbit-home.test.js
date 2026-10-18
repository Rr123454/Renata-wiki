"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { flightState, bottleDock, routePose, revealState, damp, initFlight } = require("../js/orbit-home.js");
const stops = [0, 1800, 2880, 3960, 5040];
const near = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} ≈ ${b}`);

// Independent point rotations follow the authored SVG's nested coordinate spaces.
function rotate(point, center, degrees) {
  const a = degrees * Math.PI / 180, x = point.x - center.x, y = point.y - center.y;
  return { x: center.x + x * Math.cos(a) - y * Math.sin(a), y: center.y + x * Math.sin(a) + y * Math.cos(a) };
}

test("the flying spacecraft exactly occupies the bottle emblem until detachment", () => {
  const html = fs.readFileSync(path.join(__dirname, "../home-orbit.html"), "utf8");
  assert.match(html, /rotate\(-7 150 275\)/);
  assert.match(html, /translate\(196 329\) rotate\(-90\)/);
  assert.match(html, /spacecraft.svg" x="-24" y="-35.2" width="48" height="70.4"/);
  for (const [width, height, bottleWidth, craftWidth] of [[1440, 1000, 330, 259.2], [390, 844, 150, 125], [768, 1024, 200, 145]]) {
    const geometry = { width, height, bottleWidth, craftWidth, stageHeight: height, stageTop: 0 };
    for (const scroll of [0, 125, 300, 350]) {
      const state = flightState(scroll, 1250, stops, width <= 760, geometry);
      const mark = rotate({ x: 196, y: 329 }, { x: 150, y: 275 }, -7);
      const offset = { x: (mark.x - 150) / 300 * bottleWidth * state.bottleScale, y: (mark.y - 245) / 300 * bottleWidth * state.bottleScale };
      const spun = rotate(offset, { x: 0, y: 0 }, state.bottleAngle);
      near(state.craftX * width, state.bottleX * width + spun.x);
      near(state.craftY * height, state.bottleY * height + spun.y);
      near(state.craftAngle, -97 + state.bottleAngle);
      near(state.craftScale * craftWidth, 48 / 300 * bottleWidth * state.bottleScale);
      assert.equal(state.detach, 0);
      assert.equal(state.craftOpacity, 1, "the emblem is present before launch");
    }
  }
});

test("lift-off grows out of the emblem before the bottle disappears", () => {
  const opening = flightState(0, 1250, stops, false);
  const lifting = flightState(625, 1250, stops, false);
  const launched = flightState(1250, 1250, stops, false);
  assert.equal(opening.intro, 1);
  assert.equal(opening.bottleOpacity, 1);
  assert.equal(opening.exhaust, 0);
  assert.ok(lifting.craftScale > opening.craftScale && lifting.craftScale < launched.craftScale);
  assert.ok(lifting.detach > 0 && lifting.detach < 1);
  assert.equal(lifting.bottleOpacity, 1, "the bottle remains while its emblem lifts away");
  assert.equal(launched.intro, 0);
  assert.equal(launched.bottleOpacity, 0);
  assert.equal(launched.craftScale, 1);
  assert.equal(launched.exhaust, 1);
  near(launched.ringOpacity, 0);
});

test("desktop and mobile flights are continuous and retrace when scrolling backward", () => {
  for (const mobile of [false, true]) {
    const forward = [];
    let previous;
    for (let scroll = 0; scroll <= 6000; scroll += 5) {
      const state = flightState(scroll, 1250, stops, mobile);
      for (const value of Object.values(state)) assert.ok(Number.isFinite(value));
      assert.ok(state.craftX > .15 && state.craftX < .8, "ship remains inside the scene");
      assert.ok(state.craftY > .3 && state.craftY < .9, "ship clears header and controls");
      for (const key of ["intro", "bottleOpacity", "craftOpacity", "exhaust", "detach"]) assert.ok(state[key] >= 0 && state[key] <= 1);
      if (previous) {
        assert.ok(Math.abs(state.craftX - previous.craftX) < .01, "no horizontal teleport");
        assert.ok(Math.abs(state.craftY - previous.craftY) < .01, "no vertical teleport");
        assert.ok(Math.abs(state.craftAngle - previous.craftAngle) < 2, "no sudden turn");
      }
      forward.push(state);
      previous = state;
    }
    for (let index = forward.length - 1; index >= 0; index--) assert.deepEqual(flightState(index * 5, 1250, stops, mobile), forward[index]);
  }
});

test("flight velocity stays continuous at chapter boundaries and settles at the end", () => {
  const poses = [[.54, .47, -20], [.6, .54, 14], [.42, .55, -16], [.61, .54, 15], [.5, .56, 6]];
  const epsilon = .01;
  for (let i = 1; i < stops.length - 1; i++) {
    const before = routePose(stops[i] - epsilon, stops, poses).values;
    const at = routePose(stops[i], stops, poses).values;
    const after = routePose(stops[i] + epsilon, stops, poses).values;
    at.forEach((value, axis) => near((value - before[axis]) / epsilon, (after[axis] - value) / epsilon, 1e-5));
  }
  stops.forEach((scroll, index) => assert.equal(flightState(scroll, 1250, stops, false).chapter, index));
  assert.deepEqual(flightState(9000, 1250, stops, false), flightState(stops.at(-1), 1250, stops, false));
  assert.equal(flightState(-100, 1250, stops, true).launch, 0);
  assert.ok(Number.isFinite(flightState(100, 0, stops, true).craftX));
});

test("text enters from alternating sides with staggered lines and a readable resting state", () => {
  const left = revealState(1550, 2500, 1000, false, 0, false);
  const right = revealState(1550, 2500, 1000, true, 0, false);
  assert.ok(left.x < 0 && right.x > 0);
  const heading = revealState(1800, 2500, 1000, false, 1, false);
  const body = revealState(1800, 2500, 1000, false, 2, false);
  assert.ok(heading.opacity > body.opacity, "heading arrives before the paragraph");
  for (let i = 0; i < 4; i++) assert.deepEqual(revealState(2500, 2500, 1000, false, i, false), { opacity: 1, x: -0, y: 0 });
  assert.ok(Math.abs(revealState(1550, 2500, 1000, false, 0, true).x) < Math.abs(left.x), "mobile uses a shorter entrance");
});

test("damping is frame-rate independent, converges, and cannot overshoot", () => {
  const oneFrame = damp(0, 1000, 32);
  near(oneFrame, damp(damp(0, 1000, 16), 1000, 16));
  for (const start of [0, 1800]) {
    let current = start;
    for (let i = 0; i < 120; i++) {
      const next = damp(current, 1000, 16);
      assert.ok(next >= Math.min(current, 1000) && next <= Math.max(current, 1000));
      current = next;
    }
    near(current, 1000, .001);
  }
});

// A local DOM/RAF harness exercises the actual controller without a browser or network.
function fixture() {
  let serial = 0, time = 0;
  const jobs = new Map();
  const view = { innerWidth: 1440, innerHeight: 1000, scrollY: 0, events: {},
    addEventListener(name, fn) { this.events[name] = fn; },
    requestAnimationFrame(fn) { const id = ++serial; jobs.set(id, fn); return id; },
    cancelAnimationFrame(id) { jobs.delete(id); }
  };
  function element() {
    const classes = new Set();
    return {
      style: { setProperty(name, value) { this[name] = value; } }, dataset: {}, attrs: {}, events: {}, children: [], offsetTop: 0, offsetHeight: 1000, offsetWidth: 330,
      classList: { add: value => classes.add(value), contains: value => classes.has(value), toggle(value, enabled) { if (enabled) classes.add(value); else classes.delete(value); } },
      addEventListener(name, fn) { this.events[name] = fn; },
      appendChild(child) { this.children.push(child); },
      setAttribute(name, value) { this.attrs[name] = value; },
      removeAttribute(name) { if (name === "style") this.style = { setProperty(key, value) { this[key] = value; } }; else delete this.attrs[name]; }
    };
  }
  const body = element(), reduced = element(), compact = element();
  reduced.matches = compact.matches = false;
  view.matchMedia = query => query.includes("reduced") ? reduced : compact;
  const selectors = [".flight-journey", ".flight-launch", ".flight-launch-stage", ".flight-bottle", ".flight-hero-copy", ".flight-scroll", ".flight-craft-layer", ".flight-craft", ".flight-launch-ring", ".flight-header", ".flight-controls", ".flight-motion", ".flight-progress", ".flight-progress-label", ".flight-stars", ".flight-replay"];
  const nodes = Object.fromEntries(selectors.map(selector => [selector, element()]));
  Object.defineProperty(nodes[".flight-launch"], "offsetHeight", { get: () => body.classList.contains("flight-enhanced") ? 2250 : 1000 });
  nodes[".flight-launch"].getBoundingClientRect = () => ({ top: -view.scrollY });
  nodes[".flight-craft"].offsetWidth = 259.2;
  nodes[".flight-journey"].getBoundingClientRect = () => ({ top: -view.scrollY, bottom: nodes[".flight-launch"].offsetHeight + 4320 - view.scrollY });
  const worlds = Array.from({ length: 4 }, (_, index) => {
    const world = element(), copy = element();
    world.dataset.chapter = ["Stomach", "Small intestine", "Portal circulation", "Liver"][index];
    world.offsetHeight = 1080;
    world.getBoundingClientRect = () => ({ top: nodes[".flight-launch"].offsetHeight + index * 1080 - view.scrollY });
    copy.offsetTop = index === 3 ? 860 : 237.6;
    copy.children = Array.from({ length: index === 3 ? 3 : 4 }, element);
    world.querySelector = () => copy;
    return world;
  });
  const checkpoints = Array.from({ length: 5 }, element);
  const doc = { body, hidden: false, events: {},
    querySelector: selector => nodes[selector],
    querySelectorAll: selector => selector === ".flight-world" ? worlds : checkpoints,
    createDocumentFragment: element, createElement: element,
    addEventListener(name, fn) { this.events[name] = fn; }
  };
  function step(dt = 16) { time += dt; const callbacks = [...jobs.values()]; jobs.clear(); callbacks.forEach(fn => fn(time)); }
  function settle() { let frames = 0; while (jobs.size && frames++ < 250) step(); assert.equal(jobs.size, 0, "animation frame loop stops when settled"); }
  function scroll(y) { view.scrollY = y; view.events.scroll(); }
  initFlight(view, doc);
  settle();
  return { view, doc, nodes, worlds, reduced, checkpoints, jobs, step, settle, scroll };
}

test("the real controller smooths scroll, freezes on pause, and resumes without an idle loop", () => {
  const f = fixture(), craft = f.nodes[".flight-craft"];
  assert.equal(f.nodes[".flight-launch-stage"].style["--label-opacity"], 0);
  const initial = craft.style.transform;
  f.scroll(2600); f.step();
  const firstFrame = craft.style.transform;
  assert.notEqual(firstFrame, initial);
  f.settle();
  assert.notEqual(craft.style.transform, firstFrame, "coasts to the scroll position");
  const paragraph = f.worlds[0].querySelector().children[2];
  assert.equal(paragraph.style["--copy-opacity"], 1);
  f.nodes[".flight-motion"].events.click(); f.settle();
  const paused = craft.style.transform;
  f.scroll(3900); f.settle();
  assert.equal(craft.style.transform, paused);
  assert.equal(f.nodes[".flight-motion"].attrs["aria-pressed"], "true");
  f.nodes[".flight-motion"].events.click(); f.settle();
  assert.notEqual(craft.style.transform, paused);
  f.nodes[".flight-replay"].events.click(); f.scroll(0); f.settle();
  assert.equal(craft.style.transform, initial);
  assert.equal(f.nodes[".flight-hero-copy"].inert, false);
});

test("reduced motion, short screens, and tab visibility restore readable content and stop work", () => {
  const f = fixture();
  f.scroll(3200); f.step();
  f.doc.hidden = true; f.doc.events.visibilitychange();
  assert.equal(f.jobs.size, 0);
  f.doc.hidden = false; f.doc.events.visibilitychange(); f.settle();
  f.reduced.matches = true; f.reduced.events.change(); f.settle();
  assert.equal(f.doc.body.classList.contains("flight-enhanced"), false);
  assert.equal(f.nodes[".flight-motion"].hidden, true);
  assert.equal(f.nodes[".flight-hero-copy"].inert, false);
  assert.equal(f.worlds[0].querySelector().children[0].style["--copy-opacity"], undefined);
  assert.equal(f.nodes[".flight-launch-stage"].style["--label-opacity"], undefined);
  f.reduced.matches = false; f.reduced.events.change(); f.settle();
  assert.equal(f.doc.body.classList.contains("flight-enhanced"), true);
  f.view.innerHeight = 600; f.view.events.resize(); f.settle();
  assert.equal(f.doc.body.classList.contains("flight-enhanced"), false);
  assert.equal(f.nodes[".flight-craft-layer"].style.visibility, "hidden");
});
