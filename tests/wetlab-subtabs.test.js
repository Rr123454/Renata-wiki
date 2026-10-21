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
const wetlab = fs.readFileSync(path.join(root, "wet-lab.html"), "utf8");

test("Lab Work nests exactly three Wetlab subtabs and retains Notebook and Model", () => {
  assert.deepEqual(Array.from(nav.children, child => child.key), ["wet-lab", "wet-lab-notebook", "model"]);
  assert.deepEqual(Array.from(nav.children[0].children, child => [child.label, child.href]), [
    ["Process/Background", "wet-lab.html#process-background"],
    ["Model Wetlab", "wet-lab.html#model-wetlab"],
    ["Experimentation/Protocols", "wet-lab.html#experimentation-protocols"]
  ]);
});

test("Wetlab subtabs open the source writeups and protocol index", () => {
  for (const id of ["process-background", "model-wetlab", "experimentation-protocols", "bacterial-transformation", "colony-pcr", "sds-page", "tlc-protocol"]) {
    assert.ok(wetlab.includes('href="#' + id + '"'));
    assert.ok(wetlab.includes('id="' + id + '"'));
  }
  assert.ok(wetlab.includes('href="wet-lab-notebook.html"'));
  assert.doesNotMatch(wetlab, /No completed dataset is attached|These are plans, not completed assay results/);
  const ids = [...wetlab.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size);
});
