"use strict";
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {DOCK,ROCKET_ART,windowOffset,flightState,revealState,damp,init}=require('../js/mission-home.js');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8').replace(/\r\n/g,'\n');
const geometry=mobile=>({width:mobile?390:1440,height:mobile?844:900,bottleWidth:mobile?180:330,mobile});
const near=(a,b,t=.00001)=>assert.ok(Math.abs(a-b)<t,`${a} ≠ ${b}`);

test('the new bottle emblem stays registered until the detailed spacecraft emerges',()=>{
 for(const mobile of [false,true]) {
  const g=geometry(mobile);
  for(let p=0;p<=.48;p+=.005) {
   const s=flightState(p,g);
   near(s.shipX,s.bottleX+(DOCK.x-.5)*g.bottleWidth*s.bottleScale);
   near(s.shipY,s.bottleY+(DOCK.y-.5)*g.bottleWidth*750/490*s.bottleScale);
   near(s.shipWidth,DOCK.width*g.bottleWidth*s.bottleScale);
  }
  assert.ok(flightState(.44,g).bottleScale>=4.1);
 }
});

test('the title exits right, exterior detail precedes the cockpit, and planets arrive last',()=>{
 const g=geometry(false);
 const start=flightState(0,g),middle=flightState(.52,g),inside=flightState(.81,g),hub=flightState(1,g);
 assert.equal(start.exteriorOpacity,0);assert.equal(start.insideOpacity,0);assert.equal(start.hubOpacity,0);
 assert.ok(middle.introX>g.width);assert.equal(middle.bottleOpacity,0);assert.equal(middle.exteriorOpacity,1);assert.equal(middle.insideOpacity,0);
 assert.equal(inside.insideOpacity,1);assert.equal(inside.exteriorOpacity,0);assert.equal(inside.hubOpacity,0);
 assert.equal(hub.hubOpacity,1);assert.equal(hub.insideScale,1);assert.equal(hub.planetOffset,0);
});

