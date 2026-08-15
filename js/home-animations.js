(function () {
  if (document.body.dataset.page !== "home") return;

  const main = document.getElementById("siteMain");
  if (!main) return;

  main.innerHTML = `
    <section class="renata-cinematic-hero" id="renataHero" aria-labelledby="renataHeroTitle">
      <video
        class="renata-promo-video"
        id="renataPromoVideo"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      >
        <source
          src="assets/ULP-CA_%20Renata%20-%20Post-Cholecystectomy%20Syndrome%20(2026)%20-%20Project%20Promotion%20(1).mp4"
          type="video/mp4"
        />
      </video>

      <div class="renata-promo-shade"></div>
      <div class="renata-promo-noise"></div>

      <div class="container renata-promo-content">
        <div class="renata-promo-copy">
          <p class="renata-promo-eyebrow">iGEM Renata</p>
          <h1 class="renata-promo-title" id="renataHeroTitle">
            Rebuilding
            <span>biology.</span>
          </h1>
          <p class="renata-promo-lead">
            Explore our approach to post-cholecystectomy syndrome through synthetic biology,
            pathway engineering, modeling, and human-centered design.
          </p>

          <div class="renata-promo-actions">
            <a class="renata-film-button primary" href="#renataProjectStory">
              Explore the project <span aria-hidden="true">↓</span>
            </a>
            <button class="renata-film-button" id="renataSoundToggle" type="button" aria-pressed="false">
              Sound on
            </button>
          </div>
        </div>

        <div class="renata-promo-logo-stage" aria-hidden="true">
          <div class="renata-promo-logo-glow"></div>
          <img class="renata-promo-logo" src="assets/logo.png" alt="" />
        </div>
      </div>

      <div class="renata-scroll-cue" aria-hidden="true">Scroll to explore</div>
    </section>

    <section class="renata-project-story" id="renataProjectStory" aria-label="Renata project story">
      <div class="renata-story-sticky">
        <div class="container renata-story-layout">
          <div class="renata-story-visual">
            <div class="renata-story-frame">
              <video
                class="renata-story-video"
                id="renataStoryVideo"
                muted
                playsinline
                preload="auto"
              >
                <source src="assets/Scroll%20Animation.mp4" type="video/mp4" />
              </video>
              <div class="renata-story-progress" aria-hidden="true">
                <span id="renataStoryProgress"></span>
              </div>
              <div class="renata-story-error" id="renataStoryError" hidden>
                Scroll animation could not be loaded.
              </div>
            </div>
          </div>

          <div class="renata-story-copy">
            <article class="renata-story-step active" data-renata-story-step="0">
              <span class="renata-story-number">01 / THE PROBLEM</span>
              <h2>After surgery, the story is not always over.</h2>
              <p>
                Use this section to introduce post-cholecystectomy syndrome and the biological
                problem your team chose to investigate.
              </p>
            </article>

            <article class="renata-story-step" data-renata-story-step="1">
              <span class="renata-story-number">02 / THE GAP</span>
              <h2>Current approaches leave room to rebuild.</h2>
              <p>
                Add the limitation or unmet need that led the team toward a synthetic biology
                solution.
              </p>
            </article>

            <article class="renata-story-step" data-renata-story-step="2">
              <span class="renata-story-number">03 / RENATA</span>
              <h2>Redirecting the pathway.</h2>
              <p>
                Introduce Renata's core concept here: the pathway, engineered components, and the
                intended biological effect.
              </p>
              <a class="renata-story-link" href="project-description.html">
                Read the project description <span aria-hidden="true">→</span>
              </a>
            </article>

            <article class="renata-story-step" data-renata-story-step="3">
              <span class="renata-story-number">04 / BUILD + TEST</span>
              <h2>From design to evidence.</h2>
              <p>
                Transition into the wet-lab work, engineering cycle, modeling, and the evidence
                that will shape the next iteration.
              </p>
              <a class="renata-story-link" href="engineering.html">
                Explore engineering <span aria-hidden="true">→</span>
              </a>
            </article>

            <div class="renata-story-steps-rail" aria-hidden="true">
              <span class="renata-story-dot active" data-renata-story-dot="0"></span>
              <span class="renata-story-dot" data-renata-story-dot="1"></span>
              <span class="renata-story-dot" data-renata-story-dot="2"></span>
              <span class="renata-story-dot" data-renata-story-dot="3"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  const promoVideo = document.getElementById("renataPromoVideo");
  const soundToggle = document.getElementById("renataSoundToggle");
  const story = document.getElementById("renataProjectStory");
  const storyVideo = document.getElementById("renataStoryVideo");
  const storyProgress = document.getElementById("renataStoryProgress");
  const storyError = document.getElementById("renataStoryError");
  const steps = [...document.querySelectorAll("[data-renata-story-step]")];
  const dots = [...document.querySelectorAll("[data-renata-story-dot]")];

  if (promoVideo && soundToggle) {
    promoVideo.muted = true;
    soundToggle.addEventListener("click", async () => {
      promoVideo.muted = !promoVideo.muted;
      soundToggle.setAttribute("aria-pressed", String(!promoVideo.muted));
      soundToggle.textContent = promoVideo.muted ? "Sound on" : "Mute";
      if (promoVideo.paused) {
        try {
          await promoVideo.play();
        } catch (error) {
          console.warn("Promo video playback was blocked by the browser.", error);
        }
      }
    });
  }

  if (!story || !storyVideo) return;

  let metadataReady = false;
  let ticking = false;
  let targetTime = 0;

  storyVideo.pause();

  storyVideo.addEventListener("loadedmetadata", () => {
    metadataReady = Number.isFinite(storyVideo.duration) && storyVideo.duration > 0;
    if (metadataReady) {
      storyVideo.currentTime = 0;
      updateStory();
    }
  });

  storyVideo.addEventListener("error", () => {
    if (storyError) storyError.hidden = false;
  });

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateStoryStep(progress) {
    const stepIndex = clamp(Math.floor(progress * steps.length), 0, steps.length - 1);

    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === stepIndex);
    });
  }

  function updateStory() {
    ticking = false;

    const rect = story.getBoundingClientRect();
    const scrollableDistance = Math.max(1, story.offsetHeight - window.innerHeight);
    const travelled = -rect.top;
    const progress = clamp(travelled / scrollableDistance, 0, 1);

    if (storyProgress) {
      storyProgress.style.width = `${progress * 100}%`;
    }

    updateStoryStep(progress);

    if (!metadataReady) return;

    const safeDuration = Math.max(0, storyVideo.duration - 0.035);
    targetTime = progress * safeDuration;

    if (Math.abs(storyVideo.currentTime - targetTime) > 0.018) {
      try {
        storyVideo.currentTime = targetTime;
      } catch (error) {
        // Some browsers reject seeks until enough media is buffered. The next scroll frame retries.
      }
    }
  }

  function requestStoryUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateStory);
  }

  window.addEventListener("scroll", requestStoryUpdate, { passive: true });
  window.addEventListener("resize", requestStoryUpdate);
  window.addEventListener("load", requestStoryUpdate);
  requestStoryUpdate();
})();
