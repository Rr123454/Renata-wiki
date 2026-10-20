"use strict";
// Keep local HTML entry points in sync with the exact JS/CSS bytes they load.
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const root = path.join(__dirname, "..");

function versionMarkup(markup, directory = root) {
  return markup.replace(
    /((?:src|href)=")((?:js|css)\/[^"?#]+)(?:\?[^"#]*)?"/g,
    (_match, attribute, file) => {
      const hash = createHash("sha256").update(fs.readFileSync(path.join(directory, file))).digest("hex").slice(0, 12);
      return `${attribute}${file}?v=${hash}"`;
    }
  );
}

function refreshAll({ directory = root, check = false } = {}) {
  const changed = [];
  for (const file of fs.readdirSync(directory).filter(file => file.endsWith(".html"))) {
    const target = path.join(directory, file);
    const before = fs.readFileSync(target, "utf8");
    const after = versionMarkup(before, directory);
    if (before !== after) {
      changed.push(file);
      if (!check) fs.writeFileSync(target, after);
    }
  }
  if (check && changed.length) {
    throw new Error(`Stale asset versions in ${changed.join(", ")}. Run node scripts/version-assets.js.`);
  }
  return changed;
}

module.exports = { versionMarkup, refreshAll };
if (require.main === module) {
  const changed = refreshAll({ check: process.argv.includes("--check") });
  console.log(`Asset versions checked; ${changed.length} HTML files refreshed.`);
}
