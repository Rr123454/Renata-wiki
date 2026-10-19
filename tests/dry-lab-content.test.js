"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = vm.createContext({ window: {} });
vm.runInContext(read("js/site-content.js"), context);
const originalRecords = Object.keys(context.window.SITE_DATA.experimentRecordTabs);
vm.runInContext(read("js/dry-lab-content.js"), context);
vm.runInContext(read("js/lab-content.js"), context);
vm.runInContext(read("js/project-description-content.js"), context);
vm.runInContext(read("js/engineering-content.js"), context);
vm.runInContext(read("js/project-paper.js"), context);
const data = context.window.SITE_DATA;
const key = "experiment-enzyme-design";
const content = data.experimentRecordTabs[key].content;
const pageContent = file => {
  if (file === "project-description.html") return context.window.RenataProject.render(data.pages["project-description"]);
  if (["wet-lab.html", "wet-lab-notebook.html", "model.html"].includes(file)) return context.window.RenataLab.render(file.replace(/\.html$/, ""));
  const page = data.pages[file.replace(/\.html$/, "")];
  return page?.recordKey === key ? content[page.recordView] : "";
};

test("source Overview, Notebook, and Protocols records remain available behind compatibility routes", () => {
  assert.equal(data.experimentRecordTabs[key].overviewLabel, "Overview");
  for (const [view, suffix] of [["overview", ""], ["notebook", "-notebook"], ["protocols", "-protocols"]]) {
    const pageKey = key + suffix;
    assert.equal(data.pages[pageKey].recordView, view);
    assert.equal(data.pages[pageKey].group, "lab-work");
    assert.ok(fs.existsSync(path.join(root, pageKey + ".html")));
    assert.ok(content[view].length > 1000);
  }
  for (const oldKey of originalRecords) assert.ok(data.experimentRecordTabs[oldKey]);
  assert.equal(data.experimentRoutes.filter(route => route.href === key + ".html").length, 1);
});

test("source guide covers all eleven Google Doc tabs with numbered sources", () => {
  for (const tab of ["t.0", "t.e0uhhpvtzxr2", "t.8aufh9r2twos", "t.rrxztbt0ctj7", "t.9z9za7sypse6", "t.8jnhl5t9c7qw", "t.4q1xtbwxkwv5", "t.fm1ab4nonj08", "t.klgi10wz4wek", "t.j6oa5dv0u3lh", "t.972qmrkdirwk"]) {
    assert.ok(content.overview.includes(`?tab=${tab}"`), tab);
  }
  for (const html of Object.values(content)) {
    assert.ok(html.includes("working document"));
    assert.equal([...html.matchAll(/id="source-\d+"/g)].length, 15);
    assert.doesNotMatch(html, /ppl-ai-file-upload/);
    const pdfLinks = [...html.matchAll(/href="([^"]+\.pdf)"/g)].map(match => match[1]);
    assert.deepEqual(pdfLinks, ["https://resources.rndsystems.com/pdfs/datasheets/ea003.pdf"]);
  }
});

test("all generated IDs are unique and local links, anchors, and figures resolve", () => {
  for (const [view, html] of Object.entries(content)) {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, view);
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = raw.replaceAll("&amp;", "&");
      if (/^https?:/.test(url)) continue;
      const [pathname, fragment] = url.split("#");
      const file = pathname.split("?")[0];
      if (file) assert.ok(fs.existsSync(path.join(root, file)), `${view}: ${url}`);
      if (fragment) {
        const target = file ? pageContent(file) || read(file) : html;
        assert.ok(target.includes(`id="${fragment}"`), `${view}: ${url}`);
      }
    }
  }
});

test("new reported results preserve missing data and evidence boundaries", () => {
  assert.match(content.notebook, /4\.21 ± 0\.23/);
  assert.match(content.notebook, /8\.79 ± 1\.49/);
  assert.match(content.notebook, /−8\.973/);
  assert.match(content.notebook, /0\.169/);
  assert.match(content.notebook, /unit unspecified/);
  assert.match(content.notebook, /Passing runs/);
  assert.match(content.notebook, /does not define the ± statistic/);
  assert.ok(content.notebook.includes("identifies no confident catalytic base"));
  assert.match(content.protocols, /STA-631/);
  assert.match(content.protocols, /PAP-specific/);
  assert.match(content.protocols, /second Ni-NTA flow-through/);
  assert.match(content.protocols, /six replicates/);
  assert.match(content.protocols, /0, 15, 30, 60, and 120/);
  assert.match(content.protocols, /no completion status implied/);
});

test("protein inputs retain exact lengths and declared substitutions", () => {
  const sequences = new Map([...content.protocols.matchAll(/&gt;([^\n]+)\n([A-Z\n]+)/g)]
    .map(([, name, sequence]) => [name, sequence.replaceAll("\n", "")]));
  const wt = sequences.get("BtSULT_Q8AAP8");
  const mutant = sequences.get("SultRn_preliminary_E144A_W161A_K211A_F248A_F249A_T252A");
  assert.equal(wt.length, 368);
  assert.equal(sequences.get("Human_SULT2A1_Q06520").length, 285);
  assert.equal(mutant.length, 368);
  const changes = [...wt].flatMap((residue, i) => residue === mutant[i] ? [] : [`${residue}${i + 1}${mutant[i]}`]);
  assert.deepEqual(changes, ["E144A", "W161A", "K211A", "F248A", "F249A", "T252A"]);
  const glu = sequences.get("graft_Glu144");
  const asp = sequences.get("graft_Asp144");
  assert.equal(glu.length, 353);
  assert.equal(asp.length, 353);
  assert.equal(glu[143], "E");
  assert.equal(asp[143], "D");
  assert.equal(glu.slice(0, 143) + glu.slice(144), asp.slice(0, 143) + asp.slice(144));
  assert.match(content.protocols, /Resolve the T\/A difference/);
});

test("section navigation follows the article's reading order", () => {
  for (const [view, html] of Object.entries(content)) {
    const nav = html.match(/<nav class="dry-lab-toc"[\s\S]*?<\/nav>/)[0];
    const links = [...nav.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
    const sections = [...html.matchAll(/<section class="dry-lab-section" id="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links, sections, view);
  }
});

test("entry points load cache-refreshed dry-lab content before the renderer", () => {
  for (const file of ["wet-lab.html", "model.html"]) {
    const html = read(file);
    assert.match(html, /dry-lab-content\.js\?v=20261019-structure1/);
    assert.ok(html.indexOf("js/dry-lab-content.js") < html.indexOf("js/lab-content.js"), file);
    assert.ok(html.indexOf("js/lab-content.js") < html.indexOf("js/site.js"), file);
    assert.ok(html.indexOf("js/dry-lab-content.js") < html.indexOf("js/site.js"), file);
  }
});
