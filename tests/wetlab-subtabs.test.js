"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const name of ["site-content", "dry-lab-content", "lab-content"]) {
  vm.runInContext(fs.readFileSync(path.join(root, "js", name + ".js"), "utf8"), context);
}
const nav = context.window.SITE_DATA.nav.find(group => group.key === "lab-work");
const wetlab = context.window.RenataLab.render("wet-lab");

test("Lab Work nests exactly three Wetlab subtabs and retains Notebook and Model", () => {
  assert.deepEqual(Array.from(nav.children, child => child.key), ["wet-lab", "wet-lab-notebook", "model"]);
  assert.deepEqual(Array.from(nav.children[0].children, child => [child.label, child.href]), [
    ["Process/Background", "wet-lab.html#process-background"],
    ["Model Wetlab", "wet-lab.html#model-wetlab"],
    ["Experimentation/Protocols", "wet-lab.html#experimentation-protocols"]
  ]);
});

test("Wetlab subtabs organize original content without breaking deep links", () => {
  const names = ["process-background", "model-wetlab", "experimentation-protocols"];
  for (const name of names) {
    assert.ok(wetlab.includes('href="#' + name + '"'));
    assert.ok(wetlab.includes('class="wetlab-subsection" id="' + name + '"'));
  }
  const starts = names.map(name => wetlab.indexOf('class="wetlab-subsection" id="' + name + '"'));
  assert.ok(starts[0] < starts[1] && starts[1] < starts[2]);
  for (const id of ["expression-plan", "assay-plan", "master-plan"]) {
    const index = wetlab.indexOf('id="' + id + '"');
    assert.ok(index > starts[1] && index < starts[2], id);
  }
  for (const id of ["assembly", "reporter", "growth-response", "experiments-list"]) {
    assert.ok(wetlab.indexOf('id="' + id + '"') > starts[2], id);
  }
  assert.ok(wetlab.includes('href="wet-lab-notebook.html"'));
  assert.ok(wetlab.includes("No completed dataset is attached"));
  const ids = [...wetlab.matchAll(/\\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, "every heading and anchor has a unique ID");
});
