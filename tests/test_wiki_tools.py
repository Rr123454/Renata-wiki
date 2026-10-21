import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
spec = importlib.util.spec_from_file_location("build_wiki", ROOT / "scripts/build-wiki.py")
wiki = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wiki)
import writeups


class VerbatimParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.values = {}
        self.key = None

    def handle_starttag(self, tag, attrs):
        key = dict(attrs).get("data-verbatim")
        if key:
            self.key = key
            self.values[key] = ""

    def handle_endtag(self, tag):
        if tag in {"p", "h2", "figcaption"}:
            self.key = None

    def handle_data(self, data):
        if self.key:
            self.values[self.key] += data


class WikiToolsTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        for directory in ("config", "assets", "js", "css"):
            (self.root / directory).mkdir()
        self.config = json.loads((ROOT / "config/igem.json").read_text())
        self.config["routes"] = {"description": "index.html"}
        self.save_config()
        self.save_urls({})
        (self.root / "index.html").write_text('<!doctype html><html><head></head><body><img src="assets/a.png"/><script src="js/main.js"></script></body></html>')
        (self.root / "assets/a.png").write_bytes(b"RIFF\x00\x00\x00\x00WEBPfixture")
        (self.root / "js/main.js").write_text('const image = "assets/a.png";')

    def save_config(self):
        (self.root / "config/igem.json").write_text(json.dumps(self.config))

    def save_urls(self, value):
        (self.root / "config/asset-urls.json").write_text(json.dumps(value))

    def release_ready(self):
        self.config.update(teamSlug="example", repository="https://gitlab.igem.org/2026/example",
                           attributionsUrl="https://teams.igem.org/1234")
        self.config["review"] = dict.fromkeys(self.config["review"], True)
        self.save_config()
        self.save_urls({"assets/a.png": "https://static.igem.wiki/teams/1234/a.webp"})
        (self.root / "contribution.html").write_text("<html><head></head><body>Team-supplied contribution.</body></html>")

    def wetlab_figure_urls(self, runtime=""):
        """Exercise the real content helper against an optional exported runtime."""
        program = (
            "const fs=require('node:fs'),vm=require('node:vm');"
            "const input=JSON.parse(fs.readFileSync(0,'utf8'));"
            "const context={window:{}};"
            "if(input.runtime)vm.runInNewContext(input.runtime,context);"
            "vm.runInNewContext(input.source,context);"
            "console.log(JSON.stringify(context.window.RENATA_WETLAB.records"
            ".flatMap(record=>(record.figures||[]).map(figure=>figure.file))));"
        )
        result = subprocess.run(
            ["node", "-e", program],
            input=json.dumps({"runtime": runtime, "source": (ROOT / "js/wet-lab-content.js").read_text(encoding="utf-8")}),
            text=True, capture_output=True, check=True,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        return json.loads(result.stdout)

    def test_preview_is_portable_and_does_not_modify_original_media(self):
        original = (self.root / "assets/a.png").read_bytes()
        report = wiki.build(self.root, base_path="/preview/")
        self.assertEqual(report["errors"], [])
        self.assertEqual((self.root / "public/assets/a.webp").read_bytes(), original)
        self.assertEqual((self.root / "assets/a.png").read_bytes(), original)
        page = (self.root / "public/description/index.html").read_text()
        self.assertIn('<base href="/preview/"/>', page)
        self.assertIn('src="assets/a.webp"', page)
        self.assertIn("CC BY 4.0", page)
        self.assertNotIn("config/igem.json", page)

    def test_unfinished_release_fails_without_erasing_previous_preview(self):
        wiki.build(self.root)
        before = (self.root / "public/index.html").read_bytes()
        with self.assertRaisesRegex(ValueError, "teamSlug"):
            wiki.build(self.root, release=True)
        self.assertEqual(before, (self.root / "public/index.html").read_bytes())
        report = json.loads((self.root / "build/wiki-audit.json").read_text())
        self.assertIn("assets/a.png", report["missingUploadUrls"])

    def test_release_rewrites_html_js_and_keeps_media_off_the_pages_artifact(self):
        self.release_ready()
        wiki.build(self.root, release=True)
        for path in ("index.html", "description/index.html", "js/main.js"):
            text = (self.root / "public" / path).read_text()
            self.assertIn("https://static.igem.wiki/teams/1234/a.webp", text)
        self.assertFalse((self.root / "public/assets").exists())
        self.assertIn('<base href="/example/"/>', (self.root / "public/index.html").read_text())
        self.assertIn("https://teams.igem.org/1234", (self.root / "public/attributions/index.html").read_text())
        self.assertNotIn("<iframe", (self.root / "public/attributions/index.html").read_text())

    def test_wetlab_source_figures_exist_and_keep_local_paths_without_export_runtime(self):
        figures = self.wetlab_figure_urls()
        self.assertGreater(len(figures), 0)
        for figure in figures:
            with self.subTest(figure=figure):
                self.assertTrue(figure.startswith("assets/wet-lab/"))
                self.assertTrue((ROOT / figure).is_file())
                self.assertGreater((ROOT / figure).stat().st_size, 0)

    def test_wetlab_dynamic_figures_are_inventoried_and_use_export_runtime_urls(self):
        directory = self.root / "assets/wet-lab"
        directory.mkdir()
        originals = {
            "assets/wet-lab/colony-screening.png": b"\x89PNG\r\n\x1a\nfixture",
            "assets/wet-lab/colony-gel-a.jpeg": b"\xff\xd8fixture",
        }
        for name, value in originals.items():
            (self.root / name).write_bytes(value)
        # No full filename occurs in the source corpus: the directory family
        # must be inventoried despite a dynamically assembled asset path.
        (self.root / "js/figures.js").write_text('const figure = file => `assets/wet-lab/${file}`;')
        report = wiki.build(self.root)
        inventory = {asset["source"] for asset in report["assets"]}
        self.assertTrue(set(originals).issubset(inventory))
        self.assertTrue(set(originals).issubset(report["missingUploadUrls"]))
        self.assertEqual((self.root / "public/assets/wet-lab/colony-screening.png").read_bytes(), originals["assets/wet-lab/colony-screening.png"])
        self.assertEqual((self.root / "public/assets/wet-lab/colony-gel-a.jpg").read_bytes(), originals["assets/wet-lab/colony-gel-a.jpeg"])
        preview_figures = self.wetlab_figure_urls((self.root / "public/js/wiki-runtime.js").read_text())
        self.assertIn("assets/wet-lab/colony-screening.png", preview_figures)
        self.assertIn("assets/wet-lab/colony-gel-a.jpg", preview_figures)
        self.assertNotIn("assets/wet-lab/colony-gel-a.jpeg", preview_figures)

        self.release_ready()
        with self.assertRaisesRegex(ValueError, "referenced media files still need iGEM upload URLs"):
            wiki.build(self.root, release=True)
        urls = {"assets/a.png": "https://static.igem.wiki/teams/1234/a.webp"}
        urls.update({key: f"https://static.igem.wiki/teams/1234/{Path(key).stem}." + ("jpg" if key.endswith(".jpeg") else "png") for key in originals})
        self.save_urls(urls)
        wiki.build(self.root, release=True)
        exported_figures = self.wetlab_figure_urls((self.root / "public/js/wiki-runtime.js").read_text())
        for key in originals:
            self.assertIn(urls[key], exported_figures)
            self.assertNotIn(key, exported_figures)
            self.assertEqual((self.root / key).read_bytes(), originals[key])
        self.assertFalse((self.root / "public/assets").exists())

    def test_missing_case_sensitive_media_and_external_embeds_are_rejected(self):
        page = self.root / "index.html"
        page.write_text('<html><head></head><body><img src="assets/A.png"/><iframe src="https://example.com/embed"></iframe></body></html>')
        with self.assertRaisesRegex(ValueError, "Missing asset"):
            wiki.build(self.root)
        page.write_text('<html><head></head><body><img src="https://example.com/a.png"/></body></html>')
        with self.assertRaisesRegex(ValueError, "External embedded"):
            wiki.build(self.root)

    def test_citations_are_allowed_but_false_upload_host_is_rejected(self):
        (self.root / "index.html").write_text('<html><head></head><body><a href="https://doi.org/example">Reference</a></body></html>')
        wiki.build(self.root)
        self.save_urls({"assets/a.png": "https://static.igem.wiki.evil.test/a.png"})
        with self.assertRaisesRegex(ValueError, "Invalid iGEM media"):
            wiki.build(self.root)

    def test_release_cannot_hide_placeholder_content(self):
        self.release_ready()
        (self.root / "js/main.js").write_text('const heading = "Lorem Ipsum";')
        with self.assertRaisesRegex(ValueError, "Draft copy remains"):
            wiki.build(self.root, release=True)

    def test_pdf_pipeline_preserves_unicode_and_detects_changed_text_or_sources(self):
        pdf = self.root / "input.pdf"
        pdf.write_bytes(b"%PDF-1.4\nfixture original")
        image = self.root / "figure.png"
        image.write_bytes(b"\x89PNG\r\n\x1a\nfixture")
        with patch("writeups.shutil.which", return_value=None):
            folder = writeups.import_sources("science", pdf, [image], self.root)
        record_path = folder / "writeup.json"
        record = json.loads(record_path.read_text())
        record["blocks"] = [
            {"id": "title", "type": "heading", "pages": [1], "text": "SULT2A1 & 5β-LCA"},
            {"id": "copy", "type": "paragraph", "pages": [1, 2], "text": "A < B; µM ≥ 2.\nDo not reword — patients’ text."},
            {"id": "figure", "type": "figure", "pages": [2], "source": "originals/figure-1.png",
             "alt": "LCA and DCA diagram", "text": "Figure 1. LCA & DCA."}
        ]
        record_path.write_text(json.dumps(record))
        with self.assertRaisesRegex(ValueError, "unreviewed"):
            writeups.render(folder, self.root)
        record["review"] = {"reviewer": "Test reviewer", "transcriptSha256": writeups.transcript_hash(record)}
        record_path.write_text(json.dumps(record))
        rendered = writeups.render(folder, self.root)
        parser = VerbatimParser()
        parser.feed(rendered)
        self.assertEqual(parser.values, {b["id"]: b["text"] for b in record["blocks"]})
        self.assertEqual(writeups.digest(self.root / "assets/writeups/science/writeup.pdf"), writeups.digest(pdf))
        (self.root / "index.html").write_text('<html><head></head><body><!-- writeup:science --></body></html>')
        wiki.build(self.root)
        self.assertIn('data-verbatim="copy"', (self.root / "public/index.html").read_text())
        record["blocks"][1]["text"] += " Changed."
        record_path.write_text(json.dumps(record))
        with self.assertRaisesRegex(ValueError, "changed since review"):
            writeups.render(folder, self.root)
        (folder / "originals/writeup.pdf").write_bytes(b"%PDF-changed")
        with self.assertRaisesRegex(ValueError, "Source file changed"):
            writeups.validate(folder)


if __name__ == "__main__":
    unittest.main()
