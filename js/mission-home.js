(function (root) {
  "use strict";
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = value => { const t = clamp(value); return clamp(t * t * t * (t * (t * 6 - 15) + 10)); };
  const damp = (a, b, dt) => mix(a, b, 1 - Math.exp(-Math.max(0, dt) / 125));
  const bezier = (a, b, c, d, t) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;
  // These coordinates match the solid emblem in the supplied bottle composition.
  const DOCK = Object.freeze({ x: (1059 - 700) / 490, y: (1093.75 - 470) / 750, width: 170 / 490 });

  function flightState(scroll, geometry) {
    const { width, height, bottleWidth, craftWidth, launchDistance, gallbladderTop, arrivalX, arrivalY, mobile } = geometry;
    const launch = clamp(scroll / Math.max(1, launchDistance));
    const zoom = ease((launch - .08) / .6);
    const scale = mix(1, mobile ? 4.2 : 4.8, zoom);
    const bottleHeight = bottleWidth * 750 / 490;
    const aimX = width * (mobile ? .58 : .71);
    const aimY = height * (mobile ? .71 : .57);
    const initialX = width * (mobile ? .32 : .23);
    const initialY = height * (mobile ? .72 : .59);
    const bottleX = mix(initialX, aimX - (DOCK.x - .5) * bottleWidth * scale, zoom);
    const bottleY = mix(initialY, aimY - (DOCK.y - .5) * bottleHeight * scale, zoom);
    const dockX = bottleX + (DOCK.x - .5) * bottleWidth * scale;
    const dockY = bottleY + (DOCK.y - .5) * bottleHeight * scale + (geometry.stageTop || 0);
    const dockScale = DOCK.width * bottleWidth * scale / craftWidth;
    const detach = ease((launch - .72) / .27);
    const exitX = width * (mobile ? .64 : .67), exitY = height * (mobile ? .68 : .53);
    const state = {
      launch, bottleX, bottleY, bottleScale: scale,
      bottleOpacity: 1 - ease((launch - .77) / .2),
      introX: width * 1.35 * ease(launch / .23),
      copy: ease((launch - .17) / .12) * (1 - ease((launch - .61) / .12)),
      copyX: -70 * (1 - ease((launch - .17) / .12)),
      detail: ease((launch - .37) / .33), detach,
      dockX, dockY, dockScale,
      craftX: bezier(dockX, dockX + width * .12, exitX + width * .04, exitX, detach),
      craftY: bezier(dockY, dockY - height * .1, exitY - height * .08, exitY, detach),
      craftScale: mix(dockScale, .9, detach),
      craftAngle: -18 * Math.sin(detach * Math.PI / 2),
      craftOpacity: 1,
      exhaust: ease((launch - .75) / .23),
      travel: 0
    };
    if (scroll > launchDistance) {
      const arrivalAt = Math.max(launchDistance + 1, gallbladderTop - height * .1);
      const travel = clamp((scroll - launchDistance) / (arrivalAt - launchDistance));
      const t = ease(travel);
      const endY = arrivalY - arrivalAt;
      state.travel = travel;
      state.craftX = bezier(exitX, width * .94, width * .87, arrivalX, t);
      state.craftY = bezier(exitY, height * .31, height * .24, endY, t) - Math.max(0, scroll - arrivalAt);
      state.craftAngle = mix(-18, 12, t) + Math.sin(t * Math.PI * 2) * 8;
      state.craftScale = mix(.9, mobile ? .43 : .52, t);
      state.craftOpacity = 1 - ease((scroll - arrivalAt) / (height * .48));
      state.exhaust = 1 - ease((travel - .75) / .25);
    }
    return state;
  }

  function revealState(scroll, top, viewport, index, fromRight) {
    const amount = ease((scroll + viewport * .88 - top - index * 24) / (viewport * .32));
    return { opacity: amount, x: (fromRight ? 1 : -1) * 85 * (1 - amount), y: 14 * (1 - amount) };
  }

  function init(win, doc) {
    const launch = doc.querySelector(".mission-launch");
    if (!launch) return;
    const stage = doc.querySelector(".mission-launch-stage");
    const bottle = doc.querySelector(".mission-bottle");
    const intro = doc.querySelector(".mission-intro");
    const zoomCopy = doc.querySelector(".mission-zoom-copy");
    const layer = doc.querySelector(".mission-craft-layer");
    const craft = doc.querySelector(".mission-craft");
    const gallery = doc.getElementById("gallbladder");
    const header = doc.querySelector(".flight-header");
    const controls = doc.querySelector(".mission-controls");
    const reduced = win.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = win.matchMedia("(max-width: 760px)");
    const checkpoints = [...doc.querySelectorAll(".mission-checkpoints a")];
    const atmospheres = [...doc.querySelectorAll("[data-mission-atmosphere]")];
    const sections = [launch, ...doc.querySelectorAll(".mission-transit, .mission-scene, .mission-engineering")];
    const scenes = sections.slice(1).map((section, index) => {
      const copy = section.querySelector(".mission-scene-copy, .mission-transit-copy, .mission-engineering-intro");
      return { section, index, copy, parts: copy ? [...copy.children] : [], top: 0, copyTop: 0, height: 1 };
    });
    let geometry = {}, current = win.scrollY, target = current, frame = 0, lastTime = null, enabled = false;
    let finaleTop = Infinity;

    function measure() {
      doc.body.style.setProperty("--mission-header-height", `${header.offsetHeight}px`);
      const art = gallery.querySelector(".mission-anatomy > svg").getBoundingClientRect();
      geometry = { width: stage.clientWidth || win.innerWidth, height: win.innerHeight, bottleWidth: bottle.offsetWidth,
        craftWidth: craft.offsetWidth || (compact.matches ? 220 : 360), mobile: compact.matches,
        launchDistance: Math.max(1, launch.offsetHeight - stage.offsetHeight),
        gallbladderTop: gallery.getBoundingClientRect().top + win.scrollY,
        arrivalX: art.left + art.width * .44, arrivalY: art.top + win.scrollY + art.height * .55, stageTop: 0 };
      scenes.forEach(scene => {
        scene.top = scene.section.getBoundingClientRect().top + win.scrollY;
        scene.copyTop = scene.copy.getBoundingClientRect().top + win.scrollY;
        scene.height = scene.section.offsetHeight;
      });
      finaleTop = doc.getElementById("mission").getBoundingClientRect().top + win.scrollY;
      target = Math.max(0, win.scrollY);
    }
    function updateAtmosphere() {
      // CSS owns the ambient loops. Only visible sky layers run; no idle RAF work.
      for (const atmosphere of atmospheres) {
        const bounds = atmosphere.getBoundingClientRect();
        const visible = bounds.bottom > 0 && bounds.top < win.innerHeight;
        atmosphere.classList.toggle("is-atmosphere-active", enabled && !doc.hidden && visible);
      }
    }
    function ui() {
      updateAtmosphere();
      header.classList.toggle("is-reading", target > 30);
      let active = 0;
      checkpoints.forEach((link, index) => {
        const section = doc.querySelector(link.getAttribute("href"));
        if (section.getBoundingClientRect().top <= geometry.height * .5) active = index;
      });
      checkpoints.forEach((link, index) => {
        if (index === active) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
      const finished = target + geometry.height * .55 >= finaleTop;
      controls.classList.toggle("is-finished", finished); controls.inert = finished;
    }
    function draw() {
      geometry.stageTop = Math.min(0, geometry.launchDistance - target);
      const state = flightState(current, geometry);
      const set = (name, value) => stage.style.setProperty(name, value);
      set("--bottle-x", `${state.bottleX}px`); set("--bottle-y", `${state.bottleY}px`);
      set("--bottle-scale", state.bottleScale); set("--bottle-opacity", state.bottleOpacity);
      set("--intro-x", `${state.introX}px`); set("--zoom-copy", state.copy); set("--zoom-copy-x", `${state.copyX}px`);
      set("--stars-y", `${-state.launch * 90}px`); set("--stars-x", `${-state.launch * 75}px`);
      set("--planet-y", `${-state.launch * 170}px`); set("--ground-y", `${state.launch * 300}px`);
      set("--scroll-cue", 1 - ease(state.launch / .12));
      set("--launch-label", ease((state.launch - .24) / .15) * (1 - ease((state.launch - .75) / .15)));
      const introHidden = state.launch > .25;
      intro.style.visibility = introHidden ? "hidden" : "visible"; intro.inert = introHidden;
      zoomCopy.style.visibility = state.copy < .01 ? "hidden" : "visible"; zoomCopy.inert = state.copy < .01;
      craft.style.transform = `translate3d(${state.craftX}px, ${state.craftY}px, 0) translate(-50%, -50%) rotate(${state.craftAngle}deg) scale(${state.craftScale})`;
      craft.style.opacity = state.craftOpacity;
      craft.style.setProperty("--ship-detail", state.detail);
      craft.style.setProperty("--exhaust", state.exhaust);
      layer.style.visibility = state.craftOpacity > .001 ? "visible" : "hidden";
      for (const scene of scenes) {
        scene.parts.forEach((part, index) => {
          const reveal = revealState(current, scene.copyTop, geometry.height, index, scene.index % 2 === 1);
          part.style.setProperty("--reveal-opacity", reveal.opacity);
          part.style.setProperty("--reveal-x", `${reveal.x}px`);
          part.style.setProperty("--reveal-y", `${reveal.y}px`);
        });
        const progress = clamp((current + geometry.height - scene.top) / (scene.height + geometry.height));
        scene.section.style.setProperty("--art-y", `${(progress - .5) * -35}px`);
        scene.section.style.setProperty("--art-turn", `${Math.sin((progress - .5) * Math.PI) * 1.5}deg`);
        scene.section.style.setProperty("--acid-y", `${Math.sin(progress * Math.PI * 4) * 13}px`);
        scene.section.style.setProperty("--destination-scale", .7 + progress * .5);
        scene.section.classList.toggle("is-scene-visible", scene.top < target + geometry.height && scene.top + scene.height > target);
      }
    }
    function tick(time) {
      frame = 0;
      if (doc.hidden) { lastTime = null; return; }
      const dt = lastTime === null ? 16 : Math.min(64, Math.max(0, time - lastTime));
      lastTime = time;
      if (enabled) {
        current = damp(current, target, dt);
        if (Math.abs(current - target) < .05) current = target;
        draw();
      }
      ui();
      if (enabled && current !== target) schedule();
      else lastTime = null;
    }
    function schedule() { if (!frame && !doc.hidden) frame = win.requestAnimationFrame(tick); }
    function configure(preservePosition = false) {
      const nextEnabled = !reduced.matches && win.innerHeight >= 640;
      let anchor, fraction = 0;
      if (preservePosition && enabled !== nextEnabled) {
        anchor = [...sections].reverse().find(section => section.getBoundingClientRect().top <= win.innerHeight * .3) || launch;
        fraction = clamp(-anchor.getBoundingClientRect().top / Math.max(1, anchor.offsetHeight));
      }
      enabled = nextEnabled;
      doc.body.classList.toggle("mission-enhanced", enabled);
      if (!enabled) {
        stage.removeAttribute("style"); intro.style.visibility = ""; intro.inert = false;
        zoomCopy.style.visibility = ""; zoomCopy.inert = false; layer.style.visibility = "hidden";
        scenes.forEach(scene => scene.section.classList.remove("is-scene-visible"));
      }
      if (anchor) win.scrollTo({ top: anchor.getBoundingClientRect().top + win.scrollY + fraction * anchor.offsetHeight, behavior: "instant" });
      measure(); current = target;
      updateAtmosphere();
      if (enabled) draw();
      schedule();
    }
    win.addEventListener("scroll", () => { target = Math.max(0, win.scrollY); schedule(); }, { passive: true });
    win.addEventListener("resize", () => configure(true));
    win.addEventListener("load", () => { measure(); schedule(); });
    doc.addEventListener("visibilitychange", () => {
      if (doc.hidden) { if (frame) win.cancelAnimationFrame(frame); frame = 0; lastTime = null; }
      else { measure(); current = target; schedule(); }
      updateAtmosphere();
    });
    reduced.addEventListener("change", () => configure(true));
    doc.querySelectorAll(".mission-anatomy-controls button").forEach(button => {
      button.addEventListener("click", () => {
        const after = button.dataset.anatomy === "after";
        gallery.classList.toggle("is-after", after);
        gallery.querySelectorAll(".mission-anatomy-controls button").forEach(control => control.setAttribute("aria-pressed", String(control === button)));
        gallery.querySelector(".mission-diagram-status").textContent = after ? "Without the storage step, bile flows directly from the liver to the small intestine." : "The gallbladder stores bile between meals.";
      });
    });
    const slider = doc.getElementById("design-progress");
    slider.addEventListener("input", () => doc.getElementById("engineering-story").style.setProperty("--fit-progress", Number(slider.value) / 100));
    configure();
    return { configure, measure };
  }
  const api = { DOCK, flightState, revealState, damp, init };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else init(root, root.document);
})(typeof window === "undefined" ? globalThis : window);
