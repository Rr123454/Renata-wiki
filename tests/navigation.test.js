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
  "wet-lab-notebook.html": "wet-lab.html",
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
    assert.match(html, /js\/site-content\.js\?v=20261019-project-top1/, file);
    assert.ok(navigation >= 0, file);
    const consumer = scripts.indexOf("js/site.js");
    assert.ok(navigation < consumer, file);
    assert.match(html, /css\/navigation.css/, file);
    if (file === "index.html") assert.ok(consumer < scripts.indexOf("js/mission-home.js"));
  }
  assert.match(render(data.nav, { pageKey: "home", orbit: true }), /href="index.html" aria-current="page"/);
  assert.doesNotMatch(render(data.nav), /home-orbit\.html|href="experiments\.html"/);
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

test("every content page shows the shared logo, brand, labels, and icon shortcuts", () => {
  for (const file of fs.readdirSync(root).filter(file => file.endsWith(".html") && !(file in redirects))) {
    const html = read(file);
    assert.match(html, /<header class="[^"]*site-header[^\"]*" id="siteHeader"/, file);
    assert.match(html, /css\/site-header\.css\?v=20261019-icon-bar1/, file);
    assert.match(html, /js\/navigation\.js\?v=20261019-icon-bar1/, file);
    assert.ok(html.includes("js/site.js?v=20261019-shared-header1"), file);
    const key = html.match(/data-page="([^"]+)"/)[1];
    const markup = header(data, { pageKey: key, group: data.pages[key]?.group });
    assert.match(markup, /aria-label="iGEM Renata, homepage"/);
    assert.match(markup, /src="assets\/logo.png"/);
    assert.match(markup, /class="brand-text">iGEM Renata<\/span>/);
    assert.match(markup, /id="renata-nav-list">/);
    assert.doesNotMatch(markup, /renata-nav-toggle|Explore Renata/);
    assert.equal([...markup.matchAll(/class="renata-nav-shortcut(?: is-current)?"/g)].length, 8);
    assert.doesNotMatch(markup, /flight-brand|Begin journey|<span>Menu<\/span>|<h1/);
  }
  assert.match(read("js/site.js"), /RenataNavigation\.header\(data/);
  assert.doesNotMatch(read("index.html"), /flight-brand|flight-header-actions|id="flightHeader"/);
  const css = read("css/site-header.css");
  assert.match(css, /#siteHeader \.header-inner\s*\{[^}]*align-items: center;[^}]*flex-wrap: nowrap;/);
  assert.match(css, /--header-blue: #173e84;/);
  assert.match(css, /--header-cream: #fff1bc;/);
  assert.match(css, /max-height: calc\(100dvh - var\(--nav-panel-top, 88px\) - 16px\)/);
  assert.match(css, /overflow-x: auto/);
  assert.match(css, /min-height: 44px/);
});

test("all five navigation badges use small transparent PNGs and links have real destinations", () => {
  const html = render(data.nav);
  const icons = new Set([...html.matchAll(/src="([^"]+)"/g)].map(match => match[1]));
  assert.equal(icons.size, 5);
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

test("the sponsor navigation card is removed while the footer carousel data stays intact", () => {
  const team = data.nav.find(item => item.key === "team");
  assert.deepEqual(Array.from(team.children, item => item.key), ["team", "mentors"]);
  assert.doesNotMatch(render(data.nav), /Sponsors &amp; partners|The community supporting our work|sponsors-partners/);
  assert.equal(data.sponsorsPartners.length, 3);
  assert.match(read("js/site.js"), /id="sponsors-partners"/);
});

test("active pages and related records stay distinct, and labels are escaped", () => {
  const html = render(data.nav, { pageKey: "experiment-assembly-protocols", group: "lab-work" });
  assert.match(html, /renata-nav-trigger is-active[^>]+id="renata-nav-lab-work-trigger"/);
  assert.match(html, /renata-nav-card is-section" href="wet-lab.html"/);
  assert.doesNotMatch(html, /aria-current="page"/);
  const current = render(data.nav, { pageKey: "project-description", group: "project" });
  assert.equal([...current.matchAll(/aria-current="page"/g)].length, 1);
  assert.match(current, /href="project-description.html" aria-current="page"/);
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
  const list = nav.querySelector(".renata-nav-list");
  return { nav, doc, groups, triggers, panels, list, outside, mobile, tick };
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
  f.triggers[2].focus();
  f.triggers[2].emit("keydown", { key: "ArrowDown" });
  const links = f.panels[2].querySelectorAll("a");
  assert.ok(links.length > 1, "Lab Work has multiple destinations to navigate");
  assert.equal(f.doc.activeElement, links[0]);
  links[0].emit("keydown", { key: "ArrowDown" });
  assert.equal(f.doc.activeElement, links[1]);
  links[1].emit("keydown", { key: "Escape" });
  assert.equal(f.doc.activeElement, f.triggers[2]);
  assert.equal(f.panels[2].hidden, true);
  f.triggers[2].emit("keydown", { key: "ArrowRight" });
  assert.equal(f.doc.activeElement, f.triggers[3]);
  f.triggers[3].emit("keydown", { key: "ArrowUp" });
  assert.equal(f.doc.activeElement, f.panels[3].querySelectorAll("a").at(-1));
  f.outside.focus(); f.tick();
  assert.ok(f.panels.every(panel => panel.hidden));
});

test("both Project options open the combined page from the top with wrapping keyboard navigation", () => {
  const f = fixture();
  const projectIndex = f.triggers.findIndex(trigger => trigger.getAttribute("id") === "renata-nav-project-trigger");
  const trigger = f.triggers[projectIndex];
  trigger.focus(); trigger.emit("keydown", { key: "ArrowDown" });
  const links = f.panels[projectIndex].querySelectorAll("a");
  assert.deepEqual(links.map(link => link.getAttribute("href")), ["project-description.html", "project-description.html"]);
  const shortcuts = f.groups[projectIndex].querySelectorAll(".renata-nav-shortcut");
  assert.deepEqual(shortcuts.map(link => link.getAttribute("href")), ["project-description.html", "project-description.html"]);
  const footer = data.pages.home.linkColumns.find(column => column.title === "Our Project");
  assert.deepEqual(Array.from(footer.links, link => link.href), ["project-description.html", "project-description.html"]);
  assert.equal(f.doc.activeElement, links[0]);
  links[0].emit("keydown", { key: "ArrowDown" });
  assert.equal(f.doc.activeElement, links[1]);
  links[1].emit("keydown", { key: "ArrowDown" });
  assert.equal(f.doc.activeElement, links[0], "the last destination wraps to Abstract");
  links[0].emit("keydown", { key: "Escape" });
  assert.equal(f.doc.activeElement, trigger);
  assert.equal(f.panels[projectIndex].hidden, true);
});

test("Wetlab owns the nested Notebook link while Model remains a sibling destination", () => {
  const lab = data.nav.find(item => item.key === "lab-work");
  assert.deepEqual(Array.from(lab.children, item => item.key), ["wet-lab", "model"]);
  assert.deepEqual(Array.from(lab.children[0].children, item => item.key), ["wet-lab-notebook"]);
  const current = render(data.nav, { pageKey: "wet-lab-notebook", group: "lab-work" });
  assert.match(current, /renata-nav-card is-section" href="wet-lab.html"/);
  assert.match(current, /class="renata-nav-subpages" aria-label="Wetlab pages"/);
  assert.match(current, /href="wet-lab.html#notebook" aria-current="page"/);
  assert.equal([...current.matchAll(/aria-current="page"/g)].length, 1);
  const f = fixture();
  const labIndex = f.triggers.findIndex(trigger => trigger.getAttribute("id") === "renata-nav-lab-work-trigger");
  const trigger = f.triggers[labIndex];
  trigger.focus(); trigger.emit("keydown", { key: "ArrowDown" });
  const links = f.panels[labIndex].querySelectorAll("a");
  assert.deepEqual(links.map(link => link.getAttribute("href")), ["wet-lab.html", "wet-lab.html#notebook", "model.html"]);
  links[0].emit("keydown", { key: "ArrowDown" });
  assert.equal(f.doc.activeElement, links[1], "Notebook participates in the same keyboard sequence");
  links[1].emit("keydown", { key: "End" });
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
  f.triggers[2].emit("pointerenter", { pointerType: "mouse" }); f.tick();
  assert.equal(f.doc.activeElement, link);
  assert.equal(f.panels[1].hidden, false);
});

test("mobile navigation stays visible through touch, anchor selection, and resize", () => {
  const f = fixture(true);
  assert.equal(f.list.hidden, false);
  f.triggers[0].emit("pointerenter", { pointerType: "touch" }); f.tick();
  assert.equal(f.panels[0].hidden, true);
  f.triggers[0].emit("click");
  const link = f.panels[0].querySelector("a");
  link.focus(); link.emit("click");
  assert.equal(f.list.hidden, false);
  assert.equal(f.doc.activeElement, f.triggers[0]);
  assert.equal(f.panels[0].hidden, true);
  f.triggers[0].emit("click");
  f.triggers[0].emit("keydown", { key: "Escape" });
  assert.equal(f.list.hidden, false, "Escape closes only the section");
  f.triggers[0].emit("keydown", { key: "Escape" });
  assert.equal(f.list.hidden, false, "navigation remains directly available");
  f.mobile.matches = false; f.mobile.change();
  assert.equal(f.list.hidden, false);
  assert.equal(f.doc.activeElement, f.triggers[0]);
});

test("desktop labels and icons remain visible while Escape and outside clicks close panels", () => {
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
});

test("each label has direct named icon links outside its dropdown, including Wetlab and Model", () => {
  const f = fixture();
  f.groups.forEach((group, index) => {
    const links = group.querySelectorAll(".renata-nav-shortcut");
    const children = data.nav.filter(item => item.children)[index].children;
    assert.deepEqual(links.map(link => link.getAttribute("href")), Array.from(children, child => child.href));
    links.forEach((link, childIndex) => {
      assert.equal(link.getAttribute("aria-label").replaceAll("&amp;", "&"), children[childIndex].label);
      assert.equal(link.getAttribute("title").replaceAll("&amp;", "&"), children[childIndex].label);
      assert.equal(f.panels[index].contains(link), false);
    });
    assert.equal(f.panels[index].querySelectorAll("img").length, 0, "icons moved out of dropdowns");
  });
  const labIcons = f.groups[2].querySelectorAll(".renata-nav-shortcut");
  assert.deepEqual(labIcons.map(link => link.getAttribute("href")), ["wet-lab.html", "model.html"]);
  f.triggers[0].emit("click");
  labIcons[0].focus();
  assert.ok(f.panels.every(panel => panel.hidden));
  labIcons[0].emit("click");
  assert.equal(f.doc.activeElement, labIcons[0], "direct shortcuts keep their own focus");
  f.triggers[0].emit("click");
  f.list.emit("scroll");
  assert.ok(f.panels.every(panel => panel.hidden));
});
