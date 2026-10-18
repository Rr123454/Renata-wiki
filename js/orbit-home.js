(function () {
  "use strict";
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const smoother = value => { const t = clamp(value); return t * t * t * (t * (t * 6 - 15) + 10); };
  const radians = angle => angle * Math.PI / 180;
  const damp = (current, target, dt, duration = 115) => mix(current, target, 1 - Math.exp(-Math.max(0, dt) / duration));
  const bezier = (a, b, c, d, t) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;

  // Hermite tangents use scroll distance, keeping speed continuous across chapters.
  function routePose(scroll, stops, poses) {
    if (scroll <= stops[0]) return { chapter: 0, values: poses[0] };
    if (scroll >= stops.at(-1)) return { chapter: stops.length - 1, values: poses.at(-1) };
    let index = 0;
    while (index < stops.length - 2 && scroll > stops[index + 1]) index++;
    const span = Math.max(1, stops[index + 1] - stops[index]);
    const t = clamp((scroll - stops[index]) / span);
    const tangent = (i, axis) => i === 0 || i === poses.length - 1 ? 0
      : (poses[i + 1][axis] - poses[i - 1][axis]) / Math.max(1, stops[i + 1] - stops[i - 1]);
    const values = poses[index].map((a, axis) => {
      const b = poses[index + 1][axis];
      return (2 * t ** 3 - 3 * t * t + 1) * a + (t ** 3 - 2 * t * t + t) * span * tangent(index, axis)
        + (-2 * t ** 3 + 3 * t * t) * b + (t ** 3 - t * t) * span * tangent(index + 1, axis);
    });
    return { chapter: index + t, values };
  }

  // These are the actual nested SVG transforms of the emblem on the bottle:
  // rotate(-7 150 275) → translate(196 329) → rotate(-90).
  function bottleDock(state, geometry) {
    const rotation = radians(-7), turn = radians(state.bottleAngle);
    const localX = 46 * Math.cos(rotation) - 54 * Math.sin(rotation);
    const localY = 30 + 46 * Math.sin(rotation) + 54 * Math.cos(rotation);
    const unit = geometry.bottleWidth / 300 * state.bottleScale;
    return {
      x: state.bottleX * geometry.width + (localX * Math.cos(turn) - localY * Math.sin(turn)) * unit,
      y: (geometry.stageTop || 0) + state.bottleY * geometry.stageHeight + (localX * Math.sin(turn) + localY * Math.cos(turn)) * unit,
      angle: -97 + state.bottleAngle,
      scale: 48 * unit / geometry.craftWidth
    };
  }

  function flightState(scroll, launchDistance, stops, mobile, measured) {
    const geometry = measured || (mobile
      ? { width: 390, height: 844, stageHeight: 844, bottleWidth: 150, craftWidth: 125 }
      : { width: 1440, height: 1000, stageHeight: 1000, bottleWidth: 330, craftWidth: 259.2 });
    const launch = clamp(scroll / Math.max(1, launchDistance));
    const poses = mobile
      ? [[.57, .55, -20], [.64, .66, 14], [.58, .67, -16], [.65, .65, 15], [.5, .53, 6]]
      : [[.54, .47, -20], [.6, .54, 14], [.42, .55, -16], [.61, .54, 15], [.5, .56, 6]];
    const route = routePose(scroll, stops, poses);
    const state = {
      launch, chapter: route.chapter,
      intro: 1 - smooth((launch - .05) / .25),
      night: smooth(launch / .85) * .76,
      bottleX: mix(mobile ? .25 : .24, .48, smoother(launch / .68)),
      bottleY: mix(mobile ? .73 : .66, .59, smoother(launch / .68)),
      bottleScale: mix(1, mobile ? 1.25 : 1.35, smoother(launch / .72)),
      bottleAngle: -6 * smoother(launch / .78),
      bottleOpacity: 1 - smoother((launch - .65) / .31),
      detach: smoother((launch - .28) / .52),
      ignition: smooth((launch - .35) / .3),
      exhaust: smooth((launch - .4) / .47)
    };
    const dock = bottleDock(state, geometry);
    const t = state.detach, nose = radians(dock.angle);
    const destinationX = route.values[0] * geometry.width;
    const destinationY = route.values[1] * geometry.height;
    const reach = geometry.width * (mobile ? .14 : .11);
    state.dockX = dock.x;
    state.dockY = dock.y;
    state.dockScale = dock.scale;
    state.craftX = bezier(dock.x, dock.x - Math.sin(nose) * reach, destinationX + reach, destinationX, t) / geometry.width;
    state.craftY = bezier(dock.y, dock.y + Math.cos(nose) * reach, destinationY - geometry.height * .18, destinationY, t) / geometry.height;
    state.craftAngle = mix(dock.angle, route.values[2], t) - Math.sin(t * Math.PI) * 12;
    state.craftScale = mix(dock.scale, 1, t);
    state.craftOpacity = 1;
    state.ringOpacity = Math.sin(clamp((launch - .28) / .42) * Math.PI) * .65;
    state.ringScale = .4 + state.detach * 2.4;
    return state;
  }

  function revealState(scroll, blockTop, viewportHeight, fromRight, index, mobile) {
    const entry = clamp((scroll + viewportHeight * .92 - blockTop) / (viewportHeight * .36));
    const amount = smoother((entry - index * .085) / .7);
    return {
      opacity: amount,
      x: (fromRight ? 1 : -1) * (mobile ? 64 : 180) * (1 - amount),
      y: 12 * (1 - amount)
    };
  }

  function initFlight(view, doc) {
    const journey = doc.querySelector(".flight-journey");
    if (!journey) return;
    const launch = doc.querySelector(".flight-launch");
    const stage = doc.querySelector(".flight-launch-stage");
    const bottle = doc.querySelector(".flight-bottle");
    const intro = doc.querySelector(".flight-hero-copy");
    const scrollCue = doc.querySelector(".flight-scroll");
    const layer = doc.querySelector(".flight-craft-layer");
    const craft = doc.querySelector(".flight-craft");
    const ring = doc.querySelector(".flight-launch-ring");
    const header = doc.querySelector(".flight-header");
    const controls = doc.querySelector(".flight-controls");
    const motion = doc.querySelector(".flight-motion");
    const progress = doc.querySelector(".flight-progress");
    const progressLabel = doc.querySelector(".flight-progress-label");
    const checkpoints = [...doc.querySelectorAll(".flight-progress-dots a")];
    const worlds = [...doc.querySelectorAll(".flight-world")];
    const chapters = [launch, ...worlds];
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = view.matchMedia("(max-width: 760px)");
    const scenes = worlds.map((section, index) => {
      const copy = section.querySelector(".flight-world-copy, .flight-arrival");
      return { section, index, copy, parts: [...copy.children], top: 0, blockTop: 0, height: 1 };
    });
    let paused = false, animated = false, frame = 0, lastTime = null, current = 0, target = 0, energy = 0;
    let geometry = {}, launchDistance = 1, stops = [], journeyEnd = 1, chapterTops = [], lastState = null;
    let started = false;

    let seed = 2026;
    const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
    const stars = doc.createDocumentFragment();
    for (let i = 0; i < 42; i++) {
      const star = doc.createElement("i");
      star.className = "flight-star";
      star.style.cssText = `left:${random() * 100}%;top:${random() * 100}%;--size:${2 + random() * 7}px;--alpha:${.2 + random() * .5}`;
      stars.appendChild(star);
    }
    doc.querySelector(".flight-stars").appendChild(stars);

    function draw(state) {
      stage.style.setProperty("--intro", state.intro);
      stage.style.setProperty("--intro-y", `${-state.launch * 35}px`);
      stage.style.setProperty("--night", state.night);
      stage.style.setProperty("--bottle-x", `${state.bottleX * 100}%`);
      stage.style.setProperty("--bottle-y", `${state.bottleY * 100}%`);
      stage.style.setProperty("--bottle-scale", state.bottleScale);
      stage.style.setProperty("--bottle-angle", `${state.bottleAngle}deg`);
      stage.style.setProperty("--bottle-opacity", state.bottleOpacity);
      stage.style.setProperty("--label-opacity", 0);
      stage.style.setProperty("--stars-y", `${-state.launch * 45}px`);
      stage.style.setProperty("--planet-y", `${-state.launch * 75}px`);
      stage.style.setProperty("--planet-turn", `${-16 + state.launch * 12}deg`);
      stage.style.setProperty("--comet-x", `${-state.launch * 130}px`);
      stage.style.setProperty("--ground-y", `${state.launch * 100}px`);
      const introHidden = state.intro < .02;
      intro.style.visibility = scrollCue.style.visibility = introHidden ? "hidden" : "visible";
      intro.inert = scrollCue.inert = introHidden;
      const bank = energy * Math.sin(state.chapter * Math.PI) * 4 * state.detach;
      craft.style.transform = `translate3d(${state.craftX * geometry.width}px, ${state.craftY * geometry.height}px, 0) translate(-50%, -50%) rotate(${state.craftAngle + bank}deg) scale(${state.craftScale})`;
      craft.style.opacity = state.craftOpacity;
      craft.style.setProperty("--ignition", state.ignition);
      craft.style.setProperty("--exhaust-opacity", state.exhaust);
      craft.style.setProperty("--exhaust", state.exhaust * (.85 + energy * .3 + Math.sin(state.chapter * 11) * .05));
      ring.style.transform = `translate3d(${state.dockX}px, ${state.dockY}px, 0) translate(-50%, -50%) scale(${state.ringScale})`;
      ring.style.opacity = state.ringOpacity;
      for (const scene of scenes) {
        scene.parts.forEach((part, index) => {
          const reveal = revealState(current, scene.blockTop, geometry.height, scene.index % 2 === 1, index, compact.matches);
          part.style.setProperty("--copy-opacity", reveal.opacity);
          part.style.setProperty("--copy-x", `${reveal.x}px`);
          part.style.setProperty("--copy-y", `${reveal.y}px`);
        });
        const travel = clamp((current + geometry.height * .8 - scene.top) / (scene.height + geometry.height * .6));
        const direction = scene.index % 2 ? -1 : 1;
        scene.section.style.setProperty("--organ-y", `${(.5 - travel) * (compact.matches ? 24 : 56)}px`);
        scene.section.style.setProperty("--organ-turn", `${Math.sin((travel - .5) * Math.PI) * direction * 1.8}deg`);
        scene.section.style.setProperty("--organ-scale", 1 + Math.sin(travel * Math.PI) * .035);
        scene.section.style.setProperty("--particles-y", `${(.5 - travel) * 85}px`);
        scene.section.style.setProperty("--microbe-y", `${Math.sin(travel * Math.PI * 3) * 12}px`);
        scene.section.style.setProperty("--microbe-turn", `${-13 + Math.sin(travel * Math.PI * 2) * 9}deg`);
      }
    }

    function updateUI() {
      const finished = target + geometry.height * .7 >= journeyEnd;
      controls.classList.toggle("is-finished", finished);
      controls.inert = finished;
      header.classList.toggle("is-reading", target > geometry.height * .1);
      let active = 0;
      for (let i = 1; i < chapterTops.length; i++) if (target + geometry.height * .5 >= chapterTops[i]) active = i;
      progressLabel.textContent = active ? chapters[active].dataset.chapter : "Launch";
      const chapter = routePose(animated ? current : target, stops, stops.map((_, i) => [i])).chapter;
      progress.style.setProperty("--journey-progress", chapter / (chapters.length - 1));
      checkpoints.forEach((link, i) => {
        link.classList.toggle("is-visited", i < active);
        if (i === active) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
      layer.style.visibility = animated && !finished ? "visible" : "hidden";
    }

    function tick(time) {
      frame = 0;
      if (doc.hidden) { lastTime = null; return; }
      const dt = lastTime === null ? 16 : Math.min(64, Math.max(1, time - lastTime));
      lastTime = time;
      if (animated && !paused) {
        const previous = current;
        current = damp(current, target, dt);
        if (Math.abs(target - current) < .05) current = target;
        energy = damp(energy, clamp(Math.abs(current - previous) / dt / 2), dt, 140);
        if (energy < .001) energy = 0;
        // During docking the stage is pinned. Afterwards this offset accounts
        // for its normal exit without delaying the document's native scroll.
        geometry.stageTop = Math.min(0, launchDistance - target);
        lastState = flightState(current, launchDistance, stops, compact.matches, geometry);
        draw(lastState);
      }
      updateUI();
      if (animated && !paused && (current !== target || energy > 0)) schedule();
      else lastTime = null;
    }
    function schedule() {
      if (!frame && !doc.hidden) frame = view.requestAnimationFrame(tick);
    }
    function onScroll() { target = Math.max(0, view.scrollY); schedule(); }
    function measure() {
      target = Math.max(0, view.scrollY);
      const baseWidth = element => parseFloat(view.getComputedStyle?.(element)?.width) || element.offsetWidth;
      // Use the stage's content width (excluding a desktop scrollbar) and
      // fractional CSS widths so the emblem handoff also aligns at browser zoom.
      geometry = { width: stage.clientWidth || view.innerWidth, height: view.innerHeight, stageHeight: stage.offsetHeight, bottleWidth: baseWidth(bottle), craftWidth: baseWidth(craft) || 1, stageTop: 0 };
      launchDistance = Math.max(1, launch.offsetHeight - stage.offsetHeight);
      geometry.stageTop = Math.min(0, launchDistance - target);
      chapterTops = chapters.map(section => section.getBoundingClientRect().top + view.scrollY);
      stops = chapterTops.map((top, i) => i ? top - geometry.height * .45 : 0);
      journeyEnd = journey.getBoundingClientRect().bottom + view.scrollY;
      scenes.forEach(scene => {
        scene.top = scene.section.getBoundingClientRect().top + view.scrollY;
        scene.blockTop = scene.top + scene.copy.offsetTop;
        scene.height = scene.section.offsetHeight;
      });
      if (!started) { current = target; started = true; }
      if (paused && animated && lastState) draw(flightState(current, launchDistance, stops, compact.matches, geometry));
      schedule();
    }
    function clearScene() {
      stage.removeAttribute("style");
      intro.style.visibility = scrollCue.style.visibility = "visible";
      intro.inert = scrollCue.inert = false;
      scenes.forEach(scene => {
        scene.section.removeAttribute("style");
        scene.parts.forEach(part => part.removeAttribute("style"));
      });
    }
    function syncMode() {
      const wasAnimated = animated;
      animated = !reduced.matches && view.innerHeight >= 700;
      doc.body.classList.add("flight-ready");
      doc.body.classList.toggle("flight-enhanced", animated);
      doc.body.classList.toggle("flight-paused", paused);
      motion.hidden = !animated;
      motion.setAttribute("aria-pressed", String(paused));
      motion.innerHTML = paused ? '<span aria-hidden="true">▷</span> Resume' : '<span aria-hidden="true">Ⅱ</span> Pause';
      if (!animated) { clearScene(); energy = 0; }
      if (!wasAnimated && animated) started = false;
      measure();
    }
    motion.addEventListener("click", () => { paused = !paused; syncMode(); });
    doc.querySelector(".flight-replay").addEventListener("click", () => { paused = false; syncMode(); });
    reduced.addEventListener("change", () => { paused = false; syncMode(); });
    view.addEventListener("scroll", onScroll, { passive: true });
    view.addEventListener("resize", syncMode, { passive: true });
    view.addEventListener("pageshow", measure);
    doc.addEventListener("visibilitychange", () => {
      if (doc.hidden) { if (frame) view.cancelAnimationFrame(frame); frame = 0; lastTime = null; }
      else onScroll();
    });
    syncMode();
  }

  if (typeof module === "object" && module.exports) module.exports = { flightState, bottleDock, routePose, revealState, damp, initFlight };
  if (typeof document !== "undefined") initFlight(window, document);
})();
