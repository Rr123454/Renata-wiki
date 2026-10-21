"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {execFileSync} = require("node:child_process");
const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = vm.createContext({window: {SITE_DATA: {pages: {"project-description": {}}}}});
vm.runInContext(read("js/project-overview-content.js"), context);
const description = context.window.SITE_DATA.pages["project-description"].description;
const plain = html => html.replace(/<[^>]*>/g, "").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

test("Project Description preserves all supplied body paragraphs and bullets in order", () => {
  const lines = read("content/project-description.txt").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const body = lines.slice(0, lines.findIndex(line => /^1\. Cai,/.test(line)));
  const blocks = description.sections.flatMap(section => [...section.html.matchAll(/<(?:p|li)>([\s\S]*?)<\/(?:p|li)>/g)].map(match => plain(match[1])));
  assert.deepEqual(Array.from(blocks), body.map(line => line.replace(/^- /, "")));
  assert.equal(blocks.length, 67);
  assert.equal(description.sections.length, 11);
});

test("Every inline reference resolves to a public reference and supplementary sources stay qualified", () => {
  const ids = new Set(description.references.map(ref => ref.number));
  for (const section of description.sections) for (const match of section.html.matchAll(/href="#description-ref-(\d+)"/g)) assert.ok(ids.has(Number(match[1])));
  assert.equal(description.references.length, 13);
  assert.match(description.references[1].html, /Unalp-Arida, Aynur, and Constance E\. Ruhl/);
  assert.match(description.references[12].html, /not peer-reviewed/);
  assert.equal(description.references.filter(ref => ref.supplementary).length, 2);
  assert.doesNotMatch(description.references.map(ref => ref.html).join(""), /Pasted text|file:\/\/|Team-supplied|content\//);
});

test("Project Description generated content is current", () => {
  execFileSync(process.execPath, ["scripts/build-project-description.cjs", "--check"], {cwd: root, windowsHide: true});
});
