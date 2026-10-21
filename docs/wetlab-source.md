# Wetlab source transfer

The supplied files are preserved byte for byte:

- `Process:Background.pdf` → `assets/wetlab/process-background.pdf` (1 page), shown under **Process/Background**.
- `Model WetLab WriteUp.pdf` → `assets/wetlab/model-wetlab.pdf` (25 pages), shown under **Model Wetlab**, in source order. **Experimentation/Protocols** links to the protocols within this writeup.
- `Renata_Notebook.pdf` → `assets/wetlab/renata-notebook.pdf` (19 pages), displayed as the original PDF on **Notebook**, with open/download links and a page selector. No generated notebook or transcription replaces it.

`content/wetlab/document.json` is the editable transcript, with source pages, rich-text runs, original filenames, source hashes, and figure hashes. The HTML uses the Model page's styling and expanding left outline. It remains readable without JavaScript. Source PDFs and full-size figures remain accessible.

## Fidelity and layout

PDF line wraps were reflowed; formatting-boundary spaces, superscripts, list-label ordering, the font-split `15.625ug/mL`, and wrapped URLs were checked against the PDF. Native gel tables A–C were transcribed and their continuation rows joined. All original step labels, gaps in numbering, units, wording, captions, credits, references, and scientific inconsistencies remain. Parenthetical editing/safety notes in the source are literal content, not instructions executed during import.

Thirteen figure regions were rendered directly from the PDF at three times page resolution, preserving composite diagrams and image crops. The TLC setup table on page 22 is an image already clipped at the source page's right edge; its visible extent is retained without inventing missing cells. Other embedded figures were not redrawn or scientifically reinterpreted.

The `*-extraction.json` files preserve positioned source text. `pdf-text.json` contains an independent PDFKit extraction used to check that no non-whitespace source characters were lost. Tests also compare every rendered text/table block back to the transcript, verify original PDF/figure hashes, and cover all source pages. These checks do not constitute independent scientific validation or completed human review.

## Rebuild and transfer

```sh
python3 scripts/build-wetlab.py
node scripts/version-assets.js
python3 -m unittest discover -s tests -p 'test_wetlab_document.py'
python3 scripts/build-wiki.py
python3 scripts/package-wiki.py
```

Rebuilding uses Python's standard library and Node.js, with no additional packages. The original import used local PDFKit and PyMuPDF for extraction; neither is a website/build dependency. The shared wiki build rejects stale writeup HTML or changed source files. The source ZIP includes all originals, figures, transcripts, pages, and scripts for manual transfer. The new notebook PDF is separate from the old generated prompt PDF, so the legacy notebook generator cannot overwrite it.

## Preserved annotated record

The merge also retains the separately supplied 74-page `assets/documents/igem-renata-lab-documentation-2026.pdf`, its 13 extracted figures, and its annotated evidence and chronology. The Wetlab page includes an expandable evidence review below the protocol index; Notebook includes the June–October chronology and a direct link to the full 74-page source below the 19-page PDF reader. Each section identifies its source, and the documents are kept separate.

`scripts/render-wetlab-evidence.cjs` reuses the existing source-backed renderer at build time and verifies the original PDF hash. The resulting evidence and chronology are included as static HTML by `scripts/build-wetlab.py`. Review anchors are prefixed to avoid collisions with the incoming writeups.
