/* Illustrated chapter pages. The team dealing controller owns all roster motion. */
(function (root) {
  "use strict";
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const plain = value => String(value || "").replace(/<[^>]*>/g, "");
  const chapters = {
    team: { number: "01", label: "Our team", icon: "Phoenix", satellite: "DNA", title: ["The people.", "The possibility."], lead: "Meet the students and mentors bringing Renata to life. Every perspective adds something to the story.", next: "project-description.html", nextLabel: "Explore our project", nextIcon: "Stomach" },
    project: { number: "02", label: "Our project", icon: "Stomach", satellite: "DNA", title: ["Small biology.", "A bigger question."], lead: "Explore the thinking behind Sulflux: a proposed synthetic biology approach to lithocholic acid sulfation.", next: "engineering.html", nextLabel: "Follow the engineering", nextIcon: "DNA" },
    engineering: { number: "03", label: "Engineering", icon: "DNA", satellite: "Stomach", title: ["Build. Test.", "Begin again."], lead: "Follow the questions, design choices, and iterations behind Renata’s proposed system.", next: "experiments.html", nextLabel: "Step inside the lab", nextIcon: "DNA" },
    lab: { number: "04", label: "Lab work", icon: "DNA", satellite: "Plant", title: ["Big questions.", "Small beginnings."], lead: "From experimental plans to computational observations, explore the records behind the research.", next: "human-practices.html", nextLabel: "Meet the perspectives", nextIcon: "Mic" },
    engagement: { number: "05", label: "Human practices", icon: "Mic", satellite: "Phoenix", title: ["Better science.", "Starts with listening."], lead: "Explore the people, perspectives, and conversations that inform our project decisions.", next: "education.html", nextLabel: "Share the curiosity", nextIcon: "Plant" },
    education: { number: "06", label: "Education", icon: "Plant", satellite: "Mic", title: ["Curiosity.", "Pass it on."], lead: "A place for our learning activities, outreach records, and reflections on sharing synthetic biology.", next: "team.html", nextLabel: "Meet the Renata team", nextIcon: "Phoenix" },
    community: { number: "07", label: "Our community", icon: "Eiffel_tower", satellite: "Phoenix", title: ["Ideas grow.", "Together."], lead: "Explore the connections and support around Renata.", next: "team.html", nextLabel: "Meet the Renata team", nextIcon: "Phoenix" }
  };

  function pageChapter(pageKey, pageData) {
    const key = pageKey.startsWith("education") ? "education" : pageKey === "engineering" ? "engineering" : pageData.group === "lab-work" ? "lab" : ["contact", "partnerships"].includes(pageKey) ? "community" : pageData.group in chapters ? pageData.group : "project";
    const chapter = { ...chapters[key], key };
    if (pageKey.startsWith("experiment-") || pageKey.startsWith("education-event-")) {
      chapter.title = [plain(pageData.title)];
      chapter.lead = plain(pageData.lead);
      chapter.record = true;
      chapter.next = pageKey.startsWith("experiment-") ? "experiments.html" : "education.html";
      chapter.nextLabel = pageKey.startsWith("experiment-") ? "Explore all lab records" : "Explore education";
      chapter.nextIcon = chapter.icon;
    }
    if (pageKey === "contact") { chapter.title = ["Keep in touch.", "Keep exploring."]; chapter.icon = "Mic"; }
    return chapter;
  }

  function illustration(chapter) {
    return `<svg class="orbit-page-scene" viewBox="0 0 600 500" aria-hidden="true" focusable="false">
      <g class="orbit-scene-far" fill="#ffe9a6"><path d="m88 92 5 13 13 5-13 5-5 13-5-13-13-5 13-5Z"/><path d="m501 70 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/><circle cx="130" cy="372" r="4"/><circle cx="452" cy="430" r="3"/><circle cx="548" cy="316" r="5"/></g>
      <g class="orbit-scene-ring"><ellipse cx="300" cy="250" rx="235" ry="154" transform="rotate(-18 300 250)" fill="none" stroke="#fff1bc38" stroke-width="2" stroke-dasharray="4 8"/><ellipse cx="300" cy="250" rx="220" ry="135" transform="rotate(-18 300 250)" fill="none" stroke="#ffcf78" stroke-width="3" pathLength="1" class="orbit-scene-trail"/></g>
      <g class="orbit-scene-center">
        <circle cx="300" cy="250" r="138" fill="#132e64"/>
        <circle cx="300" cy="250" r="126" fill="#cb85af" stroke="#112c62" stroke-width="6"/>
        <path d="M190 214 Q300 148 404 213M183 276Q305 214 416 271M213 333Q307 285 387 322" fill="none" stroke="#b16d9c" stroke-width="15" stroke-linecap="round"/>
        ${chapter.key === "team" ? '<rect x="211" y="154" width="180" height="218" rx="18" fill="#f49c7c" stroke="#122b60" stroke-width="5" transform="rotate(-17 300 250)"/><rect x="211" y="150" width="180" height="218" rx="18" fill="#7ccfda" stroke="#122b60" stroke-width="5" transform="rotate(13 300 250)"/>' : ""}
        <rect x="211" y="142" width="178" height="216" rx="22" fill="#fff1bc" stroke="#122b60" stroke-width="5" transform="rotate(-5 300 250)"/>
        <image href="assets/nav-icons/${chapter.icon}.png" x="234" y="174" width="132" height="132" class="orbit-scene-badge"/>
        <text x="300" y="335" fill="#173e84" text-anchor="middle" font-size="12" font-weight="800" letter-spacing="3">RENATA / ${chapter.number}</text>
      </g>
      <g class="orbit-scene-moon"><circle cx="475" cy="140" r="43" fill="#ffda77" stroke="#122b60" stroke-width="5"/><ellipse cx="475" cy="140" rx="64" ry="16" fill="none" stroke="#f2a57c" stroke-width="10" transform="rotate(-25 475 140)"/></g>
      <g class="orbit-scene-satellite"><rect x="69" y="285" width="89" height="89" rx="23" fill="#b2e4e4" stroke="#122b60" stroke-width="4" transform="rotate(10 113 330)"/><image href="assets/nav-icons/${chapter.satellite}.png" x="84" y="300" width="60" height="60" class="orbit-scene-badge"/></g>
      <g class="orbit-scene-craft" transform="translate(487 191) rotate(66)"><path d="M-7 26Q0 68 7 26" fill="#f9a17e"/><path d="M-3 26Q0 50 3 26" fill="#fff1bc"/><image href="assets/orbit/spacecraft.svg" x="-22" y="-33" width="44" height="65"/></g>
    </svg>`;
  }

  function heroMarkup(chapter, titleId, pageTitle, links) {
    return `<section class="orbit-page-hero${chapter.record ? " orbit-page-hero--record" : ""}" aria-labelledby="${escape(titleId)}">
      <div class="orbit-page-stars" aria-hidden="true"></div>
      <div class="container orbit-page-hero-grid">
        <div class="orbit-page-copy">
          <nav class="orbit-page-breadcrumb" aria-label="Breadcrumb"><a href="home-orbit.html">Into orbit</a><span aria-hidden="true">/</span><span>${escape(pageTitle)}</span></nav>
          <p class="orbit-page-kicker">${chapter.number} <span aria-hidden="true">—</span> ${escape(chapter.label)}</p>
          <h1 id="${escape(titleId)}">${chapter.title.map((line, index) => `<span class="orbit-title-line"><span style="--line:${index}">${escape(line)}</span></span>`).join("")}</h1>
          <p class="orbit-page-lead">${escape(chapter.lead)}</p>
          <a class="orbit-page-cta" href="#page-content">${chapter.key === "team" ? "Meet the crew" : "Explore this chapter"}<span aria-hidden="true">↓</span></a>
        </div>
        <div class="orbit-page-art">${illustration(chapter)}<div class="orbit-scene-caption"><span>One project. Many perspectives.</span><button class="orbit-scene-toggle" type="button" aria-pressed="false" hidden>Pause scene</button></div></div>
      </div>
      <svg class="orbit-page-horizon" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 65Q240 0 500 50T1000 45T1440 22V100H0Z" fill="#ef9a7d"/><path d="M0 87Q350 28 610 73T1150 65T1440 80V100H0Z" fill="#fff4e3"/></svg>
    </section>
    ${links.length ? `<nav class="orbit-chapter-nav" aria-label="On this page"><span>In this chapter</span>${links.slice(0, 6).map((link, index) => `<a href="#${escape(link.id)}"><span>${String(index + 1).padStart(2, "0")}</span>${escape(link.label)}</a>`).join("")}</nav>` : ""}`;
  }

  function sceneState(progress, time, pointer = { x: 0, y: 0 }) {
    const scroll = clamp(progress);
    const theta = -.7 + scroll * 3.1 + time * .00012;
    const turn = -Math.PI / 10;
    const x = 220 * Math.cos(theta), y = 135 * Math.sin(theta);
    const dx = -220 * Math.sin(theta), dy = 135 * Math.cos(theta);
    return {
      x: 300 + x * Math.cos(turn) - y * Math.sin(turn),
      y: 250 + x * Math.sin(turn) + y * Math.cos(turn),
      angle: (Math.atan2(dy, dx) + turn) * 180 / Math.PI + 90,
      float: Math.sin(time * .0007) * 5 - scroll * 12,
      tiltX: clamp(pointer.y, -1, 1) * -5, tiltY: clamp(pointer.x, -1, 1) * 7,
      moon: Math.sin(time * .0006 + 1) * 8 - scroll * 30,
      stars: scroll * 40, trail: .65 - scroll * .5
    };
  }

  function createSceneController({ win, doc, reduced, measure, paint, onState = () => {} }) {
    let frame = 0, last = null, elapsed = 0, paused = false, visible = true, progress = 0;
    let target = { x: 0, y: 0 }, pointer = { x: 0, y: 0 };
    function allowed() { return !paused && !reduced.matches && !doc.hidden && visible; }
    function cancel() { if (frame) win.cancelAnimationFrame(frame); frame = 0; last = null; }
    function render(time) {
      frame = 0;
      if (!allowed()) return;
      const delta = last === null ? 0 : Math.min(48, Math.max(0, time - last));
      last = time; elapsed += delta;
      const smoothing = 1 - Math.exp(-delta / 110);
      pointer.x += (target.x - pointer.x) * smoothing;
      pointer.y += (target.y - pointer.y) * smoothing;
      progress += (measure().progress - progress) * smoothing;
      paint(sceneState(progress, elapsed, pointer));
      frame = win.requestAnimationFrame(render);
    }
    function sync() {
      const bounds = measure(); visible = bounds.visible;
      onState({ paused, reduced: reduced.matches });
      if (!allowed()) {
        cancel();
        if (reduced.matches) paint(sceneState(0, 0));
      } else if (!frame) frame = win.requestAnimationFrame(render);
    }
    return {
      sync,
      point(x, y) { target = { x: clamp(x, -1, 1), y: clamp(y, -1, 1) }; },
      toggle() { paused = !paused; sync(); },
      destroy: cancel
    };
  }

  function enhanceScene(hero, win, doc) {
    const scene = hero.querySelector(".orbit-page-scene");
    const button = hero.querySelector(".orbit-scene-toggle");
    const craft = scene.querySelector(".orbit-scene-craft");
    const center = scene.querySelector(".orbit-scene-center");
    const moon = scene.querySelector(".orbit-scene-moon");
    const satellite = scene.querySelector(".orbit-scene-satellite");
    const stars = hero.querySelector(".orbit-page-stars");
    const trail = scene.querySelector(".orbit-scene-trail");
    const reduced = win.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = win.matchMedia("(hover: hover) and (pointer: fine)");
    const controller = createSceneController({ win, doc, reduced,
      measure() { const box = hero.getBoundingClientRect(); return { visible: box.bottom > 0 && box.top < win.innerHeight, progress: clamp(-box.top / Math.max(1, box.height)) }; },
      paint(state) {
        craft.setAttribute("transform", `translate(${state.x} ${state.y}) rotate(${state.angle})`);
        center.setAttribute("transform", `translate(0 ${state.float})`);
        moon.setAttribute("transform", `translate(0 ${state.moon})`);
        satellite.setAttribute("transform", `translate(0 ${-state.float * 1.3})`);
        scene.style.transform = `perspective(900px) rotateX(${state.tiltX}deg) rotateY(${state.tiltY}deg)`;
        stars.style.transform = `translateY(${state.stars}px)`;
        trail.style.strokeDashoffset = state.trail;
      },
      onState({ paused, reduced: reduce }) { button.hidden = reduce; button.setAttribute("aria-pressed", String(paused)); button.textContent = paused ? "Resume scene" : "Pause scene"; }
    });
    hero.addEventListener("pointermove", event => {
      if (!fine.matches || event.pointerType !== "mouse") return;
      const box = hero.getBoundingClientRect();
      controller.point((event.clientX - box.left) / box.width * 2 - 1, (event.clientY - box.top) / box.height * 2 - 1);
    });
    hero.addEventListener("pointerleave", () => controller.point(0, 0));
    button.addEventListener("click", controller.toggle);
    win.addEventListener("scroll", controller.sync, { passive: true });
    win.addEventListener("resize", controller.sync);
    doc.addEventListener("visibilitychange", controller.sync);
    reduced.addEventListener("change", controller.sync);
    win.addEventListener("pagehide", controller.destroy);
    win.addEventListener("pageshow", controller.sync);
    controller.sync();
  }

  function enhanceReading(main, links, win, doc) {
    const reduced = win.matchMedia("(prefers-reduced-motion: reduce)");
    // Never target .member-card, .team-card-inner, or their ancestors: the dealer
    // measures those nodes and must retain exclusive control over their transforms.
    const targets = [...main.querySelectorAll(".glass-card, .experiment-route-block, .project-paper-section > h2, .detail-panel > h2, .dry-lab-section > h2, .experiment-record-entry, .lab-work-model-feature, .orbit-next-copy")];
    const running = new Set();
    let observer;
    if ("IntersectionObserver" in win && targets.every(element => typeof element.animate === "function")) {
      observer = new win.IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
          observer.unobserve(entry.target);
          if (reduced.matches || doc.hidden) return;
          const side = entry.target.matches("h2") ? -22 : 0;
          const animation = entry.target.animate([
            { opacity: .3, transform: `translate(${side}px, 26px) rotate(${side ? "-.8" : ".6"}deg)`, clipPath: "inset(0 0 12% 0 round 12px)" },
            { opacity: 1, transform: "translate(0, -2px) rotate(0deg)", clipPath: "inset(0 0 0 0 round 0px)", offset: .8 },
            { opacity: 1, transform: "none", clipPath: "inset(0 0 0 0 round 0px)" }
          ], { duration: 620, delay: Math.min(index, 4) * 65, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
          running.add(animation);
          animation.finished.then(() => running.delete(animation), () => running.delete(animation));
        });
      }, { threshold: .12 });
      targets.forEach(element => observer.observe(element));
    }
    function settle() { running.forEach(animation => animation.cancel()); running.clear(); }
    reduced.addEventListener("change", () => { if (reduced.matches) settle(); });
    doc.addEventListener("visibilitychange", () => { if (doc.hidden) settle(); });
    // Keyboard focus always wins over a decorative entrance.
    main.addEventListener("focusin", settle);

    const meter = doc.createElement("div");
    meter.className = "orbit-reading-progress";
    meter.setAttribute("role", "progressbar"); meter.setAttribute("aria-label", "Page reading progress");
    meter.setAttribute("aria-valuemin", "0"); meter.setAttribute("aria-valuemax", "100");
    meter.innerHTML = '<span></span>';
    doc.getElementById("siteHeader").appendChild(meter);
    const chapterLinks = [...main.querySelectorAll(".orbit-chapter-nav a")];
    let frame = 0;
    function update() {
      frame = 0;
      const box = main.getBoundingClientRect();
      const value = clamp(-box.top / Math.max(1, box.height - win.innerHeight));
      meter.firstElementChild.style.transform = `scaleX(${value})`;
      meter.setAttribute("aria-valuenow", String(Math.round(value * 100)));
      const headerBottom = doc.getElementById("siteHeader").getBoundingClientRect().bottom;
      let current = "";
      links.forEach(link => { if (doc.getElementById(link.id)?.getBoundingClientRect().top <= headerBottom + 130) current = link.id; });
      chapterLinks.forEach(link => {
        if (link.getAttribute("href") === `#${current}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    const schedule = () => { if (!frame) frame = win.requestAnimationFrame(update); };
    win.addEventListener("scroll", schedule, { passive: true });
    win.addEventListener("resize", schedule);
    if (win.ResizeObserver) new win.ResizeObserver(schedule).observe(main);
    update();
  }

  function decorate(main, { pageKey, pageData }, win = window) {
    if (!main || pageKey === "home" || main.dataset.orbitDecorated) return;
    main.dataset.orbitDecorated = "true";
    const doc = main.ownerDocument;
    const chapter = pageChapter(pageKey, pageData);
    const heading = main.querySelector("h1");
    const titleId = heading?.id || "orbit-page-title";
    const pageTitle = heading?.textContent || plain(pageData.title);
    const oldHero = main.querySelector(".page-hero, .experiment-index-header, .project-paper-header");
    if (oldHero) oldHero.remove();
    else heading?.remove();
    const candidates = [...main.querySelectorAll(".project-paper-section[id], .team-group-section[id], .detail-section, .dry-lab-section[id], .experiment-list-header, .lab-work-model-feature, .experiment-record-panel-header, .education-event-index .experiment-route-list")];
    const links = candidates.map((section, index) => {
      if (!section.id) section.id = `orbit-chapter-${index + 1}`;
      return { id: section.id, label: section.querySelector("h2, strong")?.textContent || "Explore the events" };
    });
    const content = main.innerHTML;
    main.innerHTML = `${heroMarkup(chapter, titleId, pageTitle, links)}<div class="orbit-page-content" id="page-content" tabindex="-1">${content}</div>
      <section class="orbit-next" aria-label="Continue exploring"><div class="container"><div class="orbit-next-copy"><p>There’s more to the story</p><h2>Keep your<br>curiosity moving.</h2></div><a href="${chapter.next}"><img src="assets/nav-icons/${chapter.nextIcon}.png" width="80" height="80" alt=""/><span>${chapter.nextLabel}</span><span aria-hidden="true">↗</span></a></div></section>`;
    doc.body.dataset.orbitSection = chapter.key;
    doc.body.classList.add("orbit-pages");
    enhanceScene(main.querySelector(".orbit-page-hero"), win, doc);
    enhanceReading(main, links, win, doc);
  }
  const api = { pageChapter, heroMarkup, sceneState, createSceneController, decorate };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.RenataPages = api;
})(typeof window === "undefined" ? globalThis : window);
