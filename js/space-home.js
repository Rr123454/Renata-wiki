(function () {
  "use strict";
  if (document.body.dataset.page !== "home") return;
  const main = document.getElementById("siteMain");
  if (!main) return;

  // A conceptual oral-drug route. The tissue illustrations change scale;
  // this does not claim Renata's engineered system enters the liver.
  const tissues = [
    { id: "stomach", title: "Stomach", scale: "Inside the digestive tract", alt: "Stomach cutaway showing the gastric folds and open lumen", caption: "From the esophagus into the stomach’s open cavity." },
    { id: "intestine", title: "Intestinal lining", scale: "Tissue detail · enlarged", alt: "Small-intestinal tissue with villi, epithelium and underlying vessels", caption: "An absorbed drug crosses the intestinal wall into blood." },
    { id: "portal", title: "Portal circulation", scale: "Vessel detail · enlarged", alt: "Cutaway venous vessel with merging tributaries and blood cells", caption: "Portal blood carries absorbed compounds toward the liver." },
    { id: "liver", title: "Liver", scale: "Organ cutaway with tissue detail", alt: "Liver cutaway showing branching vessels and exposed hepatic tissue", caption: "The liver receives portal blood and can metabolize the drug." }
  ];

  const stations = [
    { id: "mission-project", side: "right", number: "02", label: "Stomach", title: "Inside<br><em>the stomach.</em>", text: "After swallowing, the esophagus carries the dose into the stomach. Follow the bottle through the open cavity as the stomach mixes its contents, then onward into the small intestine.", detail: "The curved route follows the stomach’s shape and exits through the pylorus." },
    { id: "mission-lab", side: "left", number: "03", label: "Intestinal absorption", title: "Across<br><em>the lining.</em>", text: "The view moves closer to the intestinal wall. For a compound that is absorbed into portal blood, the journey continues across the lining and into the vessels underneath.", detail: "The same miniature bottle carries the journey into the enlarged tissue detail." },
    { id: "mission-engagement", side: "right", number: "04", label: "Portal circulation", title: "Carried<br><em>by the blood.</em>", text: "Small vessels draining the intestine join the portal circulation. The absorbed compound travels with this blood toward the liver, following the vessel’s bends and branches.", detail: "The connecting passage changes from digestive tissue to a blood vessel." },
    { id: "mission-team", side: "left", number: "05", label: "Liver", title: "Arrival<br><em>at the liver.</em>", text: "Portal blood enters the liver and flows into smaller branches. Here, an absorbed drug may be taken up and metabolized before reaching the wider circulation.", detail: "The journey ends within the liver cutaway. Absorption and metabolism depend on the compound." }
  ];

  main.innerHTML = `
    <div class="space-home" id="space-home">
      <div class="space-sky" aria-hidden="true"></div>
      <svg class="space-body-map" aria-hidden="true" preserveAspectRatio="none"></svg>
      <svg class="space-flight-map" aria-hidden="true" preserveAspectRatio="none">
        <path class="space-route-base"/><path class="space-route-travelled"/>
      </svg>
      <svg class="space-ship space-bottle" viewBox="89 180 152 294" aria-hidden="true">
        <!-- Crop only the transparent margins; the supplied photo is unchanged. -->
        <image href="assets/yakult-bottle.png" width="335" height="597"/>
      </svg>
      <div class="space-toolbar">
        <span class="space-overline">Renata / iGEM 2026</span>
        <button class="space-motion" type="button" aria-pressed="false" aria-label="Pause journey animations">Pause motion</button>
      </div>
      <section class="space-hero" id="ingestion" aria-labelledby="space-title">
        <div class="space-hero-copy">
          <p class="space-eyebrow">01 / Ingestion</p>
          <h1 id="space-title">Into the body.<br><em>From ingestion<br>to liver.</em></h1>
          <p class="space-hero-intro">Enter through the mouth. Travel down the esophagus. Follow the bottle through the digestive tract and trace an absorbed compound’s route to the liver.</p>
          <a class="space-launch" href="#ingestion-path">Follow the bottle <span aria-hidden="true">↓</span></a>
          <p class="space-journey-note">The bottle is our visual guide through the body. Tissue views are enlarged and the route is schematic.</p>
        </div>
        <figure class="space-ingestion" id="ingestion-path"><img src="assets/tissues/ingestion.png" width="1254" height="1254" alt="Side cutaway of the head and throat showing the route through the mouth and down the esophagus" decoding="async" fetchpriority="high" /></figure>
        <a class="space-scroll" href="#ingestion-path">Scroll to enter the body</a>
        <span class="space-coordinate">Mouth → esophagus → stomach</span>
      </section>
      ${stations.map((station, index) => `
        <div class="space-maneuver" aria-hidden="true"></div>
        <section class="space-station space-station--${station.side}" id="${station.id}" data-tissue="${tissues[index].id}" aria-labelledby="${station.id}-title">
          <figure class="space-tissue">
            <div class="space-tissue-image"><img src="assets/tissues/${tissues[index].id}.png" width="1254" height="1254" alt="${tissues[index].alt}" loading="${index ? "lazy" : "eager"}" decoding="async" /></div>
            <figcaption><span class="space-tissue-scale">${tissues[index].scale}</span><strong>${tissues[index].title}</strong><p>${tissues[index].caption}</p></figcaption>
          </figure>
          <div class="space-station-copy">
            <div class="space-station-index"><span>${station.number}</span> / ${station.label}</div>
            <h2 id="${station.id}-title">${station.title}</h2>
            <p>${station.text}</p>
            <p class="space-stage-detail">${station.detail}</p>
          </div>
        </section>`).join("")}
      <section class="space-arrival" aria-labelledby="space-arrival-title">
        <p class="space-eyebrow">The journey, in context</p>
        <h2 id="space-arrival-title">From the body<br>to our research.</h2>
        <p>Explore Renata’s proposed LCA-sulfation pathway and the evidence behind its design.</p>
        <a class="space-text-link" href="project-description.html">Read the project description<span aria-hidden="true">↗</span></a>
        <p class="space-journey-source">The bottle represents a moving guide, with enlarged tissue views and schematic connections. The absorbed-compound route shown here does not establish liver delivery of Yakult bacteria or Renata’s engineered system. Artwork is AI-generated.<br>1. National Institute of Diabetes and Digestive and Kidney Diseases. <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works" target="_blank" rel="noopener noreferrer">“Your Digestive System &amp; How It Works.”</a> <cite>NIH</cite>, Dec. 2017.<br>2. Le, Jennifer. <a href="https://www.merckmanuals.com/professional/clinical-pharmacology/pharmacokinetics/drug-bioavailability" target="_blank" rel="noopener noreferrer">“Drug Bioavailability.”</a> <cite>Merck Manual Professional Edition</cite>, Aug. 2026.</p>
      </section>
    </div>`;

  const scene = main.querySelector(".space-home");
  const sky = scene.querySelector(".space-sky");
  const hero = scene.querySelector(".space-hero");
  const map = scene.querySelector(".space-flight-map");
  const bodyMap = scene.querySelector(".space-body-map");
  const route = scene.querySelector(".space-route-base");
  const trail = scene.querySelector(".space-route-travelled");
  const ship = scene.querySelector(".space-ship");
  const motionButton = scene.querySelector(".space-motion");
  const sections = [...scene.querySelectorAll(".space-station")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 1000px)");
  let paused = reducedMotion.matches;
  let frame = 0;
  let lastFrameTime = 0;
  let pathLength = 0;
  let flightRoute;
  let currentLength = 0;
  let desiredLength = 0;
  let travelDirection = 1;
  let sceneTop = 0;
  let viewportHeight = window.innerHeight;

  // Seeded stars stay still across reloads and do not shift the page layout.
  let seed = 2026;
  function random() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  const stars = document.createDocumentFragment();
  for (let i = 0; i < 400; i += 1) {
    const star = document.createElement("i");
    star.className = `space-star${i % 29 === 0 ? " space-star--bright" : ""}`;
    star.style.cssText = `left:${random() * 100}%;top:${random() * 100}%;--star-size:${1 + random() * 1.6}px;--star-opacity:${0.18 + random() * 0.5};--star-delay:${-random() * 5}s`;
    stars.appendChild(star);
  }
  sky.appendChild(stars);

  // Cache route geometry on resize. Scroll updates only transform the ship and draw its trail.
  function measureRoute() {
    const bounds = scene.getBoundingClientRect();
    sceneTop = bounds.top + window.scrollY;
    viewportHeight = window.innerHeight;
    const width = bounds.width;
    const ingestion = scene.querySelector(".space-ingestion").getBoundingClientRect();
    const dimensions = (element) => {
      const image = element.querySelector(".space-tissue-image").getBoundingClientRect();
      return { top: element.offsetTop, height: element.offsetHeight,
        art: { x: image.left - bounds.left, y: image.top - bounds.top, width: image.width, height: image.height } };
    };
    flightRoute = window.SPACE_ROUTE.build({
      width, viewportHeight, heroHeight: hero.offsetHeight,
      stations: sections.map(dimensions), compact: compact.matches,
      ingestion: { x: ingestion.left - bounds.left, y: ingestion.top - bounds.top, width: ingestion.width, height: ingestion.height }
    });
    map.setAttribute("viewBox", `0 0 ${width} ${bounds.height}`);
    bodyMap.setAttribute("viewBox", `0 0 ${width} ${bounds.height}`);
    bodyMap.innerHTML = flightRoute.connectors.map(connection => `<g class="body-passage body-passage--${connection.kind}"><path class="body-passage-wall" d="${connection.d}"/><path class="body-passage-folds" d="${connection.d}"/><path class="body-passage-lumen" d="${connection.d}"/></g>`).join("");
    route.setAttribute("d", flightRoute.d);
    trail.setAttribute("d", flightRoute.d);
    pathLength = flightRoute.totalLength;
    // Normalize SVG dashes to the same cached arc distances used by the bottle.
    trail.setAttribute("pathLength", String(pathLength));
    trail.style.strokeDasharray = `${pathLength} ${pathLength}`;
    updateTarget();
    currentLength = desiredLength;
    drawShip();
  }

  function drawShip() {
    if (!pathLength) return;
    const length = paused ? 0 : currentLength;
    const point = window.SPACE_ROUTE.pointAtDistance(flightRoute, length);
    const next = window.SPACE_ROUTE.pointAtDistance(flightRoute, Math.min(pathLength, length + 2));
    const previous = window.SPACE_ROUTE.pointAtDistance(flightRoute, Math.max(0, length - 2));
    // The photo's cap points upward. +90 aligns that tip with the travel tangent.
    const angle = paused ? -12 : Math.atan2((next.y - previous.y) * travelDirection, (next.x - previous.x) * travelDirection) * 180 / Math.PI + 90;
    // Keep the supplied bottle throughout. Shrink smoothly before entering tissue.
    const shrink = Math.max(0, Math.min(1, (length / flightRoute.doseEnd - .4) / .6));
    const tissueScale = compact.matches ? .55 : .36;
    const scale = 1 - shrink * (1 - tissueScale);
    ship.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
    trail.style.strokeDashoffset = String(pathLength - length);
  }

  function animate(timestamp) {
    frame = 0;
    if (paused || document.hidden) return;
    const delta = desiredLength - currentLength;
    if (Math.abs(delta) > .3) travelDirection = delta > 0 ? 1 : -1;
    const elapsed = Math.max(1, timestamp - lastFrameTime);
    lastFrameTime = timestamp;
    const easing = 1 - Math.exp(-elapsed / 80);
    currentLength = Math.abs(delta) < 0.3 ? desiredLength : currentLength + delta * easing;
    drawShip();
    if (currentLength !== desiredLength) frame = window.requestAnimationFrame(animate);
  }

  function updateTarget() {
    if (!flightRoute) return;
    desiredLength = window.SPACE_ROUTE.distanceAtScroll(flightRoute, window.scrollY - sceneTop + viewportHeight * 0.55);
    if (!frame && !paused && !document.hidden) {
      lastFrameTime = performance.now();
      frame = window.requestAnimationFrame(animate);
    }
  }

  function syncMotion() {
    scene.classList.toggle("is-static", paused);
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.setAttribute("aria-label", paused ? "Enable journey animations" : "Pause journey animations");
    motionButton.textContent = paused ? "Enable motion" : "Pause motion";
    if (paused) {
      window.cancelAnimationFrame(frame);
      frame = 0;
      drawShip();
    } else {
      currentLength = desiredLength;
      updateTarget();
    }
  }

  if ("IntersectionObserver" in window) {
    scene.classList.add("space-motion-ready");
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22 });
    sections.forEach((section) => reveal.observe(section));
  }

  motionButton.addEventListener("click", () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener("change", () => { paused = reducedMotion.matches; syncMotion(); });
  window.addEventListener("scroll", updateTarget, { passive: true });
  window.addEventListener("resize", measureRoute, { passive: true });
  window.addEventListener("pageshow", measureRoute);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { window.cancelAnimationFrame(frame); frame = 0; }
    else updateTarget();
  });
  if ("ResizeObserver" in window) new ResizeObserver(measureRoute).observe(scene);
  measureRoute();
  syncMotion();
})();
