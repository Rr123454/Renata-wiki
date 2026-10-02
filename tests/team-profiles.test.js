"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { profileMap, schoolLine, init } = require("../js/team-profiles.js");
const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
const context = { window: {} };
vm.runInNewContext(read("js/site-content.js"), context);
const data = context.window.SITE_DATA;
const groups = data.pages.team.teamGroups;
const students = groups.find(group => group.key === "students").members;

test("all 17 supplied bios map to unique students; Noah has one consolidated entry", () => {
  const names = ["Alex Fang", "Hanyu Huang", "Margaret Lin", "Vanessa Liang", "Tiger Liu", "Kylie Tien", "Aaron Torres", "Ryan Jian", "Humza Shahzad", "Matthew She", "Deena Singh", "Yuqing Zhuo", "Karthik Sajeev", "Kyle Kao", "Noah Chu", "Brandon Trinh", "Lakshya Gupta"];
  for (const name of names) {
    const matches = students.filter(member => member.name === name);
    assert.equal(matches.length, 1, name);
    assert.ok(matches[0].bio.length > 30, name);
    assert.ok(matches[0].school, name);
    assert.doesNotMatch(matches[0].bio, /&#x20;|whoever reading|choose what to add/);
  }
  assert.equal(students.length, 24);
  assert.equal(students.filter(member => member.bio).length, 17);
  assert.match(students.find(member => member.name === "Noah Chu").role, /Video Production/);
  assert.match(students.find(member => member.name === "Noah Chu").bio, /aquariums/);
  assert.match(students.find(member => member.name === "Brandon Trinh").role, /Dry Lab/);
  assert.match(students.find(member => member.name === "Karthik Sajeev").role, /Education & Human Practices/);
});

test("mentors and members with no supplied biography are preserved", () => {
  assert.deepEqual(Array.from(groups[0].members, member => member.name), ["Emma Zschunke", "Preya Shrivastava", "Matt M.", "Tasha B.", "Sharan S."]);
  for (const name of ["Kavi S.", "Ritvin R.", "Aiden R.", "Ella Y.", "Faizaan M.", "Hannah B.", "Toni D."]) {
    const member = students.find(item => item.name === name);
    assert.ok(member, name); assert.equal(member.bio, undefined);
  }
  assert.deepEqual(Array.from(students.slice(0,5), member => member.role.startsWith("Student Leader")), [true,true,true,true,true]);
});

test("profile keys match card positions and school labels use supplied facts only", () => {
  const profiles = profileMap(groups);
  assert.equal(profiles.size, 29);
  for (const group of groups) group.members.forEach((member, index) => assert.equal(profiles.get(`${group.key}:${index}`), member));
  assert.equal(schoolLine(students.find(member => member.name === "Alex Fang")), "Troy High School · Class of 2027");
  assert.equal(schoolLine(students.find(member => member.name === "Margaret Lin")), "Troy High School · Senior");
  assert.equal(schoolLine(groups[0].members[0]), "");
});

test("compact cards expose an accessible full-card button and escape member text", () => {
  const source = read("js/site.js");
  const start = source.indexOf("  function renderMemberCard(");
  const end = source.indexOf("  function renderHomePage(", start);
  const render = vm.runInNewContext(`(${source.slice(start, end).trim()})`);
  const html = render({ key: "students" }, { name: 'Test <Name> "One"', role: "R&D", bio: "Long private draft" }, 3);
  assert.match(html, /data-member-profile="students:3"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /type="button"/);
  assert.match(html, /Test &lt;Name&gt; &quot;One&quot;/);
  assert.match(html, /R&amp;D/);
  assert.doesNotMatch(html, /Long private draft/);
});

function fixture(reduced = false) {
  function element() {
    const classes = new Set();
    return {
      listeners: {}, attrs: {}, children: [], textContent: "", hidden: false, focused: false,
      classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name) },
      addEventListener(name, fn) { this.listeners[name] = fn; },
      setAttribute(name, value) { this.attrs[name] = value; },
      appendChild(child) { this.children.push(child); },
      replaceChildren(...children) { this.children = children; },
      focus() { this.focused = true; },
      getBoundingClientRect: () => ({ left: 100, right: 900, top: 60, bottom: 700, width: 800, height: 640 })
    };
  }
  const roster = element(), dialog = element(), body = element();
  body.dataset = { page: "team" };
  const parts = Object.fromEntries([".team-profile-photo", "#team-profile-name", ".team-profile-role", ".team-profile-school", "#team-profile-bio", ".team-profile-close"].map(key => [key, element()]));
  parts[".team-profile-photo"].animate = () => { parts[".team-profile-photo"].animated = true; return { cancel() {} }; };
  dialog.querySelector = key => parts[key];
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.listeners.close(); };
  roster.contains = () => true;
  const page = { body, getElementById: () => null, querySelector: () => roster, createElement: () => dialog };
  init({ SITE_DATA: data, matchMedia: () => ({ matches: reduced }) }, page);
  function open(key) {
    const portrait = { getBoundingClientRect: () => ({ left: 10, top: 300, width: 140, height: 160 }), cloneNode: () => ({ clonedPortrait: true }) };
    const card = { querySelector: () => portrait };
    const trigger = element(); trigger.dataset = { memberProfile: key }; trigger.isConnected = true;
    trigger.closest = selector => selector === ".member-card" ? card : trigger;
    roster.listeners.click({ target: trigger });
    return trigger;
  }
  return { dialog, parts, body, open };
}

