"""Import the supplied engineering report as four DBTL records and source figures."""
import hashlib
import html
import json
import re
from pathlib import Path
import fitz
from PIL import Image, ImageDraw
from engineering_references import render_references

ROOT = Path(__file__).resolve().parents[1]
doc = fitz.open(r'C:\Users\27fan\Downloads\Engineering.pdf')
out = ROOT/'assets/engineering'
out.mkdir(exist_ok=True)
audit = ROOT/'tmp/pdfs/engineering'
audit.mkdir(parents=True, exist_ok=True)
cycles = []
abstract = []
refs = []
current = None
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(.7,.7), alpha=False)
    pix.save(audit/f'page-{i+1}.png')
    entries = []
    tables = page.find_tables().tables if i == 3 else []
    for block in page.get_text('blocks'):
        if block[6] != 0:
            continue
        text = re.sub(r'\s+', ' ', block[4].replace('\u200b','')).strip()
        if any(fitz.Rect(block[:4]).intersects(fitz.Rect(t.bbox)) for t in tables):
            continue
        if text and text not in ['.', 'a)', 'b)']:
            entries.append((block[1], 'text', text))
    for table in tables:
        entries.append((table.bbox[1], 'table', table.extract()))
    rects = [fitz.Rect(info['bbox']) for info in page.get_image_info()]
    if len(rects)>1 and i != 13:
        combined = fitz.Rect(rects[0])
        for rect in rects[1:]: combined |= rect
        rects = [combined]
    for j, rect in enumerate(rects):
        dest = out/f'page-{i+1}-figure-{j+1}.png'
        page.get_pixmap(matrix=fitz.Matrix(2,2),clip=rect,alpha=False).save(dest)
        entries.append((rect.y0, 'image', dest.relative_to(ROOT).as_posix()))
    for _, kind, text in sorted(entries):
        if i >= 17:
            if kind == 'text': refs.append(text)
            continue
        if kind == 'text' and re.match(r'^Cycle [1-4]:', text):
            current = dict(title=text, id=f'engineering-cycle-{len(cycles)+1}', blocks=[])
            cycles.append(current)
        elif current:
            current['blocks'].append(dict(type=kind, text=text, page=i+1))
        elif kind == 'text' and text != 'Abstract:':
            abstract.append(text)

# Join prose interrupted solely by a PDF page break.
for cycle in cycles:
    merged = []
    for b in cycle['blocks']:
        previous = merged[-1] if merged else None
        if (previous and b['type'] == previous['type'] == 'text'
                and b['page'] != previous['page']
                and not re.search(r'[.!?:]$', previous['text'])
                and not re.fullmatch(r'Design|Build|Test|Learn', previous['text'])
                and not b['text'].startswith('Figure')):
            previous['text'] += ' ' + b['text']
        else:
            merged.append(b)
    cycle['blocks'] = merged

# Retain a source-text audit, independent of website markup.
(ROOT/'content/engineering-revision.json').write_text(json.dumps(dict(
    sha256=hashlib.sha256(Path(doc.name).read_bytes()).hexdigest(), abstract=abstract, cycles=cycles, references=refs
), ensure_ascii=False, indent=2)+'\n', encoding='utf8')

def render(cycle):
    result = [f'<section class="engineering-current-cycle" id="{cycle["id"]}"><h3>{html.escape(cycle["title"])}</h3>']
    for b in cycle['blocks']:
        if b['type'] == 'table':
            rows = b['text']
            result.append('<div class="engineering-table-scroll"><table><thead><tr>'+''.join('<th scope="col">'+html.escape(c or '').replace('\n',' ')+'</th>' for c in rows[0])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+html.escape(c or '').replace('\n',' ')+'</td>' for c in row)+'</tr>' for row in rows[1:])+'</tbody></table></div>')
            continue
        text = html.escape(b['text'])
        if b['type'] == 'image':
            with Image.open(ROOT/b['text']) as image:
                width, height = image.size
            result.append(f'<figure class="project-vector-figure"><a href="{text}" target="_blank" rel="noopener"><img src="{text}" width="{width}" height="{height}" loading="lazy" alt="Engineering evidence, cycle {cycles.index(cycle)+1}, page {b["page"]}" /></a></figure>')
        elif re.fullmatch(r'(Design|Build|Test|Learn)\s*:?', b['text']):
            result.append(f'<h4>{text.rstrip(":")}</h4>')
        else:
            result.append(f'<p>{text}</p>')
    result.append('</section>')
    return ''.join(result)

assert abstract and len(cycles) == 4, 'The abstract and all four cycles are required.'
payload = dict(
    abstractHtml=''.join(f'<p>{html.escape(text)}</p>' for text in re.split(r' (?=ULP-CA is developing|In vitro, we transformed)', ' '.join(abstract))),
    cyclesHtml=''.join(render(c) for c in cycles),
    referencesHtml=render_references(refs),
    outline=[dict(id=c['id'],title=c['title']) for c in cycles]
)
js = '/* Generated from Engineering.pdf by scripts/import-engineering.py. */\n'
js += 'window.SITE_DATA.pages.engineering.engineering.currentReport = '+json.dumps(payload,ensure_ascii=False,indent=2)+';\n'
(ROOT/'js/engineering-revision.js').write_text(js,encoding='utf8')
for start in range(0,len(doc),6):
    sheet = Image.new('RGB',(1050,1500),'#ddd')
    for i in range(start,min(start+6,len(doc))):
        im=Image.open(audit/f'page-{i+1}.png'); im.thumbnail((340,710))
        x,y=(i-start)%3*350,(i-start)//3*750
        sheet.paste(im,(x,y+25)); ImageDraw.Draw(sheet).text((x+5,y+5),str(i+1),fill='black')
    sheet.save(audit/f'sheet-{start+1}.jpg')
print(f'Imported {len(cycles)} cycles; inspect tables and figures before release.')
