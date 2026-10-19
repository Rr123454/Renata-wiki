// Run: node scripts/build-notebook.mjs [--render]
// Requires reportlab; --render also requires pypdfium2 and Pillow.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = vm.createContext({ window: {} });
for (const name of ["site-content", "dry-lab-content", "lab-content"]) {
  vm.runInContext(fs.readFileSync(path.join(root, "js", `${name}.js`), "utf8"), context);
}
const localTools = path.join(root, "tmp", "pdf-tools");
const env = { ...process.env };
if (fs.existsSync(localTools)) env.PYTHONPATH = [localTools, env.PYTHONPATH].filter(Boolean).join(path.delimiter);
const result = spawnSync("python", [path.join(root, "scripts", "build-notebook.py"), ...(process.argv.includes("--render") ? ["--render"] : [])], {
  cwd: root, env, windowsHide: true, encoding: "utf8",
  input: JSON.stringify(context.window.RenataLab.notebookDocument)
});
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
