"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { pageChapter, heroMarkup, sceneState, createSceneController } = require("../js/orbit-pages.js");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = { window: {} };
vm.runInNewContext(read("js/site-content.js"), context);
vm.runInNewContext(read("js/dry-lab-content.js"), context);
const data = context.window.SITE_DATA;

test("every reading page loads its illustrated theme and chapter renderer before rendering content", () => {
  for (const file of fs.readdirSync(root).filter(file => file.endsWith(".html"))) {
    const html = read(file);
    if (html.includes('data-page="home"')) {
      assert.doesNotMatch(html, /js\/orbit-pages.js/, file);
      continue;
    }
    assert.ok(html.indexOf("css/orbit-pages.css") > html.indexOf("css/cosmic-theme.css"), file);
    assert.ok(html.indexOf("js/orbit-pages.js") < html.indexOf("js/site.js"), file);
    const key = html.match(/data-page="([^"]+)"/)[1];
    const chapter = pageChapter(key, data.pages[key]);
    assert.ok(fs.existsSync(path.join(root, chapter.next)), key);
    assert.ok(fs.existsSync(path.join(root, `assets/nav-icons/${chapter.icon}.png`)), key);
    const rendered = heroMarkup(chapter, "page-title", data.pages[key].title, []);
    assert.equal([...rendered.matchAll(/<h1\b/g)].length, 1);
    assert.match(rendered, /aria-labelledby="page-title"/);
  }
});

test("lab records retain their own titles and the crew keeps its dedicated renderer and animations", () => {
  const page = data.pages["experiment-enzyme-design-protocols"];
  const chapter = pageChapter("experiment-enzyme-design-protocols", page);
  assert.deepEqual(chapter.title, ["BtSULT design protocols"]);
  assert.equal(chapter.record, true);
  assert.equal(chapter.next, "experiments.html");
  const team = read("team.html");
  assert.match(team, /js\/team-deal.js/); assert.match(team, /js\/team-profiles.js/);
  const source = read("js/orbit-pages.js");
  const selector = source.match(/const targets = \[\.\.\.main.querySelectorAll\("([^"]+)"\)/)[1];
  assert.doesNotMatch(selector, /member-card|team-card|team-roster|team-group/);
  assert.match(read("js/site.js"), /class="team-roster"/);
});

test("scene geometry remains finite, bounded, and responsive to pointer and scroll input", () => {
  for (const progress of [-1, 0, .5, 1, 2]) for (let time = 0; time < 70000; time += 1000) {
    const state = sceneState(progress, time, { x: 12, y: -12 });
    Object.values(state).forEach(value => assert.ok(Number.isFinite(value)));
    assert.ok(state.x > 50 && state.x < 550);
    assert.ok(state.y > 50 && state.y < 450);
    assert.equal(state.tiltX, 5); assert.equal(state.tiltY, 7);
    assert.ok(state.trail >= .15 - 1e-8 && state.trail <= .65);
  }
  assert.notDeepEqual(sceneState(0, 0), sceneState(.6, 0));
});

test("scene motion pauses, honors reduced motion, and stops rendering outside the viewport or tab", () => {
  let serial = 0, time = 0, visible = true, progress = 0;
  const frames = new Map(), painted = [], states = [];
  const win = { requestAnimationFrame(fn) { const id = ++serial; frames.set(id, fn); return id; }, cancelAnimationFrame(id) { frames.delete(id); } };
  const doc = { hidden: false }, reduced = { matches: false };
  const controller = createSceneController({ win, doc, reduced, measure: () => ({ visible, progress }), paint: state => painted.push(state), onState: state => states.push(state) });
  const step = () => { time += 16; const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(time)); };
  controller.sync(); step(); step();
  assert.equal(frames.size, 1);
  controller.point(1, 1); progress = .7; step(); step();
  assert.ok(painted.at(-1).tiltY > 0);
  controller.toggle(); assert.equal(frames.size, 0); assert.equal(states.at(-1).paused, true);
  const count = painted.length; step(); assert.equal(painted.length, count);
  controller.toggle(); step();
  visible = false; controller.sync(); assert.equal(frames.size, 0);
  visible = true; controller.sync(); step();
  doc.hidden = true; controller.sync(); assert.equal(frames.size, 0);
  doc.hidden = false; reduced.matches = true; controller.sync();
  assert.equal(frames.size, 0); assert.deepEqual(painted.at(-1), sceneState(0, 0));
  reduced.matches = false; controller.sync(); step(); controller.destroy();
  assert.equal(frames.size, 0);
});

test("text colors remain legible on the new scene and paper surfaces", () => {
  function luminance(hex) {
    const rgb = hex.match(/../g).map(c => parseInt(c, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  }
  for (const [ink, paper] of [["fff1bc", "173e84"], ["653355", "f29b82"], ["713656", "f6bd93"], ["173e84", "b7dcdf"], ["4b356e", "dfcaec"], ["394f6d", "fff4e3"]]) {
    const values = [luminance(ink), luminance(paper)].sort((a, b) => a - b);
    assert.ok((values[1] + .05) / (values[0] + .05) >= 4.5, `${ink} on ${paper}`);
  }
});
