"use strict";
const test=require('node:test'), assert=require('node:assert/strict');
const {chooseActive,init}=require('../js/project-outline.js');

test('the reading marker follows visible headings in both directions, including the final heading',()=>{
 const entries=[{id:'abstract',top:-100,visible:true},{id:'design',top:70,visible:true},{id:'record',top:0,visible:false},{id:'build',top:700,visible:true}];
 assert.equal(chooseActive(entries,125),'design');
 assert.equal(chooseActive(entries,0),'abstract');
 assert.equal(chooseActive(entries,800),'build');
 assert.equal(chooseActive([],125),null);
});
function fixture(isMobile=false) {
 let scroll=0,serial=0;const frames=new Map();
 function node(id='') {
  const classes=new Set();return {id,attrs:{},dataset:{},hidden:false,events:{},parent:null,scrollTop:0,
   classList:{add:n=>classes.add(n),toggle(n,on){on?classes.add(n):classes.delete(n);},contains:n=>classes.has(n)},
   contains(n){for(let item=n;item;item=item.parent)if(item===this)return true;return false;},
   setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},removeAttribute(k){delete this.attrs[k];},
   addEventListener(k,fn){this.events[k]=fn;},focus(){doc.activeElement=this;},getBoundingClientRect(){return {top:0,bottom:700,height:80};},
   getClientRects:()=>[{}],closest:()=>null,scrollIntoView(options){this.scrolled=options;}
  };
 }
 const nav=node(),article=node(),rootList=node(),collapse=node(),header=node();
 rootList.parent=nav;collapse.parent=nav;
 const targets=Object.fromEntries(['abstract','engineering','design','record','build'].map((id,index)=>{
  const target=node(id);target.getBoundingClientRect=()=>({top:200+index*300-scroll});return [id,target];
 }));
 const links=Object.keys(targets).map(id=>{const link=node();link.attrs.href=`#${id}`;link.parent=rootList;return link;});
 const groups=['engineering','design','build'].map(id=>{
  const n=node();n.dataset.outlineBranch=id;n.parent=rootList;const button=node(),list=node();button.parent=list.parent=n;
  n.querySelector=q=>q==='[data-outline-toggle]'?button:list;
  return {node:n,button,list};
 });
 const [engineering,design,build]=groups;
 links[1].parent=engineering.node;links[2].parent=design.node;links[3].parent=design.list;links[4].parent=build.node;
 design.node.parent=build.node.parent=engineering.list;
 nav.querySelector=()=>collapse;nav.querySelectorAll=q=>q==='a[href^="#"]'?links:groups.map(g=>g.node);
 const mobile=node();mobile.matches=isMobile;const reduced=node();reduced.matches=false;
 const win={events:{},history:{pushState(a,b,hash){this.hash=hash;}},matchMedia:q=>q.includes('900px')?mobile:reduced,
  requestAnimationFrame(fn){frames.set(++serial,fn);return serial;},addEventListener(k,fn){this.events[k]=fn;}
 };
 const doc={querySelector:q=>q==='[data-project-outline]'?nav:article,getElementById:id=>id==='siteHeader'?header:id==='project-outline-list'?rootList:targets[id]};
 const controller=init(win,doc);
 return {nav,rootList,collapse,groups,links,targets,mobile,reduced,doc,win,controller,
  scrollTo(y){scroll=y;win.events.scroll();[...frames.values()].forEach(fn=>fn());frames.clear();}
 };
}

test('scroll expands the current branch, highlights its record, and collapses unrelated stages',()=>{
 const f=fixture();assert.ok(f.groups.every(g=>g.list.hidden));
 f.scrollTo(800);
 assert.equal(f.links[2].attrs['aria-current'],'location');
 assert.equal(f.groups[0].list.hidden,false);assert.equal(f.groups[1].list.hidden,false);assert.equal(f.groups[2].list.hidden,true);
 f.scrollTo(1100);assert.equal(f.links[3].attrs['aria-current'],'location');
 f.scrollTo(1400);assert.equal(f.groups[1].list.hidden,true);assert.equal(f.groups[2].list.hidden,false);
 f.scrollTo(0);assert.equal(f.links[0].attrs['aria-current'],'location');assert.ok(f.groups.every(g=>g.list.hidden));
});

