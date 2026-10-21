"use strict";
// Reuse the annotated source renderer at build time; source pages stay static.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const context = vm.createContext({ window: {} });
for (const file of ["site-content", "dry-lab-content", "wet-lab-content", "wet-lab-notebook-data", "lab-content"]) {
  vm.runInContext(fs.readFileSync(path.join(root, "js", file + ".js"), "utf8"), context);
}
const lab = context.window.RenataLab;
const source = context.window.RENATA_WETLAB;
const sourceFile = path.join(root, source.pdf);
if (require("node:crypto").createHash("sha256").update(fs.readFileSync(sourceFile)).digest("hex") !== source.pdfSha256.toLowerCase()) {
  throw new Error("The original 74-page record has changed");
}
const prefixIds = markup => {
  const ids = new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  return markup.replace(/\bid="([^"]+)"/g, 'id="review-$1"')
    .replace(/href="#([^"]+)"/g, (match, id) => ids.has(id) ? `href="#review-${id}"` : match)
    .replace(/aria-labelledby="([^"]+)"/g, (_, value) => `aria-labelledby="${value.split(" ").map(id => ids.has(id) ? "review-" + id : id).join(" ")}"`);
};
let review = lab.render("wet-lab").match(/<article\b[^>]*>([\s\S]*)<\/article>/)[1];
const pages = { assembly: 2, screening: 4, expression: 10, purification: 13, quantification: 15, "protein-gels": 19, assay: 23 };
review = review.replace(/href="wet-lab-notebook.html#notebook-([^"]+)"/g, (_, id) => {
  if (!pages[id]) throw new Error("Unmapped annotated notebook reference: " + id);
  return `href="${source.pdf}#page=${pages[id]}"`;
});
review = prefixIds(review);
const originalNotebook = lab.render("wet-lab-notebook");
const bookmarks = [...originalNotebook.matchAll(/id="([^"]+)" data-notebook-page="(\d+)"/g)].map(([, id, page]) =>
  `<li id="${id}"><a href="${source.pdf}#page=${page}" target="_blank" rel="noopener">${id.replace(/^notebook-/, "").replaceAll("-", " ")} · p. ${page}</a></li>`
).join("");
const transcript = originalNotebook.match(/<details class="lab-notebook-transcript">([\s\S]*)<\/details>/)[1]
  .replace(/<summary>[\s\S]*?<\/summary>/, "<summary>Annotated chronology · June–October</summary>");
process.stdout.write(JSON.stringify({
  review: `<details class="lab-method-details lab-evidence-review" id="evidence-review"><summary>Annotated evidence review</summary>${review}</details>`,
  chronology: `<section class="lab-section" id="additional-lab-documentation"><h2>Additional lab documentation</h2><p>The separately supplied <a href="${source.pdf}" target="_blank" rel="noopener">74-page iGEM Renata Lab Documentation 2026 PDF</a> and its annotated chronology remain available alongside the 19-page notebook above. Page references in this section refer to the 74-page document.</p><ul aria-label="74-page source bookmarks">${bookmarks}</ul><details class="lab-notebook-transcript">${prefixIds(transcript)}</details></section>`
}));
