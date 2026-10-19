(function () {
  const data = window.SITE_DATA;
  const pageKey = document.body.dataset.page;
  const pageData = data.pages[pageKey];

  // Unknown page templates must return to the one canonical, static homepage.
  if (!pageData) {
    window.location.replace("index.html");
    return;
  }

  const orbitalHome = pageKey === "home" && document.body.dataset.homeVariant === "orbit";
  document.title = `${orbitalHome ? "SulFlux" : stripHtml(pageData.title)} | iGEM Renata`;

  renderHeader();
  window.RenataNavigation.init(document.querySelector(".renata-nav"));
  renderMain();
  if (!["home", "project-description", "wet-lab", "wet-lab-notebook", "model"].includes(pageKey)) window.RenataPages.decorate(document.getElementById("siteMain"), { pageKey, pageData });
  initProjectSidebar();
  renderFooter();
  initEffects();
  initProjectAnchor();

  function initProjectAnchor() {
    if (!["project-description", "wet-lab", "wet-lab-notebook", "model"].includes(pageKey)) return;

    // The article is rendered by JS and the story is prepended by a later script.
    // Resolve deep links once that initial layout exists, including legacy redirects.
    const scrollToAnchor = () => {
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); }
      catch { return; }
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        let disclosure = target.closest?.("details");
        while (disclosure) {
          disclosure.open = true;
          disclosure = disclosure.parentElement?.closest("details");
        }
        target.scrollIntoView({ block: "start", behavior: "instant" });
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(scrollToAnchor), { once: true });
    } else {
      requestAnimationFrame(scrollToAnchor);
    }
    window.addEventListener("hashchange", () => requestAnimationFrame(scrollToAnchor));
  }

  function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  function renderHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    header.innerHTML = window.RenataNavigation.header(data, { pageKey, group: pageData.group });
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

  function renderMain() {
    const main = document.getElementById("siteMain");
    if (!main || pageKey === "home" || main.dataset.staticContent === "true") return;

    if (pageKey === "team") {
      main.innerHTML = renderTeamPage();
    } else if (pageKey === "project-description") {
      main.innerHTML = window.RenataProject.render(pageData);
    } else if (["wet-lab", "wet-lab-notebook", "model"].includes(pageKey)) {
      main.innerHTML = window.RenataLab.render(pageKey);
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
      <div class="team-roster">
        ${pageData.teamGroups.map(renderTeamGroup).join("")}
      </div>

      ${renderDetailSections(pageData.details)}
    `;
  }

  function renderTeamGroup(group, groupIndex) {
    const members = group.members || Array.from({ length: group.slots || 0 }, () => "Member Name");
    const gridLayouts = {
      pi: "pi-member-grid",
      compact: "compact-member-grid",
      wide: "department-grid",
    };
    const gridClass = gridLayouts[group.layout] || "department-grid";
    const cards = members.map((member, index) => renderMemberCard(group, member, index));
    const memberLines = group.memberLines || [];
    const memberContent = memberLines.length
      ? memberLines.map((line) => `
          <div class="team-member-line" id="${line.key}">
            <div class="team-member-line-heading">
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
          <div class="team-group-heading">
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
    const escape = value => String(value || "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
    const memberName = escape(typeof member === "string" ? member : member.name);
    const memberRole = escape(typeof member === "string" ? group.memberLabel : member.role);
    const memberPhoto = typeof member === "string" ? "" : member.photo;
    const portrait = memberPhoto
      ? `<img class="member-photo" src="${escape(memberPhoto)}" alt="Portrait of ${memberName}" loading="lazy" decoding="async" />`
      : `<div class="member-photo-placeholder" role="img" aria-label="Photo placeholder for ${memberName}">
          <span aria-hidden="true">+</span>
        </div>`;
    return `
      <article class="member-card">
        ${portrait}
        <div class="member-meta">
          <h3>${memberName}</h3>
          <p>${memberRole}</p>
        </div>
        <button class="member-profile-open" type="button" data-member-profile="${escape(group.key)}:${index}" aria-haspopup="dialog" aria-label="View profile: ${memberName}"><span>View profile <span aria-hidden="true">↗</span></span></button>
      </article>
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
              <p>${projectModel.text || "PLACEHOLDER: Add the final project model and its interpretation here."}</p>
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
            <p>The wet-lab pages contain planned records. The BtSULT enzyme-design record contains reported computational observations and proposed follow-up work. Each record identifies its evidence, interpretation, and remaining questions.</p>
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
            <p>PLACEHOLDER: These event pages are placeholders for verified records. Rename each block and add the real date, audience, materials, evidence, reflection, and project effect after the event information is available.</p>
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
      { key: "overview", label: recordData.overviewLabel || "Experiment Details", href: `${recordKey}.html` },
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

          ${recordData.content?.[recordView] ? recordData.content[recordView] : isOverview ? `
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
        <p>${lead || "PLACEHOLDER: Add the verified experiment record here."}</p>
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
                PLACEHOLDER: Summarize the real-world context surrounding Renata, the stakeholder groups consulted,
                the methods used to collect input, the principal findings, and the project decisions
                that changed as a result. Keep claims proportional to the documented evidence.
              </p>
              <div class="project-paper-note">
                <strong>Abstract content note</strong>
                <p>PLACEHOLDER: Write this section last so it accurately reflects the completed Human Practices record.</p>
              </div>
              <figure class="project-paper-figure" id="hp-figure-stakeholders">
                <div class="project-paper-figure-placeholder" role="img" aria-label="Placeholder for the stakeholder map">
                  <span aria-hidden="true">+</span>
                  <small>Stakeholder map</small>
                </div>
                <figcaption><strong>Figure 1.</strong> PLACEHOLDER: Map the groups affected by, contributing to, or responsible for decisions surrounding the project.</figcaption>
              </figure>
            </section>

            <section class="project-paper-section" id="hp-introduction">
              <p class="project-paper-section-number">01</p>
              <h2>Introduction</h2>
              <p>
                PLACEHOLDER: Establish the social, ethical, clinical, environmental, and implementation questions
                that made stakeholder engagement necessary. Define the scope of the inquiry and explain
                how those questions connect to the proposed LCA-sulfation system.
              </p>
            </section>

            <section class="project-paper-section" id="hp-methodology">
              <p class="project-paper-section-number">02</p>
              <h2>Methodology</h2>
              <p>
                PLACEHOLDER: Report how stakeholders were selected, contacted, and consulted. For each interview,
                survey, workshop, or review, record the date, participant role, guiding questions,
                consent process, documentation method, and approach used to interpret the response.
              </p>
              <div class="project-paper-subsections" aria-label="Human Practices methodology structure">
                <article><p>Selection</p><h3>Who participated</h3><p>PLACEHOLDER: Explain why each stakeholder perspective was relevant.</p></article>
                <article><p>Collection</p><h3>How input was gathered</h3><p>PLACEHOLDER: Describe the interview, survey, workshop, or review procedure.</p></article>
                <article><p>Analysis</p><h3>How input was interpreted</h3><p>PLACEHOLDER: State how themes, disagreements, and limitations were identified.</p></article>
              </div>
              <figure class="project-paper-figure" id="hp-figure-methods">
                <div class="project-paper-figure-placeholder" role="img" aria-label="Placeholder for the engagement methodology figure">
                  <span aria-hidden="true">+</span>
                  <small>Engagement methodology</small>
                </div>
                <figcaption><strong>Figure 2.</strong> PLACEHOLDER: Show the path from stakeholder selection through evidence collection and interpretation.</figcaption>
              </figure>
            </section>

            <section class="project-paper-section" id="hp-findings">
              <p class="project-paper-section-number">03</p>
              <h2>Findings</h2>
              <p>
                PLACEHOLDER: Present the strongest documented insights by theme. Distinguish direct stakeholder input,
                the team's interpretation, and questions that remain unresolved. Add attributed quotations
                only when permission and context are documented.
              </p>
              <div class="project-paper-note">
                <strong>Evidence boundary</strong>
                <p>PLACEHOLDER: Do not describe expected opinions, hypothetical interviews, or planned engagement as completed findings.</p>
              </div>
            </section>

            <section class="project-paper-section" id="hp-integration">
              <p class="project-paper-section-number">04</p>
              <h2>Integration</h2>
              <p>
                PLACEHOLDER: Trace each material insight to a concrete project response. Record what changed in the
                design, experiments, safety planning, communication, implementation strategy, or decision
                criteria—and identify cases where the team retained its original approach with justification.
              </p>
              <figure class="project-paper-figure" id="hp-figure-integration">
                <div class="project-paper-figure-placeholder" role="img" aria-label="Placeholder for the Human Practices integration figure">
                  <span aria-hidden="true">+</span>
                  <small>Insight-to-decision map</small>
                </div>
                <figcaption><strong>Figure 3.</strong> PLACEHOLDER: Connect stakeholder evidence to specific project decisions and follow-up actions.</figcaption>
              </figure>
            </section>

            <section class="project-paper-section" id="hp-discussion">
              <p class="project-paper-section-number">05</p>
              <h2>Discussion</h2>
              <p>
                PLACEHOLDER: Interpret where stakeholder perspectives converged or conflicted, assess how representative
                the engagement was, and identify methodological limits. Explain how uncertainty affects the
                project's responsible-development claims and future engagement priorities.
              </p>
            </section>

            <section class="project-paper-section" id="hp-conclusion">
              <p class="project-paper-section-number">06</p>
              <h2>Conclusion</h2>
              <p>
                PLACEHOLDER: Summarize what the Human Practices evidence contributed to Renata and state which social,
                ethical, or implementation questions still require further consultation.
              </p>
            </section>
          </article>

          <aside class="project-paper-sidebar reveal delay-1" aria-label="Human Practices page outline">
            <nav class="page-outline" aria-labelledby="hp-outline-title">
              <p class="page-outline-title" id="hp-outline-title">On this page</p>
              <ul>
                <li>
                  <a href="#hp-abstract">Abstract</a>
                  <ul><li><a href="#hp-figure-stakeholders">Figure 1 — Stakeholder map</a></li></ul>
                </li>
                <li><a href="#hp-introduction">Introduction</a></li>
                <li>
                  <a href="#hp-methodology">Methodology</a>
                  <ul><li><a href="#hp-figure-methods">Figure 2 — Engagement methodology</a></li></ul>
                </li>
                <li><a href="#hp-findings">Findings</a></li>
                <li>
                  <a href="#hp-integration">Integration</a>
                  <ul><li><a href="#hp-figure-integration">Figure 3 — Insight-to-decision map</a></li></ul>
                </li>
                <li><a href="#hp-discussion">Discussion</a></li>
                <li><a href="#hp-conclusion">Conclusion</a></li>
              </ul>
            </nav>
            <a class="page-outline-related" href="education.html">Education records ↗</a>
          </aside>
        </div>
      </section>
    `;
  }

  function renderStandardPage() {
    return `
      <section class="page-hero" id="pageHero">
        <div class="container page-hero-grid">
          <div class="hero-copy">
            <p class="hero-kicker">${pageData.kicker}</p>
            <h1 class="hero-title">${pageData.title}</h1>
            <p class="hero-lead">${pageData.lead}</p>
            ${renderButtons(pageData.buttons)}
          </div>
        </div>
      </section>

      <section class="page-section">
        <div class="container">
          <div class="section-intro">
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
    return `
      <article class="glass-card ${card.imageLabel ? "image-content-card" : "tilt-card"}">
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
    const hubPage = card.hubPage ? data.pages[card.hubPage] : null;

    if (hubPage) {
      return `
        <section id="${card.sectionId}" class="home-section-card home-hub-section" aria-labelledby="${card.sectionId}-title">
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
      <article class="home-section-card">
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
          <article class="detail-panel">
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
          <div class="sponsor-partner-heading">
            <div>
              <p class="detail-eyebrow">With support from</p>
              <h2 id="sponsors-partners-title">Sponsors &amp; Partners</h2>
            </div>
          </div>
          <div class="sponsor-marquee" role="region" aria-label="Automatically rotating sponsors and partners">
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
          <div class="link-directory">
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
        <section class="footer-statement" id="content-license" aria-labelledby="content-license-title">
          <h3 id="content-license-title">Content license</h3>
          <p>PLACEHOLDER: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        </section>
        <section class="footer-statement" id="ai-use" aria-labelledby="ai-use-title">
          <h3 id="ai-use-title">AI use disclosure</h3>
          <p>PLACEHOLDER: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </section>
      </div>
    `;
  }

  function initEffects() {
    const siteHeader = document.getElementById("siteHeader");

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
