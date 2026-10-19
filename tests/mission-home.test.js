"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { DOCK, flightState, revealState, damp, init } = require("../js/mission-home.js");
const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
const near = (a, b, tolerance = .001) => assert.ok(Math.abs(a - b) <= tolerance, `${a} ≠ ${b}`);
const geometry = (mobile = false) => ({ width: mobile ? 390 : 1440, height: mobile ? 844 : 1000, bottleWidth: mobile ? 170 : 330, craftWidth: mobile ? 203 : 360, mobile, launchDistance: 2600, gallbladderTop: 4700, arrivalX: mobile ? 180 : 1050, arrivalY: 5300, stageTop: 0 });

test("the spacecraft stays exactly on the bottle blueprint throughout the deeper zoom", () => {
  for (const mobile of [false, true]) {
    const g = geometry(mobile);
    for (let scroll = 0; scroll <= g.launchDistance * .72; scroll += 10) {
      const state = flightState(scroll, g);
      near(state.craftX, state.bottleX + (DOCK.x - .5) * g.bottleWidth * state.bottleScale);
      near(state.craftY, state.bottleY + (DOCK.y - .5) * g.bottleWidth * 750 / 490 * state.bottleScale);
      near(state.craftScale * g.craftWidth, DOCK.width * g.bottleWidth * state.bottleScale);
      near(state.detach, 0);
    }
    assert.ok(flightState(g.launchDistance * .7, g).bottleScale >= 4.2);
  }
});

test("Renata exits right, then the blueprint gains detail before detaching", () => {
  const g = geometry();
  const start = flightState(0, g), zoom = flightState(1100, g), formed = flightState(1872, g), flying = flightState(2600, g);
  assert.equal(start.detail, 0);
  assert.ok(zoom.introX > g.width);
  assert.ok(zoom.detail > 0 && zoom.detail < 1);
  assert.ok(zoom.copy > .9);
  assert.equal(formed.detail, 1);
  assert.equal(formed.detach, 0);
  assert.equal(flying.bottleOpacity, 0);
  assert.equal(flying.detach, 1);
});

test("launch and space flight remain continuous and reversible at desktop and phone sizes", () => {
  for (const mobile of [false, true]) {
    const g = geometry(mobile), samples = [];
    let previous;
    for (let scroll = 0; scroll <= 5800; scroll += 2) {
      const state = flightState(scroll, g);
      Object.values(state).forEach(value => assert.ok(Number.isFinite(value)));
      for (const key of ["detail", "detach", "copy", "craftOpacity", "bottleOpacity", "exhaust"]) assert.ok(state[key] >= 0 && state[key] <= 1, key);
      if (previous) {
        assert.ok(Math.abs(state.craftX - previous.craftX) < 5, "no horizontal teleport");
        assert.ok(Math.abs(state.craftY - previous.craftY) < 5, "no vertical teleport");
        assert.ok(Math.abs(state.craftAngle - previous.craftAngle) < 1, "no sudden turn");
      }
      previous = state; samples.push(state);
    }
    for (let index = samples.length - 1; index >= 0; index--) assert.deepEqual(flightState(index * 2, g), samples[index]);
    const arrival = flightState(g.gallbladderTop - g.height * .1, g);
    near(arrival.craftX, g.arrivalX);
    near(arrival.craftY, g.arrivalY - (g.gallbladderTop - g.height * .1));
    assert.equal(flightState(5800, g).craftOpacity, 0);
  }
});

test("copy slides from both sides, settles fully, and camera damping is frame-rate independent", () => {
  assert.ok(revealState(1000, 2000, 1000, 0, false).x < 0);
  assert.ok(revealState(1000, 2000, 1000, 0, true).x > 0);
  assert.equal(revealState(2200, 2000, 1000, 4, false).opacity, 1);
  near(damp(0, 1000, 32), damp(damp(0, 1000, 16), 1000, 16));
});

