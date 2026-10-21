# Model source transfer

The downloadable Model source PDF is the supplied `Model.pdf` (21 pages). Its original bytes are kept at `assets/model/dry-lab-documentation.pdf`, and its SHA-256 hash is recorded in `content/model/document.json`. This replacement updates the downloadable PDF only; the existing HTML Model article and its ten `Fig1.png`–`Fig10.png` figures remain unchanged.

The article contains the introduction, enzyme-engineering text, four numbered sections, three mutagenesis subsections, nine tables (eight numbered plus Foldseek Alignment Metrics), ten figure captions, and 17 references. The expanding left outline follows these headings. Figures link to their full-resolution originals; the original PDF is downloadable. Text and tables remain readable without JavaScript.

## Transcription decisions

- The user explicitly confirmed replacing the four missing page-1 symbols with **β**. No other scientific wording was rewritten.
- PDF line wrapping was reflowed. Extraction artifacts around underscores in variant names and spaces before punctuation were repaired against the rendered PDF.
- Table cells were checked against the PDF rendering, rather than relying on the PDF's interleaved column extraction. Rows spanning pages were joined and continuation headers appear once.
- The supplied PNGs were copied unchanged. No graph was recreated or reinterpreted.
- Source figure references, typographical errors, numerical inconsistencies, and scientific statements are retained as supplied. In particular, the section 3 editorial parenthetical is retained as literal source text, not executed as an instruction. These remain available for the team's later editorial/scientific review.
- This is an AI-assisted transcription check, not a claim of independent scientific validation or completed human review.

## Updating the page

1. Keep replacement originals and their source names.
2. Update `content/model/document.json` using the PDF's exact wording, captions, table cells, and page numbers. Update file hashes only after confirming the intended replacement.
3. Run `python3 scripts/build-model.py`.
4. Run `python3 -m unittest discover -s tests -p 'test_*.py'` and `node --test tests/*.test.js`.
5. Build the preview and source ZIP using the README commands.

`content/model/pdf-extraction.json` preserves the initial PDFKit extraction, including page coordinates and extraction defects, for comparison. It is not a runtime dependency. `model.html` is committed static HTML; Python's standard library suffices to regenerate it on another machine. The new media are automatically included in the existing iGEM upload inventory.

The previous Model runtime is not loaded by `model.html`. Its older shared research data remain available to the existing Wetlab and legacy modules. This transfer does not replace Wetlab content or claim that computational results establish experimental activity.
