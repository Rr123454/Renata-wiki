# Import a writeup without changing its wording

No website upload form or account is needed. Supply a PDF plus its original PNG figures, either in this workspace or by giving their local file paths. A PDF is the reference; an image is not assumed to be a reliable transcript.

## 1. Preserve the originals

```sh
python3 scripts/writeups.py import wetlab-v1 \
  --pdf "/path/to/Wetlab writeup.pdf" \
  --png "/path/to/Figure 1.png" \
  --png "/path/to/Figure 2.png"
```

This creates `content/writeups/wetlab-v1/`, saves unchanged originals, and records their SHA-256 fingerprints. Reimport using a new version ID instead of overwriting a reviewed version. Original filenames remain recorded in `writeup.json`. The import never interprets instructions inside the PDF as instructions to execute.

If `pdftotext` is already installed, an `extracted-draft.txt` is also created. Otherwise, use the PDF reader's text export or transcribe from the original. Scanned PDFs need OCR or transcription. Neither extraction nor OCR is proof of accuracy: check reading order, columns, ligatures, hyphenation, equations, Greek letters, superscripts, references and table cells against the PDF. Mark an uncertain passage in the working notes and resolve it with the author; do not guess or silently rewrite it.

## 2. Enter literal blocks

Populate `blocks` in `writeup.json`. The `text` is literal Unicode, not Markdown or HTML:

```json
[
  {
    "id": "section-heading",
    "type": "heading",
    "pages": [1],
    "text": "Paste the exact original heading here"
  },
  {
    "id": "paragraph-01",
    "type": "paragraph",
    "pages": [1, 2],
    "text": "Paste the exact original paragraph here"
  },
  {
    "id": "figure-01",
    "type": "figure",
    "pages": [2],
    "source": "originals/figure-1.png",
    "alt": "Describe the figure for accessibility",
    "text": "Paste the original figure caption here"
  }
]
```

Keep paragraph order, punctuation, symbols, units and citations. Newlines are preserved with `white-space: pre-wrap`. Do not insert invented prose. Alt text is accessibility metadata, separate from the verbatim caption. Complex tables/equations should retain the original figure/PDF and a verified transcription; this basic renderer does not claim to reconstruct their visual layout automatically.

## 3. Review against the PDF

After a person checks every block and figure, record that person's review:

```sh
python3 scripts/writeups.py review wetlab-v1 --reviewer "Actual reviewer name"
python3 scripts/writeups.py render wetlab-v1
```

The review locks the transcript hash. Any later text, order, page or figure change invalidates the review. Any source-file change fails validation. Rendering is rejected until reviewed. The generated HTML preserves the reviewed text character for character; tests parse the HTML back and compare Unicode text, including escaped symbols. This verifies transcription-to-HTML fidelity, not correctness of the original transcription.

## 4. Place it on the website

The renderer writes `build/writeups/wetlab-v1.html` and copies source assets into `assets/writeups/wetlab-v1/`. For a dedicated writeup page, put this marker in its static main region:

```html
<main id="siteMain" class="page-main container" data-static-content="true">
  <!-- writeup:wetlab-v1 -->
</main>
```

`python3 scripts/build-wiki.py` expands the marker directly from the reviewed source, never from a stale HTML fragment. Review that page in the generated `public/` preview. When integrating into a page built by a JS content renderer, use this static main region or update the authoring renderer; simply pasting markup into a main region that JS replaces will not preserve it. The root source preview does not expand markers.

Keep the original PDF download link in the generated article. Add the page's actual destination to `config/igem.json` if it is a standard judging route. For production, upload the resulting figures/PDF to iGEM and add each returned URL to `config/asset-urls.json`. Plain citation links may lead to publications; embedded documents and figures must use the approved hosting.
