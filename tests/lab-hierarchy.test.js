"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = vm.createContext({ window: {} });
for (const file of ["site-content", "dry-lab-content", "wet-lab-content", "wet-lab-notebook-data", "lab-content"]) vm.runInContext(read(`js/${file}.js`), context);
const data = context.window.SITE_DATA, lab = context.window.RenataLab;
const source = context.window.RENATA_WETLAB;
const pages = Object.fromEntries(["wet-lab", "wet-lab-notebook", "model"].map(key => [key, lab.render(key)]));
const ids = html => [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const text = html => String(html).replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

test("top-level navigation matches the requested hierarchy with Wetlab, Notebook, and Model under Lab Work", () => {
  assert.deepEqual(Array.from(data.nav, item => item.label), ["Home", "Our Team", "Our Project", "Lab Work", "Education + HP"]);
  assert.equal(data.nav.find(item => item.key === "project").children, undefined, "Our Project is a direct link");
  assert.deepEqual(Array.from(data.nav.find(item => item.key === "team").children, item => item.label), ["Meet Our Team", "Contribution"]);
  const menu = data.nav.find(item => item.key === "lab-work").children;
  assert.deepEqual(Array.from(menu, item => item.label), ["Wetlab", "Notebook", "Model"]);
  assert.equal(menu[0].children, undefined, "all Lab Work destinations are siblings");
  assert.deepEqual(Array.from(data.pages.home.linkColumns, item => item.title), ["Our Team", "Engineering", "Lab Work", "Education + HP"]);
});

test("Wetlab renders each source-backed experiment with its evidence, interpretation and next decision", () => {
  const expected = ["assembly", "screening", "expression-plan", "purification", "quantification", "protein-gels", "assay-plan"];
  assert.deepEqual(Array.from(source.records, record => record.id), expected);
  const rendered = text(pages["wet-lab"]);
  for (const record of source.records) {
    assert.ok(ids(pages["wet-lab"]).includes(record.id), record.id);
    for (const field of ["title", "question", "evidence", "interpretation", "next"]) {
      assert.ok(record[field]?.trim(), `${record.id}: ${field} is populated`);
      assert.ok(rendered.includes(text(record[field])), `${record.id}: ${field} is rendered`);
    }
    for (const paragraph of record.paragraphs || []) {
      assert.ok(rendered.includes(text(paragraph)), `${record.id}: source explanation is rendered`);
    }
  }
  for (const id of lab.wetIds) {
    assert.ok(ids(pages["wet-lab"]).includes(id), id);
    assert.ok(!ids(pages.model).includes(id), `Bench section must be under Wetlab: ${id}`);
  }
  for (const id of ["reporter", "growth-response", "master-plan", "handoff"]) {
    assert.ok(ids(pages["wet-lab"]).includes(id), `Historical anchor retained: ${id}`);
  }
  assert.match(rendered, /(?:historical|archived|earlier)\s+(?:[^.]*\s)?plans?/i);
});

test("Wetlab retains source provenance and separates assay measurements from functional claims", () => {
  const rendered = text(pages["wet-lab"]);
  assert.match(rendered, /iGEM Renata Lab Documentation 2026/);
  assert.ok(pages["wet-lab"].includes(source.pdf), "Original source document remains available");
  assert.match(rendered, /(?:uncertain|unresolved|incomplete|pending|discrepan|conflict|ambig)/i);
  const assay = source.records.find(record => record.id === "assay-plan");
  const assayRecord = text([assay.evidence, assay.interpretation, assay.next, ...(assay.paragraphs || [])].join(" "));
  assert.match(assayRecord, /(?:activity|sulfation|conversion|product)/i);
  assert.match(assayRecord, /(?:not|cannot|unconfirmed|unresolved|pending|insufficient|requires|needs|remaining|remain|incomplete)/i, "Assay evidence includes its validation boundary");
  assert.doesNotMatch(rendered, /Completed transformation, enzyme-activity, and growth datasets have not been supplied/);
});

test("Model retains every computational source section, figures, and detailed comparisons", () => {
  for (const section of lab.modelSections) {
    assert.ok(ids(pages.model).includes(section.id), section.id);
    const heading = section.html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)[1];
    assert.ok(pages.model.includes(heading));
  }
  assert.match(pages.model, /4\.21|4.21/);
  assert.match(pages.model, /3\.35/);
  assert.match(pages.model, /0\.529/);
  assert.match(pages.model, /cofactor-region\.png/);
  assert.match(pages.model, /candidate-residues\.png/);
  assert.equal([...pages.model.matchAll(/id="source-\d+"/g)].length, 15);
});

