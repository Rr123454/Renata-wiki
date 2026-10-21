# iGEM Kickstart source record

The article at `igem-kickstart.html` combines the user's supplied three-section introduction with the complete eleven-page *Beginner’s Guide to Highschool iGEM: Research Fundamentals*, prepared by Humza Shahzad, ULP-CA 2026 Co-Founder and Student Lead.

- Original supplied filename: `Education Document_ Genetic Circuitry.pdf`.
- Unchanged original: `assets/kickstart/research-fundamentals.pdf`.
- Transcript, raw page extraction, source-page provenance, and fingerprints: `content/kickstart/guide.json`.
- Four teaching figures and the closing author portrait are extracted directly from the PDF. No illustrations are regenerated.
- `scripts/build-kickstart.py` renders only the marked transcript region; the supplied introductory account remains in the HTML outside that region.
- PDF line wrapping and invisible zero-width spaces are normalized for web reading. Heading levels, list semantics, emphasis, subscripts, and original hyperlinks are retained or mapped to semantic HTML. Source words are unchanged, including source spelling and scientific generalizations.
- Source captions follow the corresponding figures. A small additional source-page link identifies the original page.
- The complete guide is student-authored source material. Integration and word-coverage tests establish transcription fidelity; they do not establish scientific peer review or validate experimental advice.

## Rebuild and verify

```text
python -X utf8 scripts/build-kickstart.py
python -X utf8 scripts/build-kickstart.py --check
python -X utf8 -m unittest discover -s tests -p test_kickstart.py
node scripts/version-assets.js
```

Only an intentional source refresh needs PyMuPDF and Pillow:

```text
python -X utf8 scripts/build-kickstart.py --import-pdf "path/to/Education Document_ Genetic Circuitry.pdf"
```

Review the generated contact sheet under `tmp/pdfs/` and the source document when refreshing. Normal site builds use the standard library and reject stale transcript markup or changed PDF/figure fingerprints. As with other media, a production iGEM release requires official asset URLs in `config/asset-urls.json`.
