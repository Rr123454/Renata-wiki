"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { render, header, init } = require("../js/navigation.js");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = { window: {} };
vm.runInNewContext(read("js/site-content.js"), context);
const data = context.window.SITE_DATA;
const redirects = {
  "engineering.html": "project-description.html",
  "home-orbit.html": "index.html",
  "experiments.html": "wet-lab.html",
  "experiment-enzyme-design.html": "model.html",
  "experiment-enzyme-design-notebook.html": "model.html",
  "experiment-enzyme-design-protocols.html": "model.html"
};

test("every content page loads the shared menu in order, including the flight homepage", () => {
  for (const file of fs.readdirSync(root).filter(file => file.endsWith(".html") && !(file in redirects))) {
    const html = read(file);
    const scripts = [...html.matchAll(/<script src="([^"?]+)/g)].map(match => match[1]);
    const navigation = scripts.indexOf("js/navigation.js");
    assert.ok(navigation > scripts.indexOf("js/site-content.js"), file);
    assert.ok(scripts.indexOf("js/site-content.js") >= 0, file);
    assert.ok(navigation >= 0, file);
    const consumer = scripts.indexOf("js/site.js");
    assert.ok(navigation < consumer, file);
    assert.match(html, /css\/navigation.css/, file);
    if (file === "index.html") assert.ok(consumer < scripts.indexOf("js/mission-home.js"));
  }
  assert.doesNotMatch(render(data.nav), /home-orbit\.html|href="experiments\.html"/);
});

test("Home is the first shared navigation link and marks the current homepage", () => {
  assert.equal(data.nav[0].key, "home");
  assert.match(render(data.nav), /href="index\.html" aria-current="page">Home<\/a>/);
  assert.match(render(data.nav, {pageKey:"team", group:"team"}), /href="index\.html">Home<\/a>/);
  assert.match(header(data, { pageKey: "home", group: "home" }), /class="brand" aria-label="iGEM Renata, homepage"/);
  assert.match(read("index.html"), /href="index\.html" aria-current="page">Home<\/a>/);
});

