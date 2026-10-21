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
const redirects = ["engineering.html", "home-orbit.html", "experiments.html", "experiment-enzyme-design.html", "experiment-enzyme-design-notebook.html", "experiment-enzyme-design-protocols.html"];

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

test("entry points retain the base theme and load their final page theme last", () => {
  const files = fs.readdirSync(root).filter(file => file.endsWith(".html"));
  assert.ok(files.length >= 21);
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    if (redirects.includes(file)) {
      assert.match(html, /<link rel="canonical" href="[^"]+"/, file);
      assert.match(html, /window\.location\.replace\(destination\.href\)/, file);
      assert.doesNotMatch(html, /css\/(?:mission-home|orbit-pages)\.css/, file);
      continue;
    }
    const sheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m => m[1].split("?")[0]);
    assert.ok(sheets.includes("css/cosmic-theme.css"), file);
    const last = ({
      "index.html": "css/mission-home.css",
      "team.html": "css/team-space.css",
      "project-description.html": "css/project-outline.css",
      "wet-lab.html": "css/wetlab-document.css",
      "wet-lab-notebook.html": "css/wetlab-document.css",
      "model.html": "css/project-outline.css",
      "human-practices.html": "css/project-outline.css"
    })[file] || "css/orbit-pages.css";
    assert.equal(sheets.at(-1), last, file);
  }
});

test("the Engineering redirect retains the cream reading theme for its fallback", () => {
  const html = fs.readFileSync(path.join(root, "engineering.html"), "utf8");
  assert.match(html, /<body data-page="project-description">/);
  assert.match(html, /href="css\/cosmic-theme\.css(?:\?[^\"]+)?"/);
  assert.match(html, /<a href="project-description\.html#(?:engineering|dbtl-cycle)">/);
  assert.doesNotMatch(html, /css\/orbit-pages\.css/);
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
  assert.ok(contrast("fff1bc", "10295d") >= 7, "Shared footer retains strong cream-on-navy contrast");
  for (const surface of ["fff4e3", "fffaf2", "f4dec4", "aebbff", "55e6ff", "ff7180", "ffe16a"]) {
    assert.ok(contrast("24305e", surface) >= 4.5, `Deep Ink on ${surface}`);
  }
  assert.ok(contrast("667095", "fffaf2") >= 4.5, "Muted Ink is reserved for Light Cream surfaces");
  assert.ok(contrast("ffffff", "f0182d") >= 3, "bold 1.2rem primary-button text");
});

test("every footer surface shares the reference dark blue on Home and reading pages", () => {
  assert.ok(css.includes("--footer-blue: #10295d;"));
  assert.ok(css.includes("--footer-text: #fff1bc;"));
  for (const token of ["footer-paper", "footer-paper-alt", "footer-paper-bottom", "footer-navy", "footer-navy-deep", "footer-navy-bottom"]) {
    const assignments = [...css.matchAll(new RegExp(`--${token}:\\s*([^;]+);`, "g"))];
    assert.ok(assignments.length > 0, token);
    for (const match of assignments) assert.equal(match[1], "var(--footer-blue)", token);
  }
  assert.match(css, /body\[data-page\] #siteFooter\s*\{[^}]*margin: 0;[^}]*padding: 0;[^}]*background: var\(--footer-blue\);/);
  assert.match(css, /#siteFooter :is\(\.sponsor-partner-band, \.link-directory-section, \.footer-inner, \.sponsor-marquee-item, \.sponsor-logo-frame\) \{ background: var\(--footer-blue\);/);
  assert.match(css, /#siteFooter :is\(a, p, small, strong, h2, h3, \.detail-eyebrow\) \{ color: var\(--footer-text\);/);
  assert.match(css, /#siteFooter a:focus-visible \{ outline: 3px solid var\(--footer-text\);/);
  assert.match(css, /#siteFooter \.sponsor-logo-frame img \{[^}]*background: var\(--footer-cream\);/);
  assert.doesNotMatch(innerTheme, /\.site-footer|\.sponsor-partner-band|\.link-directory-section/);
});

test("all content pages mount the shared sponsor, links, and copyright footer", () => {
  const files = fs.readdirSync(root).filter(file => file.endsWith(".html") && !redirects.includes(file));
  assert.equal(files.length, 31);
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    assert.equal((html.match(/id="siteFooter"/g) || []).length, 1, file);
    assert.match(html, /css\/cosmic-theme\.css\?v=[a-f0-9]{12}/, file);
    assert.match(html, /src="js\/site\.js/, file);
  }
  const renderer = fs.readFileSync(path.join(root, "js/site.js"), "utf8");
  assert.match(renderer, /renderFooter\(\);/);
  for (const marker of ['id="sponsors-partners"', 'id="important-links"', 'class="container footer-inner"']) assert.ok(renderer.includes(marker), marker);
  assert.match(renderer, /© 2026 iGEM Renata\./);
  assert.match(renderer, /creativecommons\.org\/licenses\/by\/4\.0/);
  assert.doesNotMatch(renderer, /All rights reserved/);
});
