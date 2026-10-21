"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createHash } = require("node:crypto");
const { init, pageFromHash } = require("../js/lab-notebook.js");
const root = path.join(__dirname, "..");
const originalHash = "7ed8512b366732aa3587e594f098db952740fdd2c99bb6eae8272daf04bb9514";
const pdfPath = "assets/documents/igem-renata-lab-documentation-2026.pdf";
const anchors = {
  "notebook-assembly": 2, "notebook-screening": 4, "notebook-expression": 10,
  "notebook-purification": 13, "notebook-quantification": 15, "notebook-protein-gels": 19,
  "notebook-assay": 23, "assay-notebook": 23, "notebook-reporter": 56,
  "notebook-growth-response": 10, "notebook-june": 56, "notebook-july": 57,
  "notebook-august": 62, "notebook-september": 66, "notebook-october": 68
};
const context = vm.createContext({ window: {} });
for (const file of ["site-content", "dry-lab-content", "wet-lab-content", "wet-lab-notebook-data", "lab-content"]) {
  vm.runInContext(fs.readFileSync(path.join(root, "js", `${file}.js`), "utf8"), context);
}
const source = context.window.RENATA_WETLAB;
const data = context.window.RenataLab.notebookDocument;
const notebook = context.window.RenataLab.render("wet-lab-notebook");

