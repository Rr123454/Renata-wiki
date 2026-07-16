(function () {
  document.body.classList.add("js-animate");

  const data = window.SITE_DATA;
  const pageKey = document.body.dataset.page || "home";
  const pageData = data.pages[pageKey] || data.pages.home;

  document.title = `${stripHtml(pageData.title)} | iGEM Renata`;

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
    if (!header) return;

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
          ${data.nav.map(renderNavItem).join("")}
        </nav>
      </div>
    `;
  }

  function renderNavItem(item) {
    const isMainActive = pageData.group === item.key || pageKey === item.key;

    if (!item.children) {
      return `
        <a href="${item.href}" class="tab-link magnetic ${isMainActive ? "active" : ""}" data-magnetic>
          ${item.label}
        </a>
      `;
    }

    return `
      <div class="nav-item">
        <a href="${item.href}" class="tab-link dropdown-toggle magnetic ${isMainActive ? "active" : ""}" data-magnetic>
          ${item.label}
        </a>

        <div class="dropdown-menu">
          ${item.children
            .map(
              (child) => `
                <a href="${child.href}" class="${pageKey === child.key ? "sub-active" : ""}">
                  ${child.label}
                </a>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderMain() {
    const main = document.getElementById("siteMain");
    if (!main) return;

    if (pageKey === "home") {
      main.innerHTML = renderHomePage();
    } else {
      main.innerHTML = renderStandardPage();
    }
  }

  function renderHomePage() {
    return `
      <section class="page-hero" id="pageHero">
        <div class="hero-beam" id="heroBeam"></div>

        <div class="container home-hero-grid">
          <div class="hero-copy reveal">
            <p class="hero-kicker">${pageData.kicker}</p>
            <h1 class="hero-title">${pageData.title}</h1>
            <p class="hero-lead">${pageData.lead}</p>
            ${renderButtons(pageData.buttons)}
            ${renderStats(pageData.stats)}
          </div>

          <div class="home-logo-stage reveal delay-1">
            <div class="logo-glow"></div>
            <div class="logo-orbit-ring"></div>
            <div class="logo-orbit-ring-2"></div>
            <div class="logo-orbit-ring-3"></div>

            <div class="logo-core tilt-card" id="logoCore">
              <img src="assets/logo.png" alt="iGEM Renata logo large" />
            </div>
          </div>
        </div>
      </section>

      <section class="page-section">
        <div class="container">
          <div class="section-intro reveal">
            <h2 class="section-title">${pageData.cardsTitle}</h2>
            <p class="section-lead">${pageData.cardsLead}</p>
          </div>

          <div class="card-grid">
            ${pageData.cards.map(renderCard).join("")}
          </div>
        </div>
      </section>

      <section class="page-section">
        <div class="container">
          <div class="cta-panel reveal tilt-card">
            <h2>${pageData.ctaTitle}</h2>
            <p>${pageData.ctaText}</p>
            <a href="${pageData.ctaButton.href}" class="btn btn-${pageData.ctaButton.style || "primary"} magnetic" data-magnetic>
              ${pageData.ctaButton.text}
            </a>
          </div>
        </div>
      </section>
    `;
  }

  function renderStandardPage() {
    return `
      <section class="page-hero" id="pageHero">
        <div class="hero-beam" id="heroBeam"></div>

        <div class="container page-hero-grid">
          <div class="hero-copy reveal">
            <p class="hero-kicker">${pageData.kicker}</p>
            <h1 class="hero-title">${pageData.title}</h1>
            <p class="hero-lead">${pageData.lead}</p>
            ${renderButtons(pageData.buttons)}
          </div>
        </div>
      </section>

      <section class="page-section">
        <div class="container">
          <div class="section-intro reveal">
            <h2 class="section-title">${pageData.cardsTitle}</h2>
            <p class="section-lead">${pageData.cardsLead}</p>
          </div>

          <div class="card-grid">
            ${pageData.cards.map(renderCard).join("")}
          </div>
        </div>
      </section>

      <section class="page-section">
        <div class="container">
          <div class="cta-panel reveal tilt-card">
            <h2>${pageData.ctaTitle}</h2>
            <p>${pageData.ctaText}</p>
            <a href="${pageData.ctaButton.href}" class="btn btn-${pageData.ctaButton.style || "primary"} magnetic" data-magnetic>
              ${pageData.ctaButton.text}
            </a>
          </div>
        </div>
      </section>
    `;
  }

  function renderCard(card, index) {
    const delayClass = index === 1 ? "delay-1" : index === 2 ? "delay-2" : "";
    return `
      <article class="glass-card reveal tilt-card ${delayClass}">
        ${card.tag ? `<div class="card-tag">${card.tag}</div>` : ""}
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      </article>
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

  function renderFooter() {
    const footer = document.getElementById("siteFooter");
    if (!footer) return;

    footer.innerHTML = `
      <div class="container footer-inner">
        <p>© 2026 iGEM Renata. All rights reserved.</p>
        <p>Multi-page wiki • dropdown nav • simplified content</p>
      </div>
    `;
  }

  function initEffects() {
    const progressBar = document.getElementById("progressBar");
    const scrollRailFill = document.getElementById("scrollRailFill");
    const scrollRailThumb = document.getElementById("scrollRailThumb");
    const siteHeader = document.getElementById("siteHeader");
    const hero = document.getElementById("pageHero");
    const heroBeam = document.getElementById("heroBeam");
    const cursorRing = document.getElementById("cursorRing");
    const cursorDot = document.getElementById("cursorDot");
    const emberField = document.getElementById("emberField");
    const revealEls = [...document.querySelectorAll(".reveal")];
    const magneticEls = [...document.querySelectorAll("[data-magnetic]")];
    const tiltEls = [...document.querySelectorAll(".tilt-card")];
    const interactiveEls = [...document.querySelectorAll("a, button, .tilt-card, .glass-card, .logo-core")];
    const logoCore = document.getElementById("logoCore");

    createEmbers(22);

    let observer = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
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
    }

    requestAnimationFrame(() => {
      revealEls.forEach((el) => el.classList.add("show"));
    });

    function updateScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) : 0;

      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }

      if (scrollRailFill) {
        scrollRailFill.style.height = `${progress * 100}%`;
      }

      if (scrollRailThumb) {
        const railHeight = 240;
        const thumbY = progress * (railHeight - 22);
        scrollRailThumb.style.transform = `translate(-50%, ${thumbY}px)`;
      }

      if (siteHeader) {
        if (scrollTop > 20) siteHeader.classList.add("scrolled");
        else siteHeader.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("load", updateScroll);
    updateScroll();

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

        el.style.transform = `translate(${x * 0.10}px, ${y * 0.10}px)`;
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

        el.style.transform = `perspective(950px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });

    if (logoCore) {
      logoCore.addEventListener("mousemove", (e) => {
        if (window.innerWidth <= 768) return;

        const rect = logoCore.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * -13;
        const rotateY = ((x / rect.width) - 0.5) * 13;

        logoCore.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.01)`;
      });

      logoCore.addEventListener("mouseleave", () => {
        logoCore.style.transform = "";
      });
    }

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
      if (!cursorRing || !cursorDot) return;

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
      el.addEventListener("mouseenter", () => {
        if (cursorRing) cursorRing.classList.add("active");
      });

      el.addEventListener("mouseleave", () => {
        if (cursorRing) cursorRing.classList.remove("active");
      });
    });

    animateCursor();

    function createEmbers(count) {
      if (!emberField) return;

      for (let i = 0; i < count; i += 1) {
        const ember = document.createElement("span");
        ember.className = "ember";
        ember.style.left = `${Math.random() * 100}%`;
        ember.style.top = `${55 + Math.random() * 46}%`;
        ember.style.animationDuration = `${6 + Math.random() * 8}s`;
        ember.style.animationDelay = `${Math.random() * 8}s`;
        ember.style.width = `${5 + Math.random() * 8}px`;
        ember.style.height = ember.style.width;
        emberField.appendChild(ember);
      }
    }
  }
})();