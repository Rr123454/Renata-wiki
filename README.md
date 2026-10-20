# ULP-CA / SulFlux wiki

Static HTML, CSS and JavaScript. No application server, database, package install, account connection or external runtime library is required for local development. Keep the source files, not just a generated `public/` folder.

## Local development

Open this folder in VS Code and run **Serve website**, or:

```sh
python3 scripts/serve-wiki.py
```

Visit `http://localhost:8080/`. This preview disables browser caching so edits are visible on reload. If an older **Serve website** task is still running, stop and restart it once to use this server. The homepage is `index.html`; regenerate it after editing its template or science copy:

```sh
node scripts/build-home.js
python3 scripts/build-model.py
node --test tests/*.test.js
python3 -m unittest discover -s tests -p 'test_*.py'
```

The authoring/build commands use Node 22+ and Python 3.10+. No npm dependencies are needed.

Every HTML entry point uses a content hash for its local scripts and stylesheets. After editing JS or CSS, run `node scripts/version-assets.js` to refresh the URLs across all pages. `node scripts/build-home.js` also does this automatically. The tests reject stale asset versions; exported previews and releases receive their own hashes after URL rewriting. This prevents a content update from continuing to request an older cached script.

## Manual transfer to GitLab

```sh
node scripts/build-home.js
python3 scripts/build-model.py
python3 scripts/build-wiki.py
python3 scripts/package-wiki.py
```

- `build/renata-wiki-source.zip`: unpack into the destination repository's root. Include hidden `.gitlab-ci.yml` and `.gitignore`; preserve the destination's `.git` folder and any official repository settings. Review differences with the official template before committing. Do not create an extra enclosing folder.
- `public/`: standalone preview output. Serve with `python3 scripts/serve-wiki.py --port 8081 --directory public` and open `http://localhost:8081/`.
- `build/wiki-audit.json`: asset upload inventory, file hashes and findings.
- `.gitlab-ci.yml`: test/preview jobs plus a manual Pages release job. Source commits do not automatically publish draft material.

For a preview hosted under a subdirectory, use `python3 scripts/build-wiki.py --base-path /your-prefix/`. Build output includes static `/description/`, `/engineering/`, `/model/`, `/human-practices/` and `/education/` routes; existing `.html` links still work. Engineering's standard route contains the project record rather than the old redirect. Confirm slashless route resolution on the destination server.

For the actual iGEM release, fill `config/igem.json`, upload the media listed in the audit through iGEM's upload tool, and paste the returned URLs into `config/asset-urls.json`. Example shape:

```json
{
  "assets/story/lca-dca.webp": "https://static.igem.wiki/your-actual-upload-path/lca-dca.webp"
}
```

The example URL is illustrative: use the exact URL returned by iGEM. Then:

```sh
python3 scripts/build-wiki.py --release
```

The release build stops for missing identity/upload settings, draft text, broken media references, external embedded resources, or unfinished team review. It does not certify competition eligibility or replace the official dashboard checks. Current outstanding items are in [the audit](docs/igem-readiness.md). No upload or deployment has been performed.

## PDF and image writeups

See [the verbatim writeup workflow](docs/writeup-workflow.md). Add PDFs and PNGs locally; original bytes and page references are retained. Reviewed text is escaped into HTML without paraphrasing. Extraction/OCR requires human checking before publication.

The Model page uses the supplied **Dry Lab Documentation (1).pdf** and **Fig1.png–Fig10.png**. Its transcript, original-file hashes, page references, and documented extraction repairs are in `content/model/document.json`; originals are in `assets/model/`. See [Model source notes](docs/model-source.md). Regenerate with `python3 scripts/build-model.py`, or verify that the committed HTML is current with `python3 scripts/build-model.py --check`. No PDF extraction software is needed to build or manually transfer the site.
