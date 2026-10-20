'use strict';
// Small DOM used to exercise outline preparation against the authored articles.
// Browser geometry and events are covered separately by the controller fixture.
const decode = text => text.replace(/&(amp|lt|gt|quot|#39|nbsp);/g,(_,key)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'",nbsp:' '}[key]));
class Element {
 constructor(tag, attrs={}) {
  this.tagName=tag.toUpperCase();this.attrs=attrs;this.content=[];this.parentElement=null;
  this.dataset=Object.fromEntries(Object.entries(attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]));
  this.classList={add:(...names)=>{this.attrs.class=[...new Set([...(this.attrs.class||'').split(' '),...names])].join(' ');},remove:(...names)=>{this.attrs.class=(this.attrs.class||'').split(' ').filter(n=>!names.includes(n)).join(' ');}};
 }
 get children(){return this.content.filter(item=>item instanceof Element);}
 get id(){return this.attrs.id||'';} set id(value){this.attrs.id=value;}
 get textContent(){return this.content.map(item=>typeof item==='string'?item:item.textContent).join('');}
 getAttribute(name){return this.attrs[name]??null;}
 setAttribute(name,value){this.attrs[name]=value;}
 hasAttribute(name){return name in this.attrs;}
 matches(selector){return selector.split(',').some(s=>{s=s.trim();return s.startsWith('.')?(this.attrs.class||'').split(' ').includes(s.slice(1)):s.startsWith('[')?this.hasAttribute(s.slice(1,-1)):this.tagName===s.toUpperCase();});}
 contains(node){return node===this||this.children.some(child=>child.contains(node));}
 closest(selector){return this.matches(selector)?this:this.parentElement?.closest(selector)||null;}
 querySelectorAll(selector){return this.children.flatMap(child=>[...(child.matches(selector)?[child]:[]),...child.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 appendChild(child){child.parentElement=this;this.content.push(child);}
 insertBefore(child,before){if(child.parentElement) child.parentElement.content=child.parentElement.content.filter(item=>item!==child);child.parentElement=this;this.content.splice(this.content.indexOf(before),0,child);}
 set innerHTML(html){this.content=[];parseInto(this,html);}
}
function parseInto(root,html) {
 let parent=root;
 for(const match of html.matchAll(/<!--[\s\S]*?-->|<\/?([a-z][\w-]*)([^>]*)>|([^<]+)/gi)) {
  if(match[0].startsWith('<!--'))continue;
  if(match[3]){parent.content.push(decode(match[3]));continue;}
  if(match[0].startsWith('</')){parent=parent.parentElement||root;continue;}
  const attrs=Object.fromEntries([...match[2].matchAll(/([\w:-]+)(?:="([^"]*)"|='([^']*)')?/g)].map(m=>[m[1],decode(m[2]??m[3]??'')]));
  const child=new Element(match[1],attrs);parent.appendChild(child);
  if(!/\/$/.test(match[2])&&!/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(match[1]))parent=child;
 }
}
function documentFrom(html,page) {
 const body=new Element('body',{'data-page':page});body.innerHTML=html;
 return {body,querySelector:s=>body.querySelector(s),getElementById:id=>{const walk=n=>n.id===id?n:n.children.map(walk).find(Boolean);return walk(body);}};
}
module.exports={documentFrom};
