"""Read-only source audit; inspection images and text are written under tmp/pdfs."""
import json
from pathlib import Path
import fitz
from PIL import Image, ImageDraw

source = Path(r'C:\Users\27fan\Downloads\iGEM Renata Lab Documentation 2026 (1).pdf')
out = Path(__file__).resolve().parents[1] / 'tmp/pdfs/wetlab-update'
out.mkdir(parents=True, exist_ok=True)
doc = fitz.open(source)
pages = [{'page': i+1, 'text': p.get_text(), 'images': len(p.get_images())} for i,p in enumerate(doc)]
(out/'pages.json').write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding='utf8')
for start in range(0,len(doc),6):
    sheet = Image.new('RGB',(1050,1000),'#ddd')
    draw = ImageDraw.Draw(sheet)
    for index in range(start,min(start+6,len(doc))):
        pix = doc[index].get_pixmap(matrix=fitz.Matrix(1,1),alpha=False)
        im = Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
        im.thumbnail((340,470))
        x,y=(index-start)%3*350,(index-start)//3*500
        sheet.paste(im,(x,y+25)); draw.text((x+8,y+5),f'Page {index+1}',fill='black')
    sheet.save(out/f'pages-{start+1}-{min(start+6,len(doc))}.jpg')
print(f'Extracted {len(pages)} pages into {out}')
