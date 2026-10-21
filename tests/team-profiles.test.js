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

test("all supplied student bios map to unique students; Noah has one consolidated entry", () => {
  const names = ["Alex Fang", "Hanyu Huang", "Margaret Lin", "Vanessa Liang", "Tiger Liu", "Kylie Tien", "Aaron Torres", "Ryan Jian", "Humza Shahzad", "Matthew She", "Deena Singh", "Yuqing Zhuo", "Karthik Sajeev", "Kyle Kao", "Noah Chu", "Brandon Trinh", "Lakshya Gupta", "Kavi Shrivastava", "Ritvin Rejith", "Aidan R.", "Hannah Bae"];
  for (const name of names) {
    const matches = students.filter(member => member.name === name);
    assert.equal(matches.length, 1, name);
    assert.ok(matches[0].bio.length > 30, name);
    assert.ok(matches[0].school, name);
    assert.doesNotMatch(matches[0].bio, /&#x20;|whoever reading|choose what to add/);
  }
  assert.equal(students.length, 23);
  assert.ok(students.every(member => !/faizaan/i.test(member.name)));
  assert.equal(students.filter(member => member.bio?.trim()).length, 21);
  assert.ok(students.every(member => member.role === "Student"));
  assert.match(students.find(member => member.name === "Noah Chu").bio, /aquariums/);
});

test("mentors and members with no supplied biography are preserved", () => {
  assert.deepEqual(Array.from(groups[0].members, member => member.name), ["Emma Zschunke", "Preya Shrivastava", "Matt M.", "Dr. Tasha Barr", "Sharan S.", "Samantha Renusch"]);
  for (const name of ["Ella Y.", "Toni D."]) {
    const member = students.find(item => item.name === name);
    assert.ok(member, name); assert.equal(member.bio?.trim() || "", "", name);
  }
  assert.deepEqual(Array.from(groups[0].members, member => member.role), ["Primary PI", "Secondary PI", "Advisor", "Mentor", "Community Mentor", "Scientific Mentor"]);
});

test("all supplied student and mentor portraits retain their member assignments", () => {
  const expected = ["Humza Shahzad", "Karthik Sajeev", "Kavi Shrivastava", "Kyle Kao", "Ritvin Rejith", "Aaron Torres", "Aidan R.", "Brandon Trinh", "Ella Y.", "Alex Fang", "Hannah Bae", "Hanyu Huang", "Kylie Tien", "Margaret Lin", "Matthew She", "Ryan Jian", "Tiger Liu", "Toni D.", "Vanessa Liang", "Yuqing Zhuo", "Deena Singh", "Noah Chu", "Lakshya Gupta"];
  const portraits = students.filter(member => member.photo);
  assert.deepEqual(Array.from(portraits, member => member.name), expected);
  for (const [name, file] of Object.entries({"Emma Zschunke": "Emma Zschunke.png", "Preya Shrivastava": "Preya.png", "Matt M.": "Matt M.png", "Dr. Tasha Barr": "Tasha B.png", "Sharan S.": "Sharan.png", "Samantha Renusch": "Samantha.png"})) {
    const member = groups[0].members.find(item => item.name === name);
    assert.equal(member.photo, `assets/Team Images/${file}`);
    assert.ok(fs.existsSync(path.join(__dirname, "..", member.photo)));
  }
  for (const member of portraits) {
    assert.match(member.photo, /^assets\/Team Images\//, member.name);
    assert.ok(fs.existsSync(path.join(__dirname, "..", member.photo.split("?")[0])), member.photo);
  }
  assert.equal(students.find(member => member.name === "Yuqing Zhuo").photo, "assets/Team Images/skylar zhuo.jpg");
  assert.equal(students.find(member => member.name === "Kavi Shrivastava").photo, "assets/Team Images/Kavi S.jpg");
  assert.equal(students.find(member => member.name === "Ritvin Rejith").photo, "assets/Team Images/ritvin.png");
});

test("the 17 updated bios retain supplied roles and school corrections", () => {
  const members = groups.flatMap(group => group.members);
  const details = {
    "Deena Singh": /16 years old[\s\S]*Fundraising Manager[\s\S]*sponsors/,
    "Aaron Torres": /15 years old[\s\S]*wiki\/web development[\s\S]*business/,
    "Tiger Liu": /15 years old[\s\S]*plasmid engineering/,
    "Brandon Trinh": /17[\s\S]*Dry Lab[\s\S]*Humza[\s\S]*Paris/,
    "Matthew She": /14 years old[\s\S]*fundraising and marketing/,
    "Kylie Tien": /16[\s\S]*Dry Lab & Business Member/,
    "Dr. Tasha Barr": /Ph\.D\.[\s\S]*UC Riverside[\s\S]*experimental design/,
    "Ritvin Rejith": /2027[\s\S]*Wiki and Software[\s\S]*volleyball/,
    "Margaret Lin": /wiki\/webdev head[\s\S]*documentation and data analysis/,
    "Samantha Renusch": /Director of Education[\s\S]*IMPOWER Learning Lab[\s\S]*independent scientists/,
    "Yuqing Zhuo": /17 years old[\s\S]*upcoming senior/,
    "Humza Shahzad": /17[\s\S]*co-founders[\s\S]*Karthik Sajeev/,
    "Kavi Shrivastava": /Northwood High School[\s\S]*Wetlab Manager/,
    "Hanyu Huang": /17[\s\S]*Business Department fundraising/,
    "Aidan R.": /17-year-old[\s\S]*Damien High School[\s\S]*funding and outreach/,
    "Vanessa Liang": /15[\s\S]*secretary[\s\S]*taking attendance/,
    "Hannah Bae": /17[\s\S]*wet lab researcher[\s\S]*Renata for Gold!!!/
  };
  for (const [name, pattern] of Object.entries(details)) {
    const matches = members.filter(member => member.name === name);
    assert.equal(matches.length, 1, name);
    assert.match(matches[0].bio, pattern, name);
  }
  assert.equal(students.find(member => member.name === "Kavi Shrivastava").school, "Northwood High School");
  assert.equal(students.find(member => member.name === "Hannah Bae").school, "Northwood High School");
  assert.equal(students.find(member => member.name === "Aidan R.").school, "Damien High School");
  assert.ok(students.every(member => member.role === "Student"));
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
  const end = source.indexOf("  function renderExperimentsPage(", start);
  const render = vm.runInNewContext(`(${source.slice(start, end).trim()})`);
  const html = render({ key: "students" }, { name: 'Test <Name> "One"', photo: 'assets/Team Images/Test "One".png', role: "R&D", bio: "Long private draft" }, 3);
  assert.match(html, /data-member-profile="students:3"/);
  assert.match(html, /class="member-photo" src=/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /fetchpriority="low"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /type="button"/);
  assert.match(html, /Test &lt;Name&gt; &quot;One&quot;/);
  assert.match(html, /R&amp;D/);
  assert.doesNotMatch(html, /Long private draft/);
  const brandon = students.find(member => member.name === "Brandon Trinh");
  const withPhoto = render({ key: "students" }, brandon, students.indexOf(brandon));
  assert.match(brandon.photo, /^assets\/Team Images\/Brandon Trinh\.jpeg\?v=/);
  assert.match(withPhoto, /class="member-photo"/);
  assert.match(withPhoto, /View profile: Brandon Trinh/);
  assert.match(withPhoto, /Brandon Trinh\.jpeg\?v=/);
  assert.doesNotMatch(brandon.bio, /leave me without|photo|let me know/i);
  assert.ok(fs.existsSync(path.join(__dirname, "../assets/Team Images/Brandon Trinh.jpeg")));
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

test("long student and mentor biographies retain paragraph breaks in their dialogs", () => {
  for (const name of ["Deena Singh", "Dr. Tasha Barr", "Samantha Renusch"]) {
    const group = groups.find(group => group.members.some(member => member.name === name));
    const index = group.members.findIndex(member => member.name === name);
    const f = fixture();f.open(`${group.key}:${index}`);
    assert.equal(f.parts["#team-profile-name"].textContent, name);
    assert.equal(f.parts["#team-profile-bio"].textContent, group.members[index].bio);
    assert.match(f.parts["#team-profile-bio"].textContent, /\n\n/);
    assert.equal(f.dialog.scrollTop, 0);
  }
  assert.match(read("css/team-profiles.css"), /white-space: pre-line/);
});

test("team entry point loads profile assets and mobile profiles can scroll", () => {
  const html = read("team.html"), css = read("css/team-profiles.css"), js = read("js/team-profiles.js");
  assert.match(html, /css\/team-profiles.css\?v=[a-f0-9]{12}/);
  assert.ok(html.indexOf("js/team-profiles.js") > html.indexOf("js/team-deal.js"));
  assert.match(css, /max-height: calc\(100dvh - 24px\)/);
  assert.match(css, /overflow: auto/);
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(js, /page.createElement\("dialog"\)/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(js, /team-photo-section|team-photo-caption/);
});
