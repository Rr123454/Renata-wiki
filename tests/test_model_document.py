"""Fidelity checks for the supplied Model writeup and its static export."""
import hashlib
import importlib.util
import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("build_model", ROOT / "scripts/build-model.py")
model = importlib.util.module_from_spec(spec)
spec.loader.exec_module(model)


class ArticleParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks, self.cells, self.ids, self.images = {}, {}, [], []
        self.active = self.cell = None
        self.depth = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "img":
            self.images.append(attrs)
        if "data-model-block" in attrs:
            self.active = attrs["data-model-block"]
            self.blocks[self.active] = ""
            self.cells[self.active] = []
            self.depth = 0
        if self.active:
            self.depth += 1
            if tag in {"th", "td"}:
                self.cells[self.active].append("")
                self.cell = len(self.cells[self.active]) - 1

    def handle_endtag(self, tag):
        if self.active:
            self.depth -= 1
            if tag in {"th", "td"}:
                self.cell = None
            if self.depth == 0:
                self.active = None

    def handle_data(self, data):
        if self.active:
            self.blocks[self.active] += data
            if self.cell is not None:
                self.cells[self.active][self.cell] += data


class ModelDocumentTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.doc = json.loads((ROOT / "content/model/document.json").read_text())
        cls.pdf = json.loads((ROOT / "content/model/pdf-extraction.json").read_text())
        cls.page = (ROOT / "model.html").read_text()
        cls.parsed = ArticleParser()
        cls.parsed.feed(cls.page)

    def test_every_paragraph_heading_caption_and_reference_matches_source(self):
        repairs = {
            "5 steroid": "5β steroid", "5 -LCA": "5β-LCA",
            "graft _ Asp144": "graft_Asp144", "MPNN F2 _ _ 2": "MPNN_F2_2",
            "F147S E144D, and _": "F147S_E144D, and",
            "F147S E144D was also _": "F147S_E144D was also",
            "3F3Y .": "3F3Y.", "Kakuta Y ,": "Kakuta Y,",
            "Petrotchenko EV ,": "Petrotchenko EV,",
        }
        for b in self.doc["blocks"]:
            if b["type"] == "table":
                expected = b["headers"] + [cell for row in b["rows"] for cell in row]
                self.assertEqual(self.parsed.cells[b["key"]], expected, b["key"])
                continue
            source_pages = "\n".join(self.pdf[n - 1]["text"].strip() for n in b["pages"])
            self.assertIn(b["source"], source_pages, b["key"])
            expected = " ".join(b["source"].split())
            for old, new in repairs.items():
                expected = expected.replace(old, new)
            self.assertEqual(b["text"], expected, b["key"])
            self.assertEqual(self.parsed.blocks[b["key"]], expected, b["key"])
        page_one = " ".join(b["text"] for b in self.doc["blocks"] if b["pages"] == [1])
        self.assertEqual(page_one.count("β"), 4)

    def test_complete_document_and_table_continuations(self):
        blocks = self.doc["blocks"]
        self.assertEqual(len(self.parsed.blocks), len(blocks))
        self.assertEqual([b["id"] for b in blocks if b["type"] == "figure"],
                         [f"figure-{i}" for i in range(1, 11)])
        self.assertEqual([b["id"] for b in blocks if b["type"] == "reference"],
                         [f"source-{i}" for i in range(1, 18)])
        tables = [b for b in blocks if b["type"] == "table"]
        self.assertEqual([len(b["rows"]) for b in tables], [8, 6, 3, 8, 5, 13, 14, 3, 3])
        for table in tables:
            self.assertTrue(all(len(row) == len(table["headers"]) for row in table["rows"]))
        self.assertEqual(tables[5]["rows"][-2][0], "graft_Asp144")
        self.assertEqual(tables[5]["rows"][-2][3:5], ["2.46", "4.54"])
        self.assertEqual(tables[5]["rows"][-1][3:5], ["2.87", "5.74"])
        self.assertEqual(tables[6]["rows"][-1],
                         ["MPNN_WT_1", "WT", "21", "15.37", "19.39", "0.952", "Fail"])
        self.assertEqual(len(self.parsed.ids), len(set(self.parsed.ids)))

    def test_original_media_and_full_size_figures(self):
        self.assertEqual(len(self.doc["sources"]), 11)
        for source in self.doc["sources"]:
            self.assertEqual(hashlib.sha256((ROOT / source["path"]).read_bytes()).hexdigest(),
                             source["sha256"], source["path"])
        figures = [image for image in self.parsed.images if image["src"].startswith("assets/model/")]
        self.assertEqual(len(figures), 10)
        for i, image in enumerate(figures, 1):
            self.assertEqual(image["src"], f"assets/model/Fig{i}.png")
            self.assertEqual(image["width"], "2048")
            self.assertIn(f'href="{image["src"]}"', self.page)
        self.assertIn('href="assets/model/dry-lab-documentation.pdf" download', self.page)

    def test_static_article_and_registration_do_not_load_previous_model(self):
        self.assertIn('data-static-content="true"', self.page)
        self.assertIn('js/model-document.js', self.page)
        self.assertNotIn('js/lab-content.js', self.page)
        self.assertNotIn('js/dry-lab-content.js', self.page)
        for anchor in ["overview", "notebook", "methods", "inputs", "variant-comparison", "corrections"]:
            self.assertIn(anchor, self.parsed.ids)

    def test_committed_html_is_current_and_build_escapes_document_text(self):
        self.assertEqual(model.build(check=True), self.page)
        document = json.loads(json.dumps(self.doc))
        document["blocks"][1]["text"] = '<script>alert("PDF text")</script>'
        result = model.render(document)
        self.assertNotIn('<script>alert(', result)
        self.assertIn('&lt;script&gt;alert(', result)


if __name__ == "__main__":
    unittest.main()
