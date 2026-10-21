"""Import the revised 26-page writeup while retaining existing semantic markup."""
import hashlib
import json
import re
import shutil
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\27fan\Downloads\iGEM Renata Lab Documentation 2026 (1).pdf')
path = ROOT / 'content/wetlab/document.json'
data = json.loads(path.read_text(encoding='utf8'))
doc = fitz.open(SOURCE)
assert len(doc) == 26
blocks = data['wetlab']['blocks']
assert not any(b['key'] == 'revision-discussion' for b in blocks), 'Revision already imported'

def text_block(key, text, page, **extra):
    return dict(type='paragraph', key=key, text=text, runs=[dict(text=text)], pages=[page], **extra)

# Existing text was already cleaned of PDF line-wrap artifacts. Preserve its rich runs.
for b in blocks:
    n = int(b['key'].rsplit('-', 1)[1])
    if 354 <= n <= 381:
        b['pages'] = [23]
    elif 382 <= n <= 399:
        b['pages'] = [24]
    elif n >= 400:
        b['pages'] = [26]
    if n == 91:
        b['text'] = b['text'].replace('DBTL 1', 'DBTL 3')
        for run in b['runs']:
            run['text'] = run['text'].replace('DBTL 1', 'DBTL 3')
    if n == 401:
        b.update(text_block(b['key'], 'Adrianza, R., Renusch, S. (2026). Education | University Lab Partners. University Lab Partners.', 26))
    if n == 402:
        url = 'https://www.universitylabpartners.org/education'
        b.update(text_block(b['key'], url, 26))
        b['runs'][0]['href'] = url

# Render image bounds only; retain source labels and the original multi-image layouts.
figures = [b for b in blocks if b['type'] == 'figure']
for b in figures:
    page_no = b['pages'][0]
    page = doc[page_no-1]
    rects = [fitz.Rect(info['bbox']) for info in page.get_image_info()]
    if page_no == 17:
        rects = [rects[0] if b['key'] == 'model-wetlab-226' else rects[1]]
    rect = fitz.Rect(rects[0])
    for other in rects[1:]:
        rect |= other
    dest = ROOT / f'assets/wetlab/revision-{b["key"]}.png'
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect, alpha=False)
    pix.save(dest)
    b.update(src=dest.relative_to(ROOT).as_posix(), width=pix.width, height=pix.height,
             sha256=hashlib.sha256(dest.read_bytes()).hexdigest())

page22 = doc[21].get_text().replace('\u200b', '')
interpretation = re.sub(r'\s+', ' ', page22.split('SF2 IPTG:', 1)[1].split('Thin Layer', 1)[0]).strip()
interpretation = 'SF2 IPTG: ' + interpretation
gel = doc[21].get_image_info()[0]
dest = ROOT / 'assets/wetlab/revision-sds-page.png'
pix = doc[21].get_pixmap(matrix=fitz.Matrix(3, 3), clip=fitz.Rect(gel['bbox']), alpha=False)
pix.save(dest)
insert_at = next(i for i,b in enumerate(blocks) if b['key']=='model-wetlab-352')
blocks[insert_at:insert_at] = [
    dict(type='figure', key='revision-sds-gel', pages=[22], src=dest.relative_to(ROOT).as_posix(),
         width=pix.width, height=pix.height, alt='SDS-PAGE gel for SF2, SF3, and WT samples; band resolution limits interpretation.',
         sha256=hashlib.sha256(dest.read_bytes()).hexdigest()),
    text_block('revision-sds-interpretation', interpretation, 22),
]
discussion = re.sub(r'\s+', ' ', doc[24].get_text().replace('\u200b', '')).strip()
discussion = re.sub(r'^25\s+Discussion\s*', '', discussion)
discussion = re.sub(r'^Discussion\s*', '', discussion)
insert_at = next(i for i,b in enumerate(blocks) if b['key']=='model-wetlab-400')
heading = text_block('revision-discussion', 'Discussion', 25, level=2, id='wetlab-discussion')
heading['type'] = 'heading'
blocks[insert_at:insert_at] = [heading, text_block('revision-discussion-text', discussion, 25)]

dest = ROOT / 'assets/wetlab/lab-writeup-2026.pdf'
shutil.copyfile(SOURCE, dest)
data['wetlab']['source'] = dict(original=SOURCE.name, path=dest.relative_to(ROOT).as_posix(),
                              sha256=hashlib.sha256(dest.read_bytes()).hexdigest())
data['wetlab']['pageCount'] = len(doc)
path.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
audit_path = ROOT / 'content/wetlab/pdf-text.json'
audit = json.loads(audit_path.read_text(encoding='utf8'))
audit['wetlab'] = [dict(page=i+1, text=p.get_text().replace('\u200b', '')) for i,p in enumerate(doc)]
audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
print('Imported revised writeup and figures; notebook metadata preserved.')
