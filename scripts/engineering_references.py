"""Render the supplied Engineering bibliography with continuous numbering."""
import html
import json
import re
from pathlib import Path

def render_references(fragments):
    groups = []
    for fragment in fragments:
        if fragment == 'References:':
            continue
        if fragment in ['Scientific references', 'AI models', 'Analysis tools']:
            groups.append(dict(title=fragment, entries=[]))
        elif re.match(r'^\d+\.', fragment):
            number, text = re.split(r'\.\s*', fragment, maxsplit=1)
            groups[-1]['entries'].append(dict(number=int(number), text=text))
        else:
            groups[-1]['entries'][-1]['text'] += ' ' + fragment
    numbers = [e['number'] for g in groups for e in g['entries']]
    assert numbers == list(range(1,18)), numbers
    parts = []
    for group in groups:
        slug = group['title'].lower().replace(' ', '-')
        parts.append(f'<h3 id="engineering-refs-{slug}">{group["title"]}</h3><ol class="engineering-reference-list" start="{group["entries"][0]["number"]}">')
        for entry in group['entries']:
            text = html.escape(entry['text'])
            text = re.sub(r'(https://[^\s]+)', r'<a href="\1" target="_blank" rel="noopener noreferrer">\1</a>', text)
            text = re.sub(r'DOI: (10\.[^\s]+)', r'DOI: <a href="https://doi.org/\1" target="_blank" rel="noopener noreferrer">\1</a>', text)
            parts.append(f'<li id="engineering-ref-{entry["number"]}">{text}</li>')
        parts.append('</ol>')
    return ''.join(parts)

if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    source = json.loads((root/'content/engineering-revision.json').read_text(encoding='utf8'))
    path = root/'js/engineering-revision.js'
    current = path.read_text(encoding='utf8')
    prefix, payload = current.split(' = ', 1)
    data = json.loads(payload.strip().rstrip(';'))
    data['referencesHtml'] = render_references(source['references'])
    path.write_text(prefix+' = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
