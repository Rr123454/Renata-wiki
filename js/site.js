(function () {
  document.body.classList.add("js-animate");

  const data = window.SITE_DATA;
  const pageKey = document.body.dataset.page || "home";
  const pageData = data.pages[pageKey] || data.pages.home;

  document.title = `${stripHtml(pageData.title)} | iGEM Renata`;

  renderHeader();
  initNavigation();
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
        <a href="index.html" class="brand magnetic" data-magnetic>
          <div class="brand-logo-wrap">
            <img src="assets/logo.png" alt="iGEM Renata logo" class="brand-logo" />
          </div>
          <div class="brand-text">
            <h1>${data.brand.title}</h1>
          </div>
        </a>

        <nav class="tabs-row">
          ${data.nav.map(renderNavItem).join("")}
        </nav>
      </div>
    `;
  }

  function renderNavItem(item) {
    const isMainActive = navItemIsActive(item);

    if (!item.children) {
      return `
        <a href="${item.href}" class="tab-link magnetic ${isMainActive ? "active" : ""}" data-magnetic>
          ${item.label}
        </a>
      `;
    }

  return `
    <div class="nav-item click-menu ${item.menuOnly ? "menu-only" : ""}">
        ${item.menuOnly ? `
          <button type="button" class="tab-link dropdown-toggle nav-menu-button magnetic ${isMainActive ? "active" : ""}" data-magnetic data-home-href="${item.href}" aria-haspopup="true" aria-expanded="false">
            ${item.label}
          </button>
        ` : `
          <a href="${item.href}" class="tab-link dropdown-toggle nav-dropdown-link magnetic ${isMainActive ? "active" : ""}" data-magnetic aria-haspopup="true" aria-expanded="false">
            ${item.label}
          </a>
        `}

        <div class="dropdown-menu">
          ${item.children.map(renderDropdownChild).join("")}
        </div>
      </div>
    `;
  }

function initNavigation() {
  const menuButtons = [...document.querySelectorAll(".nav-menu-button")];
  const dropdownLinks = [...document.querySelectorAll(".nav-dropdown-link")];
  const submenuLinks = [...document.querySelectorAll(".submenu-nav-link")];
  const tabsRow = document.querySelector(".tabs-row");
  const topLevelTriggers = [
    ...document.querySelectorAll(
      ".tabs-row > .tab-link, .tabs-row > .nav-item > .tab-link"
    ),
  ];

  function setMenuState(item, isOpen) {
    if (!item) return;
    item.classList.toggle("dropdown-open", isOpen);
    item.querySelector(":scope > .tab-link")?.setAttribute("aria-expanded", String(isOpen));
  }

  function setSubmenuState(item, isOpen) {
    if (!item) return;
    item.classList.toggle("submenu-open", isOpen);
    item.querySelector(":scope > .submenu-trigger")?.setAttribute("aria-expanded", String(isOpen));
  }

  function closeSubmenus(except = null) {
    document.querySelectorAll(".submenu-item.submenu-open").forEach((item) => {
      if (item === except) return;
      setSubmenuState(item, false);
    });
  }

  function closeMenus(except = null) {
    document.querySelectorAll(".nav-item.dropdown-open").forEach((item) => {
      if (item === except) return;
      setMenuState(item, false);
    });

    if (!except) closeSubmenus();
  }

  function clearNavigationFocus(except = null) {
    const focused = document.activeElement;
    if (!(focused instanceof HTMLElement) || !tabsRow?.contains(focused) || focused === except) return;
    focused.blur();
  }

  menuButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const item = button.closest(".nav-item");
      closeMenus(item);
      closeSubmenus();
      setMenuState(item, true);
    });

    button.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const item = button.closest(".nav-item");
      closeMenus(item);
      closeSubmenus();
      setMenuState(item, true);
      window.location.assign(button.dataset.homeHref);
    });
  });

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const item = link.closest(".nav-item");
      event.preventDefault();
      event.stopPropagation();

      closeMenus(item);
      closeSubmenus();
      setMenuState(item, true);
    });

    link.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const item = link.closest(".nav-item");
      closeMenus(item);
      closeSubmenus();
      setMenuState(item, true);
      window.location.assign(link.href);
    });
  });

  submenuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const item = link.closest(".submenu-item");
      event.preventDefault();
      event.stopPropagation();

      closeSubmenus(item);
      setSubmenuState(item, true);
    });

    link.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const item = link.closest(".submenu-item");
      closeSubmenus(item);
      setSubmenuState(item, true);
      window.location.assign(link.href);
    });

    link.addEventListener("mouseenter", () => {
      tabsRow?.classList.remove("nav-hover-suppressed");
      clearNavigationFocus(link);
      closeSubmenus(link.closest(".submenu-item"));
    });
  });

  topLevelTriggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => {
      tabsRow?.classList.remove("nav-hover-suppressed");
      clearNavigationFocus(trigger);
      closeMenus(trigger.closest(".nav-item"));
      closeSubmenus();
    });
  });

  window.addEventListener("scroll", () => {
    tabsRow?.classList.add("nav-hover-suppressed");
    clearNavigationFocus();
    closeMenus();
  }, { passive: true });

  tabsRow?.addEventListener("focusin", () => {
    tabsRow.classList.remove("nav-hover-suppressed");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      clearNavigationFocus();
      closeMenus();
    }
  });
}

  function navItemIsActive(item) {
    if (pageData.group === item.key || pageKey === item.key) return true;
    return Boolean(item.children?.some(navItemIsActive));
  }

  function renderDropdownChild(child) {
    const isActive = navItemIsActive(child);

    if (!child.children) {
      return `
        <a href="${child.href}" class="${isActive ? "sub-active" : ""}">
          ${child.label}
        </a>
      `;
    }

    return `
      <div class="submenu-item">
        <a href="${child.href}" class="submenu-trigger submenu-nav-link ${isActive ? "sub-active" : ""}" aria-haspopup="true" aria-expanded="false">
          <span><strong>${child.label}</strong>${child.description ? `<small>${child.description}</small>` : ""}</span>
          <span class="submenu-arrow" aria-hidden="true">‹</span>
        </a>
        <div class="submenu-menu">
          ${child.children.map(renderDropdownChild).join("")}
        </div>
      </div>
    `;
  }

  function renderMain() {
    const main = document.getElementById("siteMain");
    if (!main) return;

    if (pageKey === "home") {
      main.innerHTML = renderHomePage();
    } else if (pageKey === "team") {
      main.innerHTML = renderTeamPage();
    } else if (pageKey === "project-description") {
      main.innerHTML = renderProjectDescriptionPage();
    } else {
      main.innerHTML = renderStandardPage();
    }
  }

  function renderTeamPage() {
    return `
      <section class="page-hero" id="pageHero">
        <div class="hero-beam" id="heroBeam"></div>
        <div class="container page-hero-grid">
          <div class="hero-copy reveal">
            <p class="hero-kicker">${pageData.kicker}</p>
            <h1 class="hero-title">${pageData.title}</h1>
            <p class="hero-lead">${pageData.lead}</p>
          </div>
        </div>
      </section>

      <section class="page-section team-photo-section">
        <div class="container">
          <div class="team-photo-placeholder reveal" role="img" aria-label="Placeholder for ${pageData.teamPhoto.imageLabel}">
            <span class="team-photo-mark" aria-hidden="true">+</span>
            <strong>${pageData.teamPhoto.imageLabel}</strong>
            <small>Panoramic image space</small>
          </div>
          <div class="section-intro team-photo-caption reveal">
            <h2 class="section-title">${pageData.teamPhoto.title}</h2>
            <p class="section-lead">${pageData.teamPhoto.text}</p>
          </div>
        </div>
      </section>

      <div class="team-roster">
        ${pageData.teamGroups.map(renderTeamGroup).join("")}
      </div>

      ${renderDetailSections(pageData.details)}
    `;
  }

  function renderTeamGroup(group, groupIndex) {
    const cards = Array.from({ length: group.slots }, (_, index) => renderMemberPlaceholder(group, index));
    return `
      <section class="page-section team-group-section ${groupIndex % 2 ? "team-group-alt" : ""}" id="${group.key}">
        <div class="container">
          <div class="team-group-heading reveal">
            <div>
              <p class="detail-eyebrow">Our Team</p>
              <h2>${group.title}</h2>
            </div>
            <p>${group.description}</p>
          </div>
          <div class="member-grid ${group.key === "supervisors" ? "supervisor-grid" : "department-grid"}">
            ${cards.join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderMemberPlaceholder(group, index) {
    const delayClass = index % 3 === 1 ? "delay-1" : index % 3 === 2 ? "delay-2" : "";
    return `
      <article class="member-card reveal ${delayClass}">
        <div class="member-photo-placeholder" role="img" aria-label="Photo placeholder for ${group.memberLabel} ${index + 1}">
          <span aria-hidden="true">+</span>
        </div>
        <div class="member-meta">
          <h3>Member Name</h3>
          <p>${group.memberLabel}</p>
        </div>
      </article>
    `;
  }

  function renderHomePage() {
    return `
      <section class="home-video-hero" aria-labelledby="homeVideoTitle">
        <div class="home-video-frame">
          <div class="home-video-placeholder">
            <span class="home-video-play" aria-hidden="true">▶</span>
            <h1 id="homeVideoTitle">Featured video</h1>
            <p>Homepage video placeholder</p>
          </div>
        </div>
      </section>
    `;
  }

  function renderProjectDescriptionPage() {
    const rationale = pageData.details?.[0] || {};
    const agencyCards = pageData.cards || [];

    return `
      <section class="page-hero" id="project-description">
        <div class="hero-beam" id="heroBeam"></div>

        <div class="container home-hero-grid">
          <div class="hero-copy reveal">
            <p class="hero-kicker">${pageData.kicker}</p>
            <h1 class="hero-title">${pageData.title}</h1>
            <p class="hero-lead">${pageData.lead}</p>
          </div>

          <article class="project-explanation-placeholder reveal delay-1">
            <div class="project-explanation-heading">
              <span class="project-explanation-mark" aria-hidden="true">+</span>
              <p class="detail-eyebrow">Project abstract</p>
            </div>
            <h2>Renata at a glance</h2>
            <p>
              Renata explores a two-cassette synthetic biology strategy for LCA sulfation,
              pairing BtSULT with a dedicated PAPS-supply module. This page organizes the
              project story into agency, methodology, current results, and conclusion.
            </p>
          </article>
        </div>
      </section>

      <section class="home-project-chapter" id="agency">
        <div class="container project-chapter-grid">
          <div class="project-chapter-copy reveal">
            <p class="detail-eyebrow">01 / Project description</p>
            <h2>Agency</h2>
            <p>The project story begins by establishing its context, the current gap, and the Renata concept.</p>
            <div class="project-story-summary">
              ${agencyCards.map((card) => `
                <article>
                  <strong>${card.tag}: ${card.title}</strong>
                  <p>${card.text}</p>
                </article>
              `).join("")}
            </div>
          </div>
          <div class="project-chapter-image reveal delay-1" role="img" aria-label="Placeholder for an agency section image">
            <span aria-hidden="true">+</span>
            <small>Agency image placeholder</small>
          </div>
        </div>
      </section>

      <section class="home-project-chapter project-chapter-alt" id="methodology">
        <div class="container project-chapter-grid project-chapter-reverse">
          <div class="project-chapter-copy reveal">
            <p class="detail-eyebrow">02 / Project description</p>
            <h2>Methodology</h2>
            <h3 class="project-story-subtitle">${rationale.title || "Biological rationale"}</h3>
            <p>${rationale.text || ""}</p>
            ${rationale.items?.length ? `
              <ul class="project-story-points">
                ${rationale.items.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            ` : ""}
          </div>
          <div class="project-chapter-image reveal delay-1" role="img" aria-label="Placeholder for a methodology section image">
            <span aria-hidden="true">+</span>
            <small>Methodology image placeholder</small>
          </div>
        </div>
      </section>

      <section class="home-project-chapter" id="results">
        <div class="container project-chapter-grid">
          <div class="project-chapter-copy reveal">
            <p class="detail-eyebrow">03 / Project description</p>
            <h2>Results</h2>
            <p>The current Project Description establishes a proposed pathway architecture rather than a completed experimental outcome.</p>
            ${rationale.note ? `<p class="project-story-status"><strong>Current design status:</strong> ${rationale.note.replace(/^Design status:\s*/i, "")}</p>` : ""}
          </div>
          <div class="project-chapter-image reveal delay-1" role="img" aria-label="Placeholder for a results section image">
            <span aria-hidden="true">+</span>
            <small>Results image placeholder</small>
          </div>
        </div>
      </section>

      <section class="home-project-chapter project-chapter-alt" id="conclusion">
        <div class="container project-chapter-grid project-chapter-reverse">
          <div class="project-chapter-copy reveal">
            <p class="detail-eyebrow">04 / Project description</p>
            <h2>Conclusion</h2>
            <p>
              The working description defines Renata's intended two-cassette route to LCA
              sulfation and identifies the design decisions that must be confirmed before
              the project advances into engineering and experimental results.
            </p>
          </div>
          <div class="project-chapter-image reveal delay-1" role="img" aria-label="Placeholder for a conclusion section image">
            <span aria-hidden="true">+</span>
            <small>Conclusion image placeholder</small>
          </div>
        </div>
      </section>

      <section class="next-step-section" aria-label="Page progression">
        <div class="container">
          <div class="next-step-nav reveal">
            ${pageData.previousButton ? `
              <a href="${pageData.previousButton.href}" class="next-step-link previous-step-link magnetic" data-magnetic>
                <span class="next-step-arrow" aria-hidden="true">←</span>
                <span class="next-step-copy">
                  <small>Previous step:</small>
                  <strong>${pageData.previousButton.text}</strong>
                </span>
              </a>
            ` : ""}
            <a href="${pageData.ctaButton.href}" class="next-step-link magnetic" data-magnetic>
              <span class="next-step-copy">
                <small>Next step:</small>
                <strong>${pageData.ctaButton.text}</strong>
              </span>
              <span class="next-step-arrow" aria-hidden="true">→</span>
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

          <div class="card-grid ${pageKey === "project" ? "project-column-grid" : ""}">
            ${pageData.cards.map(renderCard).join("")}
          </div>
        </div>
      </section>

      ${renderDetailSections(pageData.details)}

      <section class="next-step-section" aria-label="Page progression">
        <div class="container">
          <div class="next-step-nav reveal">
            ${pageData.previousButton ? `
              <a href="${pageData.previousButton.href}" class="next-step-link previous-step-link magnetic" data-magnetic>
                <span class="next-step-arrow" aria-hidden="true">←</span>
                <span class="next-step-copy">
                  <small>Previous step:</small>
                  <strong>${pageData.previousButton.text}</strong>
                </span>
              </a>
            ` : ""}
            <a href="${pageData.ctaButton.href}" class="next-step-link magnetic" data-magnetic>
              <span class="next-step-copy">
                <small>Next step:</small>
                <strong>${pageData.ctaButton.text}</strong>
              </span>
              <span class="next-step-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    `;
  }

  function renderCard(card, index) {
    const delayClass = index === 1 ? "delay-1" : index === 2 ? "delay-2" : "";
    return `
      <article class="glass-card reveal ${card.imageLabel ? "image-content-card" : "tilt-card"} ${delayClass}">
        ${card.imageLabel ? `
          <div class="card-image-placeholder" role="img" aria-label="Placeholder for ${card.imageLabel}">
            <span aria-hidden="true">+</span>
            <small>${card.imageLabel}</small>
          </div>
        ` : ""}
        ${card.tag ? `<div class="card-tag">${card.tag}</div>` : ""}
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      </article>
    `;
  }

  function renderHomeSectionCard(card, index) {
    const delayClass = index % 3 === 1 ? "delay-1" : index % 3 === 2 ? "delay-2" : "";
    const hubPage = card.hubPage ? data.pages[card.hubPage] : null;

    if (hubPage) {
      return `
        <section id="${card.sectionId}" class="home-section-card home-hub-section reveal ${delayClass}" aria-labelledby="${card.sectionId}-title">
          <div class="section-card-image" role="img" aria-label="Placeholder for ${card.imageLabel}">
            <span class="placeholder-mark" aria-hidden="true">+</span>
            <span>${card.imageLabel}</span>
          </div>
          <div class="section-card-copy home-hub-copy">
            <div class="card-tag">${card.tag}</div>
            <h3 id="${card.sectionId}-title">${card.title}</h3>
            <p class="home-hub-kicker">${hubPage.kicker}</p>
            <p class="home-hub-lead">${card.text} ${hubPage.cardsLead}</p>
          </div>
          <div class="home-hub-details">
            <div class="home-hub-grid">
              ${hubPage.cards.map((detail) => `
                <article class="home-hub-card">
                  <span class="card-tag">${detail.tag}</span>
                  <h4>${detail.title}</h4>
                  <p>${detail.text}</p>
                </article>
              `).join("")}
            </div>
          </div>
        </section>
      `;
    }

    return `
      <article class="home-section-card reveal ${delayClass}">
        <div class="section-card-image" role="img" aria-label="Placeholder for ${card.imageLabel}">
          <span class="placeholder-mark" aria-hidden="true">+</span>
          <span>${card.imageLabel}</span>
        </div>
        <div class="section-card-copy">
          <div class="card-tag">${card.tag}</div>
          <h3>${card.title}</h3>
          <p>${card.text}</p>
        </div>
      </article>
    `;
  }

  function renderDetailSections(details = []) {
    if (!details.length) return "";

    return details.map((section) => `
      <section class="page-section detail-section"${section.id ? ` id="${section.id}"` : ""}>
        <div class="container">
          <article class="detail-panel reveal">
            ${section.eyebrow ? `<p class="detail-eyebrow">${section.eyebrow}</p>` : ""}
            <h2>${section.title}</h2>
            ${section.text ? `<p class="detail-lead">${section.text}</p>` : ""}
            ${section.items ? `<ul class="detail-list">${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
            ${section.steps ? `<div class="detail-steps">${section.steps.map((step) => `
              <div class="detail-step"><span>${step.label}</span><p>${step.text}</p></div>
            `).join("")}</div>` : ""}
            ${section.constructs ? `<div class="construct-grid">${section.constructs.map((construct) => `
              <div class="construct-card"><span>${construct.id}</span><h3>${construct.title}</h3><p>${construct.text}</p></div>
            `).join("")}</div>` : ""}
            ${section.note ? `<div class="evidence-note"><strong>Working note</strong><p>${section.note}</p></div>` : ""}
            ${section.source ? `<a class="detail-source-link" href="${section.source.href}" target="_blank" rel="noopener">${section.source.label} <span aria-hidden="true">↗</span></a>` : ""}
          </article>
        </div>
      </section>
    `).join("");
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
    const directoryData = data.pages.home;
    const sponsorOrganizations = data.sponsorsPartners?.length
      ? data.sponsorsPartners
      : [{ name: "Sponsor / Partner", logo: "" }];
    const sponsorRepeatCount = Math.max(1, Math.ceil(8 / sponsorOrganizations.length));
    const sponsorLoopItems = Array.from(
      { length: sponsorRepeatCount },
      (_, repeatIndex) => sponsorOrganizations.map((organization) => ({ organization, repeatIndex }))
    ).flat();

    footer.innerHTML = `
      <section class="sponsor-partner-band" id="sponsors-partners" aria-labelledby="sponsors-partners-title">
        <div class="container">
          <div class="sponsor-partner-heading reveal">
            <div>
              <p class="detail-eyebrow">With support from</p>
              <h2 id="sponsors-partners-title">Sponsors &amp; Partners</h2>
            </div>
          </div>
          <div class="sponsor-marquee reveal delay-1" role="region" aria-label="Automatically rotating sponsors and partners">
            <div class="sponsor-marquee-track">
              ${[0, 1].map((copyIndex) => `
                <div class="sponsor-marquee-group"${copyIndex === 1 ? ' aria-hidden="true"' : ""}>
                  ${sponsorLoopItems.map(({ organization, repeatIndex }) => {
                    const isAccessibleLogo = copyIndex === 0 && repeatIndex === 0;
                    return `
                    <div class="sponsor-marquee-item"${isAccessibleLogo ? ` role="img" aria-label="${organization.name} logo"` : ' aria-hidden="true"'}>
                      <div class="sponsor-logo-frame">
                        ${organization.logo ? `
                          <img src="${organization.logo}" alt="${isAccessibleLogo ? `${organization.name} logo` : ""}" loading="eager" decoding="async" />
                        ` : `
                          <span aria-hidden="true">+</span>
                        `}
                      </div>
                    </div>
                  `;
                  }).join("")}
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="link-directory-section" id="important-links" aria-label="Contacts and important links">
        <div class="container">
          <div class="link-directory reveal delay-1">
            ${directoryData.linkColumns.map((column) => {
              const headingId = `${column.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-links`;
              return `
                <section class="link-directory-column" aria-labelledby="${headingId}">
                  <h3 id="${headingId}">${column.title}</h3>
                  <ul>
                    ${column.links.map((link) => `
                      <li><a href="${link.href}"${link.newTab ? ' target="_blank" rel="noopener"' : ""}>${link.text}${link.newTab ? ' <span aria-hidden="true">↗</span>' : ""}</a></li>
                    `).join("")}
                  </ul>
                </section>
              `;
            }).join("")}
          </div>
        </div>
      </section>
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
    const hero = document.querySelector(".page-hero");
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
