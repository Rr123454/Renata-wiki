// The viewer uses the unchanged primary record. Verify it; never regenerate it
// from the shorter accessible chronology. Run: node scripts/build-notebook.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "js/wet-lab-content.js"), "utf8"), context);
const source = context.window.RENATA_WETLAB;
const pdf = fs.readFileSync(path.join(root, source.pdf));
const digest = createHash("sha256").update(pdf).digest("hex");
if (digest !== source.pdfSha256) throw new Error("The original lab PDF has changed. Review its provenance and page mappings before updating the reader.");
process.stdout.write(`Verified original wetlab record: ${source.pageCount} pages, ${pdf.length} bytes, SHA-256 ${digest}\n`);