test('PCS slides in from the right and replaces the title in its right-hand reading area',()=>{
 for(const mobile of [false,true]) {
  const g=geometry(mobile),before=flightState(.14,g),entering=flightState(.195,g),settled=flightState(.25,g);
  assert.equal(before.copyOpacity,0);assert.ok(before.copyX>g.width*.8);
  assert.ok(entering.copyX<before.copyX&&entering.copyX>0);
  near(entering.copyOpacity,.5);assert.ok(entering.introOpacity<.05);
  near(settled.copyX,0);assert.equal(settled.copyOpacity,1);assert.equal(settled.introOpacity,0);
  assert.equal(flightState(.34,g).copyOpacity,1);assert.equal(flightState(.43,g).copyOpacity,0);
 }
 const css=read('css/mission-home.css');
 assert.match(css,/\.mission-enhanced \.mission-zoom-copy \{[^}]*top:28%; left:67\.5%; width:46%; max-width:600px/);
 assert.match(css,/transform:translate3d\(calc\(-50% \+ var\(--copy-x,85vw\)\),0,0\)/);
 assert.match(css,/@media \(max-width:760px\)[\s\S]*\.mission-enhanced \.mission-zoom-copy \{ top:22%; left:50%; width:88%/);
});

test('both zoom transitions are continuous, bounded, and reversible at phone and desktop sizes',()=>{
 for(const mobile of [true,false]) {
  const g=geometry(mobile),samples=[];let previous;
  for(let i=0;i<=2000;i++) {
   const s=flightState(i/2000,g);Object.values(s).forEach(v=>assert.ok(Number.isFinite(v)));
   for(const key of ['bottleOpacity','exteriorOpacity','insideOpacity','hubOpacity','copyOpacity']) assert.ok(s[key]>=0&&s[key]<=1,key);
   if(previous) for(const key of ['shipX','shipY','shipWidth','shipAngle']) assert.ok(Math.abs(s[key]-previous[key])<4,`${key} must not jump`);
   samples.push(s);previous=s;
  }
  for(let i=2000;i>=0;i--) assert.deepEqual(flightState(i/2000,g),samples[i]);
 }
 near(damp(0,1000,32),damp(damp(0,1000,16),1000,16));
 assert.ok(revealState(1000,2000,900,0,false).x<0);assert.ok(revealState(1000,2000,900,0,true).x>0);
});

test('the homepage keeps every supplied science paragraph verbatim and all three destinations accessible',()=>{
 const html=read('index.html'),copy=JSON.parse(read('assets/story/home-copy.json'));
 const paragraphs=[...html.matchAll(/<p data-science-copy="([^"]+)">([\s\S]*?)<\/p>/g)];
 assert.equal(paragraphs.length,8);
 for(const [key,text] of Object.entries(copy)) {
  const matches=paragraphs.filter(p=>p[1]===key);assert.ok(matches.length,key);
  for(const p of matches) assert.equal(p[2].replace(/<[^>]+>/g,'').replace(/&amp;/g,'&'),text,key);
 }
 assert.match(html,/<h1[^>]*id="mission-title"[^>]*><span>ULP<\/span><span>-CA<\/span>/);
 assert.match(html,/data-home-brand="ULP-CA"/);
 assert.deepEqual([...html.matchAll(/data-planet="([^"]+)"/g)].map(m=>m[1]),['gallbladder','sulfation','bile-acids']);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const m of html.matchAll(/href="#([^"]+)"|url\(#([^\)]+)\)/g)) assert.ok(ids.includes(m[1]||m[2]),m[0]);
 for(const name of ['lca-dca.webp','bottle-new.png','spaceship.png','spaceship-inside.png','liver.png','planet-1.png','planet-2.png','planet-3.png','person-drinking.png']) {
  assert.ok(html.includes(`assets/story/${name}`),name);assert.ok(fs.existsSync(path.join(__dirname,'../assets/story',name)));
 }
 assert.doesNotMatch(html,/mission-cabin-open|mission-cabin-dialog|Look inside|mission-craft-layer|mission-transit|Proposed design · not a validated treatment/);
});

function fixture({reducedMotion=false,height=900}={}) {
 let serial=0,time=0;const jobs=new Map();
 function el() {
  const classes=new Set();return {events:{},style:{setProperty(k,v){this[k]=v;}},dataset:{},children:[],offsetHeight:900,offsetWidth:330,clientWidth:1440,
   classList:{add:k=>classes.add(k),contains:k=>classes.has(k),toggle(k,on){on?classes.add(k):classes.delete(k);}},
   addEventListener(k,fn){this.events[k]=fn;},removeAttribute(k){if(k==='style')this.style={setProperty(k,v){this[k]=v;}};},
   focus(){doc.activeElement=this;}
  };
 }
 const win={innerWidth:1440,innerHeight:height,scrollY:0,events:{},location:{hash:''},history:{pushState(a,b,hash){win.location.hash=hash;}},
  addEventListener(k,fn){this.events[k]=fn;},requestAnimationFrame(fn){jobs.set(++serial,fn);return serial;},cancelAnimationFrame(id){jobs.delete(id);},scrollTo({top}){this.scrollY=top;}
 };
 const body=el(),reduced=el(),compact=el();reduced.matches=reducedMotion;compact.matches=false;
 win.matchMedia=q=>q.includes('reduced')?reduced:compact;
 const keys=['.mission-launch','.mission-launch-stage','.mission-bottle','.mission-intro','.mission-zoom-copy','.mission-hub','[data-launch-phase]'];
 const nodes=Object.fromEntries(keys.map(key=>[key,el()]));
 const header=el();header.offsetHeight=80;const heading=el();
 Object.defineProperty(nodes['.mission-launch'],'offsetHeight',{get:()=>body.classList.contains('mission-enhanced')?5040:1800});
 nodes['.mission-launch'].getBoundingClientRect=()=>({top:80-win.scrollY});
 nodes['.mission-launch-stage'].offsetHeight=900;
 nodes['.mission-hub'].getBoundingClientRect=()=>({top:1100-win.scrollY});
 const sections=[el(),el(),el()];sections.forEach((section,i)=>{
  section.getBoundingClientRect=()=>({top:5200+i*1000-win.scrollY});section.offsetHeight=1000;
  section.copy=el();section.copy.children=[el(),el(),el()];section.querySelector=()=>section.copy;
 });
 const hubLinks=[el(),el()],planets=[el(),el(),el()];
 const doc={body,hidden:false,events:{},getElementById:id=>id==='siteHeader'?header:heading,
  querySelector:s=>nodes[s],querySelectorAll:s=>s==='.mission-scene'?sections:s==='[data-planet]'?planets:hubLinks,addEventListener(k,fn){this.events[k]=fn;}
 };
 const controller=init(win,doc);
 function frames(n=1){for(let i=0;i<n;i++){time+=16;const pending=[...jobs];jobs.clear();pending.forEach(([,fn])=>fn(time));}}
 return {win,doc,nodes,sections,body,reduced,heading,hubLinks,planets,controller,jobs,frames,scroll(y){win.scrollY=y;win.events.scroll();frames(150);}};
}

test('the actual controller exposes planets after zoom and back links restore the cockpit, focus and history',()=>{
 const f=fixture();f.frames(2);
 assert.equal(f.nodes['.mission-hub'].inert,true);assert.equal(f.jobs.size,0);
 f.scroll(2000);assert.ok(Number(f.nodes['.mission-launch-stage'].style['--exterior-opacity'])>.9);
 f.scroll(3320);assert.equal(f.nodes['.mission-hub'].inert,false);
 f.scroll(5200);f.hubLinks[0].events.click({preventDefault(){}});
 assert.equal(f.win.location.hash,'#observatory');assert.equal(f.win.scrollY,3320);assert.equal(f.doc.activeElement,f.heading);
 f.planets[0].events.click();assert.equal(f.planets[0].classList.contains('is-visited'),true);
});

test('a 675px-tall desktop keeps the PCS transition active and reverses cleanly on scroll up',()=>{
 const f=fixture({height:675});f.frames(2);
 assert.equal(f.body.classList.contains('mission-enhanced'),true);
 f.scroll(80+3240*.28);
 assert.equal(f.nodes['.mission-launch-stage'].style['--copy-opacity'],1);
 assert.equal(f.nodes['.mission-launch-stage'].style['--copy-x'],'0px');
 assert.equal(f.nodes['.mission-intro'].style.visibility,'hidden');
 f.scroll(0);
 assert.equal(f.nodes['.mission-zoom-copy'].style.visibility,'hidden');
 assert.equal(f.nodes['.mission-intro'].style.visibility,'');
});

test('Explore holds for an extra screen of scroll without stretching the earlier animation',()=>{
 const f=fixture(),stage=f.nodes['.mission-launch-stage'];
 const animationEnd=80+3240,holdEnd=80+5040-stage.offsetHeight;
 near(holdEnd-animationEnd,stage.offsetHeight);
 f.scroll(80+3240*.5);near(stage.style['--launch-progress'],.5);
 f.hubLinks[0].events.click({preventDefault(){}});
 assert.equal(f.win.scrollY,animationEnd);
 for(const position of [animationEnd,animationEnd+450,holdEnd]) {
  f.scroll(position);
  assert.equal(stage.style['--launch-progress'],1);
  assert.equal(stage.style['--hub-opacity'],1);
  assert.equal(stage.style['--planet-offset'],'0px');
  assert.equal(f.nodes['.mission-hub'].inert,false);
 }
 f.scroll(80+3240*.5);near(stage.style['--launch-progress'],.5);
 const css=read('css/mission-home.css');
 assert.match(css,/\.mission-enhanced \.mission-launch \{ height:560svh; \}/);
 assert.match(css,/@media \(max-width:760px\)[\s\S]*\.mission-enhanced \.mission-launch \{ height:540svh; \}/);
 assert.match(css,/\.mission-enhanced \.mission-observatory-anchor \{ top:calc\(100% - 200svh\); \}/);
});

test('hidden tabs sleep and reduced-motion or short screens retain readable static planets and text',()=>{
 const f=fixture();f.win.scrollY=1000;f.win.events.scroll();assert.ok(f.jobs.size);
 f.doc.hidden=true;f.doc.events.visibilitychange();assert.equal(f.jobs.size,0);
 f.doc.hidden=false;f.doc.events.visibilitychange();f.frames(2);assert.equal(f.jobs.size,0);
 f.reduced.matches=true;f.reduced.events.change();assert.equal(f.body.classList.contains('mission-enhanced'),false);
 assert.equal(f.nodes['.mission-hub'].inert,false);assert.equal(f.nodes['.mission-intro'].style.visibility,'');
 for(const options of [{reducedMotion:true},{height:600}]) {
  const r=fixture(options);assert.equal(r.body.classList.contains('mission-enhanced'),false);
  r.controller.visitHub();assert.equal(r.nodes['.mission-hub'].inert,false);assert.equal(r.doc.activeElement,r.heading);
 }
});

 test('exterior straightens before the close-up zoom, then registers both observation windows',()=>{
 for(const mobile of [true,false]) {
  const g=geometry(mobile);
  for(const p of [.62,.64,.66]) {
   const s=flightState(p,g);near(s.shipAngle,-90);near(s.exteriorScale,1);near(s.insideOpacity,0);
  }
  for(const p of [.75,.77,.80]) {
   const s=flightState(p,g),port=windowOffset(s.shipAngle),inside=ROCKET_ART.interior;
   near(s.shipAngle,-90);
   near(port.x*s.exteriorScale+s.exteriorX/s.shipWidth,inside.x-.5);
   near(port.y*s.exteriorScale+s.exteriorY/s.shipWidth,inside.y-inside.aspect/2);
  }
 }
 const html=read('index.html');
 assert.ok(html.includes(`matrix(${ROCKET_ART.matrix.join(' ')})`));
 assert.match(html,/viewBox="510 455 740 255"/);
});
