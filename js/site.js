(function () {
  document.body.classList.add("js-animate");

  const data = window.SITE_DATA;
  const pageKey = document.body.dataset.page || "home";
  const pageData = data.pages[pageKey] || data.pages.home;

  document.title = `${stripHtml(pageData.title)} | iGEM Renata`;

  renderHeader();
  initNavigation();
  renderMain();
  initProjectSidebar();
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
          <button type="button" class="tab-link dropdown-toggle nav-menu-button magnetic ${isMainActive ? "active" : ""}" data-magnetic aria-haspopup="true" aria-expanded="false">
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
  const viewportBuffer = 12;

  function positionDropdown(item) {
    if (!item) return;
    const menu = item.querySelector(":scope > .dropdown-menu");
    if (!menu) return;

    item.classList.remove("dropdown-align-left");
    const itemRect = item.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    const wouldOverflowRight = itemRect.left + menuWidth > window.innerWidth - viewportBuffer;
    const fitsOnLeft = itemRect.right - menuWidth >= viewportBuffer;
    item.classList.toggle("dropdown-align-left", wouldOverflowRight && fitsOnLeft);
  }

  function positionSubmenu(item) {
    if (!item) return;
    const menu = item.querySelector(":scope > .submenu-menu");
    const arrow = item.querySelector(":scope > .submenu-trigger .submenu-arrow");
    if (!menu) return;

    item.classList.remove("submenu-align-left");

    if (window.matchMedia("(max-width: 760px)").matches) {
      if (arrow) arrow.textContent = "›";
      return;
    }

    const itemRect = item.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    const submenuGap = 9;
    const wouldOverflowRight =
      itemRect.right + submenuGap + menuWidth > window.innerWidth - viewportBuffer;
    const fitsOnLeft = itemRect.left - submenuGap - menuWidth >= viewportBuffer;
    const shouldOpenLeft = wouldOverflowRight && fitsOnLeft;

    item.classList.toggle("submenu-align-left", shouldOpenLeft);
    if (arrow) arrow.textContent = shouldOpenLeft ? "‹" : "›";
  }

  function positionAllMenus() {
    document.querySelectorAll(".nav-item").forEach(positionDropdown);
    document.querySelectorAll(".submenu-item").forEach(positionSubmenu);
  }

  function setMenuState(item, isOpen) {
    if (!item) return;
    if (isOpen) positionDropdown(item);
    item.classList.toggle("dropdown-open", isOpen);
    item.querySelector(":scope > .tab-link")?.setAttribute("aria-expanded", String(isOpen));
  }

  function setSubmenuState(item, isOpen) {
    if (!item) return;
    if (isOpen) positionSubmenu(item);
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

  });

  submenuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const item = link.closest(".submenu-item");
      event.preventDefault();
      event.stopPropagation();

      closeSubmenus(item);
      setSubmenuState(item, true);
    });

    link.addEventListener("mouseenter", () => {
      tabsRow?.classList.remove("nav-hover-suppressed");
      clearNavigationFocus(link);
      closeSubmenus(link.closest(".submenu-item"));
      positionSubmenu(link.closest(".submenu-item"));
    });
  });

  topLevelTriggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => {
      tabsRow?.classList.remove("nav-hover-suppressed");
      clearNavigationFocus(trigger);
      closeMenus(trigger.closest(".nav-item"));
      closeSubmenus();
      positionDropdown(trigger.closest(".nav-item"));
    });
  });

  let resizeFrame = null;
  window.addEventListener("resize", () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(positionAllMenus);
  });
  requestAnimationFrame(positionAllMenus);

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

  function initProjectSidebar() {
    const tabs = [...document.querySelectorAll(".project-sidebar-tab")];
    const panels = [...document.querySelectorAll(".project-sidebar-panel")];
    if (!tabs.length || !panels.length) return;

    function activateTab(activeTab) {
      tabs.forEach((tab) => {
        const isActive = tab === activeTab;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.id === activeTab.dataset.projectPanel;
        panel.classList.toggle("active", isActive);
        panel.hidden = !isActive;
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const offset = event.key === "ArrowRight" ? 1 : -1;
        const nextTab = tabs[(index + offset + tabs.length) % tabs.length];
        activateTab(nextTab);
        nextTab.focus();
      });
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
          <span class="submenu-arrow" aria-hidden="true">›</span>
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
    } else if (pageKey === "human-practices") {
      main.innerHTML = renderHumanPracticesPage();
    } else if (pageKey === "experiments") {
      main.innerHTML = renderExperimentsPage();
    } else if (pageKey === "education") {
      main.innerHTML = renderEducationPage();
    } else if (pageKey.startsWith("experiment-")) {
      main.innerHTML = renderExperimentRecordPage();
    } else {
      main.innerHTML = renderStandardPage();
    }
  }

  function renderTeamPage() {
    return `
      <section class="page-section team-photo-section">
        <div class="container">
          <h1 class="team-photo-kicker reveal">Meet Our Team</h1>
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
    const members = group.members || Array.from({ length: group.slots || 0 }, () => "Member Name");
    const gridClass = group.layout === "pi"
      ? "pi-member-grid"
      : group.layout === "compact"
        ? "compact-member-grid"
        : "department-grid";
    const cards = members.map((member, index) => renderMemberCard(group, member, index));
    const memberLines = group.memberLines || [];
    const memberContent = memberLines.length
      ? memberLines.map((line) => `
          <div class="team-member-line" id="${line.key}">
            <div class="team-member-line-heading reveal">
              <h3>${line.title}</h3>
              <p>${line.description}</p>
            </div>
            <div class="member-grid department-grid">
              ${line.members.map((member, index) => renderMemberCard(group, member, index)).join("")}
            </div>
          </div>
        `).join("")
      : `<div class="member-grid ${gridClass}">${cards.join("")}</div>`;
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
          ${memberContent}
        </div>
      </section>
    `;
  }

  function renderMemberCard(group, member, index) {
    const memberName = typeof member === "string" ? member : member.name;
    const memberRole = typeof member === "string" ? group.memberLabel : member.role;
    const delayClass = index % 3 === 1 ? "delay-1" : index % 3 === 2 ? "delay-2" : "";
    return `
      <article class="member-card reveal ${delayClass}">
        <div class="member-photo-placeholder" role="img" aria-label="Photo placeholder for ${memberName}">
          <span aria-hidden="true">+</span>
        </div>
        <div class="member-meta">
          <h3>${memberName}</h3>
          <p>${memberRole}</p>
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

  function renderExperimentsPage() {
    const experimentRoutes = data.experimentRoutes || [];
    const projectModel = data.labWorkModel || {};

    return `
      <section class="experiment-index-page" aria-labelledby="lab-work-title">
        <div class="container experiment-index-container">
          <header class="experiment-index-header reveal">
            <p class="hero-kicker">Model / Experiments / Evidence</p>
            <h1 id="lab-work-title">Lab Work</h1>
            <p>Begin with the project model, then explore the experimental records that test and refine the system.</p>
          </header>

          <figure class="lab-work-model-feature reveal" id="project-model">
            <div class="lab-work-model-image" role="img" aria-label="Placeholder for ${projectModel.imageLabel || "project model image"}">
              <span aria-hidden="true">+</span>
              <small>${projectModel.imageLabel || "Project model image"}</small>
            </div>
            <figcaption>
              <p class="detail-eyebrow">First view</p>
              <strong>${projectModel.title || "Project model"}</strong>
              <p>${projectModel.text || "Add the final project model and its interpretation here."}</p>
            </figcaption>
          </figure>

          <header class="experiment-list-header reveal" id="experiments-list">
            <p class="hero-kicker">Experimental record</p>
            <h2>Experiments</h2>
            <p>Each block opens a dedicated record connecting the question, method, evidence, interpretation, and resulting project decision.</p>
          </header>

          <div class="experiment-route-list" aria-label="Experiment pages">
            ${experimentRoutes.map((experiment, index) => `
              <a class="experiment-route-block reveal ${index % 3 === 1 ? "delay-1" : index % 3 === 2 ? "delay-2" : ""}" href="${experiment.href}">
                <span class="experiment-route-number">${experiment.number}</span>
                <span class="experiment-route-copy">
                  <span class="experiment-route-status">${experiment.status}</span>
                  <strong>${experiment.title}</strong>
                  <small>${experiment.summary}</small>
                </span>
                <span class="experiment-route-arrow" aria-hidden="true">→</span>
              </a>
            `).join("")}
          </div>

          <div class="experiment-evidence-note reveal">
            <strong>Current evidence status</strong>
            <p>These pages establish the experiment-record structure from the documented plan. Replace the working prompts with dated methods, results, figures, raw-data links, and interpretations after each experiment is conducted.</p>
          </div>
        </div>
      </section>
    `;
  }

  function renderEducationPage() {
    const eventRoutes = data.educationEventRoutes || [];

    return `
      <section class="experiment-index-page education-event-index" aria-labelledby="education-title">
        <div class="container experiment-index-container">
          <header class="experiment-index-header reveal">
            <p class="hero-kicker">Events / Audiences / Outcomes</p>
            <h1 id="education-title">Project education</h1>
            <p>Each education event has its own record connecting the audience, activity, evidence, reflection, and effect on later work.</p>
          </header>

          <div class="experiment-route-list" aria-label="Education event pages">
            ${eventRoutes.map((event, index) => `
              <a class="experiment-route-block education-event-route reveal ${index % 3 === 1 ? "delay-1" : index % 3 === 2 ? "delay-2" : ""}" href="${event.href}">
                <span class="experiment-route-number">${event.number}</span>
                <span class="experiment-route-copy">
                  <span class="experiment-route-status">${event.status}</span>
                  <strong>${event.title}</strong>
                  <small>${event.summary}</small>
                </span>
                <span class="experiment-route-arrow" aria-hidden="true">→</span>
              </a>
            `).join("")}
          </div>

          <div class="experiment-evidence-note reveal">
            <strong>Content status</strong>
            <p>These event pages are placeholders for verified records. Rename each block and add the real date, audience, materials, evidence, reflection, and project effect after the event information is available.</p>
          </div>
        </div>
      </section>
    `;
  }

  function renderExperimentRecordPage() {
    const recordKey = pageData.recordKey || pageKey;
    const recordData = data.experimentRecordTabs?.[recordKey] || {};
    const recordView = pageData.recordView || "overview";
    const recordRoutes = [
      { key: "overview", label: "Experiment Details", href: `${recordKey}.html` },
      { key: "notebook", label: "Notebook", href: `${recordKey}-notebook.html` },
      { key: "protocols", label: "Protocols", href: `${recordKey}-protocols.html` }
    ];
    const isOverview = recordView === "overview";
    const resourceTitle = recordView === "notebook" ? "Notebook" : "Protocols";
    const resourceLead = recordView === "notebook" ? recordData.notebookLead : recordData.protocolsLead;
    const resourceEntries = recordView === "notebook" ? recordData.notebook : recordData.protocols;

    return `
      <section class="page-hero experiment-record-hero" id="pageHero">
        <div class="container page-hero-grid">
          <div class="hero-copy reveal">
            <p class="hero-kicker">${pageData.kicker}</p>
            <h1 class="hero-title">${pageData.title}</h1>
            <p class="hero-lead">${pageData.lead}</p>
            ${renderButtons(pageData.buttons)}
          </div>
        </div>
      </section>

      <section class="experiment-record-workspace">
        <div class="container">
          <nav class="experiment-record-tabs reveal" aria-label="Pages for this experiment">
            ${recordRoutes.map((route) => `
              <a class="experiment-record-tab ${route.key === recordView ? "active" : ""}" href="${route.href}" ${route.key === recordView ? 'aria-current="page"' : ""}>${route.label}</a>
            `).join("")}
          </nav>

          ${isOverview ? `
            <div class="experiment-record-panel">
              <div class="section-intro reveal">
                <h2 class="section-title">${pageData.cardsTitle}</h2>
                <p class="section-lead">${pageData.cardsLead}</p>
              </div>
              <div class="card-grid experiment-record-overview-grid">
                ${pageData.cards.map(renderCard).join("")}
              </div>
              ${renderDetailSections(pageData.details)}
            </div>
          ` : `
            <div class="experiment-record-panel">
              ${renderExperimentRecordEntries(resourceTitle, resourceLead, resourceEntries || [])}
            </div>
          `}
        </div>
      </section>
    `;
  }

  function renderExperimentRecordEntries(title, lead, entries) {
    return `
      <header class="experiment-record-panel-header reveal">
        <p class="detail-eyebrow">Experiment record</p>
        <h2>${title}</h2>
        <p>${lead || "Add the verified experiment record here."}</p>
      </header>
      <div class="experiment-record-entry-list">
        ${entries.map((entry, index) => `
          <article class="experiment-record-entry reveal ${index % 2 ? "delay-1" : ""}">
            <span>${entry.label}</span>
            <div>
              <h3>${entry.title}</h3>
              <p>${entry.text}</p>
            </div>
          </article>
        `).join("")}
      </div>
      <div class="experiment-evidence-note reveal">
        <strong>Working record</strong>
        <p>Replace these prompts with dated notebook entries or validated protocol details. Keep planned work clearly separated from completed procedures and observed results.</p>
      </div>
    `;
  }


  function renderProjectDescriptionPage() {
    const rationale = pageData.details?.[0] || {};

    return `
      <section class="project-paper-page" id="project-description">
        <div class="container project-paper-layout">
          <article class="project-paper reveal" aria-labelledby="project-paper-title">
            <header class="project-paper-header">
              <p class="project-paper-type">Project Description</p>
              <h1 id="project-paper-title">${pageData.title}</h1>
            </header>

            <section class="project-paper-section" id="abstract">
              <p class="project-paper-section-number">Summary</p>
              <h2>Abstract</h2>
              <p>
                Renata proposes a synthetic biology route for sulfating lithocholic acid (LCA).
                The design combines a BtSULT sulfotransferase cassette with a second cassette
                intended to supply PAPS, the required sulfate donor. The current project description
                establishes the biological rationale, planned architecture, and design boundaries;
                it does not yet claim successful assembly, expression, or LCA sulfation.
              </p>
              <div class="project-paper-note">
                <strong>Abstract content note</strong>
                <p>
                  Incorporate the project's agency directly into the final abstract by stating
                  the biological context, the current gap, and the Renata concept.
                </p>
              </div>
              <figure class="project-paper-figure" id="figure-concept">
                <div class="project-paper-figure-placeholder" role="img" aria-label="Placeholder for the Renata project concept figure">
                  <span aria-hidden="true">+</span>
                  <small>Project concept figure</small>
                </div>
                <figcaption><strong>Figure 1.</strong> Placeholder for the problem, proposed system, and intended impact.</figcaption>
              </figure>
            </section>

            <section class="project-paper-section" id="methodology">
              <p class="project-paper-section-number">01</p>
              <h2>Methodology</h2>
              <h3>${rationale.title || "Biological rationale"}</h3>
              <p>${rationale.text || ""}</p>
              ${rationale.items?.length ? `
                <ul class="project-paper-list">
                  ${rationale.items.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              ` : ""}
              <div class="project-paper-note">
                <strong>Methodology content note</strong>
                <p>
                  Describe the software tools, inputs, outputs, and computational workflow
                  within the final Methodology rather than on a separate Software page.
                </p>
              </div>
              <figure class="project-paper-figure" id="figure-pathway">
                <div class="project-paper-figure-placeholder" role="img" aria-label="Placeholder for the two-cassette pathway architecture figure">
                  <span aria-hidden="true">+</span>
                  <small>Pathway architecture figure</small>
                </div>
                <figcaption><strong>Figure 2.</strong> Planned BtSULT and PAPS-supply cassette architecture.</figcaption>
              </figure>
              <figure class="project-paper-figure" id="figure-pcs-development">
                <div class="project-paper-figure-placeholder pcs-visual" role="img" aria-label="PCS development workflow from Design to Construct, Screen, and Characterize">
                  <p class="pcs-visual-title">How the workflow was developed</p>
                  <div class="pcs-workflow-steps">
                    <div class="pcs-workflow-step"><strong>P</strong><small>Design</small></div>
                    <div class="pcs-workflow-step"><strong>C</strong><small>Construct</small></div>
                    <div class="pcs-workflow-step"><strong>S</strong><small>Screen</small></div>
                    <div class="pcs-workflow-step"><strong>C</strong><small>Characterize</small></div>
                  </div>
                </div>
                <figcaption><strong>Figure 3.</strong> Development sequence for the PCS workflow: Design, Construct, Screen, and Characterize.</figcaption>
              </figure>
              <figure class="project-paper-figure" id="figure-pcs-use">
                <div class="project-paper-figure-placeholder pcs-visual" role="img" aria-label="Intended use of the PCS workflow and the project areas it affects">
                  <p class="pcs-visual-title">How the workflow should be used and what it affects</p>
                  <div class="pcs-impact-map">
                    <div class="pcs-impact-source">
                      <strong>Use the PCS workflow</strong>
                      <small>Organize evidence and guide project decisions</small>
                    </div>
                    <div class="pcs-impact-outcomes" aria-label="Affected project areas">
                      <div><strong>Design cycle</strong><small>Plan the next iteration</small></div>
                      <div><strong>Experiments</strong><small>Prioritize follow-up work</small></div>
                      <div><strong>Interpretation</strong><small>Connect results to decisions</small></div>
                    </div>
                  </div>
                </div>
                <figcaption><strong>Figure 4.</strong> Intended use of the PCS workflow and its effects on subsequent project decisions.</figcaption>
              </figure>
            </section>

            <section class="project-paper-section" id="results">
              <p class="project-paper-section-number">02</p>
              <h2>Results</h2>
              <p>
                The current Project Description establishes a proposed pathway architecture rather
                than a completed experimental outcome.
              </p>
              <div class="project-paper-subsections" aria-label="Results summary structure">
                <article>
                  <p>Data</p>
                  <h3>Main result</h3>
                  <p>Present the strongest result and its most important readout first.</p>
                </article>
                <article>
                  <p>Meaning</p>
                  <h3>Interpretation</h3>
                  <p>Explain what the evidence supports and what cannot yet be concluded.</p>
                </article>
                <article>
                  <p>Limits</p>
                  <h3>Next step</h3>
                  <p>Identify remaining limitations and the work needed to resolve them.</p>
                </article>
              </div>
              ${rationale.note ? `<div class="project-paper-note"><strong>Current design status</strong><p>${rationale.note.replace(/^Design status:\s*/i, "")}</p></div>` : ""}
              <figure class="project-paper-figure" id="figure-status">
                <div class="project-paper-figure-placeholder" role="img" aria-label="Placeholder for the current evidence status figure">
                  <span aria-hidden="true">+</span>
                  <small>Evidence status figure</small>
                </div>
                <figcaption><strong>Figure 5.</strong> Placeholder for current evidence, limitations, and unresolved design decisions.</figcaption>
              </figure>
            </section>

            <section class="project-paper-section" id="conclusion">
              <p class="project-paper-section-number">03</p>
              <h2>Conclusion</h2>
              <p>
                The working description defines Renata's intended two-cassette route to LCA
                sulfation and identifies the design decisions that must be confirmed before
                the project advances into engineering and experimental results.
              </p>
            </section>

          </article>

          <aside class="project-paper-sidebar reveal delay-1" aria-label="Project description navigation">
            <div class="project-paper-sidebar-inner">
              <h2>Explore this page</h2>
              <div class="project-sidebar-tabs" role="tablist" aria-label="Project description resources">
                <button type="button" class="project-sidebar-tab active" id="project-tab-links" role="tab" aria-selected="true" aria-controls="project-panel-links" data-project-panel="project-panel-links">Sections</button>
                <button type="button" class="project-sidebar-tab" id="project-tab-figures" role="tab" aria-selected="false" aria-controls="project-panel-figures" data-project-panel="project-panel-figures">Figures</button>
                <button type="button" class="project-sidebar-tab" id="project-tab-references" role="tab" aria-selected="false" aria-controls="project-panel-references" data-project-panel="project-panel-references">References</button>
              </div>

              <div class="project-sidebar-panel active" id="project-panel-links" role="tabpanel" aria-labelledby="project-tab-links">
                <a href="#abstract">Abstract</a>
                <a href="#methodology">Methodology</a>
                <a href="#results">Results</a>
                <a href="#conclusion">Conclusion</a>
              </div>

              <div class="project-sidebar-panel" id="project-panel-figures" role="tabpanel" aria-labelledby="project-tab-figures" hidden>
                <a href="#figure-concept" class="project-sidebar-figure-link">
                  <span class="project-sidebar-figure-thumb" role="img" aria-label="Thumbnail space for Figure 1"><span aria-hidden="true">+</span></span>
                  <span class="project-sidebar-figure-copy"><span class="project-sidebar-figure-number">Figure 1</span><strong>Project concept</strong></span>
                </a>
                <a href="#figure-pathway" class="project-sidebar-figure-link">
                  <span class="project-sidebar-figure-thumb" role="img" aria-label="Thumbnail space for Figure 2"><span aria-hidden="true">+</span></span>
                  <span class="project-sidebar-figure-copy"><span class="project-sidebar-figure-number">Figure 2</span><strong>Pathway architecture</strong></span>
                </a>
                <a href="#figure-pcs-development" class="project-sidebar-figure-link">
                  <span class="project-sidebar-figure-thumb" role="img" aria-label="Thumbnail space for Figure 3"><span aria-hidden="true">+</span></span>
                  <span class="project-sidebar-figure-copy"><span class="project-sidebar-figure-number">Figure 3</span><strong>Workflow development</strong></span>
                </a>
                <a href="#figure-pcs-use" class="project-sidebar-figure-link">
                  <span class="project-sidebar-figure-thumb" role="img" aria-label="Thumbnail space for Figure 4"><span aria-hidden="true">+</span></span>
                  <span class="project-sidebar-figure-copy"><span class="project-sidebar-figure-number">Figure 4</span><strong>Intended use and effects</strong></span>
                </a>
                <a href="#figure-status" class="project-sidebar-figure-link">
                  <span class="project-sidebar-figure-thumb" role="img" aria-label="Thumbnail space for Figure 5"><span aria-hidden="true">+</span></span>
                  <span class="project-sidebar-figure-copy"><span class="project-sidebar-figure-number">Figure 5</span><strong>Evidence status</strong></span>
                </a>
              </div>

              <div class="project-sidebar-panel" id="project-panel-references" role="tabpanel" aria-labelledby="project-tab-references" hidden>
                <div class="project-sidebar-reference">
                  <strong>Background literature</strong>
                  <span>Add sources supporting the biological context and project need.</span>
                </div>
                <div class="project-sidebar-reference">
                  <strong>Pathway literature</strong>
                  <span>Add sources for BtSULT, PAPS supply, and LCA sulfation.</span>
                </div>
                <div class="project-sidebar-reference">
                  <strong>Assembly literature</strong>
                  <span>Add sources for the Golden Gate and JUMP design strategy.</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

    `;
  }

  function renderHumanPracticesPage() {
    return `
      <section class="project-paper-page human-practices-paper-page" id="human-practices">
        <div class="container project-paper-layout">
          <article class="project-paper reveal" aria-labelledby="human-practices-paper-title">
            <header class="project-paper-header">
              <p class="project-paper-type">Human Practices</p>
              <h1 id="human-practices-paper-title">Human Practices</h1>
            </header>

            <section class="project-paper-section" id="hp-abstract">
              <p class="project-paper-section-number">Summary</p>
              <h2>Abstract</h2>
              <p>
                Summarize the real-world context surrounding Renata, the stakeholder groups consulted,
                the methods used to collect input, the principal findings, and the project decisions
                that changed as a result. Keep claims proportional to the documented evidence.
              </p>
              <div class="project-paper-note">
                <strong>Abstract content note</strong>
                <p>Write this section last so it accurately reflects the completed Human Practices record.</p>
              </div>
              <figure class="project-paper-figure" id="hp-figure-stakeholders">
                <div class="project-paper-figure-placeholder" role="img" aria-label="Placeholder for the stakeholder map">
                  <span aria-hidden="true">+</span>
                  <small>Stakeholder map</small>
                </div>
                <figcaption><strong>Figure 1.</strong> Map the groups affected by, contributing to, or responsible for decisions surrounding the project.</figcaption>
              </figure>
            </section>

            <section class="project-paper-section" id="hp-introduction">
              <p class="project-paper-section-number">01</p>
              <h2>Introduction</h2>
              <p>
                Establish the social, ethical, clinical, environmental, and implementation questions
                that made stakeholder engagement necessary. Define the scope of the inquiry and explain
                how those questions connect to the proposed LCA-sulfation system.
              </p>
            </section>

            <section class="project-paper-section" id="hp-methodology">
              <p class="project-paper-section-number">02</p>
              <h2>Methodology</h2>
              <p>
                Report how stakeholders were selected, contacted, and consulted. For each interview,
                survey, workshop, or review, record the date, participant role, guiding questions,
                consent process, documentation method, and approach used to interpret the response.
              </p>
              <div class="project-paper-subsections" aria-label="Human Practices methodology structure">
                <article><p>Selection</p><h3>Who participated</h3><p>Explain why each stakeholder perspective was relevant.</p></article>
                <article><p>Collection</p><h3>How input was gathered</h3><p>Describe the interview, survey, workshop, or review procedure.</p></article>
                <article><p>Analysis</p><h3>How input was interpreted</h3><p>State how themes, disagreements, and limitations were identified.</p></article>
              </div>
              <figure class="project-paper-figure" id="hp-figure-methods">
                <div class="project-paper-figure-placeholder" role="img" aria-label="Placeholder for the engagement methodology figure">
                  <span aria-hidden="true">+</span>
                  <small>Engagement methodology</small>
                </div>
                <figcaption><strong>Figure 2.</strong> Show the path from stakeholder selection through evidence collection and interpretation.</figcaption>
              </figure>
            </section>

            <section class="project-paper-section" id="hp-findings">
              <p class="project-paper-section-number">03</p>
              <h2>Findings</h2>
              <p>
                Present the strongest documented insights by theme. Distinguish direct stakeholder input,
                the team's interpretation, and questions that remain unresolved. Add attributed quotations
                only when permission and context are documented.
              </p>
              <div class="project-paper-note">
                <strong>Evidence boundary</strong>
                <p>Do not describe expected opinions, hypothetical interviews, or planned engagement as completed findings.</p>
              </div>
            </section>

            <section class="project-paper-section" id="hp-integration">
              <p class="project-paper-section-number">04</p>
              <h2>Integration</h2>
              <p>
                Trace each material insight to a concrete project response. Record what changed in the
                design, experiments, safety planning, communication, implementation strategy, or decision
                criteria—and identify cases where the team retained its original approach with justification.
              </p>
              <figure class="project-paper-figure" id="hp-figure-integration">
                <div class="project-paper-figure-placeholder" role="img" aria-label="Placeholder for the Human Practices integration figure">
                  <span aria-hidden="true">+</span>
                  <small>Insight-to-decision map</small>
                </div>
                <figcaption><strong>Figure 3.</strong> Connect stakeholder evidence to specific project decisions and follow-up actions.</figcaption>
              </figure>
            </section>

            <section class="project-paper-section" id="hp-discussion">
              <p class="project-paper-section-number">05</p>
              <h2>Discussion</h2>
              <p>
                Interpret where stakeholder perspectives converged or conflicted, assess how representative
                the engagement was, and identify methodological limits. Explain how uncertainty affects the
                project's responsible-development claims and future engagement priorities.
              </p>
            </section>

            <section class="project-paper-section" id="hp-conclusion">
              <p class="project-paper-section-number">06</p>
              <h2>Conclusion</h2>
              <p>
                Summarize what the Human Practices evidence contributed to Renata and state which social,
                ethical, or implementation questions still require further consultation.
              </p>
            </section>
          </article>

          <aside class="project-paper-sidebar reveal delay-1" aria-label="Human Practices navigation">
            <div class="project-paper-sidebar-inner">
              <h2>Explore this page</h2>
              <div class="project-sidebar-tabs" role="tablist" aria-label="Human Practices resources">
                <button type="button" class="project-sidebar-tab active" id="hp-tab-sections" role="tab" aria-selected="true" aria-controls="hp-panel-sections" data-project-panel="hp-panel-sections">Sections</button>
                <button type="button" class="project-sidebar-tab" id="hp-tab-figures" role="tab" aria-selected="false" aria-controls="hp-panel-figures" data-project-panel="hp-panel-figures">Figures</button>
                <button type="button" class="project-sidebar-tab" id="hp-tab-references" role="tab" aria-selected="false" aria-controls="hp-panel-references" data-project-panel="hp-panel-references">References</button>
              </div>

              <div class="project-sidebar-panel active" id="hp-panel-sections" role="tabpanel" aria-labelledby="hp-tab-sections">
                <a href="#hp-abstract">Abstract</a>
                <a href="#hp-introduction">Introduction</a>
                <a href="#hp-methodology">Methodology</a>
                <a href="#hp-findings">Findings</a>
                <a href="#hp-integration">Integration</a>
                <a href="#hp-discussion">Discussion</a>
                <a href="#hp-conclusion">Conclusion</a>
              </div>

              <div class="project-sidebar-panel" id="hp-panel-figures" role="tabpanel" aria-labelledby="hp-tab-figures" hidden>
                <a href="#hp-figure-stakeholders" class="project-sidebar-figure-link">
                  <span class="project-sidebar-figure-thumb" role="img" aria-label="Thumbnail space for Figure 1"><span aria-hidden="true">+</span></span>
                  <span class="project-sidebar-figure-copy"><span class="project-sidebar-figure-number">Figure 1</span><strong>Stakeholder map</strong></span>
                </a>
                <a href="#hp-figure-methods" class="project-sidebar-figure-link">
                  <span class="project-sidebar-figure-thumb" role="img" aria-label="Thumbnail space for Figure 2"><span aria-hidden="true">+</span></span>
                  <span class="project-sidebar-figure-copy"><span class="project-sidebar-figure-number">Figure 2</span><strong>Engagement methodology</strong></span>
                </a>
                <a href="#hp-figure-integration" class="project-sidebar-figure-link">
                  <span class="project-sidebar-figure-thumb" role="img" aria-label="Thumbnail space for Figure 3"><span aria-hidden="true">+</span></span>
                  <span class="project-sidebar-figure-copy"><span class="project-sidebar-figure-number">Figure 3</span><strong>Insight-to-decision map</strong></span>
                </a>
              </div>

              <div class="project-sidebar-panel" id="hp-panel-references" role="tabpanel" aria-labelledby="hp-tab-references" hidden>
                <div class="project-sidebar-reference"><strong>Stakeholder records</strong><span>Add consented interview, survey, workshop, and meeting records.</span></div>
                <div class="project-sidebar-reference"><strong>Context literature</strong><span>Add credible sources supporting the social, clinical, ethical, and implementation context.</span></div>
                <div class="project-sidebar-reference"><strong>Decision evidence</strong><span>Link each integration claim to the record that supports it.</span></div>
              </div>
            </div>
          </aside>
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
              const columnClass = headingId.replace(/-links$/, "");
              return `
                <section class="link-directory-column link-directory-column-${columnClass}" aria-labelledby="${headingId}">
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
      </div>
    `;
  }

  function initEffects() {
    const siteHeader = document.getElementById("siteHeader");
    const revealEls = [...document.querySelectorAll(".reveal")];

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

      if (siteHeader) {
        if (scrollTop > 20) siteHeader.classList.add("scrolled");
        else siteHeader.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("load", updateScroll);
    updateScroll();

  }
})();