test("the live homepage uses the new route, supplied assets, evidence status, and controls", () => {
  const html = read("home-orbit.html");
  assert.match(html, /js\/mission-home.js/);
  const artwork = require("../js/mission-art.js");
  assert.ok(html.includes(artwork.bottle()), "live bottle matches the authored composition");
  assert.ok(html.includes(artwork.rocket("flying-rocket")), "live ship matches its blueprint");
  assert.doesNotMatch(html, /js\/orbit-home.js|id="stomach"|id="intestine"|id="portal"/);
  for (const file of ["rocket-left.png", "rocket-right.png", "sulflux-bottle.png", "sult2a1.png", "btsult.png"]) {
    assert.ok(html.includes(`assets/story/${file}`));
    assert.ok(fs.existsSync(path.join(__dirname, "..", "assets/story", file)));
  }
  assert.match(html, /Proposed design · not a validated treatment/);
  assert.doesNotMatch(html, /Over 60 million|we have created a new version|is able to bind to and sulfonate/);
  assert.match(html, /data-anatomy="after"/);
  assert.match(html, /id="design-progress" type="range"/);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, "SVG and page IDs remain unique");
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
});

function fixture() {
  let serial = 0, time = 0;
  const jobs = new Map();
  const win = { innerWidth: 1440, innerHeight: 1000, scrollY: 0, events: {},
    addEventListener(name, fn) { this.events[name] = fn; }, requestAnimationFrame(fn) { const id = ++serial; jobs.set(id, fn); return id; },
    cancelAnimationFrame(id) { jobs.delete(id); }, scrollTo({ top }) { this.scrollY = top; }
  };
  function element() {
    const classes = new Set();
    return { style: { setProperty(name, value) { this[name] = value; } }, dataset: {}, attrs: {}, events: {}, children: [], offsetWidth: 330, offsetHeight: 1000,
      classList: { add: key => classes.add(key), remove: key => classes.delete(key), contains: key => classes.has(key), toggle(key, on) { on ? classes.add(key) : classes.delete(key); } },
      addEventListener(name, fn) { this.events[name] = fn; }, setAttribute(name, value) { this.attrs[name] = value; }, getAttribute(name) { return this.attrs[name]; },
      removeAttribute(name) { if (name === "style") this.style = { setProperty(key, value) { this[key] = value; } }; else delete this.attrs[name]; }
    };
  }
  const body = element(), reduced = element(), compact = element(); reduced.matches = compact.matches = false;
  win.matchMedia = query => query.includes("reduced") ? reduced : compact;
  const nodes = Object.fromEntries([".mission-launch", ".mission-launch-stage", ".mission-bottle", ".mission-intro", ".mission-zoom-copy", ".mission-craft-layer", ".mission-craft", ".flight-header", ".mission-controls", ".mission-motion-toggle"].map(key => [key, element()]));
  const launch = nodes[".mission-launch"];
  Object.defineProperty(launch, "offsetHeight", { get: () => body.classList.contains("mission-enhanced") ? 3600 : 1100 });
  launch.getBoundingClientRect = () => ({ top: -win.scrollY });
  nodes[".mission-craft"].offsetWidth = 360;
  const ids = { launch };
  const scenes = ["space", "gallbladder", "symptoms", "sulfation", "bile-acids", "engineering-story", "sulflux"].map((id, index) => {
    const section = element(), copy = element();
    section.getBoundingClientRect = () => ({ top: launch.offsetHeight + index * 1100 - win.scrollY });
    copy.getBoundingClientRect = () => ({ top: section.getBoundingClientRect().top + 150 });
    copy.children = Array.from({ length: 5 }, element);
    section.querySelector = () => copy;
    ids[id] = section; return section;
  });
  const gallery = ids.gallbladder, copy = gallery.querySelector();
  const art = element(); art.getBoundingClientRect = () => ({ top: gallery.getBoundingClientRect().top + 200, left: 700, width: 650, height: 600 });
  const anatomyButtons = ["before", "after"].map(state => { const button = element(); button.dataset.anatomy = state; return button; });
  const status = element();
  gallery.querySelector = selector => selector.includes("svg") ? art : selector.includes("status") ? status : copy;
  gallery.querySelectorAll = () => anatomyButtons;
  ids.mission = element(); ids.mission.getBoundingClientRect = () => ({ top: launch.offsetHeight + 8000 - win.scrollY });
  ids["design-progress"] = element(); ids["design-progress"].value = "0";
  const checkpoints = ["launch", "gallbladder", "symptoms", "sulfation", "bile-acids", "engineering-story", "sulflux"].map(id => { const node = element(); node.attrs.href = `#${id}`; return node; });
  const doc = { body, hidden: false, events: {}, getElementById: id => ids[id], querySelector: selector => selector[0] === "#" ? ids[selector.slice(1)] : nodes[selector],
    querySelectorAll: selector => selector.includes("checkpoints") ? checkpoints : selector.includes("anatomy-controls") ? anatomyButtons : scenes,
    addEventListener(name, fn) { this.events[name] = fn; }
  };
  function step(dt = 16) { time += dt; const callbacks = [...jobs.values()]; jobs.clear(); callbacks.forEach(fn => fn(time)); }
  function settle() { let frames = 0; while (jobs.size && frames++ < 300) step(); assert.equal(jobs.size, 0, "no permanent RAF loop"); }
  function scroll(top) { win.scrollY = top; win.events.scroll(); }
  init(win, doc); settle();
  return { win, doc, nodes, ids, scenes, reduced, anatomyButtons, status, jobs, step, settle, scroll };
}

