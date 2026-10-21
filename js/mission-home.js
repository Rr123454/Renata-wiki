(function (root) {
  "use strict";
  const clamp = n => Math.max(0, Math.min(1, n));
  const mix = (a,b,t) => a+(b-a)*t;
  const ease = n => { const t=clamp(n); return clamp(t*t*t*(t*(6*t-15)+10)); };
  const phase = (p,a,b) => ease((p-a)/(b-a));
  const damp = (a,b,dt) => mix(a,b,1-Math.exp(-Math.max(0,dt)/115));
  // Register the source artwork (naturally tilted -55 degrees) to the bottle emblem.
  // The SVG and motion controller share this coordinate system.
  const radians=55*Math.PI/180, sx=.2420402002784682, sy=.24103026059126886;
  const ROCKET_ART = Object.freeze({
    frame:{x:868,y:985,width:175,height:107},
    matrix:[sx*Math.cos(radians),sy*Math.sin(radians),-sx*Math.sin(radians),sy*Math.cos(radians),
      871+sx*710.9211485805196,988-sy*439.9968513133648],
    window:{x:378,y:578,diameter:190},
    interior:{x:.5,y:(716-315)/960,diameter:580/960,aspect:985/960}
  });
  const f=ROCKET_ART.frame;
  const DOCK = Object.freeze({x:(f.x+f.width/2-700)/490,y:(f.y+f.height/2-470)/750,width:f.width/490});
  function windowOffset(angle) {
    const [a,b,c,d,e,g]=ROCKET_ART.matrix,w=ROCKET_ART.window;
    const x=(a*w.x+c*w.y+e-f.x-f.width/2)/f.width;
    const y=(b*w.x+d*w.y+g-f.y-f.height/2)/f.width;
    const r=angle*Math.PI/180;
    return {x:x*Math.cos(r)-y*Math.sin(r),y:x*Math.sin(r)+y*Math.cos(r)};
  }
  function flightState(progress, { width, height, bottleWidth, mobile }) {
    const p=clamp(progress), zoom=phase(p,.06,.44), depart=phase(p,.48,.62), cabin=phase(p,.66,.75);
    // Bring PCS in from the right into the title's right-hand reading area.
    const copyArrival=phase(p,.14,.25);
    const bottleScale=mix(1,mobile?4.1:5.1,zoom);
    const bottleX=mix(width*(mobile?.5:.23),width*.53-(DOCK.x-.5)*bottleWidth*bottleScale,zoom);
    const bottleY=mix(height*(mobile?.7:.59),height*.59-(DOCK.y-.5)*bottleWidth*750/490*bottleScale,zoom);
    const dockX=bottleX+(DOCK.x-.5)*bottleWidth*bottleScale;
    const dockY=bottleY+(DOCK.y-.5)*bottleWidth*750/490*bottleScale;
    const dockWidth=DOCK.width*bottleWidth*bottleScale;
    const finalWidth=Math.min(width*(mobile?.58:.36),height*.55,540);
    const shipWidth=mix(dockWidth,finalWidth,depart),shipAngle=mix(0,-90,depart);
    const exteriorDiameter=ROCKET_ART.window.diameter*(sx+sy)/2/f.width;
    const inside=ROCKET_ART.interior,port=windowOffset(shipAngle);
    const exteriorScale=mix(1,inside.diameter/exteriorDiameter,cabin);
    const exteriorX=(mix(port.x,inside.x-.5,cabin)-port.x*exteriorScale)*shipWidth;
    const exteriorY=(mix(port.y,inside.y-inside.aspect/2,cabin)-port.y*exteriorScale)*shipWidth;
    return { p,bottleX,bottleY,bottleScale,dockX,dockY,dockWidth,
      bottleOpacity:1-phase(p,.36,.48),
      introX:width*1.4*phase(p,0,.19), introOpacity:1-phase(p,.12,.21),
      copyOpacity:copyArrival*(1-phase(p,.34,.43)), copyX:width*.85*(1-copyArrival),
      shipX:mix(dockX,width*.5,depart), shipY:mix(dockY,height*(mobile?.60:.57),depart),
      shipWidth,shipAngle,exteriorScale,exteriorX,exteriorY,
      exteriorOpacity:phase(p,.27,.42)*(1-phase(p,.75,.80)),
      insideOpacity:phase(p,.75,.81), insideScale:1, insideReveal:mix(29,85,phase(p,.75,.84)),
      hubOpacity:phase(p,.84,.95), planetOffset:45*(1-phase(p,.84,.95)),
      captionOpacity:1-phase(p,.8,.88), ringScale:mix(1.3,1,phase(p,.72,1)),
      starsX:-p*65, starsY:-p*110
    };
  }
  function revealState(scroll,top,viewport,index,fromRight) {
    const amount=phase(scroll+viewport*.91-top-index*18,0,viewport*.25);
    return { opacity:amount, x:(fromRight?1:-1)*65*(1-amount) };
  }
  function init(win,doc) {
    const launch=doc.querySelector('.mission-launch'); if(!launch) return;
    const stage=doc.querySelector('.mission-launch-stage'), bottle=doc.querySelector('.mission-bottle');
    const intro=doc.querySelector('.mission-intro'), copy=doc.querySelector('.mission-zoom-copy'), hub=doc.querySelector('.mission-hub');
    const heading=doc.getElementById('mission-hub-title'), label=doc.querySelector('[data-launch-phase]');
    const header=doc.getElementById('siteHeader'), reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
    const compact=win.matchMedia('(max-width: 760px)');
    const sections=[...doc.querySelectorAll('.mission-scene')];
    const scenes=sections.map((node,index)=>({node,index,parts:[...node.querySelector('.mission-scene-copy').children],top:0,height:0}));
    let enabled=false, geometry={}, start=0, distance=1, current=win.scrollY, target=current, frame=0, last=null;
    function measure() {
      doc.body.style.setProperty('--mission-header-height',`${header.offsetHeight}px`);
      start=launch.getBoundingClientRect().top+win.scrollY;
      // Reserve the final screen of sticky travel for the fully revealed Explore hub.
      // Excluding that hold keeps the bottle, PCS, and spacecraft timing unchanged.
      distance=Math.max(1,launch.offsetHeight-2*stage.offsetHeight);
      geometry={width:stage.clientWidth||win.innerWidth,height:stage.offsetHeight,bottleWidth:bottle.offsetWidth,mobile:compact.matches};
      // Align the title's center with the lettering baked into the bottle artwork.
      // Keep the bottle/rocket registration and the compact stacked layout intact.
      if(enabled&&!compact.matches) {
        const title=doc.getElementById('mission-title');
        const labelY=geometry.height*.59+(785-845)*geometry.bottleWidth/490;
        stage.style.setProperty('--intro-top',`${labelY-title.offsetTop-title.offsetHeight/2}px`);
      } else stage.style.removeProperty('--intro-top');
      scenes.forEach(scene=>{scene.top=scene.node.getBoundingClientRect().top+win.scrollY;scene.height=scene.node.offsetHeight;});
      target=Math.max(0,win.scrollY);
    }
    function draw() {
      if(!enabled) return;
      const state=flightState((current-start)/distance,geometry);
      const values={'bottle-x':`${state.bottleX}px`,'bottle-y':`${state.bottleY}px`,'bottle-scale':state.bottleScale,'bottle-opacity':state.bottleOpacity,
        'intro-x':`${state.introX}px`,'intro-opacity':state.introOpacity,'copy-opacity':state.copyOpacity,'copy-x':`${state.copyX}px`,
        'ship-x':`${state.shipX}px`,'ship-y':`${state.shipY}px`,'ship-width':`${state.shipWidth}px`,'ship-angle':`${state.shipAngle}deg`,
        'exterior-opacity':state.exteriorOpacity,'exterior-scale':state.exteriorScale,'inside-opacity':state.insideOpacity,
        'exterior-x':`${state.exteriorX}px`,'exterior-y':`${state.exteriorY}px`,
        'inside-scale':state.insideScale,'inside-reveal':`${state.insideReveal}%`,'hub-opacity':state.hubOpacity,
        'planet-offset':`${state.planetOffset}px`,'caption-opacity':state.captionOpacity,'ring-scale':state.ringScale,
        'stars-x':`${state.starsX}px`,'stars-y':`${state.starsY}px`,'launch-progress':state.p};
      Object.entries(values).forEach(([key,value])=>stage.style.setProperty(`--${key}`,value));
      intro.inert=state.introOpacity<.1; intro.style.visibility=intro.inert?'hidden':'';
      copy.style.visibility=state.copyOpacity<.01?'hidden':'';
      hub.inert=state.hubOpacity<.98; hub.style.visibility=state.hubOpacity<.01?'hidden':'';
      label.textContent=state.p<.27?'01 / The bottle':state.p<.62?'02 / The spacecraft':state.p<.84?'03 / Inside SulFlux':'04 / Choose a planet';
      scenes.forEach(scene=>{
        scene.parts.forEach((part,index)=>{
          const reveal=revealState(current,scene.top+80,geometry.height,index,scene.index%2===1);
          part.style.setProperty('--reveal-opacity',reveal.opacity);part.style.setProperty('--reveal-x',`${reveal.x}px`);
        });
        const t=clamp((current+geometry.height-scene.top)/(scene.height+geometry.height));
        scene.node.style.setProperty('--art-y',`${(t-.5)*-25}px`);
        scene.node.style.setProperty('--art-turn',`${Math.sin(t*Math.PI)*1.2}deg`);
      });
    }
    function tick(time) {
      frame=0; if(doc.hidden) {last=null;return;}
      current=enabled?damp(current,target,last===null?16:Math.min(64,time-last)):target;last=time;
      if(Math.abs(current-target)<.05) current=target;
      draw();
      if(enabled&&current!==target) schedule();else last=null;
    }
    function schedule() { if(!frame&&!doc.hidden) frame=win.requestAnimationFrame(tick); }
    function configure(preserve=false) {
      const next=!reduced.matches&&win.innerHeight>=640;
      let anchor,fraction=0;
      if(preserve&&next!==enabled) {
        anchor=[launch,...sections].reverse().find(node=>node.getBoundingClientRect().top<=win.innerHeight*.3)||launch;
        fraction=clamp(-anchor.getBoundingClientRect().top/Math.max(1,anchor.offsetHeight));
      }
      enabled=next;doc.body.classList.toggle('mission-enhanced',enabled);
      if(!enabled) {stage.removeAttribute('style');intro.inert=false;intro.style.visibility='';hub.inert=false;hub.style.visibility='';copy.style.visibility='';}
      if(anchor) win.scrollTo({top:anchor.getBoundingClientRect().top+win.scrollY+fraction*anchor.offsetHeight,behavior:'instant'});
      measure();current=target;draw();schedule();
    }
    function visitHub(focus=true) {
      const top=enabled?start+distance:hub.getBoundingClientRect().top+win.scrollY-header.offsetHeight-20;
      win.scrollTo({top,behavior:'instant'});target=current=Math.max(0,top);draw();
      if(focus) heading.focus({preventScroll:true});
    }
    doc.querySelectorAll('a[href="#observatory"]').forEach(link=>link.addEventListener('click',event=>{
      event.preventDefault();win.history.pushState(null,'','#observatory');visitHub();
    }));
    doc.querySelectorAll('[data-planet]').forEach(link=>link.addEventListener('click',()=>link.classList.add('is-visited')));
    win.addEventListener('scroll',()=>{target=Math.max(0,win.scrollY);schedule();},{passive:true});
    win.addEventListener('resize',()=>configure(true));
    win.addEventListener('load',()=>{measure();current=target;draw();if(win.location.hash==='#observatory') visitHub(false);});
    win.addEventListener('hashchange',()=>{if(win.location.hash==='#observatory') visitHub();});
    doc.addEventListener('visibilitychange',()=>{
      if(doc.hidden){if(frame)win.cancelAnimationFrame(frame);frame=0;last=null;}
      else {measure();current=target;draw();schedule();}
    });
    reduced.addEventListener('change',()=>configure(true));
    configure();
    if(win.location.hash==='#observatory') visitHub(false);
    return {configure,visitHub,measure};
  }
  const api={DOCK,ROCKET_ART,windowOffset,flightState,revealState,damp,init};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else init(root,root.document);
})(typeof window==='undefined'?globalThis:window);