test("click opens the selected portrait and bio; close restores focus and scrolling", () => {
  const f = fixture();
  const index = students.findIndex(member => member.name === "Alex Fang");
  const opener = f.open(`students:${index}`);
  assert.equal(f.dialog.open, true);
  assert.equal(f.parts["#team-profile-name"].textContent, "Alex Fang");
  assert.equal(f.parts["#team-profile-bio"].textContent, students[index].bio);
  assert.equal(f.parts[".team-profile-photo"].children[0].clonedPortrait, true);
  assert.equal(f.parts[".team-profile-photo"].animated, true);
  assert.equal(f.parts[".team-profile-close"].focused, true);
  assert.equal(f.body.classList.contains("team-profile-is-open"), true);
  assert.equal(f.dialog.attrs["aria-labelledby"], "team-profile-name");
  f.parts[".team-profile-close"].listeners.click();
  assert.equal(f.dialog.open, false);
  assert.equal(f.body.classList.contains("team-profile-is-open"), false);
  assert.equal(opener.focused, true);
});

test("backdrop closes the dialog; clicking inside preserves it; missing bios are explicit", () => {
  const f = fixture(true); f.open("mentors:0");
  assert.equal(f.parts["#team-profile-bio"].textContent, "Bio coming soon.");
  assert.equal(f.parts[".team-profile-school"].hidden, true);
  assert.equal(f.parts[".team-profile-photo"].animated, undefined);
  f.dialog.listeners.click({ target: f.dialog, clientX: 200, clientY: 200 });
  assert.equal(f.dialog.open, true);
  f.dialog.listeners.click({ target: f.dialog, clientX: 0, clientY: 0 });
  assert.equal(f.dialog.open, false);
});

test("team entry point loads profile assets and mobile profiles can scroll", () => {
  const html = read("team.html"), css = read("css/team-profiles.css"), js = read("js/team-profiles.js");
  assert.match(html, /css\/team-profiles.css\?v=20261001-profiles1/);
  assert.ok(html.indexOf("js/team-profiles.js") > html.indexOf("js/team-deal.js"));
  assert.match(css, /max-height: calc\(100dvh - 24px\)/);
  assert.match(css, /overflow: auto/);
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(js, /page.createElement\("dialog"\)/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(js, /team-photo-section|team-photo-caption/);
});
