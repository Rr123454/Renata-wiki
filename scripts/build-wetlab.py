#!/usr/bin/env python3
"""Build the supplied Wetlab writeups and original-PDF notebook (standard library only)."""
import argparse
import hashlib
import html
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
START, END = '<!-- wetlab-document:start -->', '<!-- wetlab-document:end -->'
ESC = html.escape


def rich(block):
    parts = []
    for run in block['runs']:
        value = ESC(run['text'])
        for flag, tag in [('italic', 'em'), ('bold', 'strong'), ('sup', 'sup')]:
            if run.get(flag):
                value = f'<{tag}>{value}</{tag}>'
        if run.get('href'):
            value = f'<a href="{ESC(run["href"], quote=True)}">{value}</a>'
        parts.append(value)
    return ''.join(parts)


def render_blocks(blocks):
    output, sections = [], []
    for index, block in enumerate(blocks):
        kind = block['type']
        attrs = f'data-source-block="{block["key"]}" data-source-pages="{",".join(map(str, block["pages"]))}"'
        if kind == 'heading':
            level = block['level']
            while sections and sections[-1] >= level:
                output.append('</section>'); sections.pop()
            output.append(f'<section class="model-section" aria-labelledby="{block["id"]}">')
            sections.append(level)
            aliases = {'host-expression':['handoff'], 'bacterial-transformation':['assembly'], 'growth-induction':['growth-response','expression-plan'], 'tlc':['assay-plan'], 'wetlab-references':['sources']}
            output.extend(f'<span class="lab-anchor" id="{alias}"></span>' for alias in aliases.get(block['id'], []))
            output.append(f'<h{level} id="{block["id"]}" {attrs}>{rich(block)}</h{level}>')
        elif kind == 'paragraph':
            cls = 'source-list-item' if block.get('list') else 'source-paragraph'
            indent = min(block.get('indent', 0), 4)
            output.append(f'<p class="{cls}" style="--source-indent:{indent}" {attrs}>{rich(block)}</p>')
        elif kind == 'figure':
            src = ESC(block['src'])
            output.append(f'<figure class="model-figure" id="{block["key"]}"><a href="{src}" aria-label="Open figure at full resolution"><img src="{src}" width="{block["width"]}" height="{block["height"]}" loading="lazy" decoding="async" alt="{ESC(block["alt"])}" /></a>')
            if index+1 == len(blocks) or blocks[index+1]['type'] != 'caption':
                output.append('</figure>')
        elif kind == 'caption':
            output.append(f'<figcaption {attrs}>{rich(block)}</figcaption></figure>')
        elif kind == 'table':
            rows = block['rows']
            head = ''.join(f'<th scope="col">{ESC(c)}</th>' for c in rows[0])
            body = ''.join('<tr>'+''.join(f'<td>{ESC(c)}</td>' for c in row)+'</tr>' for row in rows[1:])
            output.append(f'<div class="model-table-scroll" role="region" tabindex="0" aria-label="{ESC(block["text"])}"><table {attrs}><caption>{ESC(block["text"])}</caption><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>')
        else:
            raise ValueError(f'Unknown source block: {kind}')
    output.extend('</section>' for _ in sections)
    return '\n'.join(output)


