/* Full-resolution artwork, rendered at display density instead of a 1× cursor bitmap. */
(function (root) {
  'use strict';
  const NATIVE = 'input,textarea,select,iframe,object,embed,[contenteditable="true"],[contenteditable=""],[disabled],[aria-disabled="true"],dialog';
  function init(win, doc) {
    const html = doc.documentElement;
    if (html.dataset.rocketCursorReady) return;
    html.dataset.rocketCursorReady = 'true';
    const fine = win.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
    const contrast = win.matchMedia('(forced-colors: active)');
    let sprite, loaded = false, timer = 0;
    function hide() {
      html.classList.remove('sulflux-cursor');
      if (sprite) { sprite.hidden = true; sprite.classList.remove('is-moving'); }
      win.clearTimeout(timer); timer = 0;
    }
    function sync() {
      hide();
      if (!fine.matches || contrast.matches || sprite) return;
      sprite = doc.createElement('div');
      sprite.className = 'rocket-cursor'; sprite.hidden = true;
      sprite.setAttribute('aria-hidden','true');
      sprite.innerHTML = '<svg class="rocket-cursor-thrust" viewBox="0 0 24 12" focusable="false"><path d="M24 1Q13 0 0 6Q13 12 24 11Z" fill="#ff994d"/><path d="M24 3Q14 2 6 6Q14 10 24 9Z" fill="#ffe9a6"/><path d="M24 4Q18 4 12 6Q18 8 24 8Z" fill="#fffaf0"/></svg><span class="rocket-cursor-trail"><i></i><i></i><i></i></span>';
      const image = new win.Image();
      image.alt = ''; image.width = 60; image.height = 45;
      image.draggable = false;
      image.onload = () => { loaded = true; };
      image.onerror = () => { loaded = false; hide(); };
      image.src = 'assets/story/rocket-cutout.png';
      sprite.appendChild(image); doc.body.appendChild(sprite);
    }
    function point(event) {
      if (!loaded || !fine.matches || contrast.matches || doc.hidden || event.pointerType !== 'mouse' || event.target?.closest?.(NATIVE)) { hide(); return; }
      // Center the 60 × 45px craft on the click point, preserving its left-facing orientation.
      sprite.style.transform = `translate3d(${event.clientX - 30}px,${event.clientY - 22.5}px,0) scaleX(-1)`;
      sprite.hidden = false; html.classList.add('sulflux-cursor');
      win.clearTimeout(timer);
      sprite.classList.toggle('is-moving', !reduced.matches);
      if (!reduced.matches) timer = win.setTimeout(() => { sprite.classList.remove('is-moving'); timer = 0; }, 130);
    }
    doc.addEventListener('pointermove', point, {passive:true});
    doc.addEventListener('pointerover', point, {passive:true});
    doc.addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); }, {passive:true});
    doc.addEventListener('visibilitychange', hide);
    // Restore the native pointer for keyboard navigation and top-layer dialogs.
    doc.addEventListener('keydown', hide);
    doc.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') hide(); }, {passive:true});
    doc.addEventListener('toggle', hide, true);
    win.addEventListener('blur', hide); win.addEventListener('pagehide', hide);
    fine.addEventListener('change', sync); contrast.addEventListener('change', sync);
    reduced.addEventListener('change', hide);
    sync();
    return {hide};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {init};
  else init(root, root.document);
})(typeof window === 'undefined' ? globalThis : window);
