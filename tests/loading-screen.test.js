"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../js/loading-screen.js"), "utf8");
const redirects = ["engineering.html", "home-orbit.html", "experiments.html", "wet-lab-notebook.html", "experiment-enzyme-design.html", "experiment-enzyme-design-notebook.html", "experiment-enzyme-design-protocols.html"];

function fixture({ reduced = false, marked = ["bottle.png rocket.png"], fallback = [] } = {}) {
  let now = 0, count = 0;
  const timers = new Map(), images = [], listeners = new Map(), windowListeners = new Map(), classes = new Set();
  const button = { addEventListener(type, fn) { this[type] = fn; } };
  const progress = { style: {} };
  const main = { attributes: {}, setAttribute(k, v) { this.attributes[k] = v; }, focus() { doc.activeElement = this; } };
  const loader = {
    classList: { add: value => classes.add(value) },
    querySelector: selector => selector === "button" ? button : progress,
    contains: node => node === button,
    remove() { this.removed = true; }
  };
  const doc = {
    body: { appendChild(node) { assert.equal(node, loader); } },
    createElement: () => loader,
    getElementById: () => main,
    querySelectorAll: selector => selector === "[data-preload]" ? marked.map(preload => ({ dataset: { preload } })) : fallback.map(href => ({ getAttribute: () => href })),
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: name => listeners.delete(name)
  };
  const win = {
    matchMedia: () => ({ matches: reduced }),
    setTimeout(fn, delay) { timers.set(++count, { at: now + delay, fn }); return count; },
    addEventListener: (name, fn) => windowListeners.set(name, fn)
  };
  vm.runInNewContext(source, { window: win, document: doc, performance: { now: () => now }, Image: class { constructor() { images.push(this); } } });
  function advance(duration) {
    const end = now + duration;
    for (;;) {
      const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      now = next[1].at; timers.delete(next[0]); next[1].fn();
    }
    now = end;
  }
  return { doc, button, loader, main, images, progress, advance, classes,
    ready: () => listeners.get("DOMContentLoaded")(),
    key: key => listeners.get("keydown")?.({ key }),
    restore: () => windowListeners.get("pageshow")({ persisted: true })
  };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

test("the loader reports real image completion and dismisses after successful or failed loads", async () => {
  const f = fixture(); f.ready();
  assert.deepEqual(f.images.map(image => image.src), ["bottle.png", "rocket.png"]);
  f.images[0].onload();
  assert.equal(f.progress.style.transform, "scaleX(0.5)");
  f.images[1].onerror(); await flush();
  assert.equal(f.progress.style.transform, "scaleX(1)");
  f.advance(449); assert.equal(f.classes.has("is-dismissed"), false);
  f.advance(1); assert.equal(f.classes.has("is-dismissed"), true);
  f.advance(500); assert.equal(f.loader.removed, true);
});

test("unresponsive image requests cannot leave the loading screen blocking the page", () => {
  const f = fixture(); f.ready();
  f.advance(3199); assert.equal(f.classes.has("is-dismissed"), false);
  f.advance(1); assert.equal(f.classes.has("is-dismissed"), true);
  f.advance(500); assert.equal(f.loader.removed, true);
});

test("Skip, Escape and history restoration dismiss safely, with keyboard focus restored", () => {
  const f = fixture(); f.doc.activeElement = f.button; f.button.click();
  assert.equal(f.doc.activeElement, f.main);
  assert.equal(f.main.attributes.tabindex, "-1");
  f.ready(); assert.equal(f.images.length, 0);
  const escape = fixture(); escape.key("Escape"); assert.equal(escape.classes.has("is-dismissed"), true);
  const history = fixture(); history.restore(); assert.equal(history.classes.has("is-dismissed"), true);
});

test("reduced motion has no artificial delay and chapter artwork is deduplicated", async () => {
  const f = fixture({ reduced: true, marked: [], fallback: ["badge.png", "badge.png", "ship.svg"] }); f.ready();
  assert.deepEqual(f.images.map(image => image.src), ["badge.png", "ship.svg"]);
  f.images.forEach(image => image.onload()); await flush(); f.advance(0);
  assert.equal(f.loader.removed, true);
  const empty = fixture({ reduced: true, marked: [] }); empty.ready(); await flush(); empty.advance(0);
  assert.equal(empty.loader.removed, true);
});

test("every homepage and chapter includes the loader with an independent CSS fail-open", () => {
  const root = path.join(__dirname, "..");
  for (const name of fs.readdirSync(root).filter(file => file.endsWith(".html") && !redirects.includes(file))) {
    const html = fs.readFileSync(path.join(root, name), "utf8");
    assert.match(html, /css\/loading-screen\.css/, name);
    assert.match(html, /<body[^>]*>\s*<script src="js\/loading-screen\.js/, name);
  }
  const css = fs.readFileSync(path.join(root, "css/loading-screen.css"), "utf8");
  assert.match(css, /animation: loader-fail-open 0s 5s forwards/);
  assert.match(css, /@keyframes loader-fail-open \{ to \{ visibility: hidden; pointer-events: none; opacity: 0/);
});

test("compatibility redirects stay lightweight and offer working fallback links", () => {
  for (const file of redirects) {
    const html = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    assert.match(html, /window\.location\.replace\(destination\.href\)/, file);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    assert.ok(canonical, file);
    assert.ok(fs.existsSync(path.join(__dirname, "..", canonical[1].split("#")[0])), file);
    assert.ok(html.includes(`<a href="${canonical[1]}">`), file);
    assert.doesNotMatch(html, /loading-screen\.(?:js|css)/, file);
  }
});
