#!/usr/bin/env python3
"""Dependency-free static export. Preview stays local; --release enforces release gates."""
import argparse
import hashlib
import html
import json
import re
import runpy
import shutil
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit
from writeups import render as render_writeup

ROOT = Path(__file__).resolve().parents[1]
MEDIA = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".pdf",
         ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".webm", ".mp3", ".wav", ".csv"}


def media_type(path):
    head = path.read_bytes()[:16]
    if head.startswith(b"RIFF") and head[8:12] == b"WEBP":
        return ".webp"
    if head.startswith(b"\x89PNG"):
        return ".png"
    if head.startswith(b"\xff\xd8"):
        return ".jpg"
    return path.suffix.lower()


def allowed_media_url(value):
    u = urlsplit(value)
    return u.scheme == "https" and u.hostname == "static.igem.wiki" and not u.username and not u.fragment


def allowed_igem_url(value):
    u = urlsplit(value)
    host = u.hostname or ""
    return u.scheme == "https" and not u.username and (host in {"igem.org", "igem.wiki"} or host.endswith((".igem.org", ".igem.wiki")))


def build(root=ROOT, output=None, release=False, base_path=None):
    root = Path(root)
    if (root / "content/model/document.json").exists():
        runpy.run_path(str(ROOT / "scripts/build-model.py"))["build"](root, check=True)
    output = Path(output or root / "public").resolve()
    config = json.loads((root / "config/igem.json").read_text())
    urls = json.loads((root / "config/asset-urls.json").read_text())
    sources = sorted(root.glob("*.html"))
    for directory in ("css", "js"):
        sources += sorted((root / directory).glob("*"))
    sources = [p for p in sources if p.suffix in {".html", ".css", ".js"}]
    texts = {p.relative_to(root).as_posix(): p.read_text() for p in sources}
    for name, text in texts.items():
        texts[name] = re.sub(r"<!--\s*writeup:([a-z0-9-]+)\s*-->",
                             lambda m: render_writeup(root / "content/writeups" / m[1], root), text)
    # Inventory literal references and expand the few template-literal image families.
    assets = {}
    corpus = "\n".join(texts.values())
    for p in sorted((root / "assets").rglob("*")):
        if not p.is_file() or p.suffix.lower() not in MEDIA:
            continue
        key = p.relative_to(root).as_posix()
        dynamic = key.startswith(("assets/nav-icons/", "assets/dry-lab/"))
        if key in corpus or quote(key, safe="/") in corpus or dynamic:
            assets[key] = p
    errors = []
    # Catch broken/case-sensitive references that work accidentally on macOS.
    actual = {p.relative_to(root).as_posix() for p in (root / "assets").rglob("*") if p.is_file()}
    for name, text in texts.items():
        for match in re.finditer(r"""(?:["'`(\s])((?:\.\./)?assets/[^"'`<>\n]*?\.(?:png|jpg|jpeg|webp|svg|pdf|woff2?|ttf|gif|ico))(?=["'`)#?\s])""", text, re.I):
            ref = unquote(match[1].removeprefix("../"))
            if "${" not in ref and ref not in actual:
                errors.append(f"Missing asset (case-sensitive): {name}: {ref}")
    missing = [key for key in assets if not urls.get(key)]
    for key, value in urls.items():
        if not isinstance(value, str) or not allowed_media_url(value):
            errors.append(f"Invalid iGEM media URL: {key}")
    placeholders = [name for name, text in texts.items()
                    if not name.endswith(".css") and re.search(r"\blorem\b|\bPLACEHOLDER\s*:", text, re.I)]
    # Citation anchors are allowed. Requests for embedded resources must stay on iGEM.
    for name, text in texts.items():
        patterns = [
            r"""(?:src|poster)\s*=\s*["'](https?://[^"']+)""",
            r"""<(?:image|link)\b[^>]*href=["'](https?://[^"']+)""",
            r"""(?:url\(|fetch\(|importScripts\()\s*["']?(https?://[^"' )]+)"""
        ]
        for pattern in patterns:
            for value in re.findall(pattern, text):
                host = urlsplit(value).hostname or ""
                if not (host in {"igem.org", "igem.wiki"} or host.endswith((".igem.org", ".igem.wiki"))):
                    errors.append(f"External embedded resource: {name}: {value}")
    if release:
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", config["teamSlug"]):
            errors.append("Set the official teamSlug in config/igem.json.")
        if not allowed_igem_url(config.get("attributionsUrl", "")):
            errors.append("Set the public attributions/team URL supplied by the current iGEM dashboard.")
        expected = f'https://gitlab.igem.org/{config["year"]}/{config["teamSlug"]}'
        if config["repository"].removesuffix(".git").rstrip("/") != expected:
            errors.append("Set repository to the team's official iGEM GitLab repository.")
        if missing:
            errors.append(f"{len(missing)} referenced media files still need iGEM upload URLs.")
        if placeholders:
            errors.append("Draft copy remains in: " + ", ".join(placeholders))
        for key, checked in config["review"].items():
            if checked is not True:
                errors.append(f"Team review pending: {key}")
        if not (root / "contribution.html").exists():
            errors.append("Add the team's actual contribution.html write-up; no invented contribution is generated.")
    if config.get("attributionsEmbedUrl") and not allowed_igem_url(config["attributionsEmbedUrl"]):
        errors.append("Attributions embed must use an official iGEM URL.")
    if output == root or root in output.parents and output.name in {"assets", "js", "css", "content", "config"}:
        raise ValueError("Output must be a separate generated directory.")
    if output.exists() and any(output.iterdir()) and not (output / ".wiki-build").exists():
        raise ValueError("Refusing to overwrite a directory not created by this builder.")
    # Do not destroy the last usable preview when a release gate fails.
    report = {"mode": "release" if release else "preview", "errors": errors,
              "missingUploadUrls": missing, "draftFiles": placeholders,
              "assets": [{"source": key, "sha256": hashlib.sha256(p.read_bytes()).hexdigest(),
                          "uploadExtension": media_type(p), "url": urls.get(key, "")}
                         for key, p in assets.items()]}
    report_dir = root / "build"
    report_dir.mkdir(exist_ok=True)
    (report_dir / "wiki-audit.json").write_text(json.dumps(report, indent=2) + "\n")
    if errors:
        raise ValueError("\n".join(errors))
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    (output / ".wiki-build").write_text("Generated by scripts/build-wiki.py\n")
    base = base_path or (f'/{config["teamSlug"]}/' if release else "/")
    if not re.fullmatch(r"/(?:[a-zA-Z0-9_-]+/)*", base):
        raise ValueError("base-path must start and end with / and contain simple path segments.")
    # Correct MIME extensions in export without changing the supplied originals.
    resolved = {}
    for key, p in assets.items():
        suffix = media_type(p)
        target = str(Path(key).with_suffix(suffix)) if suffix != p.suffix.lower() else key
        resolved[key] = urls.get(key) if release else quote(target, safe="/")
        if not release:
            dest = output / target
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(p, dest)
    def rewrite(text):
        spellings = {spelling: key for key in resolved for spelling in {key, quote(key, safe="/")}}
        if not spellings:
            return text
        pattern = r"(\.\./)?(" + "|".join(re.escape(key) for key in sorted(spellings, key=len, reverse=True)) + ")"
        return re.sub(pattern, lambda m: (m[1] or "" if not release else "") + resolved[spellings[m[2]]], text)
    boot = "window.IGEM_CONFIG=" + json.dumps(config) + ";\n"
    boot += "window.IGEM_ASSETS=" + json.dumps(resolved) + ";\n"
    boot += "window.IGEM_ASSET_URL=p=>window.IGEM_ASSETS[p]||p;\n"
    (output / "js").mkdir()
    (output / "js/wiki-runtime.js").write_text(boot)
    license_html = '<p>Content is licensed under <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>'
    repo_html = f'<p><a href="{html.escape(config["repository"])}">Wiki source on iGEM GitLab</a></p>' if config["repository"] else ""
    def decorate(text):
        text = re.sub(r'<base\b[^>]*>', '', text)
        text = text.replace("<head>", f'<head>\n<base href="{base}"/>\n<script src="js/wiki-runtime.js"></script>', 1)
        # Retain a license/source footer even on compatibility routes and without JS.
        text = text.replace("</body>", f'<aside class="container wiki-license">{license_html}{repo_html}</aside>\n</body>')
        text = rewrite(text)
        def versioned(match):
            name = match[2]
            source = boot if name == "js/wiki-runtime.js" else rewrite(texts.get(name, ""))
            version = hashlib.sha256(source.encode()).hexdigest()[:12]
            return f'{match[1]}{name}?v={version}"'
        return re.sub(r'((?:src|href)=")((?:js|css)/[^"?]+)(?:\?[^"]*)?"', versioned, text)
    for name, text in texts.items():
        dest = output / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(decorate(text) if name.endswith(".html") else rewrite(text))
    routes = dict(config["routes"])
    if (root / "contribution.html").exists():
        routes["contribution"] = "contribution.html"
    for route, source in routes.items():
        if not re.fullmatch(r"[a-z0-9-]+", route) or source not in texts:
            raise ValueError(f"Invalid route: {route}: {source}")
        dest = output / route / "index.html"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(decorate(texts[source]))
    attribution = (f'<p><a href="{html.escape(config["attributionsUrl"], quote=True)}">Official project attributions</a></p>'
                   if allowed_igem_url(config.get("attributionsUrl", "")) else '<p>The completed official Attributions Form and public link are pending.</p>')
    # Only embed if the current dashboard provides an embed URL; do not assume an older season's rule.
    if config.get("attributionsEmbedUrl"):
        attribution += (f'<iframe id="igem-attribution-form" title="iGEM Project Attributions" '
                        f'src="{html.escape(config["attributionsEmbedUrl"], quote=True)}" '
                        'style="width:100%;min-height:100vh;border:0"></iframe>')
    attribution_page = decorate('<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width"/><title>Attributions</title><link rel="stylesheet" href="css/site.css"/></head><body><main class="container"><a href="index.html">Home</a><h1>Attributions</h1>' + attribution + '</main></body></html>')
    (output / "attributions").mkdir(exist_ok=True)
    (output / "attributions/index.html").write_text(attribution_page)
    (output / "attributions.html").write_text(attribution_page)
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--release", action="store_true")
    parser.add_argument("--output")
    parser.add_argument("--base-path")
    args = parser.parse_args()
    try:
        result = build(output=args.output, release=args.release, base_path=args.base_path)
        print(f'Built {args.output or "public/"} ({result["mode"]}). Audit: build/wiki-audit.json')
    except ValueError as error:
        parser.exit(1, f"Build stopped:\n{error}\nAudit: build/wiki-audit.json\n")