test("the actual controller docks, animates scroll, and exposes the interactive science diagrams", () => {
  const f = fixture();
  const initial = f.nodes[".mission-craft"].style.transform;
  f.scroll(1500); f.step();
  assert.notEqual(f.nodes[".mission-launch-stage"].style["--intro-x"], "0px");
  f.step();
  assert.notEqual(f.nodes[".mission-craft"].style.transform, initial);
  f.settle();
  assert.ok(f.nodes[".mission-launch-stage"].style["--bottle-scale"] > 4);
  f.anatomyButtons[1].events.click();
  assert.equal(f.ids.gallbladder.classList.contains("is-after"), true);
  assert.equal(f.anatomyButtons[1].attrs["aria-pressed"], "true");
  assert.match(f.status.textContent, /directly from the liver/);
  f.ids["design-progress"].value = "65"; f.ids["design-progress"].events.input();
  assert.equal(f.ids["engineering-story"].style["--fit-progress"], .65);
  f.scroll(0); f.settle();
  assert.equal(f.nodes[".mission-craft"].style.transform, initial, "replaying returns to the bottle exactly");
});

test("motion-off, reduced motion, small screens, and hidden tabs keep content readable", () => {
  const f = fixture();
  f.scroll(1200); f.step();
  f.doc.hidden = true; f.doc.events.visibilitychange(); assert.equal(f.jobs.size, 0);
  f.doc.hidden = false; f.doc.events.visibilitychange(); f.settle();
  f.nodes[".mission-motion-toggle"].events.click(); f.settle();
  assert.equal(f.doc.body.classList.contains("mission-enhanced"), false);
  assert.equal(f.nodes[".mission-intro"].inert, false);
  assert.equal(f.nodes[".mission-zoom-copy"].inert, false);
  assert.equal(f.nodes[".mission-launch-stage"].style["--bottle-scale"], undefined);
  assert.equal(f.nodes[".mission-craft-layer"].style.visibility, "hidden");
  f.nodes[".mission-motion-toggle"].events.click(); f.settle();
  assert.equal(f.doc.body.classList.contains("mission-enhanced"), true);
  f.reduced.matches = true; f.reduced.events.change(); f.settle();
  assert.equal(f.doc.body.classList.contains("mission-enhanced"), false);
  assert.equal(f.nodes[".mission-motion-toggle"].hidden, true);
  f.reduced.matches = false; f.win.innerHeight = 600; f.win.events.resize(); f.settle();
  assert.equal(f.doc.body.classList.contains("mission-enhanced"), false);
});
