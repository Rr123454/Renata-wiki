(function () {
  if (document.body.dataset.page !== "home") return;

  const hero = document.getElementById("renataHero");
  const story = document.getElementById("renataProjectStory");
  const main = document.getElementById("siteMain");

  if (!hero || !story || !main) return;

  story.insertAdjacentHTML(
    "afterbegin",
    `<div class="renata-story-chapter" aria-hidden="true">PATHWAY / STORY</div>`
  );

  story.insertAdjacentHTML(
    "afterend",
    `
      <section class="renata-system-strip" aria-label="The Renata system">
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
          </div>

          <div class="renata-system-links">
            <a class="renata-system-link" href="experiments.html#experiments-list">
              <span class="renata-system-index">01</span>
              <span>
                <strong>Build the biology</strong>
                <small>Wet lab, engineering, methods, and experimental evidence.</small>
              </span>
              <span class="renata-system-arrow" aria-hidden="true">→</span>
            </a>

            <a class="renata-system-link" href="experiments.html#project-model">
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

})();