def article(document):
    background, wetlab = document['background'], document['wetlab']
    links = [('process-background', 'Process/Background'), ('model-wetlab', 'Model Wetlab'), ('experimentation-protocols', 'Experimentation/Protocols')]
    tabs = '<nav class="wetlab-subtabs" aria-label="Wetlab subtabs">'+''.join(f'<a class="wetlab-subtab" href="#{key}"><strong>{label}</strong></a>' for key,label in links)+'</nav>'
    downloads = ''.join(f'<a href="{doc["source"]["path"]}" download>{label} PDF</a>' for doc,label in [(background,'Process/Background'),(wetlab,'Model Wetlab')])
    protocols = [b for b in wetlab['blocks'] if b['type']=='heading' and b['id'] in ['bacterial-transformation','colony-pcr','gel-electrophoresis','od600','culture-concentrations','iptg-stock','iptg-spike','his-pulldown','bca-quantification','sds-page','tlc-protocol']]
    index = '<section class="model-section" aria-labelledby="experimentation-protocols"><h2 id="experimentation-protocols">Experimentation/Protocols</h2><ul>'+''.join(f'<li><a href="#{b["id"]}">{ESC(b["text"])}</a></li>' for b in protocols)+'</ul></section>'
    aliases = ''.join(f'<span class="lab-anchor" id="{old}"></span>' for old in ['work-analysis','experiments-list','reporter','master-plan','six-week-plan'])
    content = f'<h1 id="lab-page-title">Wetlab</h1>{tabs}<section class="model-section" aria-labelledby="process-background"><h2 id="process-background">Process/Background</h2>{render_blocks(background["blocks"])}</section>{render_blocks(wetlab["blocks"])}{aliases}{index}'
    return f'<section class="lab-page container model-document wetlab-document"><div class="model-download">{downloads}<a href="wet-lab-notebook.html">Notebook PDF ↗</a></div><div class="lab-layout"><aside class="lab-sidebar"><nav aria-label="On this page" data-outline-auto><p>On this page</p>'+''.join(f'<a href="#{key}">{label}</a>' for key,label in links)+f'</nav></aside><article class="lab-article" aria-labelledby="lab-page-title">{content}</article></div></section>'


def notebook(document):
    nb = document['notebook']; pdf = nb['source']['path']; count = nb['pageCount']
    anchors = ''.join(f'<span id="notebook-page-{n}" data-notebook-page="{n}" class="lab-notebook-anchor"></span>' for n in range(1,count+1))
    options = ''.join(f'<option value="{n}">Page {n}</option>' for n in range(1,count+1))
    return f'''<section class="lab-page container lab-page--notebook" aria-labelledby="lab-page-title"><header class="lab-page-header"><h1 id="lab-page-title">Notebook</h1><p>Renata_Notebook.pdf · {count} pages</p><a href="wet-lab.html">Wetlab writeups ↗</a></header><section class="lab-notebook-panel" id="notebook" aria-label="Renata notebook PDF">{anchors}<div class="lab-notebook-toolbar"><label for="notebook-page">Go to</label><select id="notebook-page" data-notebook-select>{options}</select><a href="{pdf}" target="_blank" rel="noopener">Open PDF ↗</a><a href="{pdf}" download="Renata_Notebook.pdf">Download PDF</a></div><iframe class="lab-notebook-pdf" data-notebook-frame src="{pdf}#page=1&amp;view=FitH&amp;navpanes=0" title="Renata notebook — original PDF"></iframe><p>If the reader is unavailable, <a href="{pdf}">open the original notebook PDF</a>.</p></section></section>'''


def build(root=ROOT, check=False):
    root = Path(root)
    document = json.loads((root/'content/wetlab/document.json').read_text())
    originals = [document[key]['source'] for key in ['background','wetlab','notebook']]
    figures = [dict(path=b['src'], sha256=b['sha256']) for b in document['wetlab']['blocks'] if b['type']=='figure']
    for source in originals+figures:
        if hashlib.sha256((root/source['path']).read_bytes()).hexdigest() != source['sha256']:
            raise ValueError(f'Source changed: {source["path"]}')
    for name, body in [('wet-lab.html',article(document)),('wet-lab-notebook.html',notebook(document))]:
        path = root/name; current = path.read_text()
        if current.count(START)!=1 or current.count(END)!=1: raise ValueError(f'Missing source markers: {name}')
        before, rest = current.split(START); _, after = rest.split(END)
        result = before+START+'\n'+body+'\n'+END+after
        if check and result!=current: raise ValueError('Wetlab source pages are stale; run python3 scripts/build-wetlab.py')
        if not check: path.write_text(result)
    return document

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__); parser.add_argument('--check',action='store_true')
    build(check=parser.parse_args().check)
    print('Wetlab writeups and original notebook PDF checked.')
