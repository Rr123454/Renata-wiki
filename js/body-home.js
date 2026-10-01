(function () {
  "use strict";
  if (document.body.dataset.page !== "home") return;
  const main = document.getElementById("siteMain");
  if (!main || !window.BODY_ROUTE) return;
  const chapters = [
    { id: "ingestion", label: "Ingestion", title: "Into the body.<br><em>Onward to the liver.</em>", text: "Follow the bottle through one connected body: enter the mouth, travel down the esophagus, and continue into the digestive tract.", note: "The miniature bottle is a visual guide. After absorption, it represents a compound travelling in blood.", next: "stomach" },
    { id: "stomach", label: "Stomach", title: "Through the<br><em>stomach.</em>", text: "The esophagus leads into the stomach, where its contents are mixed. The curved route follows the stomach and continues through its outlet into the small intestine.", note: "The same body stays in view throughout the journey.", next: "intestine" },
    { id: "intestine", label: "Intestinal absorption", title: "Across<br><em>the lining.</em>", text: "Trace the intestinal folds, then cross the gut lining. For an absorbed compound that enters portal blood, this is the transition from the digestive tract to the circulation.", note: "The crossing is schematic; absorption depends on the compound.", next: "portal" },
    { id: "portal", label: "Portal circulation", title: "A route<br><em>through blood.</em>", text: "Vessels draining the intestine converge into the portal vein. The bottle turns upward with them, following the absorbed compound toward the liver.", note: "The route turns because the liver sits above the intestinal loops.", next: "liver" },
    { id: "liver", label: "Liver", title: "Arrival<br><em>at the liver.</em>", text: "Portal blood enters the liver and divides into smaller vessels. An absorbed drug may be taken up and metabolized here before reaching the wider circulation.", note: "This is a conceptual journey. It does not demonstrate liver delivery by Renata’s system.", next: "journey-context" }
  ];
  main.innerHTML = `
    <div class="body-home">
      <div class="body-stars" aria-hidden="true"></div>
      <div class="body-journey">
        <figure class="body-visual" aria-label="One continuous body showing the journey from ingestion to the liver">
          <div class="body-visual-bar"><span class="body-overline">Renata / Inside the body</span><button type="button" class="body-motion" aria-pressed="false">Pause motion</button></div>
          <svg class="body-anatomy" viewBox="0 0 1000 1500" role="img" aria-labelledby="body-art-title body-art-desc">
            <title id="body-art-title">A connected digestive tract inside one body</title>
            <desc id="body-art-desc">The head, neck and torso form a continuous cutaway. The route runs from the mouth down the esophagus, through the stomach and intestine, then follows portal blood upward to the liver. The bottle is a symbolic guide.</desc>
            <image class="body-art-image" href="assets/tissues/contiguous-body.png" width="1000" height="1500" preserveAspectRatio="none"/>
            <path class="body-route-base"/><path class="body-route-travelled"/>
            <g class="body-bottle" aria-hidden="true"><svg x="-43" y="-83.17" width="86" height="166.34" viewBox="89 180 152 294"><image href="assets/yakult-bottle.png" width="335" height="597"/></svg></g>
          </svg>
          <figcaption class="body-position"><span class="body-position-number">01 / 05</span><span class="body-position-name">Mouth &amp; esophagus</span></figcaption>
        </figure>
        <div class="body-chapters">
          ${chapters.map((chapter, i) => `<section class="body-chapter" id="${chapter.id}" aria-labelledby="${chapter.id}-heading"><div class="body-chapter-copy"><p class="body-kicker">0${i + 1} / ${chapter.label}</p><${i ? "h2" : "h1"} id="${chapter.id}-heading">${chapter.title}</${i ? "h2" : "h1"}><p>${chapter.text}</p><p class="body-note">${chapter.note}</p><a class="body-next" href="#${chapter.next}">${i ? "Keep following" : "Scroll to begin"}<span aria-hidden="true">↓</span></a></div></section>`).join("")}
        </div>
      </div>
      <section class="body-arrival" id="journey-context" aria-labelledby="body-arrival-title">
        <p class="body-kicker">The journey, in context</p>
        <h2 id="body-arrival-title">From the body<br><em>to our research.</em></h2>
        <p>Explore Renata’s proposed LCA-sulfation pathway and the evidence behind its design.</p>
        <a class="body-project-link" href="project-description.html">Read the project description <span aria-hidden="true">↗</span></a>
        <div class="body-sources"><p>The bottle is a symbolic guide through a schematic, AI-generated body illustration. The route represents an absorbed compound entering portal blood; it does not establish liver delivery of Yakult bacteria or Renata’s engineered system.</p><ol>
          <li>National Institute of Diabetes and Digestive and Kidney Diseases. <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works" target="_blank" rel="noopener noreferrer">“Your Digestive System &amp; How It Works.”</a> <cite>NIH</cite>, Dec. 2017.</li>
          <li>Le, Jennifer. <a href="https://www.merckmanuals.com/professional/clinical-pharmacology/pharmacokinetics/drug-bioavailability" target="_blank" rel="noopener noreferrer">“Drug Bioavailability.”</a> <cite>Merck Manual Professional Edition</cite>, Aug. 2026.</li>
        </ol></div>
      </section>
    </div>`;
  const home = main.querySelector(".body-home"), journey = main.querySelector(".body-journey");
  const header = document.getElementById("siteHeader");
  const sections = [...main.querySelectorAll(".body-chapter")];
  const trail = main.querySelector(".body-route-travelled"), bottle = main.querySelector(".body-bottle");
  const positionName = main.querySelector(".body-position-name"), positionNumber = main.querySelector(".body-position-number");
  const button = main.querySelector(".body-motion"), route = window.BODY_ROUTE.build();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 760px)");
  let paused = reduced.matches, current = 0, target = 0, direction = 1, frame = 0, lastTime = 0, stops = [], active = -1;
  for (const path of main.querySelectorAll(".body-route-base, .body-route-travelled")) {
    path.setAttribute("d", route.d);
    path.setAttribute("pathLength", route.totalLength);
  }
  trail.style.strokeDasharray = `${route.totalLength} ${route.totalLength}`;
  // Fixed stars stay still while the body route advances; no perpetual animation.
  let seed = 2026;
  const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
  const stars = document.createDocumentFragment();
  for (let i = 0; i < 160; i++) {
    const star = document.createElement("i");
    star.className = `body-star${i % 19 ? "" : " body-star--warm"}`;
    star.style.cssText = `left:${random() * 99}%;top:${random() * 100}%`;
    stars.appendChild(star);
  }
  main.querySelector(".body-stars").appendChild(stars);
  function draw() {
    const p = window.BODY_ROUTE.pose(route, current, direction);
    const shrink = Math.min(1, current / 110);
    const scale = 1 - shrink * (compact.matches ? .27 : .45);
    bottle.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${p.angle.toFixed(2)}) scale(${scale.toFixed(3)})`);
    trail.style.strokeDashoffset = String(route.totalLength - current);
    const found = route.phases.findIndex(phase => current < phase.end - .1);
    const index = found < 0 ? route.phases.length - 1 : found;
    if (index !== active) {
      active = index;
      positionName.textContent = route.phases[index].label;
      positionNumber.textContent = `0${index + 1} / 05`;
      home.dataset.stage = route.phases[index].id;
    }
  }
  function animate(time) {
    frame = 0;
    if (paused || document.hidden) return;
    const delta = target - current;
    if (Math.abs(delta) > .02) direction = delta > 0 ? 1 : -1;
    const dt = Math.min(64, Math.max(1, time - lastTime));
    lastTime = time;
    current += delta * (1 - Math.exp(-dt / 80));
    if (Math.abs(target - current) < .05) current = target;
    draw();
    if (current !== target) frame = requestAnimationFrame(animate);
  }
  function updateTarget() {
    if (!stops.length) return;
    target = window.BODY_ROUTE.distanceAtScroll(route, stops, window.scrollY);
    if (!paused && !frame) { lastTime = performance.now(); frame = requestAnimationFrame(animate); }
  }
  function measure() {
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    home.style.setProperty("--body-header", `${headerHeight}px`);
    stops = sections.map(section => section.getBoundingClientRect().top + window.scrollY - headerHeight);
    // Finish while the final chapter and complete body are both still visible.
    const last = sections[sections.length - 1];
    const available = Math.max(1, last.offsetHeight - (window.innerHeight - headerHeight) * .45);
    stops.push(stops[stops.length - 1] + available);
    updateTarget();
    if (!paused) current = target;
    draw();
  }
  function syncMotion() {
    home.classList.toggle("is-paused", paused);
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "Resume motion" : "Pause motion";
    if (paused && frame) { cancelAnimationFrame(frame); frame = 0; }
    else updateTarget();
  }
  button.addEventListener("click", () => { paused = !paused; syncMotion(); });
  reduced.addEventListener("change", event => { paused = event.matches; syncMotion(); });
  window.addEventListener("scroll", updateTarget, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("pageshow", measure);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) updateTarget(); });
  new ResizeObserver(measure).observe(journey);
  if (header) new ResizeObserver(measure).observe(header);
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle("is-visible", entry.isIntersecting);
  }, { threshold: .18 });
  sections.forEach(section => reveal.observe(section));
  syncMotion();
  measure();
})();
