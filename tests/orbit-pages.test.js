"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { pageChapter, heroMarkup, sceneState, trailPath, createSceneController } = require("../js/orbit-pages.js");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = { window: {} };
vm.runInNewContext(read("js/site-content.js"), context);
vm.runInNewContext(read("js/dry-lab-content.js"), context);
vm.runInNewContext(read("js/lab-content.js"), context);
const data = context.window.SITE_DATA;
const redirects = new Set(["engineering.html", "home-orbit.html", "experiments.html", "wet-lab-notebook.html", "experiment-enzyme-design.html", "experiment-enzyme-design-notebook.html", "experiment-enzyme-design-protocols.html"]);
const researchPages = new Set(["project-description", "wet-lab", "wet-lab-notebook", "model"]);

test("illustrated chapters load their renderer while research papers and redirects stay separate", () => {
  for (const file of fs.readdirSync(root).filter(file => file.endsWith(".html"))) {
    const html = read(file);
    if (redirects.has(file)) {
      const canonical = html.match(/rel="canonical" href="([^"]+)"/);
      assert.ok(canonical, file);
      assert.ok(fs.existsSync(path.join(root, canonical[1].split("#")[0])), file);
      assert.match(html, /window\.location\.replace\(destination\.href\)/, file);
      assert.doesNotMatch(html, /js\/orbit-pages.js/, file);
      continue;
    }
    if (html.includes('data-page="home"')) {
      assert.doesNotMatch(html, /js\/orbit-pages.js/, file);
      continue;
    }
    const key = html.match(/data-page="([^"]+)"/)[1];
    if (researchPages.has(key)) {
      assert.doesNotMatch(html, /(?:css|js)\/orbit-pages\.(?:css|js)/, file);
      assert.match(html, /css\/(?:project-research|lab-work)\.css/, file);
      assert.ok(data.pages[key], key);
      continue;
    }
    assert.ok(html.indexOf("css/orbit-pages.css") > html.indexOf("css/cosmic-theme.css"), file);
    assert.ok(html.indexOf("js/orbit-pages.js") >= 0, file);
    assert.ok(html.indexOf("js/orbit-pages.js") < html.indexOf("js/site.js"), file);
    const chapter = pageChapter(key, data.pages[key]);
    assert.ok(fs.existsSync(path.join(root, chapter.next.split("#")[0])), key);
    assert.ok(fs.existsSync(path.join(root, `assets/nav-icons/${chapter.icon}.png`)), key);
    const rendered = heroMarkup(chapter, "page-title", data.pages[key].title, []);
    assert.equal([...rendered.matchAll(/<h1\b/g)].length, 1);
    assert.match(rendered, /aria-labelledby="page-title"/);
    assert.doesNotMatch(rendered, /orbit-scene-toggle|Pause scene|Resume scene/);
    assert.match(html, /js\/orbit-pages\.js\?v=20261019-rocket-cutout1/);
  }
});

