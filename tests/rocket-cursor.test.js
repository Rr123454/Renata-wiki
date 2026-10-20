'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {init}=require('../js/rocket-cursor.js');
function fixture({fine=true,reduced=false,contrast=false}={}) {
 const images=[],timers=new Map(); let serial=0;
 function node() {
  const classes=new Set();return {dataset:{},style:{},events:{},children:[],hidden:false,
   classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k),toggle(k,on){on?classes.add(k):classes.delete(k);}},
   setAttribute(k,v){this[k]=v;},appendChild(n){this.children.push(n);},addEventListener(k,fn){this.events[k]=fn;}
  };
 }
 const media=Object.fromEntries(Object.entries({fine,reduced,contrast}).map(([key,value])=>[key,Object.assign(node(),{matches:value})]));
 const doc=Object.assign(node(),{documentElement:node(),body:node(),createElement:node,hidden:false});
 const win=Object.assign(node(),{matchMedia:q=>media[q.includes('forced-colors')?'contrast':q.includes('reduced')?'reduced':'fine'],
  Image:class {constructor(){images.push(this);}},setTimeout(fn){timers.set(++serial,fn);return serial;},clearTimeout(id){timers.delete(id);}
 });
 const controller=init(win,doc);
 return {win,doc,media,images,timers,controller,get sprite(){return doc.body.children[0];},
  move(options={}) {doc.events.pointermove({pointerType:'mouse',clientX:200,clientY:150,target:{closest:()=>null},...options});},
  expire(){const jobs=[...timers.values()];timers.clear();jobs.forEach(fn=>fn());}
 };
}
test('the full-resolution bird rocket uses its center as the click point without resampling or lag',()=>{
 const f=fixture();assert.equal(f.images[0].src,'assets/story/rocket-cutout.png');
 f.move();assert.equal(f.sprite.hidden,true);assert.equal(f.doc.documentElement.classList.contains('sulflux-cursor'),false);
 f.images[0].onload();f.move();
 assert.equal(f.sprite.hidden,false);assert.equal(f.sprite.style.transform,'translate3d(170px,127.5px,0) scaleX(-1)');
 assert.ok(f.doc.documentElement.classList.contains('sulflux-cursor'));
 assert.ok(f.sprite.children.includes(f.images[0]),'render the large original directly');
 assert.equal(f.images[0].width,60);assert.equal(f.sprite['aria-hidden'],'true');
 init(f.win,f.doc);assert.equal(f.images.length,1);
 f.move({clientX:410,clientY:300});assert.equal(f.sprite.style.transform,'translate3d(380px,277.5px,0) scaleX(-1)');
});
test('a tiny thruster trail runs only during movement and settles without a permanent animation loop',()=>{
 const f=fixture();f.images[0].onload();f.move();
 assert.match(f.sprite.innerHTML,/rocket-cursor-thrust/);assert.equal((f.sprite.innerHTML.match(/<i>/g)||[]).length,3);
 assert.ok(f.sprite.classList.contains('is-moving'));assert.equal(f.timers.size,1);
 f.move();assert.equal(f.timers.size,1);f.expire();assert.equal(f.timers.size,0);
 assert.equal(f.sprite.classList.contains('is-moving'),false);assert.equal(f.sprite.hidden,false);
 f.move();f.doc.hidden=true;f.doc.events.visibilitychange();assert.equal(f.sprite.hidden,true);assert.equal(f.timers.size,0);
 f.doc.hidden=false;f.move();f.win.events.blur();assert.equal(f.sprite.hidden,true);
});
test('native cursor stays available for touch, failed loads, text editing, dialogs, and forced colors',()=>{
 const touch=fixture({fine:false});assert.equal(touch.images.length,0);
 const highContrast=fixture({contrast:true});assert.equal(highContrast.images.length,0);
 const f=fixture();f.images[0].onerror();f.move();assert.equal(f.sprite.hidden,true);
 f.images[0].onload();f.move();f.move({target:{closest:()=>({})}});assert.equal(f.sprite.hidden,true);
 assert.equal(f.doc.documentElement.classList.contains('sulflux-cursor'),false);
 f.move();f.move({pointerType:'touch'});assert.equal(f.sprite.hidden,true);
 f.move();f.doc.events.pointerout({relatedTarget:null});assert.equal(f.sprite.hidden,true);
 f.move();f.media.contrast.matches=true;f.media.contrast.events.change();assert.equal(f.sprite.hidden,true);
 f.media.contrast.matches=false;f.media.contrast.events.change();assert.equal(f.images.length,1);
 f.move();f.doc.events.keydown();assert.equal(f.sprite.hidden,true);
});
test('reduced motion retains a still rocket and flame without sparks or timers',()=>{
 const f=fixture({reduced:true});f.images[0].onload();f.move();
 assert.equal(f.sprite.hidden,false);assert.equal(f.sprite.classList.contains('is-moving'),false);assert.equal(f.timers.size,0);
});
test('every content page loads the cursor, with click-through styling and accessible fallbacks',()=>{
 const root=path.join(__dirname,'..');
 for(const name of fs.readdirSync(root).filter(f=>f.endsWith('.html'))) {
  const html=fs.readFileSync(path.join(root,name),'utf8');if(!html.includes('src="js/site.js?'))continue;
  assert.match(html,/css\/rocket-cursor.css/,name);assert.match(html,/js\/rocket-cursor.js/,name);
 }
 const css=fs.readFileSync(path.join(root,'css/rocket-cursor.css'),'utf8');
 assert.match(css,/pointer-events:none/);assert.match(css,/cursor:text!important/);
 assert.match(css,/forced-colors:active/);assert.match(css,/cursor:not-allowed!important/);
 assert.doesNotMatch(fs.readFileSync(path.join(root,'js/rocket-cursor.js'),'utf8'),/canvas|toDataURL/);
});
