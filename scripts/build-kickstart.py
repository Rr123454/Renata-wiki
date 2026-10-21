"""Build the source-preserving Kickstart article; --import-pdf refreshes source data.

Normal builds use only the standard library. Import requires PyMuPDF and Pillow.
No document text is executed. Source typography and hyperlinks are escaped.
"""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DATA = Path('content/kickstart/guide.json')
PDF = Path('assets/kickstart/research-fundamentals.pdf')
START = '<!-- kickstart-guide:start -->'
END = '<!-- kickstart-guide:end -->'


def import_pdf(source):
    import fitz
    from PIL import Image, ImageDraw
    pdf_bytes = Path(source).read_bytes()
    target = ROOT / PDF
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(pdf_bytes)
    doc = fitz.open(stream=pdf_bytes, filetype='pdf')
    blocks, pending, pages, thumbs = [], [], [], []
    def flush():
        if pending:
            blocks.append({'type': 'paragraph', 'pages': sorted(set(pages)),
                           'text': ' '.join(x[0] for x in pending),
                           'html': ' '.join(x[1] for x in pending)})
            pending.clear()
            pages.clear()
    figure = 0
    alts = ['Operon architecture showing a regulatory gene, promoter, operator, and structural genes.',
            'EcoRI recognition and cleavage sites with complementary sticky ends.',
            'Comparison of single and double restriction digests from SnapGene.',
            'Golden Gate Assembly diagram from New England Biolabs.',
            'Author portrait included at the end of the guide.']
    raw_pages = []
    for number, page in enumerate(doc, 1):
        raw_pages.append(page.get_text())
        pix = page.get_pixmap(matrix=fitz.Matrix(.5, .5), alpha=False)
        thumb = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        thumbs.append(thumb)
        if number == 1:
            continue
        links = [link for link in page.get_links() if link.get('uri', '').startswith(('https://', 'http://'))]
        events = []
        for block in page.get_text('dict')['blocks']:
            if block['type'] == 1:
                events.append((block['bbox'][1], 'image', block))
            else:
                for line in block['lines']:
                    if line['bbox'][1] > 55:
                        events.append((line['bbox'][1], 'line', line))
        for _, kind, item in sorted(events, key=lambda x: x[0]):
            if kind == 'image':
                flush()
                figure += 1
                asset = f'assets/kickstart/figure-{figure}.{item["ext"]}'
                (ROOT / asset).write_bytes(item['image'])
                blocks.append({'type': 'figure', 'pages': [number], 'source': asset,
                               'width': item['width'], 'height': item['height'],
                               'alt': alts[figure - 1], 'sha256': hashlib.sha256(item['image']).hexdigest()})
                continue
            spans = item['spans']
            text = ''.join(span['text'] for span in spans).replace('\u200b', '').strip()
            if not text:
                flush()
                continue
            formatted = []
            for span in spans:
                value = html.escape(span['text'].replace('\u200b', ''))
                if span['flags'] & 16:
                    value = f'<strong>{value}</strong>'
                if span['flags'] & 2:
                    value = f'<em>{value}</em>'
                if span['size'] < 10 and span['text'].strip().isdigit():
                    value = f'<sub>{value}</sub>'
                for link in links:
                    rect = fitz.Rect(span['bbox'])
                    intersection = rect & link['from']
                    if not intersection.is_empty and intersection.get_area() > rect.get_area() * .5:
                        value = f'<a href="{html.escape(link["uri"], quote=True)}">{value}</a>'
                        break
                formatted.append(value)
            markup = ''.join(formatted).strip()
            is_heading = (max(span['size'] for span in spans if span['text'].strip()) >= 17
                          or text == 'Gene Design Principles')
            if is_heading:
                flush()
                blocks.append({'type': 'heading', 'pages': [number], 'text': text,
                               'id': 'guide-' + re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')})
            else:
                if text.startswith(('➢', '❖')) or re.match(r'^\d+\.\s+\w', text):
                    flush()
                pending.append((text, markup))
                pages.append(number)
        # Keep prose across page breaks (e.g. Golden Gate, pages 9–10).
    flush()
    data = {'title': 'Beginner’s Guide to Highschool iGEM: Research Fundamentals',
            'byline': 'Prepared By: Humza Shahzad, ULP-CA 2026 Co-Founder and Student Lead',
            'source': str(PDF).replace('\\', '/'), 'sha256': hashlib.sha256(pdf_bytes).hexdigest(),
            'page_count': len(doc), 'raw_pages': raw_pages, 'blocks': blocks}
    (ROOT / DATA).parent.mkdir(parents=True, exist_ok=True)
    (ROOT / DATA).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    # Contact sheet for visual inspection; never shipped as site content.
    sheet = Image.new('RGB', (3 * 326, 4 * 420), 'white')
    draw = ImageDraw.Draw(sheet)
    for i, thumb in enumerate(thumbs):
        x, y = i % 3 * 326, i // 3 * 420
        sheet.paste(thumb, (x + 10, y + 20))
        draw.text((x + 10, y + 3), f'Page {i + 1}', fill='black')
    (ROOT / 'tmp/pdfs').mkdir(parents=True, exist_ok=True)
    sheet.save(ROOT / 'tmp/pdfs/kickstart-pages.png')


def build(root=ROOT, check=False):
    root = Path(root)
    data = json.loads((root / DATA).read_text(encoding='utf-8'))
    if hashlib.sha256((root / data['source']).read_bytes()).hexdigest() != data['sha256']:
        raise ValueError('Kickstart original PDF fingerprint changed')
    parts = [f'<header class="kickstart-guide-heading"><p class="detail-eyebrow">The complete guide · {data["page_count"]} source pages</p>',
             f'<h2 id="research-fundamentals">{html.escape(data["title"])}</h2>',
             f'<p>{html.escape(data["byline"])}</p>',
             f'<p><a href="{data["source"]}">Read the guide as a PDF</a></p></header>']
    in_list = False
    for index, block in enumerate(data['blocks']):
        page = block['pages'][0]
        attributes = f'data-source-pages="{",".join(map(str, block["pages"]))}"'
        is_item = block['type'] == 'paragraph' and (block['text'].startswith('➢') or re.match(r'^\d+\.\s+\w', block['text']))
        if in_list and not is_item:
            parts.append('</ul>')
            in_list = False
        if is_item and not in_list:
            parts.append('<ul class="kickstart-source-list">')
            in_list = True
        if block['type'] == 'heading':
            parts.append(f'<h3 id="{block["id"]}" {attributes}>{html.escape(block["text"])}</h3>')
        elif block['type'] == 'figure':
            path = block['source']
            if hashlib.sha256((root / path).read_bytes()).hexdigest() != block['sha256']:
                raise ValueError(f'Kickstart source figure changed: {path}')
            parts.append(f'<figure id="guide-figure-{sum(b["type"] == "figure" for b in data["blocks"][:index + 1])}" {attributes}><a href="{path}" aria-label="Open full-size figure"><img src="{path}" width="{block["width"]}" height="{block["height"]}" loading="lazy" alt="{html.escape(block["alt"], quote=True)}"></a></figure>')
        else:
            css = ' class="kickstart-source-caption"' if block['text'].lstrip().startswith('Fig.') else ''
            tag = 'li' if is_item else 'h4' if block['text'].startswith('❖') else 'p'
            parts.append(f'<{tag}{css} {attributes}>{block["html"]}</{tag}>')
    if in_list:
        parts.append('</ul>')
    generated = '\n'.join(parts)
    path = root / 'igem-kickstart.html'
    old = path.read_text(encoding='utf-8')
    before, rest = old.split(START, 1)
    _, after = rest.split(END, 1)
    result = before + START + '\n' + generated + '\n' + END + after
    if check:
        if result != old:
            raise ValueError('Kickstart article is stale; run python scripts/build-kickstart.py')
    else:
        path.write_text(result, encoding='utf-8')
    return data


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--import-pdf')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    if args.import_pdf:
        import_pdf(args.import_pdf)
    data = build(check=args.check)
    print(f'Kickstart: {data["page_count"]} pages, {len(data["blocks"])} source blocks verified.')
