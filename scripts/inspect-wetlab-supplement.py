"""Inspect unique supporting images and the pages that establish their context."""
from pathlib import Path
import json
import fitz
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
out = root/'tmp/pdfs/wetlab-supplement'
out.mkdir(parents=True, exist_ok=True)
doc = fitz.open(r'C:\Users\27fan\Downloads\iGEM Renata Lab Documentation 2026 (2).pdf')
pages = [39,47,48,58,59,60,61,62,64,65,66,70,71,72,73]
for n in pages:
    doc[n-1].get_pixmap(matrix=fitz.Matrix(1,1), alpha=False).save(out/f'page-{n}.png')
for start in range(0,len(pages),4):
    sheet=Image.new('RGB',(1250,1660),'#ddd')
    draw=ImageDraw.Draw(sheet)
    for j,n in enumerate(pages[start:start+4]):
        im=Image.open(out/f'page-{n}.png'); im.thumbnail((610,790))
        x,y=j%2*625,j//2*830
        sheet.paste(im,(x,y+25)); draw.text((x+5,y+5),f'Page {n}',fill='black')
    sheet.save(out/f'sheet-{start}.jpg')
(out/'text.json').write_text(json.dumps([dict(page=n,text=doc[n-1].get_text()) for n in pages],ensure_ascii=False,indent=2),encoding='utf8')
print(out)
