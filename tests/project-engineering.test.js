"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const renderedPages = new Map();

// Capture the real shared renderer's output; interaction hooks have no nodes here.
function element() {
  return {
    innerHTML: "",
    dataset: {},
    get textContent() { return this.innerHTML.replace(/<[^>]*>/g, ""); },
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {}
  };
}

function renderPage(file) {
  if (renderedPages.has(file)) return renderedPages.get(file);
  const pageKey = read(file).match(/data-page="([^"]+)"/)?.[1];
  assert.ok(pageKey, `Page key for ${file}`);
  const nodes = Object.fromEntries(["siteMain", "siteHeader", "siteFooter"].map(id => [id, element()]));
  const staticMain = read(file).match(/<main\b[^>]*data-static-content="true"[^>]*>([\s\S]*?)<\/main>/);
  if (staticMain) {
    nodes.siteMain.dataset.staticContent = "true";
    nodes.siteMain.innerHTML = staticMain[1];
  }
  const context = vm.createContext({
    document: {
      body: { dataset: { page: pageKey } },
      createElement: element,
      getElementById: id => nodes[id] || null,
      querySelectorAll: () => [],
      querySelector: () => null,
      addEventListener() {}
    },
    window: {
      scrollY: 0, innerWidth: 1440, addEventListener() {},
      // Decoration is exercised separately in orbit-pages.test.js.
      RenataPages: { decorate() {} }
    },
    requestAnimationFrame() {},
    cancelAnimationFrame() {}
  });
  context.window.document = context.document;
  for (const script of [
    "js/site-content.js", "js/project-description-content.js", "js/engineering-content.js",
    "js/project-paper.js", "js/dry-lab-content.js", "js/wet-lab-content.js", "js/wet-lab-notebook-data.js", "js/lab-content.js", "js/navigation.js", "js/site.js"
  ]) vm.runInContext(read(script), context, { filename: script });
  const result = {
    data: context.window.SITE_DATA,
    main: nodes.siteMain.innerHTML,
    header: nodes.siteHeader.innerHTML,
    footer: nodes.siteFooter.innerHTML
  };
  result.html = result.header + result.main + result.footer;
  renderedPages.set(file, result);
  return result;
}

const project = renderPage("project-description.html");
const engineering = project.data.pages["project-description"].engineering;

function anchorHarness({ hash = "#engineering", pageKey = "project-description", readyState = "loading" } = {}) {
  const nodes = Object.fromEntries(["siteMain", "siteHeader", "siteFooter"].map(id => [id, element()]));
  const listeners = new Map();
  const windowListeners = new Map();
  const frames = [];
  const scrolls = [];
  const context = vm.createContext({
    document: {
      readyState,
      body: { dataset: { page: pageKey } },
      createElement: element,
      getElementById: id => nodes[id] || null,
      querySelectorAll: () => [],
      querySelector: () => null,
      addEventListener(type, callback, options) {
        if (!listeners.has(type)) listeners.set(type, []);
        listeners.get(type).push({ callback, once: options?.once });
      }
    },
    window: {
      location: { hash }, scrollY: 0, innerWidth: 1440,
      addEventListener(type, callback) {
        if (!windowListeners.has(type)) windowListeners.set(type, []);
        windowListeners.get(type).push(callback);
      },
      RenataPages: { decorate() {} }
    },
    requestAnimationFrame: callback => frames.push(callback),
    cancelAnimationFrame() {}
  });
  context.window.document = context.document;
  for (const script of ["js/site-content.js", "js/project-description-content.js", "js/engineering-content.js", "js/project-paper.js", "js/dry-lab-content.js", "js/wet-lab-content.js", "js/wet-lab-notebook-data.js", "js/lab-content.js", "js/navigation.js", "js/site.js"]) {
    vm.runInContext(read(script), context, { filename: script });
  }
  return {
    scrolls,
    addTarget(id, detailsDepth = 0) {
      const disclosures = Array.from({ length: detailsDepth }, () => ({ open: false }));
      disclosures.forEach((item, index) => { item.parentElement = { closest: () => disclosures[index + 1] || null }; });
      const target = {
        disclosures, openedAtScroll: false, closest: () => disclosures[0] || null,
        scrollIntoView(options) {
          target.openedAtScroll = disclosures.every(item => item.open);
          scrolls.push({ id, ...options });
        }
      };
      nodes[id] = target;
      return target;
    },
    changeHash(hash) {
      context.window.location.hash = hash;
      for (const callback of windowListeners.get("hashchange") || []) callback();
    },
    flushFrames() { while (frames.length) frames.shift()(); },
    ready() {
      context.document.readyState = "interactive";
      const callbacks = listeners.get("DOMContentLoaded") || [];
      listeners.set("DOMContentLoaded", callbacks.filter(listener => !listener.once));
      for (const listener of callbacks) listener.callback();
    }
  };
}

