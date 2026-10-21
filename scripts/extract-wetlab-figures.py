"""Extract unaltered embedded figures from the supplied 2026 wet-lab PDF.

Run with the original PDF path. Physical (one-based) PDF pages are used throughout.
The preview renders are inspection artifacts, not website assets.
"""
import argparse
import hashlib
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
FIGURES = [
    (5, 0, "colony-screening"),
    (33, 0, "colony-gel-a"),
    (34, 0, "colony-gel-b"),
    (35, 0, "colony-gel-c"),
    (11, 0, "growth-curve"),
    (15, 0, "bca-standard-curve"),
    (18, 0, "bca-crude-lysate"),
    (18, 1, "bca-purified-comparison"),
    (55, 0, "tlc-plate-1"),
    (55, 1, "tlc-plate-2"),
    (55, 2, "tlc-plate-3"),
    (55, 3, "tlc-plate-4"),
    (55, 4, "tlc-plate-5"),
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    target = ROOT / "assets" / "wet-lab"
    previews = ROOT / "tmp" / "pdfs" / "wet-lab-review"
    target.mkdir(parents=True, exist_ok=True)
    previews.mkdir(parents=True, exist_ok=True)
    with fitz.open(args.source) as doc:
        for page, index, name in FIGURES:
            xref = doc[page - 1].get_images(full=True)[index][0]
            extracted = doc.extract_image(xref)
            image = extracted["image"]
            filename = f"{name}.{extracted['ext']}"
            (target / filename).write_bytes(image)
            print(f"p. {page}: {filename} ({len(image)} bytes), sha256={hashlib.sha256(image).hexdigest()}")
        for page in [5, 8, 11, 15, 18, 46, 47, 55, 72, 73]:
            doc[page - 1].get_pixmap(matrix=fitz.Matrix(1.25, 1.25)).save(previews / f"page-{page}.png")
        print(f"Physical pages: {len(doc)}")


if __name__ == "__main__":
    main()
