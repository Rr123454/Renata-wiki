#!/usr/bin/env python3
"""Preserve source PDFs/images and publish only reviewed, verbatim transcripts."""
import argparse
import hashlib
import html
import json
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def transcript_hash(record):
    return hashlib.sha256(json.dumps(record["blocks"], ensure_ascii=False, sort_keys=True).encode()).hexdigest()


def import_sources(identifier, pdf, images=(), root=ROOT):
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", identifier):
        raise ValueError("Use a lowercase, hyphenated write-up ID.")
    pdf = Path(pdf)
    if not pdf.read_bytes().startswith(b"%PDF"):
        raise ValueError("The supplied document is not a PDF.")
    dest = root / "content/writeups" / identifier
    if dest.exists():
        raise ValueError("This ID already exists. Use a new version ID to preserve the original.")
    originals = dest / "originals"
    originals.mkdir(parents=True)
    records = []
    for index, source in enumerate([pdf, *map(Path, images)]):
        name = "writeup.pdf" if index == 0 else f"figure-{index}{source.suffix.lower()}"
        if index and source.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            raise ValueError("Figures must be PNG, JPEG or WebP files.")
        shutil.copyfile(source, originals / name)
        records.append({"file": "originals/" + name, "originalName": source.name, "sha256": digest(source)})
    record = {"id": identifier, "sources": records, "blocks": [],
              "review": {"reviewer": "", "transcriptSha256": ""}}
    (dest / "writeup.json").write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n")
    # Extraction is a convenience only. Never silently publish OCR or extraction output.
    if shutil.which("pdftotext"):
        subprocess.run(["pdftotext", "-layout", str(originals / "writeup.pdf"), str(dest / "extracted-draft.txt")], check=True)
    return dest


def validate(folder, require_review=True):
    folder = Path(folder)
    record = json.loads((folder / "writeup.json").read_text())
    source_names = set()
    for source in record["sources"]:
        path = (folder / source["file"]).resolve()
        if folder.resolve() not in path.parents or digest(path) != source["sha256"]:
            raise ValueError("Source file changed or escaped its folder: " + source["file"])
        source_names.add(source["file"])
    if not record["blocks"]:
        raise ValueError("Add exact, page-referenced text to blocks before rendering.")
    ids = set()
    for block in record["blocks"]:
        if not re.fullmatch(r"[a-z0-9-]+", block["id"]) or block["id"] in ids:
            raise ValueError("Each block needs a unique simple ID.")
        ids.add(block["id"])
        if block["type"] not in {"heading", "paragraph", "figure"} or not isinstance(block["text"], str):
            raise ValueError("Use heading, paragraph, or figure blocks with literal text.")
        if not block.get("pages") or any(type(p) is not int or p < 1 for p in block["pages"]):
            raise ValueError("Every block needs its original PDF page numbers.")
        if block["type"] == "figure" and (block.get("source") not in source_names or not block.get("alt")):
            raise ValueError("Each figure needs a preserved image source and alt text.")
    if require_review and (not record["review"]["reviewer"].strip() or record["review"]["transcriptSha256"] != transcript_hash(record)):
        raise ValueError("Transcript is unreviewed or changed since review.")
    return record


def render(folder, root=ROOT):
    folder = Path(folder)
    record = validate(folder)
    identifier = record["id"]
    if not re.fullmatch(r"[a-z0-9-]+", identifier):
        raise ValueError("Invalid write-up ID.")
    assets = root / "assets/writeups" / identifier
    assets.mkdir(parents=True, exist_ok=True)
    for source in record["sources"]:
        shutil.copyfile(folder / source["file"], assets / Path(source["file"]).name)
    parts = [f'<article class="verbatim-writeup" data-writeup="{identifier}">']
    for block in record["blocks"]:
        key = html.escape(block["id"], quote=True)
        text = html.escape(block["text"])
        attrs = f'id="{identifier}-{key}" data-verbatim="{key}" style="white-space:pre-wrap"'
        if block["type"] == "figure":
            url = f'assets/writeups/{identifier}/{Path(block["source"]).name}'
            parts.append(f'<figure><img src="{url}" alt="{html.escape(block["alt"], quote=True)}" loading="lazy"/><figcaption {attrs}>{text}</figcaption></figure>')
        else:
            tag = "h2" if block["type"] == "heading" else "p"
            parts.append(f'<{tag} {attrs}>{text}</{tag}>')
    parts.append(f'<a href="assets/writeups/{identifier}/writeup.pdf">Original write-up (PDF)</a></article>')
    return "\n".join(parts)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    imp = sub.add_parser("import")
    imp.add_argument("id")
    imp.add_argument("--pdf", required=True)
    imp.add_argument("--png", action="append", default=[])
    review = sub.add_parser("review", help="Run only after a human has checked every block against the PDF.")
    review.add_argument("id")
    review.add_argument("--reviewer", required=True)
    out = sub.add_parser("render")
    out.add_argument("id")
    args = parser.parse_args()
    try:
        if args.command == "import":
            print(import_sources(args.id, args.pdf, args.png))
        else:
            if not re.fullmatch(r"[a-z0-9-]+", args.id):
                raise ValueError("Invalid ID.")
            folder = ROOT / "content/writeups" / args.id
            if args.command == "review":
                record = validate(folder, require_review=False)
                if not args.reviewer.strip():
                    raise ValueError("Supply the actual reviewer's name.")
                record["review"] = {"reviewer": args.reviewer, "transcriptSha256": transcript_hash(record)}
                (folder / "writeup.json").write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
                print("Recorded your review; subsequent text changes invalidate it.")
            else:
                fragment = render(folder)
                output = ROOT / "build/writeups"
                output.mkdir(parents=True, exist_ok=True)
                (output / f"{args.id}.html").write_text(fragment)
                print(f"Rendered build/writeups/{args.id}.html without rewriting text.")
    except (ValueError, KeyError, OSError) as error:
        parser.exit(1, str(error) + "\n")