test("retired routes have explicit compatibility redirects and useful fallback links", () => {
  for (const [file, target] of Object.entries(redirects)) {
    const html = read(file);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    assert.ok(canonical, file);
    assert.equal(canonical[1].split("#")[0], target, file);
    assert.ok(fs.existsSync(path.join(root, target)), target);
    assert.match(html, /window\.location\.replace\(destination\.href\)/, file);
    assert.match(html, /destination\.search = window\.location\.search/, file);
    assert.ok([...html.matchAll(/<a href="([^"]+)"/g)].some(match => match[1].split("#")[0] === target), file);
    assert.doesNotMatch(html, /src="js\/(?:navigation|site)\.js/, file);
  }
});

test("every content page shows the shared logo, brand, and labels with no icons in the bar", () => {
  for (const file of fs.readdirSync(root).filter(file => file.endsWith(".html") && !(file in redirects))) {
    const html = read(file);
    assert.match(html, /<header class="[^"]*site-header[^\"]*" id="siteHeader"/, file);
    const key = html.match(/data-page="([^"]+)"/)[1];
    const markup = header(data, { pageKey: key, group: data.pages[key]?.group });
    assert.match(markup, /aria-label="iGEM Renata, homepage"/);
    assert.match(markup, /src="assets\/logo.png"/);
    assert.match(markup, /class="brand-text">iGEM Renata<\/span>/);
    assert.match(markup, /id="renata-nav-list">/);
    assert.doesNotMatch(markup, /renata-nav-shortcut|Explore this section|Explore Renata/, file);
    assert.doesNotMatch(markup, /flight-brand|Begin journey|<span>Menu<\/span>|<h1/);
  }
  assert.match(read("js/site.js"), /RenataNavigation\.header\(data/);
  assert.doesNotMatch(read("index.html"), /flight-brand|flight-header-actions|id="flightHeader"/);
});

test("the collapsed menu is a three-bar toggle and panels open under their own trigger", () => {
  const markup = render(data.nav);
  assert.match(markup, /<button class="renata-nav-toggle" type="button" aria-expanded="false" aria-controls="renata-nav-list" aria-label="Menu">/);
  assert.match(markup, /class="renata-nav-bars"/);
  const navigationCss = read("css/navigation.css");
  assert.match(navigationCss, /\.renata-nav \.renata-nav-panel \{[^}]*left: var\(--nav-panel-left, auto\)/);
  assert.match(navigationCss, /\.renata-nav\[data-nav-open="false"\] \.renata-nav-list \{ display: none; \}/);
  assert.match(navigationCss, /\.renata-nav-bars::before \{ top: -6px; \}/);
  const headerCss = read("css/site-header.css");
  assert.match(headerCss, /#siteHeader \.renata-nav-panel \{[^}]*left: var\(--nav-panel-left, auto\); right: auto;/);
  assert.match(headerCss, /@media \(max-width: 980px\)/);
  assert.doesNotMatch(headerCss, /renata-nav-shortcut|renata-nav-row/);
  assert.match(headerCss, /--header-blue: #173e84;/);
  assert.match(headerCss, /--header-cream: #fff1bc;/);
  assert.match(headerCss, /min-height: 44px/);
});

test("Team is a direct link while Project, Lab Work, and Engagement have dropdowns", () => {
  const flat = Array.from(data.nav).filter(item => !item.children);
  assert.deepEqual(Array.from(flat, item => item.key), ["home", "team"]);
  assert.deepEqual(Array.from(flat, item => item.href), ["index.html", "team.html"]);
  assert.equal(flat.every(item => !item.icon), true, "direct labels carry no icon of their own");
  const grouped = Array.from(data.nav).filter(item => item.children);
  assert.deepEqual(Array.from(grouped, item => item.key), ["project", "lab-work", "engagement"]);
  const markup = render(data.nav);
  assert.equal([...markup.matchAll(/class="renata-nav-panel"/g)].length, 3, "all three grouped labels render a panel");
  assert.match(markup, /<li><a class="renata-nav-trigger" href="team.html">Our Team<\/a><\/li>/);
  assert.deepEqual(Array.from(data.nav.find(item => item.key === "project").children, child => [child.label, child.href]), [
    ["Engineering", "project-description.html#engineering"], ["The Problem", "project-description.html#abstract"]
  ]);
});

test("dropdown cards carry the section icons that used to sit in the menu bar", () => {
  const markup = render(data.nav);
  const lab = data.nav.find(item => item.key === "lab-work");
  assert.deepEqual(Array.from(lab.children, child => child.icon), ["DNA", "DNA", "Stomach"]);
  for (const child of lab.children) {
    assert.ok(markup.includes(`assets/nav-icons/${child.icon}.png`), child.icon);
  }
  const icons = new Set([...markup.matchAll(/src="([^"]+)"/g)].map(match => match[1]));
  assert.equal(icons.size, 4, "the dropdown destinations reuse four local badges");
  let bytes = 0;
  for (const icon of icons) {
    const png = fs.readFileSync(path.join(root, icon));
    assert.equal(png.readUInt32BE(16), 192, icon);
    assert.equal(png.readUInt32BE(20), 192, icon);
    assert.equal(png[25], 6, "RGBA retains transparency");
    bytes += png.length;
  }
  assert.ok(bytes < 100000, "all menu badges together stay below 100 KB");
  for (const match of markup.matchAll(/href="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(root, match[1].split("#")[0])), match[1]);
});

test("Notebook is an independent Lab Work destination with its own current-page marker", () => {
  const lab = data.nav.find(item => item.key === "lab-work");
  assert.deepEqual(Array.from(lab.children, item => item.key), ["wet-lab", "wet-lab-notebook", "model"]);
  assert.equal(lab.children.every(child => !child.children), true);
  const markup = render(data.nav, { pageKey: "wet-lab-notebook", group: "lab-work" });
  assert.match(markup, /href="wet-lab-notebook.html" aria-current="page"/);
  assert.doesNotMatch(markup, /is-section" href="wet-lab.html"|renata-nav-subpages/);
});

test("the sponsor navigation card stays out while the footer carousel data is intact", () => {
  assert.doesNotMatch(render(data.nav), /Sponsors &amp; partners|The community supporting our work|sponsors-partners/);
  assert.equal(data.sponsorsPartners.length, 3);
  assert.match(read("js/site.js"), /id="sponsors-partners"/);
  assert.ok(data.pages.team.teamGroups.some(group => group.key === "mentors"));
});

test("active pages and related records stay distinct, and labels are escaped", () => {
  const html = render(data.nav, { pageKey: "experiment-assembly-protocols", group: "lab-work" });
  assert.match(html, /renata-nav-trigger is-active[^>]+id="renata-nav-lab-work-trigger"/);
  assert.match(html, /renata-nav-card is-section" href="wet-lab.html"/);
  assert.doesNotMatch(html, /aria-current="page"/);
  const current = render(data.nav, { pageKey: "project-description", group: "project" });
  assert.equal([...current.matchAll(/aria-current="page"/g)].length, 1);
  assert.match(current, /href="project-description.html#engineering" aria-current="page"/);
  assert.doesNotMatch(current, /href="engineering\.html(?:[?#][^"]*)?"/);
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
  const nav = new Element("nav", { class: "renata-nav" }, doc);
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
  const list = nav.querySelector(".renata-nav-list");
  const toggle = nav.querySelector(".renata-nav-toggle");
  const links = nav.querySelectorAll(".renata-nav-trigger").filter(node => node.tag === "a");
  return { nav, doc, groups, triggers, panels, list, toggle, links, outside, mobile, tick };
}

test("click toggles menus, opens only one, and outside clicks dismiss", () => {
  const f = fixture();
  assert.equal(f.triggers.length, 3, "Project, Lab Work, and Engagement are dropdowns");
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
  f.triggers[0].focus();
  f.triggers[0].emit("keydown", { key: "ArrowDown" });
  const links = f.panels[0].querySelectorAll("a");
  assert.ok(links.length > 1, "Project has multiple destinations to navigate");
  assert.equal(f.doc.activeElement, links[0]);
  links[0].emit("keydown", { key: "ArrowDown" });
  assert.equal(f.doc.activeElement, links[1]);
  links[1].emit("keydown", { key: "Escape" });
  assert.equal(f.doc.activeElement, f.triggers[0]);
  assert.equal(f.panels[0].hidden, true);
  f.triggers[1].emit("keydown", { key: "ArrowUp" });
  assert.equal(f.doc.activeElement, f.panels[1].querySelectorAll("a").at(-1));
  f.outside.focus(); f.tick();
  assert.ok(f.panels.every(panel => panel.hidden));
});

test("arrow keys move across direct labels and dropdown triggers alike", () => {
  const f = fixture();
  assert.deepEqual(f.links.map(link => link.getAttribute("href")), ["index.html", "team.html"]);
  f.links[0].emit("keydown", { key: "ArrowRight" });
  assert.equal(f.doc.activeElement, f.links[1]);
  f.links[1].emit("keydown", { key: "ArrowRight" });
  assert.equal(f.doc.activeElement, f.triggers[0]);
  f.links[0].emit("keydown", { key: "ArrowLeft" });
  assert.equal(f.doc.activeElement, f.triggers[2], "focus wraps to the last trigger");
});

test("Lab Work lists Wetlab, Notebook, and Model, each reachable by keyboard", () => {
  const f = fixture();
  const labIndex = f.triggers.findIndex(trigger => trigger.getAttribute("id") === "renata-nav-lab-work-trigger");
  const trigger = f.triggers[labIndex];
  trigger.focus(); trigger.emit("keydown", { key: "ArrowDown" });
  const links = f.panels[labIndex].querySelectorAll("a");
  assert.deepEqual(links.map(link => link.getAttribute("href")), ["wet-lab.html", "wet-lab-notebook.html", "model.html"]);
  assert.equal(f.panels[labIndex].querySelectorAll("img").length, 3, "icons now live on the dropdown cards");
  links[0].emit("keydown", { key: "End" });
  assert.equal(f.doc.activeElement, links[2]);
  links[2].emit("keydown", { key: "Home" });
  assert.equal(f.doc.activeElement, links[0]);
});

test("hover has intent delay, can be pinned by click, and never steals keyboard focus", () => {
  const f = fixture();
  f.triggers[0].emit("pointerenter", { pointerType: "mouse" });
  assert.equal(f.panels[0].hidden, true);
  f.tick(120);
  assert.equal(f.panels[0].hidden, false);
  f.outside.emit("keydown", { key: "Escape" });
  assert.equal(f.panels[0].hidden, true, "Escape also dismisses a hover-only menu");
  f.triggers[0].emit("pointerenter", { pointerType: "mouse" }); f.tick();
  f.triggers[0].emit("click");
  f.groups[0].emit("pointerleave"); f.tick();
  assert.equal(f.panels[0].hidden, false, "click pins the hover-open menu");
  f.triggers[0].emit("click");
  f.triggers[1].focus(); f.triggers[1].emit("keydown", { key: "ArrowDown" });
  const link = f.doc.activeElement;
  f.triggers[0].emit("pointerenter", { pointerType: "mouse" }); f.tick();
  assert.equal(f.doc.activeElement, link);
  assert.equal(f.panels[1].hidden, false);
});

test("the three-bar toggle collapses and restores the menu on small screens", () => {
  const f = fixture(true);
  assert.ok(f.toggle, "a toggle is rendered");
  assert.equal(f.nav.dataset.navOpen, "false", "the menu starts collapsed");
  assert.equal(f.toggle.getAttribute("aria-expanded"), "false");
  assert.equal(f.toggle.getAttribute("aria-controls"), "renata-nav-list");
  assert.equal(f.list.getAttribute("id"), "renata-nav-list");
  f.toggle.emit("click");
  assert.equal(f.nav.dataset.navOpen, "true");
  assert.equal(f.toggle.getAttribute("aria-expanded"), "true");
  f.triggers[0].emit("pointerenter", { pointerType: "touch" }); f.tick();
  assert.equal(f.panels[0].hidden, true, "touch never hover-opens a section");
  f.triggers[0].emit("click");
  assert.equal(f.panels[0].hidden, false);
  f.triggers[0].emit("keydown", { key: "Escape" });
  assert.equal(f.nav.dataset.navOpen, "true", "Escape closes only the section");
  f.triggers[0].emit("keydown", { key: "Escape" });
  assert.equal(f.nav.dataset.navOpen, "false", "a second Escape closes the whole menu");
});

test("choosing a destination or tapping away closes the collapsed menu", () => {
  const f = fixture(true);
  f.toggle.emit("click");
  f.triggers[0].emit("click");
  const link = f.panels[0].querySelector("a");
  link.focus(); link.emit("click");
  assert.equal(f.nav.dataset.navOpen, "false");
  assert.equal(f.panels[0].hidden, true);
  f.toggle.emit("click");
  f.outside.emit("pointerdown");
  assert.equal(f.nav.dataset.navOpen, "false");
  f.toggle.emit("click");
  f.mobile.matches = false; f.mobile.change();
  assert.equal(f.nav.dataset.navOpen, "false", "widening the viewport resets the collapsed state");
});

test("desktop labels remain visible while Escape and outside clicks close panels", () => {
  const f = fixture();
  assert.equal(f.list.hidden, false);
  f.triggers[0].emit("keydown", { key: "ArrowDown" });
  f.doc.activeElement.emit("keydown", { key: "Escape" });
  assert.equal(f.panels[0].hidden, true);
  assert.equal(f.list.hidden, false);
  assert.equal(f.doc.activeElement, f.triggers[0]);
  f.triggers[0].emit("keydown", { key: "ArrowDown" });
  f.outside.emit("pointerdown");
  assert.equal(f.panels[0].hidden, true);
  assert.equal(f.doc.activeElement, f.triggers[0]);
  assert.equal(f.list.hidden, false);
  f.triggers[0].emit("click");
  f.list.emit("scroll");
  assert.ok(f.panels.every(panel => panel.hidden));
});
