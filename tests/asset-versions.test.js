"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { versionMarkup, refreshAll } = require("../scripts/version-assets.js");
const root = path.join(__dirname, "..");

test("every page loads the current content version of every local script and stylesheet", () => {
  let checked = 0;
  for (const file of fs.readdirSync(root).filter(file => file.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    for (const [, resource, query] of html.matchAll(/(?:src|href)="((?:js|css)\/[^"?]+)(\?[^"]*)?"/g)) {
      const expected = createHash("sha256").update(fs.readFileSync(path.join(root, resource))).digest("hex").slice(0, 12);
      assert.equal(query, `?v=${expected}`, `${file}: ${resource}`);
      checked++;
    }
  }
  assert.ok(checked > 200);
});

test("changing an asset invalidates every referring page without changing copy or external links", t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "wiki-versions-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.mkdirSync(path.join(directory, "js"));
  const script = path.join(directory, "js/copy.js");
  fs.writeFileSync(script, 'const title = "Before";');
  const markup = '<h1>Preserved copy</h1><script src="js/copy.js?v=old"></script><a href="https://example.org/">Source</a>';
  for (const name of ["index.html", "team.html"]) fs.writeFileSync(path.join(directory, name), markup);
  assert.equal(refreshAll({ directory }).length, 2);
  const before = fs.readFileSync(path.join(directory, "index.html"), "utf8");
  assert.equal(versionMarkup(before, directory), before);
  fs.writeFileSync(script, 'const title = "After";');
  assert.throws(() => refreshAll({ directory, check: true }), /Stale asset versions/);
  assert.equal(fs.readFileSync(path.join(directory, "index.html"), "utf8"), before);
  assert.equal(refreshAll({ directory }).length, 2);
  const after = fs.readFileSync(path.join(directory, "index.html"), "utf8");
  assert.notEqual(after, before);
  assert.equal(after.replace(/\?v=[a-f0-9]+/, "?v=old"), markup);
  assert.deepEqual(refreshAll({ directory, check: true }), []);
});
