"""Rebuild the viewer PDF from the site's existing notebook data; never invent records."""
import hashlib
import html
import json
from pathlib import Path
import shutil
import sys

from reportlab.lib import colors
from reportlab.lib.pagesizes import A5
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak

ROOT = Path(__file__).resolve().parents[1]
raw = sys.stdin.buffer.read()
data = json.loads(raw)
source_hash = hashlib.sha256(raw).hexdigest()
output = ROOT / "output" / "pdf" / "wet-lab-notebook.pdf"
asset = ROOT / "assets" / "documents" / "wet-lab-notebook.pdf"
output.parent.mkdir(parents=True, exist_ok=True)
asset.parent.mkdir(parents=True, exist_ok=True)
ink = colors.HexColor("#24305E")
muted = colors.HexColor("#536080")
accent = colors.HexColor("#DB8050")
styles = {
    "title": ParagraphStyle("Title", fontName="Helvetica-Bold", fontSize=24, leading=28, textColor=ink, spaceAfter=14),
    "heading": ParagraphStyle("Heading", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=ink, spaceAfter=12),
    "entry": ParagraphStyle("Entry", fontName="Helvetica-Bold", fontSize=11.5, leading=15, textColor=ink, spaceAfter=5, keepWithNext=True),
    "body": ParagraphStyle("Body", fontName="Helvetica", fontSize=10.5, leading=15, textColor=ink, spaceAfter=12),
    "label": ParagraphStyle("Label", fontName="Helvetica-Bold", fontSize=8, leading=11, textColor=muted, spaceAfter=6, keepWithNext=True),
    "small": ParagraphStyle("Small", fontName="Helvetica", fontSize=8.5, leading=12, textColor=muted, spaceAfter=10),
}

def para(text, style="body"):
    text = text.replace("\u2011", "-").replace("\u2013", "-").replace("\u2014", "-")
    return Paragraph(html.escape(text), styles[style])

page_count = 1 + len(data["sections"])
def furniture(canvas, doc):
    width, height = A5
    canvas.saveState()
    canvas.setFillColor(ink)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(30, height - 23, "iGEM RENATA / WETLAB NOTEBOOK")
    canvas.setStrokeColor(accent)
    canvas.setLineWidth(2)
    canvas.line(30, height - 33, width - 30, height - 33)
    canvas.setFillColor(muted)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(30, 20, "Undated prompts - completed bench records pending")
    canvas.drawRightString(width - 30, 20, f"{doc.page} / {page_count}")
    canvas.restoreState()

story = [para(data["title"], "title"), para("WORKING PROMPTS / EVIDENCE BOUNDARY", "label"), para(data["notice"]), para(data["planningNote"]), Spacer(1, 10), para("Notebook sections", "heading")]
for section in data["sections"]:
    story.append(para(f'{section["page"]}  |  {section["title"]}'))
story.extend([Spacer(1, 12), para("Source", "entry"), para(data["source"], "small")])
for section in data["sections"]:
    story.extend([PageBreak(), para(data["status"].upper(), "label"), para(section["title"], "heading"), para(section["lead"]), Spacer(1, 5)])
    for entry in section["entries"]:
        story.extend([para(entry["label"].upper(), "label"), para(entry["title"], "entry"), para(entry["text"]), Spacer(1, 5)])
    if not section["entries"]:
        story.extend([Spacer(1, 12), para("Awaiting a dated assay record", "entry"), para(data["planningNote"])])

document = SimpleDocTemplate(str(output), pagesize=A5, leftMargin=30, rightMargin=30, topMargin=49, bottomMargin=39,
    title=data["title"], author="iGEM Renata", subject=f"Undated entry prompts; source-sha256:{source_hash}", invariant=1)
document.build(story, onFirstPage=furniture, onLaterPages=furniture)
shutil.copyfile(output, asset)
print(json.dumps({"pdf": str(asset), "bytes": asset.stat().st_size, "sourceHash": source_hash}))

if "--render" in sys.argv:
    import pypdfium2 as pdfium
    previews = ROOT / "tmp" / "pdfs" / "wet-lab-notebook"
    previews.mkdir(parents=True, exist_ok=True)
    pdf = pdfium.PdfDocument(str(output))
    assert len(pdf) == page_count, f"Unexpected page count: {len(pdf)}"
    for index, page in enumerate(pdf):
        page.render(scale=1.6).to_pil().save(previews / f"page-{index + 1}.png")
    print(json.dumps({"pages": len(pdf), "previews": str(previews)}))