test("chapter destinations link directly to the consolidated Project DBTL section", () => {
  const project = pageChapter("project-description", data.pages["project-description"]);
  assert.equal(project.key, "project");
  assert.equal(project.next, "project-description.html#dbtl-cycle");
  assert.ok(!Object.hasOwn(data.pages, "engineering"));
  const legacy = pageChapter("engineering", data.pages.engineering);
  assert.equal(legacy.key, "project");
  assert.doesNotMatch(read("js/orbit-pages.js"), /["']engineering\.html["']/);
  assert.ok(data.nav.find(item => item.key === "project").children.every(item => item.href === project.next.split("#")[0]));
});

test("lab records retain their own titles and the crew keeps its dedicated renderer and animations", () => {
  const page = data.pages["experiment-assembly"];
  const chapter = pageChapter("experiment-assembly", page);
  assert.deepEqual(chapter.title, [page.title.replace(/<[^>]*>/g, "")]);
  assert.equal(chapter.record, true);
  assert.equal(chapter.next, "wet-lab.html");
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
    assert.equal(state.trailSweep, 1);
    assert.ok(state.trailX > 50 && state.trailX < 550);
    assert.ok(state.trailY > 50 && state.trailY < 450);
  }
  assert.notDeepEqual(sceneState(0, 0), sceneState(.6, 0));
});

test("the shared cutout is oriented to face its orbit tangent in either travel direction", () => {
  const markup = heroMarkup(pageChapter("team", data.pages.team), "crew-title", "Our Team", []);
  assert.match(markup, /href="assets\/story\/rocket-cutout\.png"[^>]*transform="rotate\(72\)"/);
  assert.doesNotMatch(markup, /assets\/orbit\/spacecraft\.svg/);
  for (const direction of [1, -1]) for (const progress of [0, .5, 1]) for (let time = 0; time < 110000; time += 2000) {
    const state = sceneState(progress, time, undefined, direction);
    const next = sceneState(progress, time + direction, undefined, direction);
    const dx = next.x - state.x, dy = next.y - state.y;
    const radians = state.angle * Math.PI / 180;
    const noseX = -Math.sin(radians), noseY = Math.cos(radians);
    const alignment = (noseX * dx + noseY * dy) / Math.hypot(dx, dy);
    assert.ok(alignment > .99999, `nose faces travel: ${direction}, ${time}`);
  }
});

test("the orange trail follows the same ellipse and ends under the rocket on every frame", () => {
  for (const direction of [1, -1]) for (let time = 0; time < 110000; time += 1500) {
    const state = sceneState(.4, time, undefined, direction);
    const d = trailPath(state);
    assert.ok(d.endsWith(` ${state.x} ${state.y}`));
    assert.ok(d.includes(`A220 135 -18 0 ${direction > 0 ? 1 : 0}`));
    // Undo the scene rotation and check the trail starts behind the current angle.
    const x = state.trailX - 300, y = state.trailY - 250, rotation = Math.PI / 10;
    const ux = (x * Math.cos(rotation) - y * Math.sin(rotation)) / 220;
    const uy = (x * Math.sin(rotation) + y * Math.cos(rotation)) / 135;
    assert.ok(Math.abs(ux * ux + uy * uy - 1) < 1e-10);
    const difference = state.theta - Math.atan2(uy, ux);
    const wrapped = Math.atan2(Math.sin(difference), Math.cos(difference));
    assert.ok(Math.abs(wrapped - direction * 1.45) < 1e-10);
  }
  assert.notEqual(trailPath(sceneState(0, 0)), trailPath(sceneState(0, 5000)), "trail moves while the page is stationary");
  const markup = heroMarkup(pageChapter("team", data.pages.team), "crew-title", "Our Team", []);
  assert.match(markup, /<path d="M[^\"]+" fill="none" stroke="#db8050"[^>]+class="orbit-scene-trail"/);
  assert.match(markup, /M-7 -26Q0 -68 7 -26/);
  assert.doesNotMatch(read("css/orbit-pages.css").match(/\.orbit-scene-trail\s*\{[^}]+\}/)[0], /stroke-dash/);
});

test("scene motion plays automatically, honors reduced motion, and resumes when visible", () => {
  let serial = 0, time = 0, visible = true, progress = 0;
  const frames = new Map(), painted = [];
  const win = { requestAnimationFrame(fn) { const id = ++serial; frames.set(id, fn); return id; }, cancelAnimationFrame(id) { frames.delete(id); } };
  const doc = { hidden: false }, reduced = { matches: false };
  const controller = createSceneController({ win, doc, reduced, measure: () => ({ visible, progress }), paint: state => painted.push(state) });
  const step = () => { time += 16; const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(time)); };
  controller.sync(); step(); step();
  assert.equal(frames.size, 1);
  assert.notEqual(painted[0].theta, painted[1].theta, "the scene moves without interaction");
  controller.point(1, 1); progress = .7; step(); step();
  assert.ok(painted.at(-1).tiltY > 0);
  assert.equal(painted.at(-1).direction, 1);
  progress = 0; step();
  assert.equal(painted.at(-1).direction, -1, "scrolling back reverses the nose and trail together");
  assert.equal(painted.at(-1).trailSweep, 0);
  visible = false; controller.sync(); assert.equal(frames.size, 0);
  const count = painted.length; step(); assert.equal(painted.length, count);
  visible = true; controller.sync(); step();
  assert.equal(frames.size, 1, "returning to the scene resumes it automatically");
  doc.hidden = true; controller.sync(); assert.equal(frames.size, 0);
  doc.hidden = false; controller.sync(); step();
  assert.equal(frames.size, 1, "returning to the tab resumes it automatically");
  reduced.matches = true; controller.sync();
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
