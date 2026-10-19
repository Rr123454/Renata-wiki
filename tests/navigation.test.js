"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { render, init } = require("../js/navigation.js");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = { window: {} };
vm.runInNewContext(read("js/site-content.js"), context);
const data = context.window.SITE_DATA;

test("every page loads the shared menu in order, including the flight homepage", () => {
  for (const file of fs.readdirSync(root).filter(file => file.endsWith(".html"))) {
    const html = read(file);
    const scripts = [...html.matchAll(/<script src="([^"?]+)/g)].map(match => match[1]);
    const navigation = scripts.indexOf("js/navigation.js");
    assert.ok(navigation > scripts.indexOf("js/site-content.js"), file);
    assert.ok(scripts.indexOf("js/site-content.js") >= 0, file);
    assert.ok(navigation >= 0, file);
    const consumer = scripts.indexOf(file === "home-orbit.html" ? "js/mission-home.js" : "js/site.js");
    assert.ok(navigation < consumer, file);
    assert.match(html, /css\/navigation.css/, file);
  }
  assert.match(render(data.nav, { orbit: true }), /href="home-orbit.html" aria-current="page"/);
});

test("all six supplied badges use small transparent PNGs and links have real destinations", () => {
  const html = render(data.nav);
  const icons = new Set([...html.matchAll(/src="([^"]+)"/g)].map(match => match[1]));
  assert.equal(icons.size, 6);
  let bytes = 0;
  for (const icon of icons) {
    const png = fs.readFileSync(path.join(root, icon));
    assert.equal(png.readUInt32BE(16), 192, icon);
    assert.equal(png.readUInt32BE(20), 192, icon);
    assert.equal(png[25], 6, "RGBA retains transparency");
    bytes += png.length;
  }
  assert.ok(bytes < 100000, "all menu badges together stay below 100 KB");
  for (const match of html.matchAll(/href="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(root, match[1].split("#")[0])), match[1]);
  assert.match(read("js/site.js"), /id="sponsors-partners"/);
  assert.ok(data.pages.team.teamGroups.some(group => group.key === "mentors"));
});

test("active pages and related records stay distinct, and labels are escaped", () => {
  const html = render(data.nav, { pageKey: "experiment-assembly-protocols", group: "lab-work" });
  assert.match(html, /renata-nav-trigger is-active[^>]+id="renata-nav-lab-work-trigger"/);
  assert.match(html, /renata-nav-card is-section" href="experiment-assembly.html"/);
  assert.doesNotMatch(html, /aria-current="page"/);
  const current = render(data.nav, { pageKey: "engineering", group: "project" });
  assert.equal([...current.matchAll(/aria-current="page"/g)].length, 1);
  assert.match(current, /href="engineering.html" aria-current="page"/);
  assert.match(render([{ key: "home", href: "index.html", label: '<script>"&' }]), /&lt;script&gt;&quot;&amp;/);
});

// A small DOM fixture runs the actual controller against its rendered markup.
// It models events, focus, hidden state, and media changes without a browser dependency.
function fixture(isMobile = false) {
  let doc;
  class Element {
    constructor(tag, attrs = {}, parent = null) {
      this.tag = tag; this.attrs = attrs; this.parent = parent;
      this.children = []; this.events = {}; this.dataset = {};
      this.hidden = "hidden" in attrs;
      if (parent) parent.children.push(this);
    }
    get ownerDocument() { return doc; }
    getAttribute(name) { return this.attrs[name] ?? null; }
    setAttribute(name, value) { this.attrs[name] = value; }
    matches(selector) { return selector[0] === "." ? (this.attrs.class || "").split(" ").includes(selector.slice(1)) : this.tag === selector; }
    contains(target) { return target === this || this.children.some(child => child.contains(target)); }
    closest(selector) { return this.matches(selector) ? this : this.parent?.closest(selector); }
    querySelectorAll(selector) { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    addEventListener(type, handler) { (this.events[type] ||= []).push(handler); }
    emit(type, options = {}) {
      const event = { type, target: this, preventDefault() { this.defaultPrevented = true; }, ...options };
      for (let node = this; node; node = ["pointerenter", "pointerleave", "focus"].includes(type) ? null : node.parent) {
        (node.events[type] || []).forEach(handler => handler(event));
      }
      return event;
    }
    focus() { const previous = doc.activeElement; doc.activeElement = this; previous?.emit("focusout"); this.emit("focus"); }
  }
  doc = new Element("document");
  const nav = new Element("nav", {}, doc);
  let parent = nav;
  for (const match of render(data.nav).matchAll(/<(\/?)([a-z]+)([^>]*)>/g)) {
    if (match[1]) { parent = parent.parent; continue; }
    const attrs = Object.fromEntries([...match[3].matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(attr => [attr[1], attr[2] ?? ""]));
    const element = new Element(match[2], attrs, parent);
    if (match[2] !== "img") parent = element;
  }
  const outside = new Element("button", {}, doc);
  doc.activeElement = outside;
  let clock = 0, serial = 0;
  const timers = new Map();
  const mobile = { matches: isMobile, addEventListener(type, handler) { this.change = handler; } };
  const win = {
    matchMedia(query) { return query.includes("max-width") ? mobile : { matches: true }; },
    setTimeout(fn, delay) { const id = ++serial; timers.set(id, { fn, at: clock + delay }); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  function tick(ms = 1000) {
    clock += ms;
    for (const [id, timer] of timers) if (timer.at <= clock) { timers.delete(id); timer.fn(); }
  }
  init(nav, win);
  const groups = nav.querySelectorAll(".renata-nav-group");
  const triggers = groups.map(group => group.querySelector("button"));
  const panels = groups.map(group => group.querySelector(".renata-nav-panel"));
  const toggle = nav.querySelector(".renata-nav-toggle");
  const list = nav.querySelector(".renata-nav-list");
  return { nav, doc, groups, triggers, panels, toggle, list, outside, mobile, tick };
}

test("click toggles menus, opens only one, and outside clicks dismiss", () => {
  const f = fixture();
  f.triggers[0].emit("click");
  assert.equal(f.panels[0].hidden, false);
  assert.equal(f.triggers[0].getAttribute("aria-expanded"), "true");
  f.triggers[0].emit("click");
  assert.equal(f.panels[0].hidden, true);
  f.triggers[0].emit("click");
  f.triggers[1].emit("click");
  assert.equal(f.panels[0].hidden, true);
  assert.equal(f.panels[1].hidden, false);
  f.outside.emit("pointerdown");
  assert.ok(f.panels.every(panel => panel.hidden));
});

test("keyboard opens links, navigates, and Escape returns focus to its trigger", () => {
  const f = fixture();
  f.triggers[1].focus();
  f.triggers[1].emit("keydown", { key: "ArrowDown" });
  const links = f.panels[1].querySelectorAll("a");
  assert.equal(f.doc.activeElement, links[0]);
  links[0].emit("keydown", { key: "ArrowDown" });
  assert.equal(f.doc.activeElement, links[1]);
  links[1].emit("keydown", { key: "Escape" });
  assert.equal(f.doc.activeElement, f.triggers[1]);
  assert.equal(f.panels[1].hidden, true);
  f.triggers[1].emit("keydown", { key: "ArrowRight" });
  assert.equal(f.doc.activeElement, f.triggers[2]);
  f.triggers[2].emit("keydown", { key: "ArrowUp" });
  assert.equal(f.doc.activeElement, f.panels[2].querySelectorAll("a").at(-1));
  f.outside.focus(); f.tick();
  assert.ok(f.panels.every(panel => panel.hidden));
});

test("hover has intent delay, can be pinned by click, and never steals keyboard focus", () => {
  const f = fixture();
  f.groups[0].emit("pointerenter", { pointerType: "mouse" });
  assert.equal(f.panels[0].hidden, true);
  f.tick(120);
  assert.equal(f.panels[0].hidden, false);
  f.outside.emit("keydown", { key: "Escape" });
  assert.equal(f.panels[0].hidden, true, "Escape also dismisses a hover-only menu");
  f.groups[0].emit("pointerenter", { pointerType: "mouse" }); f.tick();
  f.triggers[0].emit("click");
  f.groups[0].emit("pointerleave"); f.tick();
  assert.equal(f.panels[0].hidden, false, "click pins the hover-open menu");
  f.triggers[0].emit("click");
  f.triggers[1].focus(); f.triggers[1].emit("keydown", { key: "ArrowDown" });
  const link = f.doc.activeElement;
  f.groups[2].emit("pointerenter", { pointerType: "mouse" }); f.tick();
  assert.equal(f.doc.activeElement, link);
  assert.equal(f.panels[1].hidden, false);
});

test("mobile disclosure, touch, anchor selection, and resize preserve usable focus", () => {
  const f = fixture(true);
  assert.equal(f.list.hidden, true);
  f.toggle.emit("click");
  assert.equal(f.list.hidden, false);
  f.groups[0].emit("pointerenter", { pointerType: "touch" }); f.tick();
  assert.equal(f.panels[0].hidden, true);
  f.triggers[0].emit("click");
  const link = f.panels[0].querySelector("a");
  link.focus(); link.emit("click");
  assert.equal(f.list.hidden, true);
  assert.equal(f.doc.activeElement, f.toggle);
  f.toggle.emit("click"); f.triggers[0].emit("click");
  f.triggers[0].emit("keydown", { key: "Escape" });
  assert.equal(f.list.hidden, false, "first Escape closes the section");
  f.triggers[0].emit("keydown", { key: "Escape" });
  assert.equal(f.list.hidden, true, "second Escape closes the mobile navigation");
  f.mobile.matches = false; f.mobile.change();
  assert.equal(f.list.hidden, false);
  assert.equal(f.doc.activeElement, f.nav.querySelector(".renata-nav-trigger"));
});
