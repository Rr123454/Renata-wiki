import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import runpy
import unittest

ROOT = Path(__file__).resolve().parents[1]


class TextParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.ids = []
        self.anchors = []

    def handle_data(self, text):
        self.text.append(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a' and attrs.get('href', '').startswith('#'):
            self.anchors.append(attrs['href'][1:])


def normalized(text):
    return re.sub(r'\s+', '', text.replace('\u200b', ''))


class KickstartTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / 'content/kickstart/guide.json').read_text(encoding='utf-8'))
        cls.page = (ROOT / 'igem-kickstart.html').read_text(encoding='utf-8')

    def test_every_source_word_is_retained_in_order(self):
        transcript = self.data['title'] + self.data['byline']
        transcript += ''.join(b['text'] for b in self.data['blocks'] if b['type'] != 'figure')
        self.assertEqual(normalized(transcript), normalized(''.join(self.data['raw_pages'])))

    def test_inline_formatting_preserves_literal_text(self):
        for block in self.data['blocks']:
            if block['type'] != 'paragraph':
                continue
            parser = TextParser()
            parser.feed(block['html'])
            self.assertEqual(normalized(''.join(parser.text)), normalized(block['text']))
            self.assertIn(block['html'], self.page)

    def test_original_pdf_and_five_images_have_verified_fingerprints(self):
        self.assertEqual(self.data['page_count'], 11)
        self.assertEqual(hashlib.sha256((ROOT / self.data['source']).read_bytes()).hexdigest(), self.data['sha256'])
        images = [b for b in self.data['blocks'] if b['type'] == 'figure']
        self.assertEqual(len(images), 5)  # Four teaching figures and the author's portrait.
        for image in images:
            self.assertEqual(hashlib.sha256((ROOT / image['source']).read_bytes()).hexdigest(), image['sha256'])
            self.assertIn(image['source'], self.page)

    def test_outline_anchors_and_shared_chrome(self):
        parser = TextParser()
        parser.feed(self.page)
        self.assertEqual(len(parser.ids), len(set(parser.ids)))
        self.assertTrue(set(parser.anchors).issubset(set(parser.ids)))
        for value in ['siteHeader', 'siteFooter', 'shared-resource', 'what-we-contributed', 'community-contribution']:
            self.assertIn(value, parser.ids)
        for value in ['NBJF', 'DBHS-CA', 'Humza Shahzad', 'data-static-content="true"']:
            self.assertIn(value, self.page)

    def test_generated_article_is_current(self):
        runpy.run_path(str(ROOT / 'scripts/build-kickstart.py'))['build'](ROOT, check=True)


if __name__ == '__main__':
    unittest.main()
