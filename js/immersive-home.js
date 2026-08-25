(function () {
  if (document.body.dataset.page !== "home") return;

  const hero = document.getElementById("renataHero");
  const story = document.getElementById("renataProjectStory");
  const storyLayout = story?.querySelector(".renata-story-layout");
  const main = document.getElementById("siteMain");

  if (!hero || !story || !storyLayout || !main) return;

  hero.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="renata-bio-layer" aria-hidden="true">
        <svg class="renata-bio-orbit" viewBox="0 0 700 700">
          <circle class="orbit-ring" cx="350" cy="350" r="270"></circle>
          <circle class="orbit-ring secondary" cx="350" cy="350" r="205"></circle>

          <g transform="translate(350 350)">
            <line class="molecule-bond" x1="-92" y1="-22" x2="-40" y2="-66"></line>
            <line class="molecule-bond" x1="-40" y1="-66" x2="24" y2="-44"></line>
            <line class="molecule-bond" x1="24" y1="-44" x2="70" y2="12"></line>
            <line class="molecule-bond" x1="70" y1="12" x2="44" y2="78"></line>
            <line class="molecule-bond" x1="44" y1="78" x2="-28" y2="82"></line>
            <line class="molecule-bond" x1="-28" y1="82" x2="-76" y2="35"></line>
            <line class="molecule-bond" x1="-76" y1="35" x2="-92" y2="-22"></line>

            <circle class="molecule-node" cx="-92" cy="-22" r="10"></circle>
            <circle class="molecule-node cool" cx="-40" cy="-66" r="8"></circle>
            <circle class="molecule-node small" cx="24" cy="-44" r="7"></circle>
            <circle class="molecule-node" cx="70" cy="12" r="11"></circle>
            <circle class="molecule-node cool" cx="44" cy="78" r="9"></circle>
            <circle class="molecule-node small" cx="-28" cy="82" r="7"></circle>
            <circle class="molecule-node" cx="-76" cy="35" r="9"></circle>
          </g>
        </svg>

        <svg class="renata-feather-ribbon" viewBox="0 0 760 360">
          <path class="feather-main" d="M28 312 C 126 246, 182 146, 282 90 C 396 27, 518 58, 720 20"></path>
          <path class="feather-vein" d="M116 250 C 164 255, 202 267, 248 300"></path>
          <path class="feather-vein" d="M176 190 C 223 187, 271 198, 318 229"></path>
          <path class="feather-vein" d="M248 124 C 300 118, 348 129, 397 155"></path>
          <path class="feather-vein" d="M334 79 C 382 86, 424 103, 460 128"></path>
          <path class="feather-vein" d="M420 61 C 462 74, 496 94, 527 121"></path>
        </svg>
      </div>

      <div class="renata-hero-label">LCA · PAPS · PAP · SULFATION</div>
    `
  );

  story.insertAdjacentHTML(
    "afterbegin",
    `<div class="renata-story-chapter" aria-hidden="true">PATHWAY / STORY</div>`
  );

  storyLayout.insertAdjacentHTML(
    "beforeend",
    `
      <svg class="renata-pathway-overlay" id="renataPathwayOverlay" viewBox="0 0 1200 700" aria-hidden="true">
        <path
          class="pathway-line"
          d="M180 570 C 310 490, 405 500, 505 410 C 610 315, 720 335, 800 245 C 880 155, 978 178, 1060 104"
        ></path>
        <path
          class="pathway-flow"
          id="renataPathwayFlow"
          d="M180 570 C 310 490, 405 500, 505 410 C 610 315, 720 335, 800 245 C 880 155, 978 178, 1060 104"
        ></path>
        <circle class="pathway-tracer" id="renataPathwayTracer" cx="180" cy="570" r="6"></circle>
        <text class="pathway-label" x="148" y="600">LCA</text>
        <text class="pathway-label" x="490" y="448">PAPS</text>
        <text class="pathway-label" x="785" y="279">MbtSult</text>
        <text class="pathway-label" x="1034" y="88">SULFLUX</text>
      </svg>
    `
  );

  story.insertAdjacentHTML(
    "afterend",
    `
      <section class="renata-system-strip" aria-labelledby="renataSystemTitle">
        <svg class="renata-system-object one" viewBox="0 0 180 180" aria-hidden="true">
          <circle cx="90" cy="90" r="70" fill="none" stroke="#071224" stroke-width="2" stroke-dasharray="5 8"></circle>
          <circle cx="90" cy="90" r="8" fill="#d9530b"></circle>
          <circle cx="45" cy="66" r="6" fill="#071224"></circle>
          <circle cx="132" cy="116" r="5" fill="#071224"></circle>
          <line x1="45" y1="66" x2="90" y2="90" stroke="#071224" stroke-width="2"></line>
          <line x1="90" y1="90" x2="132" y2="116" stroke="#071224" stroke-width="2"></line>
        </svg>

        <svg class="renata-system-object two" viewBox="0 0 220 220" aria-hidden="true">
          <path d="M22 172 C 55 112, 86 62, 196 31" fill="none" stroke="#071224" stroke-width="2"></path>
          <circle cx="55" cy="121" r="7" fill="#d9530b"></circle>
          <circle cx="112" cy="75" r="5" fill="#071224"></circle>
          <circle cx="170" cy="44" r="6" fill="#071224"></circle>
        </svg>

        <div class="container renata-system-grid">
          <div>
            <p class="renata-system-kicker">THE RENATA SYSTEM</p>
            <h2 class="renata-system-title" id="renataSystemTitle">One pathway. Three layers.</h2>
          </div>

          <div class="renata-system-links">
            <a class="renata-system-link" href="wet-lab.html">
              <span class="renata-system-index">01</span>
              <span>
                <strong>Build the biology</strong>
                <small>Wet lab, engineering, protocols, and experimental evidence.</small>
              </span>
              <span class="renata-system-arrow" aria-hidden="true">→</span>
            </a>

            <a class="renata-system-link" href="dry-lab.html">
              <span class="renata-system-index">02</span>
              <span>
                <strong>Model the pathway</strong>
                <small>SimBiology, software, pathway behavior, and design decisions.</small>
              </span>
              <span class="renata-system-arrow" aria-hidden="true">→</span>
            </a>

            <a class="renata-system-link" href="human-practices.html">
              <span class="renata-system-index">03</span>
              <span>
                <strong>Design for people</strong>
                <small>Human practices, education, engagement, and implementation context.</small>
              </span>
              <span class="renata-system-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    `
  );

  const pathway = document.getElementById("renataPathwayFlow");
  const tracer = document.getElementById("renataPathwayTracer");
  const pathwayLength = pathway?.getTotalLength?.() || 0;

  if (pathway && pathwayLength) {
    pathway.style.strokeDasharray = `${pathwayLength}`;
    pathway.style.strokeDashoffset = `${pathwayLength}`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateHeroPointer(event) {
    const rect = hero.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
    const y = clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1);

    hero.style.setProperty("--renata-mx", String((x - 0.5) * 2));
    hero.style.setProperty("--renata-my", String((y - 0.5) * 2));
  }

  function resetHeroPointer() {
    hero.style.setProperty("--renata-mx", "0");
    hero.style.setProperty("--renata-my", "0");
  }

  hero.addEventListener("pointermove", updateHeroPointer, { passive: true });
  hero.addEventListener("pointerleave", resetHeroPointer);

  function updateStoryObject() {
    if (!pathway || !tracer || !pathwayLength) return;

    const rect = story.getBoundingClientRect();
    const distance = Math.max(1, story.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / distance, 0, 1);

    pathway.style.strokeDashoffset = `${pathwayLength * (1 - progress)}`;

    const point = pathway.getPointAtLength(pathwayLength * progress);
    tracer.setAttribute("cx", point.x.toFixed(2));
    tracer.setAttribute("cy", point.y.toFixed(2));
  }

  let ticking = false;

  function requestUpdate() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      ticking = false;
      updateStoryObject();
    });
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
})();
