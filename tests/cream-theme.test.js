"use strict";
// Run: node --test tests/cream-theme.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const css = fs.readFileSync(path.join(root, "css/cosmic-theme.css"), "utf8");
const marker = "/* Reading pages share the bottle's warm cream";
const innerTheme = css.slice(css.indexOf(marker));

test("the reading palette uses the requested color values", () => {
  for (const [name, value] of Object.entries({
    "main-cream": "fff4e3", "light-cream": "fffaf2", "warm-beige": "f4dec4",
    "cosmic-blue": "748cff", "soft-periwinkle": "aebbff", "navigation-cyan": "55e6ff",
    "soft-coral": "ff7180", "deep-ink": "24305e", "muted-ink": "667095"
  })) assert.ok(innerTheme.includes(`--${name}: #${value};`), name);
  assert.ok(css.includes("--yakult-red: #f0182d;"));
  assert.ok(css.includes("--star-yellow: #ffe16a;"));
});

test("every new rule excludes Home", () => {
  const rules = innerTheme.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{[^{}]*\}/g);
  let count = 0;
  for (const rule of rules) {
    // Each top-level comma-separated selector must carry the non-home guard.
    const selector = rule[1].trim();
    const topLevelSelectors = selector.split(/,(?=\s*(?:body|html))/);
    for (const part of topLevelSelectors) assert.ok(part.includes(':not([data-page="home"])'), part);
    count++;
  }
  assert.ok(count > 30);
  assert.ok(css.includes("--cosmic-sky: #748cff;"));
  assert.ok(css.includes("--deep-ink: #18265a;"), "Home's original Deep Ink is retained");
});

test("all 21 entry points load the refreshed theme last", () => {
  const files = fs.readdirSync(root).filter(file => file.endsWith(".html"));
  assert.equal(files.length, 21);
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    const sheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m => m[1]);
    assert.equal(sheets.at(-1), "css/cosmic-theme.css?v=20261001-cream1", file);
  }
});

function luminance(hex) {
  const rgb = hex.match(/../g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a, b) {
  const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (light + .05) / (dark + .05);
}

test("reading text and control labels retain appropriate contrast", () => {
  for (const surface of ["fff4e3", "fffaf2", "f4dec4", "aebbff", "55e6ff", "ff7180", "ffe16a"]) {
    assert.ok(contrast("24305e", surface) >= 4.5, `Deep Ink on ${surface}`);
  }
  assert.ok(contrast("667095", "fffaf2") >= 4.5, "Muted Ink is reserved for Light Cream surfaces");
  assert.ok(contrast("ffffff", "f0182d") >= 3, "bold 1.2rem primary-button text");
});
