"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const context = { window: {} };
vm.runInNewContext(read("js/site-content.js"), context);
const data = context.window.SITE_DATA;
const orbit = require("../js/orbit-pages.js");

test("Kickstart is a Contribution entry, with no separate main-menu or footer item", () => {
  assert.equal(data.contributionRoutes.length, 2);
  assert.equal(data.contributionRoutes[0].href, "igem-kickstart.html");
  assert.equal(data.contributionRoutes[0].title, data.pages["igem-kickstart"].title);
  assert.doesNotMatch(JSON.stringify(data.nav), /igem-kickstart\.html/);
  assert.doesNotMatch(JSON.stringify(data.pages.home.linkColumns), /igem-kickstart\.html/);
  assert.equal(data.pages.contribution.group, "engagement");
});

test("Contribution features Kickstart in a large linked editorial layout", () => {
  const source = read("js/site.js");
  const start = source.indexOf("  function renderContributionPage(");
  const end = source.indexOf("  function renderEducationPage(", start);
  const render = vm.runInNewContext(`(${source.slice(start, end).trim()})`, { data });
  const html = render();
  for (const value of ["contribution-feature", "contribution-guide-preview", "Read the guide", 'href="igem-kickstart.html"', data.contributionRoutes[0].summary]) {
    assert.ok(html.includes(value), value);
  }
  assert.doesNotMatch(html, /coming soon|PLACEHOLDER|experiment-route-number/);
  assert.match(html, /<h2 id="kickstart-feature-title">/);
  assert.match(html, /aria-labelledby="kickstart-feature-title"/);
  assert.match(html, /href="https:\/\/registry.igem.org\/parts\/bba-26tr5lm8" aria-labelledby="registry-part-feature-title" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /View Registry entry/);
  assert.match(html, /<h2 id="registry-part-feature-title">Registry Part: BBa_26TR5LM8<\/h2>/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, "each resource has a unique heading ID");
  assert.match(read("contribution.html"), /css\/contribution.css/);
  assert.match(read("css/contribution.css"), /@media \(max-width: 760px\)/);
  assert.match(source, /pageKey === "contribution"\) \{\s*main.innerHTML = renderContributionPage\(\)/);
});

test("Kickstart links back to Contribution in its breadcrumb and closing navigation", () => {
  const chapter = orbit.pageChapter("igem-kickstart", data.pages["igem-kickstart"]);
  assert.equal(chapter.parent.href, "contribution.html");
  assert.equal(chapter.next, "contribution.html");
  assert.equal(chapter.label, "Contribution");
  assert.match(orbit.heroMarkup(chapter, "title", data.pages["igem-kickstart"].title, []), /href="contribution.html">Contribution<\/a>/);
});
