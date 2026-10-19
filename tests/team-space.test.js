"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { init } = require("../js/team-space.js");
const read = name => fs.readFileSync(path.join(__dirname, "..", name), "utf8");

test("blue team hero breadcrumb uses cream while portrait cards retain dark text", () => {
  const css = read("css/team-space.css");
  assert.match(css, /body\[data-page="team"\]\.orbit-pages \.orbit-page-breadcrumb a\s*\{ color: var\(--crew-cream\);/);
  assert.match(css, /\.orbit-page-breadcrumb a:focus-visible\s*\{ outline-color: var\(--crew-cream\);/);
  assert.match(css, /\.team-card-front\s*\{[^}]*background: var\(--crew-cream\);[^}]*color: var\(--crew-night\);/);
});

function fixture(page = "team") {
  const node = (text = "") => ({ textContent: text, attrs: {}, dataset: {}, classes: [],
    setAttribute(key, value) { this.attrs[key] = value; },
    classList: { add() {} } });
  const selectorMap = Object.fromEntries([
    ".orbit-page-lead", ".orbit-scene-caption > span", ".orbit-scene-center text", ".orbit-scene-center image",
    ".team-dealer-copy > span", ".team-dealer-copy > strong", ".team-dealer-copy > p", ".team-dealer-art text"
  ].map(selector => [selector, node()]));
  const titles = [node("Existing title"), node("Existing subtitle")];
  const backs = [node("R"), node("R")];
  const roster = { dataset: {}, querySelector: selector => selectorMap[selector], querySelectorAll: () => backs };
  const hero = { querySelector: selector => selectorMap[selector], querySelectorAll: () => titles };
  const doc = { body: { dataset: { page } }, querySelector: selector => ({ ".team-card-table": roster, ".orbit-page-hero": hero })[selector] };
  return { doc, roster, selectorMap, titles, backs };
}

test("crew identity enhances the existing team page exactly once", () => {
  const { doc, roster, titles, selectorMap } = fixture();
  assert.equal(init(doc), true);
  assert.equal(roster.dataset.teamSpace, "true");
  assert.equal(init(doc), false);
  assert.deepEqual(titles.map(node => node.textContent), ["Our team.", "The SulFlux crew."]);
  assert.equal(selectorMap[".orbit-scene-center image"].attrs.href, "assets/orbit/bottle.svg");
  assert.match(selectorMap[".team-dealer-copy > p"].textContent, /Mentors, then students/);
});

test("crew enhancement is scoped and tolerates missing shared decoration", () => {
  assert.equal(init(fixture("home").doc), false);
  assert.equal(init({ body: { dataset: { page: "team" } }, querySelector: () => null }), false);
  const { doc, roster } = fixture();
  doc.querySelector = selector => selector === ".team-card-table" ? roster : null;
  assert.equal(init(doc), true);
});

test("the full-team photo block is removed while individual roster cards remain", () => {
  const context = { window: {} };
  vm.runInNewContext(read("js/site-content.js"), context);
  const pageData = context.window.SITE_DATA.pages.team;
  assert.equal(Object.hasOwn(pageData, "teamPhoto"), false);
  const source = read("js/site.js");
  const start = source.indexOf("  function renderTeamPage(");
  const end = source.indexOf("  function renderTeamGroup(", start);
  const render = vm.runInNewContext(`(${source.slice(start, end).trim()})`, {
    pageData,
    renderTeamGroup: group => `<section id="${group.key}">${group.members.length} crew cards</section>`,
    renderDetailSections: () => ""
  });
  const html = render();
  assert.doesNotMatch(html, /team-photo|Full team photo|Together, we are Renata|Panoramic image/);
  assert.match(html, /class="team-roster"/);
  assert.match(html, /id="mentors"/);
  assert.match(html, /id="students"/);
  assert.equal(pageData.teamGroups.reduce((total, group) => total + group.members.length, 0), 29);
});

test("roster data, card dealing and profile behavior stay under existing controllers", () => {
  const source = read("js/team-space.js");
  assert.doesNotMatch(source, /team-photo|innerHTML|\.animate\(|requestAnimationFrame|setTimeout|addEventListener|member-meta|data-member-profile/);
  const css = read("css/team-space.css");
  assert.doesNotMatch(css, /\.team-photo|\.member-card\s*\{|transform\s*:/);
  assert.match(css, /\.member-profile-open:focus-visible/);
  assert.match(css, /@media \(max-width: 650px\)/);
  const html = read("team.html");
  assert.ok(html.indexOf("css/team-space.css") > html.indexOf("css/orbit-pages.css"));
  assert.ok(html.indexOf("js/team-space.js") > html.indexOf("js/team-profiles.js"));
  assert.ok(html.indexOf("js/team-space.js") > html.indexOf("js/team-deal.js"));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "assets/orbit/bottle.svg")));
});
