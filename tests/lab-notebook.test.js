"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createHash } = require("node:crypto");
const { init, pageFromHash } = require("../js/lab-notebook.js");
const root = path.join(__dirname, "..");
const anchors = { "notebook-assembly": 2, "notebook-reporter": 3, "notebook-growth-response": 4, "notebook-assay": 5, "assay-notebook": 5 };

function fixture(hash = "") {
  const frame = {
    src: "assets/documents/wet-lab-notebook.pdf#page=1&view=FitH&navpanes=0",
    getAttribute(name) { return this[name]; },
    setAttribute(name, value) { this[name] = value; }
  };
  const select = { value: "1", addEventListener(event, fn) { this[event] = fn; } };
  const panel = {
    dataset: {},
    querySelector: selector => selector === "[data-notebook-frame]" ? frame : select,
    querySelectorAll: () => Object.entries(anchors).map(([id, page]) => ({ id, dataset: { notebookPage: String(page) } }))
  };
  const doc = { getElementById: () => panel, addEventListener(event, fn) { this[event] = fn; } };
  const win = { location: { hash }, addEventListener(event, fn) { this[event] = fn; } };
  return { frame, select, panel, doc, win, controller: init(win, doc) };
}

test("the shipped PDF is generated from the current notebook data", () => {
  const context = vm.createContext({ window: {} });
  for (const file of ["site-content", "dry-lab-content", "lab-content"]) {
    vm.runInContext(fs.readFileSync(path.join(root, "js", `${file}.js`), "utf8"), context);
  }
  const data = context.window.RenataLab.notebookDocument;
  const digest = createHash("sha256").update(JSON.stringify(data)).digest("hex");
  const pdf = fs.readFileSync(path.join(root, "assets/documents/wet-lab-notebook.pdf"));
  assert.ok(pdf.subarray(0, 5).equals(Buffer.from("%PDF-")));
  assert.ok(pdf.includes(Buffer.from(`source-sha256:${digest}`)), "Rebuild the PDF when notebook data changes");
  assert.match(pdf.toString("latin1"), /\/Count 5\b/);
  assert.equal(data.sections.length, 4);
  assert.match(data.notice, /No experiment dates or completed measurements/);
});

test("notebook anchors resolve to the correct PDF page and malformed hashes are safe", () => {
  assert.equal(pageFromHash("#notebook", anchors), 1);
  assert.equal(pageFromHash("#notebook-reporter", anchors), 3);
  assert.equal(pageFromHash("#assay-notebook", anchors), 5);
  assert.equal(pageFromHash("#work-analysis", anchors), null);
  assert.equal(pageFromHash("#%E0%A4%A", anchors), null);
});

test("initial deep link and section selection keep the PDF and selector synchronized", () => {
  const f = fixture("#notebook-reporter");
  assert.equal(f.select.value, "3");
  assert.match(f.frame.src, /#page=3&view=FitH&navpanes=0$/);
  assert.match(f.frame.src, /\?notebook-page=3#page=3/);
  f.select.value = "5";
  f.select.change();
  assert.match(f.frame.src, /#page=5&/);
  f.win.location.hash = "#notebook-assembly";
  f.win.hashchange();
  assert.equal(f.select.value, "2");
  assert.match(f.frame.src, /#page=2&/);
});

test("repeated notebook links work after changing the PDF page manually", () => {
  const f = fixture("#notebook-reporter");
  f.controller.showPage(5);
  f.doc.click({ target: { closest: () => ({ getAttribute: () => "#notebook-reporter" }) } });
  assert.equal(f.select.value, "3");
  assert.match(f.frame.src, /#page=3&/);
  f.doc.click({ target: {} });
  f.controller.showPage(999);
  assert.equal(f.select.value, "1");
  assert.match(f.frame.src, /#page=1&/);
});

test("the reader initializes once and safely skips pages without a notebook", () => {
  const f = fixture();
  assert.equal(init(f.win, f.doc), undefined);
  assert.equal(init({}, { getElementById: () => null }), undefined);
  assert.equal(f.panel.dataset.readerReady, "true");
});

test("old notebook aliases select the same record on the separate page", () => {
  assert.equal(pageFromHash("#assembly", anchors), 2);
  assert.equal(pageFromHash("#reporter", anchors), 3);
  assert.equal(pageFromHash("#growth-response", anchors), 4);
});
test("bookmarks into the former combined Wetlab reader redirect with their query and record intact", () => {
  for (const hash of ["#notebook", "#notebook-reporter", "#notebook-assay", "#assay-notebook", "#assembly"]) {
    let actual;
    const win = {location:{href:`http://localhost:8080/wet-lab.html?preview=1${hash}`,search:'?preview=1',hash,replace(url){actual=url;}},addEventListener(){}};
    init(win,{body:{dataset:{page:'wet-lab'}}});
    assert.equal(actual,hash==='#assembly'?undefined:`http://localhost:8080/wet-lab-notebook.html?preview=1${hash}`);
  }
});
