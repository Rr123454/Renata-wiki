#!/usr/bin/env python3
"""Create a source ZIP for manual transfer; no credentials or network access."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
files = list(root.glob("*.html"))
for name in (".gitlab-ci.yml", ".gitignore", "LICENSE", "README.md"):
    if (root / name).is_file():
        files.append(root / name)
for directory in ("assets", "css", "js", "scripts", "tests", "config", "content", "docs", ".vscode"):
    files.extend(p for p in (root / directory).rglob("*")
                 if p.is_file() and "__pycache__" not in p.parts and p.name != ".DS_Store")
output = root / "build"
output.mkdir(exist_ok=True)
archive = output / "renata-wiki-source.zip"
with ZipFile(archive, "w", compression=ZIP_DEFLATED) as target:
    for path in sorted(set(files)):
        target.write(path, path.relative_to(root))
print(f"{archive}: {len(set(files))} source files. No .git history, credentials, or local debug output included.")