test('manual toggles work and scrolling never hides a focused branch',()=>{
 const f=fixture();f.scrollTo(800);
 f.groups[1].button.events.click();assert.equal(f.groups[1].list.hidden,true);
 f.scrollTo(805);assert.equal(f.groups[1].list.hidden,true,'manual close remains until active section changes');
 f.groups[1].button.events.click();f.doc.activeElement=f.links[3];
 f.scrollTo(1400);assert.equal(f.groups[1].list.hidden,false,'focused content remains available');
 f.collapse.events.click();assert.equal(f.doc.activeElement,f.collapse);assert.equal(f.rootList.hidden,true);
});

test('mobile contents collapse after selection and record links open disclosures before scrolling',()=>{
 const f=fixture(true);assert.equal(f.rootList.hidden,true);
 f.collapse.events.click();assert.equal(f.rootList.hidden,false);
 const record={open:false,parentElement:null};f.targets.record.closest=()=>record;
 f.reduced.matches=true;
 f.links[3].events.click({preventDefault(){}});
 assert.equal(record.open,true);assert.equal(f.targets.record.scrolled.behavior,'instant');
 assert.equal(f.win.history.hash,'#record');assert.equal(f.rootList.hidden,true);
 f.mobile.matches=false;f.mobile.events.change();assert.equal(f.rootList.hidden,false);
});

const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {prepare,headingTree,treeMarkup}=require('../js/project-outline.js');
const {documentFrom}=require('./helpers/outline-dom.js');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
function researchMarkup(page) {
 if(page==='model') return read('model.html');
 if(page==='human-practices') {
  const source=read('js/site.js'),start=source.indexOf('  function renderHumanPracticesPage()'),end=source.indexOf('  function renderStandardPage()',start);
  const content = {window:{}};
  vm.runInNewContext(read('js/site-content.js'),content);
  return vm.runInNewContext(`(${source.slice(start,end).trim()})`, {data:content.window.SITE_DATA})();
 }
 const context=vm.createContext({window:{}});
 for(const file of ['site-content','dry-lab-content','wet-lab-content','wet-lab-notebook-data','lab-content']) vm.runInContext(read(`js/${file}.js`),context);
 return context.window.RenataLab.render(page);
}
test('HP, Wetlab, and Model prepare the same left outline from their real rendered articles',()=>{
 for(const page of ['human-practices','wet-lab','model']) {
  const doc=documentFrom(researchMarkup(page),page);
  const article=doc.querySelector('.project-paper,.lab-article'),before=article.textContent;
  prepare(doc);
  const sidebar=doc.querySelector('.project-paper-sidebar,.lab-sidebar'),nav=sidebar.querySelector('nav');
  assert.equal(article.parentElement.children[0],sidebar,page);
  assert.equal(nav.dataset.projectOutline,'');
  assert.equal(doc.getElementById('project-outline-title').textContent,'On this page');
  const links=nav.querySelectorAll('a');assert.ok(links.length>=8,page);
  const targets=links.map(link=>doc.getElementById(link.getAttribute('href').slice(1)));
  assert.ok(targets.every(Boolean),`${page}: every heading link resolves`);
  assert.equal(new Set(targets).size,targets.length,`${page}: no duplicated targets`);
  const buttons=nav.querySelectorAll('button');
  for(const button of buttons) assert.ok(doc.getElementById(button.getAttribute('aria-controls')),page);
  assert.equal(article.textContent,before,`${page}: research copy is unchanged`);
  if(page==='model') {
   const design=doc.getElementById('outline-notebook');
   for(const id of ['point-mutations','loop-grafting','proteinmpnn'])
    assert.ok(design.querySelectorAll('a').some(link=>link.getAttribute('href')===`#${id}`));
  }
  if(page==='wet-lab') {
   const assembly=doc.getElementById('outline-assembly');
   assert.ok(links.some(link=>link.getAttribute('href')==='#assembly'&&link.textContent.includes('Transformation')));
   assert.ok(assembly.querySelectorAll('a').some(link=>link.textContent.includes('Methods & original record')));
   const archived=doc.getElementById('outline-planned-assembly');
   assert.ok(archived.querySelectorAll('a').some(link=>link.textContent.includes('Golden Gate/JUMP assembly')));
  }
  prepare(doc);assert.equal(nav.querySelectorAll('a').length,links.length,'idempotent preparation');
 }
});
test('outline nesting handles skipped heading levels, siblings, and escaped titles',()=>{
 const tree=headingTree([{id:'a',label:'A',level:1},{id:'b',label:'B & <C>',level:3},{id:'c',label:'C',level:2},{id:'d',label:'D',level:1}]);
 assert.deepEqual(tree.map(item=>item.id),['a','d']);
 assert.deepEqual(tree[0].children.map(item=>item.id),['b','c']);
 assert.match(treeMarkup(tree),/B &amp; &lt;C&gt;/);
});
