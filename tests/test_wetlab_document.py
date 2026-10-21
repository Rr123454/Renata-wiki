"""Original-byte, source-text coverage, HTML fidelity, and notebook checks."""
import collections
import hashlib
import importlib.util
import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('wetlab', ROOT/'scripts/build-wetlab.py')
wetlab = importlib.util.module_from_spec(spec); spec.loader.exec_module(wetlab)

class Blocks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = {}; self.active = None; self.depth = 0; self.ids = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        if 'data-source-block' in attrs:
            self.active=attrs['data-source-block']; self.blocks[self.active]=''; self.depth=0
        if self.active: self.depth += 1
    def handle_endtag(self, tag):
        if self.active:
            self.depth -= 1
            if self.depth == 0: self.active = None
    def handle_data(self, text):
        if self.active: self.blocks[self.active] += text

class WetlabDocumentTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.doc=json.loads((ROOT/'content/wetlab/document.json').read_text())
        cls.html=(ROOT/'wet-lab.html').read_text()
        cls.parsed=Blocks(); cls.parsed.feed(cls.html)
    def test_build_is_current_and_originals_are_unchanged(self):
        wetlab.build(check=True)  # Checks three PDFs and every exported figure hash.
        self.assertEqual([self.doc[k]['pageCount'] for k in ['background','wetlab','notebook']],[1,25,19])
    def test_every_transcribed_block_round_trips_without_wording_changes(self):
        for doc in [self.doc['background'],self.doc['wetlab']]:
            for b in doc['blocks']:
                if b['type']=='figure': continue
                expected=b['text']
                if b['type']=='table': expected+=''.join(''.join(row) for row in b['rows'])
                else: self.assertEqual(expected,''.join(r['text'] for r in b['runs']))
                self.assertEqual(self.parsed.blocks[b['key']],expected,b['key'])
        self.assertEqual(len(self.parsed.ids),len(set(self.parsed.ids)))
    def test_no_source_characters_are_lost_during_reflow(self):
        # Independent PDFKit extraction: ignores layout whitespace and page numerals.
        # This complements (does not replace) the page/figure visual comparison.
        source=json.loads((ROOT/'content/wetlab/pdf-text.json').read_text())
        count=lambda s:collections.Counter(re.sub(r'\s','',s))
        for key in ['background','wetlab']:
            original=''.join(re.sub(r'^\d+\n','',p['text']) for p in source[key])
            transferred=''.join(b.get('text','')+(''.join(''.join(row) for row in b['rows']) if b['type']=='table' else '') for b in self.doc[key]['blocks'])
            self.assertEqual(count(original),count(transferred),key)
    def test_all_figures_tables_and_source_pages_are_present(self):
        blocks=self.doc['wetlab']['blocks']
        self.assertEqual(sorted({n for b in blocks for n in b['pages']}),list(range(1,26)))
        figures=[b for b in blocks if b['type']=='figure']
        self.assertEqual(len(figures),13)
        self.assertEqual(len([b for b in blocks if b['type']=='table']),3)
        for figure in figures:
            self.assertIn('href="'+figure['src']+'"',self.html)
        self.assertIn('15.625ug/mL',self.html)
        self.assertIn('<sup>2</sup>',self.html)
        self.assertIn('***SUBSTITUTED FOR ACETIC ACID/UV VISUALIZATION***',self.html)
    def test_notebook_is_original_pdf_with_all_pages_selectable(self):
        page=(ROOT/'wet-lab-notebook.html').read_text(); source=self.doc['notebook']['source']
        self.assertEqual(hashlib.sha256((ROOT/source['path']).read_bytes()).hexdigest(),source['sha256'])
        self.assertEqual(re.findall(r'<option value="(\d+)">',page),[str(n) for n in range(1,20)])
        self.assertIn(source['path']+'#page=1',page)
        self.assertNotIn('Read notebook as text',page)

    def test_annotated_record_and_chronology_survive_the_merge(self):
        self.assertIn('id="evidence-review"', self.html)
        self.assertIn('id="review-record-checks"', self.html)
        self.assertIn('id="review-historical-plans"', self.html)
        for anchor in ['assembly','screening','expression-plan','purification','quantification','protein-gels','assay-plan']:
            self.assertIn('id="review-'+anchor+'"', self.html)
        for href in re.findall(r'href="#([^"]+)"', self.html):
            self.assertIn(href, self.parsed.ids, href)
        notebook=(ROOT/'wet-lab-notebook.html').read_text()
        self.assertIn('assets/documents/igem-renata-lab-documentation-2026.pdf', notebook)
        self.assertIn('id="additional-lab-documentation"', notebook)
        parsed = Blocks(); parsed.feed(notebook)
        self.assertEqual(len(parsed.ids), len(set(parsed.ids)))
        for anchor in ['notebook-assembly','notebook-reporter','notebook-growth-response','assay-notebook']:
            self.assertIn(anchor, parsed.ids)
        for month in ['june','july','august','september','october']:
            self.assertIn('id="review-notebook-text-'+month+'"', notebook)

if __name__=='__main__': unittest.main()
