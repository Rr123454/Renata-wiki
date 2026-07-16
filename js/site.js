(function () {
  const data = window.SITE_DATA;
  const pageKey = document.body.dataset.page || "home";
  const pageData = data.pages[pageKey] || data.pages.home;

  document.title = `${stripHtml(pageData.heading)} | iGEM Renata`;

  renderHeader();
  renderMain();
  renderFooter();
  initEffects();

  function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  function renderHeader() {
    const header = document.getElementById("siteHeader");

    header.innerHTML = `
      <div class="container header-inner">
        <div class="brand-row">
          <a href="index.html" class="brand magnetic" data-magnetic>
            <div class="brand-logo-wrap">
              <img src="assets/logo.png" alt="iGEM Renata logo" class="brand-logo" />
            </div>
            <div class="brand-text">
              <h1>${data.brand.title}</h1>
              <p>${data.brand.subtitle}</p>
            </div>
          </a>

          <div class="header-tag">Phoenix / Rebirth / Judge-first</div>
        </div>

        <nav class="tabs-row">
          ${data.nav
            .map(
              (item) => `
                <a
                  href="${item.href}"
                  class="tab-link magnetic ${item.key === pageKey ? "active" : ""}"
                  data-magnetic
                >
                  ${item.label}
                </a>
              `
            )
            .join("")}
        </nav>
      </div>
    `;
  }

  function renderMain() {
    const main = document.getElementById("siteMain");

    main.innerHTML = `
      <section class="page-hero" id="pageHero">
        <div class="hero-beam" id="heroBeam"></div>
        <div class="container hero-grid">
          <div class="hero-copy reveal">
            <p class="hero-kicker">${pageData.kicker}</p>
            <h1 class="hero-title">${pageData.heading}</h1>
            <p class="hero-lead">${pageData.lead}</p>

            ${renderButtons(pageData.buttons)}
            ${renderStats(pageData.stats)}
          </div>

          <aside class="hero-spotlight reveal delay-1 tilt-card">
            <p class="spotlight-label">${pageData.spotlight.label}</p>
            <h2>${pageData.spotlight.title}</h2>
            <p>${pageData.spotlight.text}</p>

            <ul class="spotlight-list">
              ${pageData.spotlight.points.map((point) => `<li>${point}</li>`).join("")}
            </ul>

            <div class="spotlight-links">
              ${pageData.spotlight.links
                .map((link) => `<a href="${link.href}">${link.text}</a>`)
                .join("")}
            </div>
          </aside>
        </div>
      </section>

      <section class="page-section">
        <div class="container">
          <div class="section-intro reveal">
            <p class="section-label">${pageData.cardsLabel}</p>
            <h2 class="section-title">${pageData.cardsTitle}</h2>
            <p class="section-lead">${pageData.cardsLead}</p>
          </div>

          <div class="card-grid">
            ${pageData.cards
              .map(
                (card, index) => `
                  <article class="glass-card reveal tilt-card ${index === 1 ? "delay-1" : index === 2 ? "delay-2" : ""}">
                    ${card.tag ? `<div class="card-tag">${card.tag}</div>` : ""}
                    <h3>${card.title}</h3>
                    <p>${card.text}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="page-section alt">
        <div class="container feature-grid">
          <div class="feature-copy reveal">
            <p class="section-label">${pageData.feature.label}</p>
            <h2 class="section-title">${pageData.feature.title}</h2>
            <p class="section-lead">${pageData.feature.text}</p>

            <ul class="bullet-list">
              ${pageData.feature.bullets.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>

          <div class="feature-note reveal delay-1 tilt-card">
            <p class="note-label">${pageData.feature.noteLabel}</p>
            <h3>${pageData.feature.noteTitle}</h3>
            <p>${pageData.feature.noteText}</p>
          </div>
        </div>
      </section>

      <section class="page-section">
        <div class="container">
          <div class="section-intro reveal">
            <p class="section-label">${pageData.timeline.label}</p>
            <h2 class="section-title">${pageData.timeline.title}</h2>
          </div>

          <div class="timeline-grid">
            ${pageData.timeline.items
              .map(
                (item, index) => `
                  <article class="timeline-item reveal ${index === 1 ? "delay-1" : index >= 2 ? "delay-2" : ""}">
                    <div class="timeline-step">${index + 1}</div>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="page-section">
        <div class="container">
          <div class="cta-panel reveal tilt-card">
            <h2>${pageData.cta.title}</h2>
            <p>${pageData.cta.text}</p>
            <a href="${pageData.cta.button.href}" class="btn btn-${pageData.cta.button.style || "primary"} magnetic" data-magnetic>
              ${pageData.cta.button.text}
            </a>
          </div>
        </div>
      </section>
    `;
  }

  function renderFooter() {
    const footer = document.getElementById("siteFooter");

    footer.innerHTML = `
      <div class="container footer-inner">
        <p>© 2026 iGEM Renata. All rights reserved.</p>
        <p>System font stack • multi-page structure • judge-first navigation</p>
      </div>
    `;
  }

  function renderButtons(buttons = []) {
    if (!buttons.length) return "";

    return `
      <div class="hero-actions">
        ${buttons
          .map(
            (button) => `
              <a href="${button.href}" class="btn btn-${button.style || "primary"} magnetic" data-magnetic>
                ${button.text}
              </a>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderStats(stats = []) {
    if (!stats.length) return "";

    return `
      <div class="hero-stats">
        ${stats
          .map(
            (stat) => `
              <div class="stat-card">
                <strong>${stat.value}</strong>
                <span>${stat.label}</span>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function initEffects() {
    const progressBar = document.getElementById("progressBar");
    const siteHeader = document.getElementById("siteHeader");
    const hero = document.getElementById("pageHero");
    const heroBeam = document.getElementById("heroBeam");
    const cursorRing = document.getElementById("cursorRing");
    const cursorDot = document.getElementById("cursorDot");
    const emberField = document.getElementById("emberField");
    const revealEls = [...document.querySelectorAll(".reveal")];
    const magneticEls = [...document.querySelectorAll("[data-magnetic]")];
    const tiltEls = [...document.querySelectorAll(".tilt-card")];
    const interactiveEls = [...document.querySelectorAll("a, button, .tilt-card, .glass-card")];

    createEmbers(18);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));

    function updateScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      progressBar.style.width = `${progress}%`;

      if (scrollTop > 20) {
        siteHeader.classList.add("scrolled");
      } else {
        siteHeader.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("load", updateScroll);

    if (hero && heroBeam) {
      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        heroBeam.style.setProperty("--spotlight-x", `${x}%`);
        heroBeam.style.setProperty("--spotlight-y", `${y}%`);
      });

      hero.addEventListener("mouseleave", () => {
        heroBeam.style.setProperty("--spotlight-x", "62%");
        heroBeam.style.setProperty("--spotlight-y", "28%");
      });
    }

    magneticEls.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        if (window.innerWidth <= 768) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });

    tiltEls.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        if (window.innerWidth <= 768) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * -10;
        const rotateY = ((x / rect.width) - 0.5) * 10;

        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      dotX += (mouseX - dotX) * 0.34;
      dotY += (mouseY - dotY) * 0.34;

      if (window.innerWidth > 768) {
        cursorRing.style.transform = `translate(${ringX - 21}px, ${ringY - 21}px)`;
        cursorDot.style.transform = `translate(${dotX - 5}px, ${dotY - 5}px)`;
      }

      requestAnimationFrame(animateCursor);
    }

    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
    });

    animateCursor();

    function createEmbers(count) {
      for (let i = 0; i < count; i += 1) {
        const ember = document.createElement("span");
        ember.className = "ember";
        ember.style.left = `${Math.random() * 100}%`;
        ember.style.top = `${58 + Math.random() * 44}%`;
        ember.style.animationDuration = `${7 + Math.random() * 8}s`;
        ember.style.animationDelay = `${Math.random() * 8}s`;
        ember.style.width = `${5 + Math.random() * 7}px`;
        ember.style.height = ember.style.width;
        emberField.appendChild(ember);
      }
    }
  }
})();