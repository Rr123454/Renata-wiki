(function () {
  if (document.body.dataset.page !== "home") return;

  const hero = document.getElementById("renataHero");
  const story = document.getElementById("renataProjectStory");
  const storyLayout = story?.querySelector(".renata-story-layout");
  const main = document.getElementById("siteMain");

  if (!hero || !story || !storyLayout || !main) return;

  /* The pathway overlay is the one piece of homepage motion that carries
     information: it draws the real LCA -> PAPS -> MbtSult -> SULFLUX route
     and advances a tracer along it as you scroll. The drifting molecule
     SVG, the feather ribbon, the vertical hero label and the chapter
     marker that used to be injected here were ambient decoration and are
     gone. */
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
        <circle class="pathway-tracer" id="renataPathwayTracer" cx="180" cy="570" r="5"></circle>
        <text class="pathway-label" x="148" y="600">LCA</text>
        <text class="pathway-label" x="490" y="448">PAPS</text>
        <text class="pathway-label" x="785" y="279">MbtSult</text>
        <text class="pathway-label" x="1034" y="88">SULFLUX</text>
      </svg>
    `
  );

  /* The handoff. data-theme="document" is what makes this section flip to
     the light palette AND bring the matching ink with it. Setting only the
     background here is what made the headline invisible before. */
  story.insertAdjacentHTML(
    "afterend",
    `
      <section class="renata-system-strip" data-theme="document" aria-labelledby="renataSystemTitle">
        <div class="container renata-system-grid">
          <div>
            <p class="renata-system-kicker">The Renata system</p>
            <h2 class="renata-system-title" id="renataSystemTitle">One pathway. Three layers.</h2>
          </div>

          <div class="renata-system-links">
            <a class="renata-system-link" href="experiments.html">
              <span class="renata-system-index">01</span>
              <span>
                <strong>Build the biology</strong>
                <small>Experiments, protocols, engineering cycles, and the evidence behind them.</small>
              </span>
              <span class="renata-system-arrow" aria-hidden="true">&rarr;</span>
            </a>

            <a class="renata-system-link" href="model.html">
              <span class="renata-system-index">02</span>
              <span>
                <strong>Model the pathway</strong>
                <small>Assumptions, predictions, and the design decisions the model changed.</small>
              </span>
              <span class="renata-system-arrow" aria-hidden="true">&rarr;</span>
            </a>

            <a class="renata-system-link" href="human-practices.html">
              <span class="renata-system-index">03</span>
              <span>
                <strong>Design for people</strong>
                <small>Human practices, education, and the implementation context.</small>
              </span>
              <span class="renata-system-arrow" aria-hidden="true">&rarr;</span>
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