function fixture(hash = "") {
  const frame = {
    src: `${pdfPath}#page=1&view=FitH&navpanes=0`,
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

test("the reader uses the unchanged 74-page PDF supplied by the team", () => {
  assert.equal(source.pdf, pdfPath);
  assert.equal(source.pageCount, 74);
  assert.equal(source.pdfSha256.toLowerCase(), originalHash);
  const pdf = fs.readFileSync(path.join(root, source.pdf));
  assert.ok(pdf.subarray(0, 5).equals(Buffer.from("%PDF-")));
  assert.equal(createHash("sha256").update(pdf).digest("hex"), originalHash, "Source PDF bytes are preserved");
  assert.ok(notebook.includes(`${pdfPath}#page=1`));
  assert.doesNotMatch(notebook, /assets\/documents\/wet-lab-notebook\.pdf/);
});

test("the notebook preserves monthly chronology, source-page references and entry text", () => {
  const months = [["June", 56], ["July", 57], ["August", 62], ["September", 66], ["October", 68]];
  let previous = -1;
  for (const [month, page] of months) {
    const section = data.sections.find(item => item.title.includes(month));
    assert.ok(section, month);
    assert.equal(section.page, page, `${month}: source page`);
    const index = data.sections.indexOf(section);
    assert.ok(index > previous, "Monthly sections remain in source order");
    previous = index;
    assert.ok(section.entries.length > 0, `${month}: documented entries`);
    for (const entry of section.entries) {
      assert.ok(entry.label && entry.text, `${month}: dated entry and evidence text`);
      assert.ok(notebook.includes(entry.label), `${month}: chronology is visible`);
    }
  }
  assert.match(JSON.stringify(data), /(?:date|heading|label)[^.]{0,180}(?:conflict|discrepan|mismatch|inconsisten|ambig|uncertain)|(?:conflict|discrepan|mismatch|inconsisten|ambig|uncertain)[^.]{0,180}(?:date|heading|label)/i, "Source chronology discrepancies remain explicit");
});

test("the chronology retains missing results and unresolved sample identities", () => {
  const monthText = name => {
    const section = data.sections.find(item => item.id === name);
    return [section.lead, ...section.entries.map(entry => `${entry.label} ${entry.title} ${entry.text}`)].join(" ");
  };
  assert.match(monthText("august"), /10[–-]21 August/);
  assert.match(monthText("august"), /no experiments|no data/i, "A documented pause remains visible");
  assert.match(monthText("september"), /2B[^.]*unreported|unreported[^.]*2B/i, "The missing 2B count is not invented");
  assert.match(monthText("september"), /SF2[^.]*SF3/);
  assert.match(monthText("september"), /(?:label|identit|mapping)[^.]*conflict|conflict[^.]*label|without[^.]*confirmed mutation/i);
  assert.match(monthText("october"), /3 October/);
  assert.match(monthText("october"), /conflict|duplicat|ambig/i);
  assert.match(monthText("october"), /TLC[^.]*inconclusive|inconclusive[^.]*TLC/i);
  assert.match(monthText("october"), /(?:not|neither|unconfirmed|unresolved)[^.]*(?:activity|conversion|sulfation)/i, "Observed bands do not imply a completed functional result");
});

test("rendered reader bookmarks target the supplied document's real pages", () => {
  const actual = Object.fromEntries([...notebook.matchAll(/id="([^"]+)"\s+data-notebook-page="(\d+)"/g)].map(([, id, page]) => [id, Number(page)]));
  for (const [id, page] of Object.entries(anchors)) {
    assert.equal(actual[id], page, id);
  }
  for (const page of Object.values(actual)) assert.ok(page >= 1 && page <= source.pageCount);
});

test("the reader uses the unchanged supplied 19-page notebook without generated prompts", () => {
  const data = JSON.parse(fs.readFileSync(path.join(root, "content/wetlab/document.json"), "utf8")).notebook;
  const pdf = fs.readFileSync(path.join(root, data.source.path));
  assert.ok(pdf.subarray(0, 5).equals(Buffer.from("%PDF-")));
  assert.equal(createHash("sha256").update(pdf).digest("hex"), data.source.sha256);
  assert.equal(data.pageCount, 19);
  const page = fs.readFileSync(path.join(root, "wet-lab-notebook.html"), "utf8");
  assert.equal([...page.matchAll(/<option value=/g)].length, 19);
  assert.ok(page.includes(data.source.path));
  assert.doesNotMatch(page, /undated entry prompts|Read notebook as text|No experiment dates/);
});

test("notebook anchors resolve to the correct PDF page and malformed hashes are safe", () => {
  assert.equal(pageFromHash("#notebook", anchors), 1);
  assert.equal(pageFromHash("#notebook-reporter", anchors), 56);
  assert.equal(pageFromHash("#assay-notebook", anchors), 23);
  assert.equal(pageFromHash("#notebook-october", anchors), 68);
  assert.equal(pageFromHash("#work-analysis", anchors), null);
  assert.equal(pageFromHash("#%E0%A4%A", anchors), null);
});

test("initial deep link and section selection keep the PDF and selector synchronized", () => {
  const f = fixture("#notebook-reporter");
  assert.equal(f.select.value, "56");
  assert.match(f.frame.src, /#page=56&view=FitH&navpanes=0$/);
  assert.match(f.frame.src, /\?notebook-page=56#page=56/);
  f.select.value = "68";
  f.select.change();
  assert.match(f.frame.src, /#page=68&/);
  f.win.location.hash = "#notebook-assembly";
  f.win.hashchange();
  assert.equal(f.select.value, "2");
  assert.match(f.frame.src, /#page=2&/);
});

test("repeated notebook links work after changing the PDF page manually", () => {
  const f = fixture("#notebook-reporter");
  f.controller.showPage(23);
  f.doc.click({ target: { closest: () => ({ getAttribute: () => "#notebook-reporter" }) } });
  assert.equal(f.select.value, "56");
  assert.match(f.frame.src, /#page=56&/);
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
  assert.equal(pageFromHash("#reporter", anchors), 56);
  assert.equal(pageFromHash("#growth-response", anchors), 10);
});
test("bookmarks into the former combined Wetlab reader redirect with their query and record intact", () => {
  for (const hash of ["#notebook", "#notebook-reporter", "#notebook-assay", "#assay-notebook", "#assembly"]) {
    let actual;
    const win = {location:{href:`http://localhost:8080/wet-lab.html?preview=1${hash}`,search:'?preview=1',hash,replace(url){actual=url;}},addEventListener(){}};
    init(win,{body:{dataset:{page:'wet-lab'}}});
    assert.equal(actual,hash==='#assembly'?undefined:`http://localhost:8080/wet-lab-notebook.html?preview=1${hash}`);
  }
});