test("Project Description retains all six engineering records and their provenance", () => {
  const expectedIds = [
    "assembly-design-cycle", "assembly-evidence-map", "enzyme-design-cycle",
    "enzyme-design-revisions", "system-integration-decisions", "measurements-to-model"
  ];
  assert.deepEqual(Array.from(engineering.details, record => record.id), expectedIds);
  const renderedIds = [...project.main.matchAll(/class="project-engineering-record" id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual([...renderedIds].sort(), [...expectedIds].sort());
  assert.equal(renderedIds.length, 6);
  assert.equal((project.main.match(/<details class="project-engineering-record"/g) || []).length, 6);
  for (const record of engineering.details) {
    assert.ok(project.main.includes(record.title));
    assert.ok(project.main.includes(record.note));
  }
  assert.ok(engineering.sourceNote.length > 100);
  assert.ok(project.main.includes(`<p id="engineering-sources">${engineering.sourceNote}</p>`));
});

test("the project opens with Abstract and a Design–Build–Test–Learn cycle", () => {
  const sectionIds = [...project.main.matchAll(/<section class="project-paper-section[^\"]*" id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sectionIds, ["abstract", "engineering"]);
  assert.match(project.main, /<h1 id="project-paper-title">Our Project<\/h1>/);
  const stageIds = [...project.main.matchAll(/<section class="project-dbtl-stage" id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(stageIds, ["design", "build", "test", "learn"]);
  const sidebar = project.main.match(/<nav class="page-outline"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(sidebar, "the page carries a hierarchical On this page outline");
  assert.doesNotMatch(sidebar, /project-sidebar-tab|role="tablist"|Explore this page/);
  // Abstract, then DBTL Cycle with its four stages indented beneath it.
  const destinations = [...sidebar.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(destinations.filter(id => [...sectionIds, ...stageIds].includes(id)), [...sectionIds, ...stageIds]);
  assert.match(sidebar, /data-outline-branch="engineering"/);
  for (const record of engineering.details) assert.ok(destinations.includes(record.id), record.id);
  for (const [stage, title, recordIds] of [
    ["design", "Expression Vector", ["system-integration-decisions", "enzyme-design-cycle"]],
    ["build", "Transformation Experiments", ["assembly-design-cycle", "assembly-evidence-map"]],
    ["test", "Enzyme Characterization Assay", ["measurements-to-model"]],
    ["learn", "Reflections / What We’d Change", ["enzyme-design-revisions"]]
  ]) {
    const start = project.main.indexOf(`class="project-dbtl-stage" id="${stage}"`);
    const nextStage = project.main.indexOf('class="project-dbtl-stage"', start + 1);
    const content = project.main.slice(start, nextStage < 0 ? undefined : nextStage);
    assert.ok(content.includes(title));
    for (const id of recordIds) assert.ok(content.includes(`id="${id}"`), `${id} belongs in ${stage}`);
  }
  assert.match(project.main, /id="dbtl-cycle"/);
});

test("the abstract covers motivation, goal, process, and evidence status without claiming clinical success", () => {
  const abstract = project.data.pages["project-description"].paper.abstract;
  for (const phrase of ["Post-cholecystectomy syndrome", "research goal", "DBTL cycle", "current wet-lab record", "Computational comparisons", "Clinical benefit in PCS has yet to be established"]) assert.ok(abstract.includes(phrase), phrase);
  assert.match(abstract, /Completed transformation, expression, product-formation, and kinetic datasets have yet to be supplied/);
});

test("the expression-vector figure is explicitly labelled as a proposed schematic placeholder", () => {
  assert.match(project.main, /id="figure-expression-vector"/);
  assert.match(project.main, /Schematic placeholder/);
  assert.match(project.main, /Proposed architecture · verified map pending/);
  assert.match(project.main, /Expression-vector image to be added/);
  const figure = project.data.pages["project-description"].paper.vectorFigure;
  assert.ok(!figure.src, "An experimental map must not be invented");
  assert.deepEqual(Array.from(figure.architecture), ["T7 promoter", "RBS", "His6", "SUMO", "ULP1 cleavage site", "BtSULT variant", "Stop / terminators"]);
});

test("Our Project navigation uses the existing project page without a duplicate route", () => {
  const flatten = items => items.flatMap(item => [item, ...flatten(item.children || [])]);
  assert.ok(!Object.hasOwn(project.data.pages, "engineering"));
  assert.ok(flatten(project.data.nav).every(item => item.key !== "engineering"));
  assert.doesNotMatch(project.header + project.footer, /href="engineering\.html(?:[?#][^"]*)?"/);
  assert.match(project.header + project.footer, />\s*Engineering\s*</);
  assert.match(project.header, />\s*Our Project\s*</);
  assert.doesNotMatch(project.header, /renata-nav-project|>\s*Our Lab Work\s*</);
  assert.match(project.header, /href="project-description\.html"/);
  assert.match(project.footer, /href="project-description\.html"/);
  assert.doesNotMatch(project.header + project.footer, /href="project-description\.html#(?:abstract|dbtl-cycle)"/);
});

test("old Engineering URLs replace history while preserving query strings and section anchors", () => {
  const redirectHtml = read("engineering.html");
  const redirectScript = redirectHtml.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
  assert.ok(redirectScript);
  for (const [oldUrl, expectedUrl] of [
    ["http://localhost:8080/engineering.html", "http://localhost:8080/project-description.html#engineering"],
    ["http://localhost:8080/engineering.html?preview=latest", "http://localhost:8080/project-description.html?preview=latest#engineering"],
    ["http://localhost:8080/engineering.html?preview=latest#enzyme-design-revisions", "http://localhost:8080/project-description.html?preview=latest#enzyme-design-revisions"]
  ]) {
    const oldLocation = new URL(oldUrl);
    const redirects = [];
    vm.runInNewContext(redirectScript, {
      URL,
      window: { location: {
        href: oldLocation.href, search: oldLocation.search, hash: oldLocation.hash,
        replace: url => redirects.push(url),
        assign: () => assert.fail("Redirect must replace the obsolete history entry")
      } }
    });
    assert.deepEqual(redirects, [expectedUrl]);
  }
  assert.match(redirectHtml, /<link rel="canonical" href="project-description\.html#engineering"/);
  assert.match(redirectHtml, /<a href="project-description\.html#engineering">/);
});

test("project deep links wait for DOMContentLoaded and a frame before resolving the final layout", () => {
  const harness = anchorHarness({ hash: "#%65ngineering" });
  harness.flushFrames();
  assert.deepEqual(harness.scrolls, []);
  // A later script can finish the document layout before the ready event.
  harness.addTarget("engineering");
  harness.ready();
  assert.deepEqual(harness.scrolls, []);
  harness.flushFrames();
  assert.deepEqual(harness.scrolls, [{ id: "engineering", block: "start", behavior: "instant" }]);
  harness.ready();
  harness.flushFrames();
  assert.equal(harness.scrolls.length, 1, "The initial anchor handler runs once");
});

test("a project page initialized after DOMContentLoaded still resolves its anchor on a frame", () => {
  const harness = anchorHarness({ hash: "#enzyme-design-revisions", readyState: "complete" });
  harness.addTarget("enzyme-design-revisions");
  assert.deepEqual(harness.scrolls, []);
  harness.flushFrames();
  assert.deepEqual(harness.scrolls, [{ id: "enzyme-design-revisions", block: "start", behavior: "instant" }]);
});

test("deep links reveal supporting records before scrolling and respond to later hash changes", () => {
  const harness = anchorHarness({ hash: "#enzyme-design-revisions", readyState: "complete" });
  const target = harness.addTarget("enzyme-design-revisions", 2);
  assert.ok(target.disclosures.every(item => !item.open));
  harness.flushFrames();
  assert.ok(target.openedAtScroll, "Every enclosing details element opens before scrolling");
  const next = harness.addTarget("assembly-evidence-map", 1);
  harness.changeHash("#assembly-evidence-map");
  assert.equal(harness.scrolls.length, 1, "Hash-change scrolling is deferred until the next frame");
  harness.flushFrames();
  assert.ok(next.openedAtScroll);
  assert.equal(harness.scrolls.at(-1).id, "assembly-evidence-map");
});

test("Wetlab, its Notebook, and Model also resolve rendered deep links", () => {
  for (const [pageKey, id] of [["wet-lab", "assembly"], ["wet-lab-notebook", "assay-notebook"], ["model", "corrections"]]) {
    const harness = anchorHarness({ hash: `#${id}`, pageKey, readyState: "complete" });
    harness.addTarget(id);
    harness.flushFrames();
    assert.deepEqual(harness.scrolls, [{ id, block: "start", behavior: "instant" }]);
  }
});

test("empty, malformed, missing, and non-project deep links do not cause an anchor scroll", () => {
  for (const options of [
    { hash: "" }, { hash: "#" }, { hash: "#%E0%A4%A" }, { hash: "#unknown-section" },
    { hash: "#engineering", pageKey: "experiments" }
  ]) {
    const harness = anchorHarness(options);
    harness.addTarget("engineering");
    harness.flushFrames();
    harness.ready();
    harness.flushFrames();
    assert.deepEqual(harness.scrolls, [], JSON.stringify(options));
  }
});

test("Project Description loads the merged data before rendering with refreshed asset versions", () => {
  const html = read("project-description.html");
  const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
  const version = scripts.find(src => src.startsWith("js/site.js?"))?.split("?v=")[1];
  assert.ok(version);
  const required = ["js/site-content.js", "js/project-description-content.js", "js/engineering-content.js", "js/project-paper.js", "js/site.js"];
  const positions = required.map(file => scripts.findIndex(src => src.split("?")[0] === file));
  assert.ok(positions.every(position => position >= 0));
  assert.ok(positions.every((position, index) => index === 0 || position > positions[index - 1]));
  assert.match(html, /css\/project-research\.css\?v=[a-f0-9]{12}/);
  assert.doesNotMatch(html, /(?:home-animations|immersive-home|orbit-pages)\.(?:js|css)/);
  assert.doesNotMatch(project.main, /<video\b|home-scroll|home-orbit/);
  assert.equal(scripts.filter(src => src.startsWith("js/engineering-content.js?")).length, 1);
  const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(match => match[1].split("?")[0]);
  assert.equal(styles.at(-1), "css/project-outline.css");
});

test("rendered IDs are unique and local page links, section anchors, and assets resolve", () => {
  const ids = [...project.html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, raw] of project.html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = raw.replaceAll("&amp;", "&");
    if (/^(?:https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [pathname, fragment] = url.split("#");
    const file = pathname.split("?")[0];
    if (file) assert.ok(fs.existsSync(path.join(root, file)), `Missing local resource: ${url}`);
    if (fragment) {
      const target = file ? renderPage(file).html : project.html;
      assert.ok(target.includes(`id="${fragment}"`), `Missing local anchor: ${url}`);
    }
  }
});

test("merged engineering preserves source 1 and the distinction between plans and evidence", () => {
  const source = project.data.pages["project-description"].paper.references[0];
  assert.match(source.citation, /iGEM Renata\./);
  assert.match(source.citation, /<cite>Dry Lab Documentation<\/cite>/);
  assert.match(source.citation, /Engineering source tabs include/);
  assert.match(engineering.sourceNote, /aria-label="Source 1: Dry Lab Documentation">\[1\]<\/a>/);
  assert.equal(project.data.pages["project-description"].paper.references.filter(ref => ref.href === source.href).length, 1);
  assert.match(project.main, /This cycle records an experimental plan; characterization data have not yet been reported\./);
  assert.match(project.main, /left the catalytic base unresolved/);
  assert.match(project.main, /retracted that mapping/);
  assert.match(project.main, /Geometric pass counts describe predictions/);
  assert.match(project.main, /do not establish completed bench work/);
  assert.match(project.main, /completed kinetic dataset and fitted ODE model have yet to be reported/);
});