test("Model preserves the original chronology and incomplete-method provenance before each record", () => {
  const source = data.experimentRecordTabs["experiment-enzyme-design"].content;
  for (const [view, group, firstSection] of [["notebook", "notebook", "alignment"], ["protocols", "methods", "inputs"]]) {
    const introduction = source[view].match(/<p class="dry-lab-intro">[\s\S]*?<\/p>/)[0];
    const position = pages.model.indexOf(introduction);
    assert.ok(position > pages.model.indexOf(`class="lab-model-group" id="${group}"`), view);
    assert.ok(position < pages.model.indexOf(`id="${firstSection}"`), view);
    assert.ok(introduction.includes('href="#source-1"'), "The original source citation remains attached");
  }
  assert.match(pages.model, /Most computational entries have no recorded date/);
  assert.match(pages.model, /Dates are retained as written; the year is unspecified/);
  assert.match(pages.model, /Numerical results below are reported observations awaiting raw-file verification/);
  assert.match(pages.model, /Software versions, exact raw inputs, and several experimental choices remain to be recorded/);
});

test("new research pages have unique anchors, working local section links, and real assets", () => {
  for (const [key, html] of Object.entries(pages)) {
    const found = ids(html);
    assert.equal(found.length, new Set(found).size, key);
    for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|data:|mailto:)/.test(href)) continue;
      const [file, hash] = href.split("#");
      if (file) assert.ok(fs.existsSync(path.join(root, file.split("?")[0])), href);
      const target = !file ? html : pages[file.replace(/\.html$/, "")];
      if (hash && target) assert.ok(ids(target).includes(hash), `${key}: ${href}`);
    }
    const entry = read(`${key}.html`);
    const dependencies = key === "model" ? ["site-content", "navigation"] : ["site-content", "dry-lab-content", "lab-content", "navigation"];
    if (key === "model") assert.match(entry, /data-static-content="true"/, "Model keeps its generated source-backed article");
    for (const file of dependencies) {
      assert.ok(entry.indexOf(`js/${file}.js`) >= 0, `${key}: ${file} is present`);
      assert.ok(entry.indexOf(`js/${file}.js`) < entry.indexOf("js/site.js"));
    }
    if (key !== "model") for (const file of ["wet-lab-content", "wet-lab-notebook-data"]) {
      assert.ok(entry.indexOf(`js/${file}.js`) >= 0, `${key}: ${file} is present`);
      assert.ok(entry.indexOf(`js/${file}.js`) < entry.indexOf("js/lab-content.js"), `${key}: source data loads before the renderer`);
    }
    assert.doesNotMatch(entry, /js\/orbit-pages\.js/);
  }
});

test("Notebook has its own full-width PDF reader and accessible transcript", () => {
  const notebook = pages["wet-lab-notebook"];
  assert.doesNotMatch(pages["wet-lab"], /<iframe|lab-workspace|Read notebook as text/);
  assert.match(pages["wet-lab"], /href="wet-lab-notebook.html"/);
  assert.match(notebook, /<iframe[^>]*data-notebook-frame/);
  assert.ok(notebook.includes(source.pdf));
  assert.match(notebook, /Read notebook as text/);
  assert.doesNotMatch(notebook, /Undated \/ awaiting bench record|completed bench records are still pending|PDF: undated entry prompts/);
  for (const month of ["June", "July", "August", "September", "October"]) assert.ok(notebook.includes(month), month);
  assert.match(notebook, /href="wet-lab.html"/);
  assert.match(read("wet-lab-notebook.html"), /data-page="wet-lab-notebook"/);
  assert.doesNotMatch(read("wet-lab-notebook.html"), /window.location.replace/);
  assert.match(pages.model, /biochemical performance still needs experimental measurement/);
});

test("retired lab routes preserve queries and route old fragments to the correct content", () => {
  for (const [file, hash, target] of [
    ["experiments.html", "", "wet-lab.html#experiments-list"],
    ["experiment-enzyme-design.html", "", "model.html#overview"],
    ["experiment-enzyme-design-notebook.html", "#variant-comparison", "model.html#variant-comparison"],
    ["experiment-enzyme-design-protocols.html", "", "model.html#methods"],
    ["experiment-enzyme-design-protocols.html", "#expression-plan", "wet-lab.html#expression-plan"],
    ["experiment-enzyme-design-protocols.html", "#assay-plan", "wet-lab.html#assay-plan"],
  ]) {
    const url = new URL(`http://localhost:8080/${file}?preview=latest${hash}`);
    let actual;
    const script = read(file).match(/<script>([\s\S]*?)<\/script>/)[1];
    vm.runInNewContext(script, { URL, window: { location: { href: url.href, hash: url.hash, search: url.search, replace(value) { actual = value; } } } });
    const expected = new URL(target, url); expected.search = url.search;
    assert.equal(actual, expected.href);
  }
});
