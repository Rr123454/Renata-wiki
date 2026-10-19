"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const htmlFiles = fs.readdirSync(root).filter(file => file.endsWith(".html"));
const retired = [
  "js/body-home.js", "js/contiguous-route.js", "js/space-home.js",
  "js/space-route.js", "js/tissue-route.js", "js/orbit-home.js",
  "js/home-animations.js", "js/immersive-home.js", "css/body-home.css",
  "css/space-home.css", "css/home-animations.css", "css/home-animations-fix.css",
  "css/immersive-home.css", "css/home-compare.css"
];

test("retired homepage renderers and their styles are deleted", () => {
  for (const file of retired) assert.equal(fs.existsSync(path.join(root, file)), false, file);
  const sources = [
    ...htmlFiles,
    ...fs.readdirSync(path.join(root, "js")).filter(file => file.endsWith(".js")).map(file => `js/${file}`)
  ];
  for (const file of sources) {
    const source = read(file);
    for (const obsolete of retired) assert.ok(!source.includes(obsolete), `${file} loads ${obsolete}`);
    assert.doesNotMatch(source, /renderHomePage|class=["'](?:body-home|space-home|home-compare)/, file);
  }
});

test("index is the only homepage and keeps a complete static story", () => {
  assert.deepEqual(htmlFiles.filter(file => /data-page=["']home["']/.test(read(file))), ["index.html"]);
  const html = read("index.html");
  assert.match(html, /class="mission-home" id="siteMain" data-static-content="true"/);
  for (const id of ["launch", "gallbladder", "symptoms", "sulfation", "bile-acids", "engineering-story", "sulflux"]) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
  assert.match(html, /js\/mission-home\.js/);
  assert.doesNotMatch(html, /home-compare|flight-compare|home-orbit\.html/);
});

test("all page scripts and styles resolve after removing the old homepage", () => {
  for (const file of htmlFiles) {
    if (read(file).includes('src="js/site.js?')) {
      assert.match(read(file), /src="js\/site\.js\?v=20261019-shared-header1"/, `${file} reloads the shared renderer`);
    }
    for (const match of read(file).matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)) {
      const resource = match[1].split(/[?#]/)[0];
      if (!resource || /^(?:https?:|data:|\/\/)/.test(resource)) continue;
      assert.ok(fs.existsSync(path.join(root, resource)), `${file}: ${resource}`);
      assert.ok(!retired.includes(resource), `${file}: ${resource}`);
    }
  }
});

test("static and generated navigation cannot link to an alternate homepage", () => {
  const context = { window: {} };
  vm.runInNewContext(read("js/site-content.js"), context);
  const { render } = require("../js/navigation.js");
  const { heroMarkup, pageChapter } = require("../js/orbit-pages.js");
  const sources = htmlFiles.map(file => [file, read(file)]);
  for (const [key, page] of Object.entries(context.window.SITE_DATA.pages)) {
    sources.push([`${key} navigation`, render(context.window.SITE_DATA.nav, { pageKey: key, group: page.group, orbit: key === "home" })]);
    if (key !== "home") sources.push([`${key} breadcrumb`, heroMarkup(pageChapter(key, page), "title", page.title, [])]);
  }
  for (const [name, html] of sources) {
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      assert.doesNotMatch(match[1], /(?:^|\/)(?:home(?:[-_][^/?#]*)?|index[-_][^/?#]+)\.html(?:[?#]|$)/i, `${name}: ${match[1]}`);
    }
  }
});

test("unknown page templates redirect to the canonical homepage without rendering stale home data", () => {
  for (const page of [undefined, "old-home"]) {
    const destinations = [];
    vm.runInNewContext(read("js/site.js"), {
      document: { body: { dataset: { page } } },
      window: {
        SITE_DATA: { pages: { home: { title: "Home", group: "home" } } },
        location: { replace: target => destinations.push(target) }
      }
    });
    assert.deepEqual(destinations, ["index.html"]);
  }
  assert.doesNotMatch(read("js/site.js"), /\|\|\s*data\.pages\.home/);
});

test("old bookmarks resolve to the current homepage without an alternate screen", () => {
  const old = read("home-orbit.html");
  assert.doesNotMatch(old, /<script src=|<link rel="stylesheet"|data-page=|mission-launch/);
  const redirect = old.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const source of ["http://localhost:8080/home-orbit.html", "http://localhost:8080/home-orbit.html?preview=current#gallbladder"]) {
    const url = new URL(source), destinations = [];
    vm.runInNewContext(redirect, { URL, window: { location: {
      href: source, search: url.search, hash: url.hash,
      replace: target => destinations.push(target)
    } } });
    assert.deepEqual(destinations, [source.replace("home-orbit.html", "index.html")]);
  }
});

test("the supported preview instructions offer only the current homepage", () => {
  const launch = JSON.parse(read(".vscode/launch.json").replace(/^\s*\/\/.*$/gm, ""));
  assert.deepEqual(launch.configurations.map(config => config.url), ["http://localhost:8080/index.html"]);
  assert.doesNotMatch(read("assets/homepage-concept.md"), /Home 01|Home 02|Compare Renata|alternate homepage’s|original homepage/);
  assert.match(read("assets/story/README.md"), /included directly in `index\.html`/);
});
