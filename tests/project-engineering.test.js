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
    "js/site-content.js", "js/project-description-content.js", "js/engineering-content.js", "js/project-overview-content.js",
    "js/engineering-revision.js", "js/project-paper.js", "js/dry-lab-content.js", "js/wet-lab-content.js", "js/wet-lab-notebook-data.js", "js/lab-content.js", "js/navigation.js", "js/site.js"
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
const dbtl = renderPage("engineering.html");
const engineering = dbtl.data.pages.engineering.engineering;

test("Engineering adds four current cycles, source figures, and explicit evidence limits", () => {
  assert.equal(engineering.currentReport.outline.length, 4);
  for (let n=1;n<=4;n++) assert.ok(dbtl.main.includes(`id="engineering-cycle-${n}"`));
  assert.doesNotMatch(dbtl.main, /Earlier design plans and supporting records|class="engineering-history"/);
  assert.doesNotMatch(dbtl.main, /Reading the evidence|Cycles 1–2 describe computational candidates/);
  assert.match(dbtl.main, /LCA sulfation remain unconfirmed/);
  assert.match(dbtl.main, /16–32% recovery/);
  assert.match(dbtl.main, /engineering-table-scroll/);
  assert.match(dbtl.main, /no sulfo-LCA spot could be identified/);
  const images = [...engineering.currentReport.cyclesHtml.matchAll(/<img src="([^"]+)"/g)];
  assert.ok(images.length >= 13);
  for (const [,src] of images) assert.ok(fs.existsSync(path.join(root,src)),src);
  const reservedImages = [...engineering.currentReport.cyclesHtml.matchAll(/<img src="[^"]+" width="[1-9]\d*" height="[1-9]\d*"/g)];
  assert.equal(reservedImages.length, images.length, 'Lazy-loaded figures reserve space so cycle and reference links land correctly');
  const ids = [...dbtl.main.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size);
});

function anchorHarness({ hash = "#engineering", search = "", pageKey = "engineering", readyState = "loading" } = {}) {
  const nodes = Object.fromEntries(["siteMain", "siteHeader", "siteFooter"].map(id => [id, element()]));
  const listeners = new Map();
  const windowListeners = new Map();
  const frames = [];
  const scrolls = [];
  const redirects = [];
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
      location: { hash, search, replace: destination => redirects.push(destination) }, scrollY: 0, innerWidth: 1440,
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
  for (const script of ["js/site-content.js", "js/project-description-content.js", "js/engineering-content.js", "js/project-overview-content.js", "js/project-paper.js", "js/dry-lab-content.js", "js/wet-lab-content.js", "js/wet-lab-notebook-data.js", "js/lab-content.js", "js/navigation.js", "js/site.js"]) {
    vm.runInContext(read(script), context, { filename: script });
  }
  return {
    scrolls, redirects,
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

test("Engineering preserves earlier record data without displaying a second stage-based layout", () => {
  const expectedIds = [
    "assembly-design-cycle", "assembly-evidence-map", "enzyme-design-cycle",
    "enzyme-design-revisions", "system-integration-decisions", "measurements-to-model"
  ];
  assert.deepEqual(Array.from(engineering.details, record => record.id), expectedIds);
  const renderedIds = [...dbtl.main.matchAll(/class="project-engineering-record" id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(renderedIds, []);
  for (const record of engineering.details) {
    assert.ok(record.title && record.note);
    assert.ok(dbtl.main.includes(`id="${record.id}"`), 'Earlier bookmarks remain usable');
  }
  assert.ok(engineering.sourceNote.length > 100);
  assert.ok(!dbtl.main.includes(engineering.sourceNote));
});

test("Engineering uses Abstract, DBTL Cycle with four numbered cycles, then References", () => {
  const projectSectionIds = [...project.main.matchAll(/<section class="project-paper-section[^\"]*" id="([^"]+)"/g)].map(match => match[1]);
  assert.ok(projectSectionIds.includes("abstract"));
  assert.ok(!projectSectionIds.includes("engineering"));
  assert.match(project.main, /<h1 id="project-paper-title">Project Description<\/h1>/);
  assert.doesNotMatch(project.main, /class="project-dbtl-stage"|class="project-engineering-record"/);
  const sectionIds = [...dbtl.main.matchAll(/<section class="project-paper-section[^\"]*" id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sectionIds, ["abstract", "engineering", "engineering-current-references"]);
  assert.match(dbtl.main, /<h1 id="project-paper-title">Engineering<\/h1>/);
  assert.doesNotMatch(dbtl.main, /class="project-dbtl-stage"|class="project-cycle-nav"/);
  const cycleIds = [...dbtl.main.matchAll(/<section class="engineering-current-cycle" id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(cycleIds, [1,2,3,4].map(n => `engineering-cycle-${n}`));
  const headings = [...dbtl.main.matchAll(/<h2\b[^>]*>([^<]+)<\/h2>/g)].map(match => match[1]);
  assert.deepEqual(headings, ['Abstract', 'DBTL Cycle', 'References']);
  const sidebar = dbtl.main.match(/<nav class="page-outline"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(sidebar, "the page carries a hierarchical On this page outline");
  assert.match(sidebar, /data-outline-autocollapse="false"/);
  assert.doesNotMatch(sidebar, /Current engineering cycles|Cycle references/);
  assert.equal((sidebar.match(/>DBTL Cycle<\/a>/g) || []).length, 1, 'There is one DBTL parent in the outline');
  assert.doesNotMatch(sidebar, /project-sidebar-tab|role="tablist"|Explore this page/);
  // The outline mirrors the requested hierarchy, without duplicate stage links.
  const destinations = [...sidebar.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(destinations, ['abstract', 'engineering', ...cycleIds, 'engineering-current-references']);
  assert.match(sidebar, /data-outline-branch="engineering"/);
  const cycleBranch = sidebar.match(/<ul id="outline-engineering"[^>]*>([\s\S]*?)<\/ul>/)[1];
  for (let n=1; n<=4; n++) {
    assert.ok(cycleBranch.includes(`href="#engineering-cycle-${n}">Cycle ${n}</a>`));
  }
  assert.match(dbtl.main, /id="dbtl-cycle"/);
  const source = JSON.parse(read('content/engineering-revision.json'));
  const decode = text => text.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
  const abstractText = decode(engineering.currentReport.abstractHtml.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  assert.equal(abstractText, source.abstract.join(' '));
  assert.match(abstractText, /Continued experimentation aims to establish reliable SulFlux folding/);
  assert.ok(dbtl.main.includes(engineering.currentReport.abstractHtml));
  assert.ok(dbtl.main.includes(engineering.currentReport.cyclesHtml));
});

test("the description introduces bile-acid biology and preserves the stated validation boundaries", () => {
  const sections = project.data.pages["project-description"].description.sections;
  const abstract = sections.find(section => section.id === "abstract").html;
  assert.match(abstract, /gallbladder/);
  assert.match(abstract, /enterohepatic circulation/);
  assert.ok(project.main.includes(abstract));
  const enzyme = sections.find(section => section.id === "btsult-engineering").html;
  assert.match(enzyme, /activity must be experimentally established/);
  const outlook = sections.find(section => section.id === "project-outlook").html;
  assert.match(outlook, /extensive safety and efficacy testing before it could be considered for clinical use/);
  assert.match(outlook, /establish the feasibility of the proposed biochemical mechanism/);
});

test("Project Description renders every supplied overview section and all 13 published references", () => {
  const description = project.data.pages["project-description"].description;
  assert.ok(description, "The complete description has its own structured content");
  assert.deepEqual(Array.from(description.sections, section => section.id), [
    "abstract", "gallbladder-removal", "bile-acid-metabolism", "selective-modification",
    "current-treatments", "sulfation-approach", "btsult-engineering", "paps-supply",
    "biochemical-validation", "probiotic-delivery", "project-outlook"
  ]);
  const contentBlocks = description.sections.reduce((count, section) => count + (section.html.match(/<(?:p|li)>/g) || []).length, 0);
  assert.equal(contentBlocks, 67, "All supplied prose paragraphs and list items are retained");
  let previousSection = -1;
  for (const section of description.sections) {
    assert.ok(section.id && section.title && section.html.trim(), section.id);
    const position = project.main.indexOf(`id="${section.id}"`);
    assert.ok(position > previousSection, `${section.title}: source order is preserved`);
    assert.ok(project.main.includes(section.html), `${section.title}: complete content is retained`);
    assert.ok(project.main.includes(`href="#${section.id}"`), `${section.title}: sidebar link exists`);
    previousSection = position;
  }
  assert.equal(description.references.length, 13);
  assert.deepEqual(Array.from(description.references, reference => reference.number), Array.from({ length: 13 }, (_, index) => index + 1));
  for (const reference of description.references) {
    assert.ok(reference.html.trim(), `Reference ${reference.number}`);
    assert.ok(project.main.includes(`<li id="description-ref-${reference.number}">${reference.html}</li>`), `Reference ${reference.number} is rendered in full`);
  }
  assert.doesNotMatch(dbtl.main, /id="description-ref-/);
});

test("the current report replaces the old expression-vector placeholder with source figures", () => {
  assert.doesNotMatch(dbtl.main, /Schematic placeholder|Expression-vector image to be added/);
  assert.match(dbtl.main, /assets\/engineering\/page-\d+-figure-\d+\.png/);
  const figure = project.data.pages["project-description"].paper.vectorFigure;
  assert.ok(!figure.src, "An experimental map must not be invented");
  assert.deepEqual(Array.from(figure.architecture), ["T7 promoter", "RBS", "His6", "SUMO", "ULP1 cleavage site", "BtSULT variant", "Stop / terminators"]);
});

test("Our Project navigation links Engineering and Project Description to separate pages", () => {
  const flatten = items => items.flatMap(item => [item, ...flatten(item.children || [])]);
  assert.ok(Object.hasOwn(project.data.pages, "engineering"));
  assert.ok(flatten(project.data.nav).some(item => item.href === "engineering.html#dbtl-cycle"));
  assert.match(project.header + project.footer, />\s*Engineering\s*</);
  assert.match(project.header, />\s*Our Project\s*</);
  assert.match(project.header, /aria-controls="renata-nav-project"/);
  assert.doesNotMatch(project.header, />\s*Our Lab Work\s*</);
  assert.match(project.header, /href="engineering\.html#dbtl-cycle"/);
  assert.match(project.header, /href="project-description\.html#abstract"/);
  assert.match(project.header, />\s*Project Description\s*</);
  assert.match(project.footer, /href="project-description\.html(?:#abstract)?"/);
  assert.match(dbtl.main, /id="dbtl-cycle"/);
  assert.match(project.main, /id="abstract"/);
});

test("Engineering is a full content page and preserves its DBTL record anchors", () => {
  const html = read("engineering.html");
  assert.match(html, /data-page="engineering"/);
  assert.match(html, /id="siteMain"/);
  assert.doesNotMatch(html, /window\.location\.replace|http-equiv="refresh"/);
  for (const id of ["engineering", "dbtl-cycle", "design", "build", "test", "learn", ...engineering.details.map(record => record.id)]) {
    assert.ok(dbtl.main.includes(`id="${id}"`), id);
  }
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

test("each Project dropdown destination resolves its own page's initial section", () => {
  for (const [pageKey, id] of [["project-description", "abstract"], ["engineering", "dbtl-cycle"]]) {
    const harness = anchorHarness({ hash: `#${id}`, pageKey, readyState: "complete" });
    harness.addTarget(id);
    harness.flushFrames();
    assert.deepEqual(harness.scrolls, [{ id, block: "start", behavior: "instant" }], pageKey);
  }
});

test("old Project Description DBTL bookmarks redirect to Engineering with their query and fragment intact", () => {
  for (const hash of ["#dbtl-cycle", "#design"]) {
    const harness = anchorHarness({ hash, search: "?preview=latest&source=bookmark", pageKey: "project-description", readyState: "complete" });
    assert.deepEqual(harness.redirects, [], "Compatibility routing waits for the layout frame");
    harness.flushFrames();
    assert.deepEqual(harness.redirects, [`engineering.html?preview=latest&source=bookmark${hash}`]);
    assert.deepEqual(harness.scrolls, [], "The old page redirects before attempting a local scroll");
  }
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

test("both project pages load shared source data before rendering with refreshed asset versions", () => {
  for (const file of ["project-description.html", "engineering.html"]) {
    const html = read(file);
    const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
    const version = scripts.find(src => src.startsWith("js/site.js?"))?.split("?v=")[1];
    assert.ok(version);
    const required = ["js/site-content.js", "js/project-description-content.js", "js/engineering-content.js", "js/project-paper.js", "js/site.js"];
    const positions = required.map(file => scripts.findIndex(src => src.split("?")[0] === file));
    assert.ok(positions.every(position => position >= 0));
    assert.ok(positions.every((position, index) => index === 0 || position > positions[index - 1]));
    assert.match(html, /css\/project-research\.css\?v=[a-f0-9]{12}/);
    assert.doesNotMatch(html, /(?:home-animations|immersive-home|orbit-pages)\.(?:js|css)/);
    assert.doesNotMatch(renderPage(file).main, /<video\b|home-scroll|home-orbit/);
    assert.equal(scripts.filter(src => src.startsWith("js/engineering-content.js?")).length, 1);
    if (file === "project-description.html") {
      const overviewPosition = scripts.findIndex(src => src.split("?")[0] === "js/project-overview-content.js");
      assert.ok(overviewPosition > scripts.findIndex(src => src.split("?")[0] === "js/engineering-content.js"));
      assert.ok(overviewPosition < scripts.findIndex(src => src.split("?")[0] === "js/project-paper.js"));
      assert.equal(scripts.filter(src => src.startsWith("js/project-overview-content.js?")).length, 1);
    }
    const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(match => match[1].split("?")[0]);
    assert.equal(styles.at(-1), "css/project-outline.css");
  }
});

test("rendered IDs are unique and local page links, section anchors, and assets resolve", () => {
  for (const page of [project, dbtl]) {
    const ids = [...page.html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, raw] of page.html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = raw.replaceAll("&amp;", "&");
      if (/^(?:https?:|mailto:|tel:|data:)/.test(url)) continue;
      const [pathname, fragment] = url.split("#");
      const file = pathname.split("?")[0];
      if (file) assert.ok(fs.existsSync(path.join(root, file)), `Missing local resource: ${url}`);
      if (fragment) {
        const target = file ? renderPage(file).html : page.html;
        assert.ok(target.includes(`id="${fragment}"`), `Missing local anchor: ${url}`);
      }
    }
  }
});

test("engineering preserves internal provenance as metadata and displays published citations only", () => {
  const source = project.data.pages["project-description"].paper.references[0];
  assert.match(source.citation, /iGEM Renata\./);
  assert.match(source.citation, /<cite>Dry Lab Documentation<\/cite>/);
  assert.match(source.citation, /Engineering source tabs include/);
  assert.equal(source.internal, true);
  assert.doesNotMatch(project.main + dbtl.main, /Dry Lab Documentation|unpublished working notes|href="https:\/\/docs\.google\.com\/document/);
  assert.match(dbtl.main, /href="https:\/\/doi\.org\/10\.1038\/s41564-022-01176-y"/);
  assert.match(dbtl.main, /href="https:\/\/doi\.org\/10\.1016\/j\.ab\.2012\.01\.003"/);
  assert.equal(project.data.pages["project-description"].paper.references.filter(ref => ref.href === source.href).length, 1);
  assert.doesNotMatch(dbtl.main, /This cycle records an experimental plan; characterization data have not yet been reported\./);
  assert.match(dbtl.main, /LCA sulfation remain unconfirmed/);
});

test("Engineering bibliography has 17 complete entries in three continuously numbered groups", () => {
  const html = engineering.currentReport.referencesHtml;
  const ids = [...html.matchAll(/<li id="engineering-ref-(\d+)"/g)].map(m=>Number(m[1]));
  assert.deepEqual(ids, Array.from({length:17},(_,i)=>i+1));
  for (const start of [1,11,15]) assert.ok(html.includes(`class="engineering-reference-list" start="${start}"`));
  for (const title of ['Scientific references','AI models','Analysis tools']) assert.ok(html.includes(`>${title}</h3>`));
  assert.match(html, /<li id="engineering-ref-2">Kakuta Y,[\s\S]*?10\.1074\/jbc\.273\.42\.27325<\/a><\/li>/);
  assert.match(dbtl.main, /href="#engineering-current-references">References<\/a>/);
  assert.equal((html.match(/<li id="engineering-ref-/g)||[]).length,17);
  assert.match(dbtl.main, /<li id="engineering-ref-18">Prather, Brittany/);
  assert.equal((dbtl.main.match(/id="engineering-ref-/g)||[]).length,18);
});
