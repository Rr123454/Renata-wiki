// Keep the paper-style overview source separate from its rendered template.
const fs=require('node:fs');
const sections=JSON.parse(fs.readFileSync('content/engagement/hp-summary.json','utf8'));
let code=fs.readFileSync('js/site.js','utf8');
const start=code.indexOf('            <section class="project-paper-section" id="hp-abstract">');
const end=code.indexOf('          </article>',start);
const body=sections.map(s=>`            <section class="project-paper-section" id="${s.id}">
              <h2>${s.title}</h2>
              ${s.paragraphs.map(p=>`<p>${p}</p>`).join('\n              ')}
              ${(s.subsections||[]).map((sub,i)=>`<section id="${s.id}-${i+1}"><h3>${sub.title}</h3><p>${sub.text}</p></section>`).join('\n              ')}
            </section>`).join('\n');
if(start<0||end<0) throw new Error('HP summary markers missing');
code=code.slice(0,start)+body+'\n'+code.slice(end);
const navStart=code.indexOf('              <ul>',code.indexOf('id="hp-outline-title"'));
const navEnd=code.indexOf('            </nav>',navStart);
code=code.slice(0,navStart)+'              <ul><li><a href="#hp-events">Engagement records</a></li>'+sections.map(s=>`<li><a href="#${s.id}">${s.title}</a></li>`).join('')+'</ul>\n'+code.slice(navEnd);
fs.writeFileSync('js/site.js',code.replace(/^[ \t]+$/gm,''));
