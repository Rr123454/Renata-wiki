"""Extract the supplied engagement record and its photographs for the wiki."""
import hashlib
import io
import json
from pathlib import Path
import fitz
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\27fan\Downloads\Writeup Education + HP.pdf')
out = ROOT / 'assets/engagement'
archive = ROOT / 'content/engagement'
out.mkdir(exist_ok=True)
archive.mkdir(exist_ok=True)
doc = fitz.open(SOURCE)
manifest = {'source': SOURCE.name, 'sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'pages': [], 'images': []}
thumbs = []
for number, page in enumerate(doc, 1):
    manifest['pages'].append({'page': number, 'text': page.get_text(), 'links': [link.get('uri') for link in page.get_links() if link.get('uri')]})
    for index, item in enumerate(page.get_images(full=True), 1):
        raw = doc.extract_image(item[0])
        im = Image.open(io.BytesIO(raw['image'])).convert('RGB')
        im.thumbnail((1800, 1800))
        name = f'page-{number:02}-{index}.jpg'
        im.save(out / name, quality=88, optimize=True)
        manifest['images'].append({'page': number, 'src': f'assets/engagement/{name}', 'width': im.width, 'height': im.height})
        tile = Image.new('RGB', (360, 280), 'white')
        thumb = ImageOps.contain(im, (350, 245))
        tile.paste(thumb, ((360-thumb.width)//2, 0))
        ImageDraw.Draw(tile).text((8, 255), name, fill='black')
        thumbs.append(tile)
(archive / 'source.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf8')
sheet = Image.new('RGB', (360*3, 280*((len(thumbs)+2)//3)), '#ddd')
for i,tile in enumerate(thumbs): sheet.paste(tile, ((i%3)*360,(i//3)*280))
sheet.save(ROOT / 'tmp/engagement-contact-sheet.jpg')
print(f'Extracted {len(doc)} pages and {len(thumbs)} images.')
