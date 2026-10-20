#!/usr/bin/env python3
"""Render the source-faithful Model article using only the Python standard library."""
import argparse
import hashlib
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
START = "<!-- model-document:start -->"
END = "<!-- model-document:end -->"


def render(document):
    esc = html.escape
    blocks = document["blocks"]
    output = []
    # Keep incoming links from the former Model page useful.
    aliases = {
        "structural-study": ["methods", "inputs", "alignment"],
        "catalytic-distance": ["pymol", "docking"],
        "notebook": ["redesign"],
        "point-mutations": ["variant-comparison"],
        "wet-lab-candidates": ["corrections"],
    }
    sections = []
    for b in blocks:
        tag = b["type"]
        key = f'data-model-block="{b["key"]}"'
        text = esc(b["text"])
        if tag == "heading":
            level = b["level"]
            while sections and sections[-1] >= level:
                output.append("</section>")
                sections.pop()
            if level > 1:
                output.append(f'<section class="model-section" aria-labelledby="{b["id"]}">')
                sections.append(level)
            for alias in aliases.get(b["id"], []):
                output.append(f'<span class="lab-anchor" id="{alias}"></span>')
            output.append(f'<h{level} id="{b["id"]}" {key}>{text}</h{level}>')
        elif tag == "paragraph":
            output.append(f'<p {key}>{text}</p>')
        elif tag == "figure":
            src = esc(b["src"])
            output.append(
                f'<figure class="model-figure" id="{b["id"]}">'
                f'<a href="{src}" aria-label="Open Figure {b["id"].split("-")[-1]} at full resolution">'
                f'<img src="{src}" width="{b["width"]}" height="{b["height"]}" '
                f'loading="lazy" decoding="async" alt="{text}" /></a>'
                f'<figcaption {key}>{text}</figcaption></figure>'
            )
        elif tag == "table":
            headers = "".join(f'<th scope="col">{esc(c)}</th>' for c in b["headers"])
            rows = "".join(
                "<tr>" + f'<th scope="row">{esc(row[0])}</th>' +
                "".join(f"<td>{esc(c)}</td>" for c in row[1:]) + "</tr>"
                for row in b["rows"]
            )
            output.append(
                f'<div class="model-table-scroll" role="region" tabindex="0" '
                f'aria-labelledby="{b["id"]}-caption"><table id="{b["id"]}" {key}>'
                f'<caption id="{b["id"]}-caption">{text}</caption>'
                f'<thead><tr>{headers}</tr></thead><tbody>{rows}</tbody></table></div>'
            )
        elif tag == "reference":
            # Link only URLs/DOIs already present in the supplied reference.
            text = re.sub(r"https://[^\s<]+", lambda m: f'<a href="{m[0]}">{m[0]}</a>', text)
            text = re.sub(r"(?<=DOI: )(10\.[^\s<]+)", lambda m: f'<a href="https://doi.org/{m[0]}">{m[0]}</a>', text)
            output.append(f'<p class="model-reference" id="{b["id"]}" {key}>{text}</p>')
        else:
            raise ValueError(f"Unknown block type: {tag}")
    output.extend("</section>" for _ in sections)
    # Title/introduction belong to the article so the PDF reading order is exact.
    links = "".join(
        f'<a href="#{b["id"]}">{esc(b["text"])}</a>'
        for b in blocks if b["type"] == "heading" and b["level"] == 2
    )
    return (
        '<section class="lab-page container model-document">'
        '<div class="model-download"><a href="' + esc(document["pdf"]) +
        '" download>Download original PDF</a></div><div class="lab-layout">'
        '<aside class="lab-sidebar"><nav aria-label="On this page" data-outline-auto>'
        '<p>On this page</p>' + links + '</nav></aside>'
        '<article class="lab-article" aria-labelledby="lab-page-title">\n' +
        "\n".join(output) + '\n</article></div></section>'
    )


def build(root=ROOT, check=False):
    root = Path(root)
    document = json.loads((root / "content/model/document.json").read_text())
    for source in document["sources"]:
        if hashlib.sha256((root / source["path"]).read_bytes()).hexdigest() != source["sha256"]:
            raise ValueError(f"Original source changed: {source['path']}")
    path = root / "model.html"
    current = path.read_text()
    if current.count(START) != 1 or current.count(END) != 1:
        raise ValueError("Model page must contain exactly one document marker pair")
    before, rest = current.split(START)
    _, after = rest.split(END)
    result = before + START + "\n" + render(document) + "\n" + END + after
    if check and current != result:
        raise ValueError("Model page is stale; run python3 scripts/build-model.py")
    if not check:
        path.write_text(result)
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    build(check=args.check)
    print("Model document checked." if args.check else "Model document built.")
