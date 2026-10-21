(function () {
  const escapeHtml = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const data = window.SITE_DATA;
  const pageKey = document.body.dataset.page;
  const pageData = data.pages[pageKey];

  // Unknown page templates must return to the one canonical, static homepage.
  if (!pageData) {
    window.location.replace("index.html");
    return;
  }

  const orbitalHome = pageKey === "home" && document.body.dataset.homeVariant === "orbit";
  document.title = orbitalHome ? "ULP-CA · SulFlux" : `${stripHtml(pageData.title)} | iGEM Renata`;

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
    if (pageKey === "home" && document.body.dataset.homeBrand) {
      header.querySelector(".brand-text").textContent = document.body.dataset.homeBrand;
      header.querySelector(".brand").setAttribute("aria-label", `${document.body.dataset.homeBrand}, homepage`);
    }
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
    } else if (pageKey === "contribution") {
      main.innerHTML = renderContributionPage();
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
      ? `<img class="member-photo" src="${escape(memberPhoto)}" alt="Portrait of ${memberName}" loading="lazy" decoding="async" fetchpriority="low" />`
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

  function renderContributionPage() {
    return `
      <section class="experiment-index-page education-event-index contribution-index" id="contribution-resources" aria-labelledby="contribution-title">
        <div class="container experiment-index-container">
          <header class="experiment-index-header reveal">
            <p class="hero-kicker">Engagement / Contribution</p>
            <h1 id="contribution-title">Contribution</h1>
            <p>Resources and lessons from our team, shared with the iGEM community.</p>
          </header>
          <div class="contribution-features" aria-label="Contribution resources">
            ${(data.contributionRoutes || []).map(resource => `
              <a class="contribution-feature" href="${resource.href}" aria-labelledby="kickstart-feature-title">
                <div class="contribution-feature-copy">
                  <p class="contribution-feature-kicker">${resource.status}</p>
                  <h2 id="kickstart-feature-title">${resource.title}</h2>
                  <p class="contribution-feature-summary">${resource.summary}</p>
                  <span class="contribution-feature-action">Read the guide <span aria-hidden="true">→</span></span>
                </div>
                <div class="contribution-guide-preview" aria-hidden="true">
                  <span class="contribution-guide-brand">ULP-CA / iGEM Kickstart</span>
                  <span class="contribution-guide-title">Research<br>Fundamentals</span>
                  <img src="assets/kickstart/figure-1.png" width="1298" height="537" alt="" loading="lazy">
                  <span class="contribution-guide-topics">Gene design · Plasmids<br>DNA assembly · DBTL</span>
                  <span class="contribution-guide-author">By Humza Shahzad</span>
                  <span class="contribution-guide-length">11 pages · A starting point for new teams</span>
                </div>
              </a>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderEducationPage() {
    const eventRoutes = data.educationEventRoutes || [];
    const overview = data.educationOverview;

    return `
      <section class="experiment-index-page education-event-index" id="education-events" aria-labelledby="education-title">
        <div class="container experiment-index-container">
          <header class="experiment-index-header reveal">
            <p class="hero-kicker">Events / Audiences / Outcomes</p>
            <h1 id="education-title">Education</h1>
            <p>Explore four initiatives introducing students to genetics, biotechnology, and synthetic biology research.</p>
          </header>

          ${overview ? `
            <section class="education-overview" id="education-overview" aria-labelledby="education-overview-title">
              <div class="education-overview-heading">
                <p class="hero-kicker">Why we teach</p>
                <h2 id="education-overview-title">${overview.title}</h2>
              </div>
              <div class="education-overview-copy">
                ${overview.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join("")}
                <p class="education-source">${overview.source}</p>
              </div>
            </section>
          ` : ""}

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
            <p>These accounts document our activities and educational intentions. Formal learning-assessment results have not been supplied.</p>
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


            <section class="project-paper-section" id="hp-events">
              <h2>Engagement records</h2>
              <p>Our interviews, professional exchanges, and community service informed how we considered the people affected by our project.</p>
              <div class="experiment-route-list" aria-label="Human Practices records">
                ${(data.humanPracticesEventRoutes || []).map(event => `
                  <a class="experiment-route-block education-event-route" href="${event.href}">
                    <span class="experiment-route-number">${event.number}</span>
                    <span class="experiment-route-copy"><span class="experiment-route-status">${event.status}</span><strong>${event.title}</strong><small>${event.summary}</small></span>
                    <span class="experiment-route-arrow" aria-hidden="true">→</span>
                  </a>
                `).join("")}
              </div>
            </section>
            <section class="project-paper-section" id="hp-abstract">
              <h2>Abstract</h2>
              <p>RENATA’s Human Practices work brought together perspectives from biotechnology and healthcare professionals, two patients, online patient communities, and community volunteers. Across six engagement records, the team considered the clinical relevance, practical delivery, accessibility, and development requirements of its proposed LCA-sulfation system. Patient and professional feedback helped the team prioritize convenience and tolerability and explore a prebiotic–probiotic delivery approach. These accounts describe stakeholder input and its influence on the team’s thinking; they do not establish clinical safety or therapeutic effectiveness.</p>

            </section>
            <section class="project-paper-section" id="hp-introduction">
              <h2>Introduction</h2>
              <p>Our proposed system aims to modify lithocholic acid (LCA) using the BtSULT enzyme. The engagement accounts ask what would be needed beyond demonstrating enzyme activity: whether the approach addresses patients’ needs, how it could be delivered, and what evidence would support further development. The May SABPA forum introduced commercial and clinical questions, while subsequent interviews and outreach brought everyday patient experiences into those considerations.</p>

            </section>
            <section class="project-paper-section" id="hp-methodology">
              <h2>Engagement approach</h2>
              <p>The supplied record describes professional discussions at the SABPA OC/LA Biomedical Forum and San Diego MedChem Symposium, an interview with gastroenterologist Dr. Singh, two individual patient interviews, outreach through Facebook communities, and conversations during SEVA Collective service. These were qualitative opportunities to gather perspectives. The write-up does not document a standardized interview protocol, formal coding method, or representative sampling strategy.</p>
              <section id="hp-methodology-1"><h3>Professional perspectives</h3><p>Conversations addressed commercial feasibility, clinical relevance, existing treatment limitations, enzyme engineering, and the evidence needed for further development.</p></section>
              <section id="hp-methodology-2"><h3>Patient and community perspectives</h3><p>Individual interviews and Facebook responses described varied experiences after gallbladder removal. Community service provided an opportunity to explain the project to people outside biotechnology and practice accessible science communication.</p></section>
            </section>
            <section class="project-paper-section" id="hp-findings">
              <h2>What we learned</h2>
              <p>Dr. Singh encouraged the team to consider overlapping gastrointestinal symptoms, existing treatments, the size of the patient group with persistent complications, and the possible role of the gut microbiome. The patient accounts differed: one described persistent symptoms and dietary restrictions, while another reported substantial improvement after surgery with continuing difficulty tolerating fatty foods. Facebook responses also varied, highlighting unpredictable symptoms and concerns about access to medication.</p>
              <p>Patients emphasized ease of use, clinical testing, and transparency about potential risks. Professional exchanges highlighted the distinction between enzyme activity and meaningful therapeutic benefit, along with manufacturing, cost, delivery, and scalability. At MedChem, discussion also addressed enzyme activity and substrate specificity in computational evaluation.</p>

            </section>
            <section class="project-paper-section" id="hp-integration">
              <h2>How feedback shaped the project</h2>
              <p>Patient and professional feedback helped establish convenience and tolerability as design priorities. The team reports moving toward a prebiotic–probiotic approach and considering how engineered bacteria might work alongside prebiotic components. These remain design goals whose performance requires testing.</p>
              <p>The SABPA discussions helped separate the evidence required for a functioning laboratory system from the additional evidence needed for clinical translation and commercialization. At MedChem, the team shared its progress and received further feedback on enzyme engineering. The supplied account does not identify numerical scores, selection thresholds, or a specific final protein-design change.</p>

            </section>
            <section class="project-paper-section" id="hp-discussion">
              <h2>Evidence and limitations</h2>
              <p>Two patient interviews and self-selected Facebook responses provide individual experiences rather than estimates of symptom prevalence or treatment effectiveness. The records contain differing perspectives and cannot establish that the proposed system will improve patient outcomes or reduce side effects. No clinical validation is reported here.</p>
              <p>The document’s opening HP overview is unfinished. This overview synthesizes the six completed accounts that follow it; it adds no interview quotations, participant counts, consent claims, or experimental results beyond the supplied record.</p>

            </section>
            <section class="project-paper-section" id="hp-conclusion">
              <h2>Conclusion</h2>
              <p>Human Practices broadened RENATA’s evaluation of SultFlux to include practical use, patient concerns, scientific evidence, and development constraints. The accounts connect feedback to delivery considerations and research priorities while keeping laboratory feasibility, clinical benefit, and commercial viability as separate questions requiring different evidence.</p>

            </section>
            <p class="education-source">1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d., pp. 1–10. Overview synthesized from the six event accounts.</p>
          </article>

          <aside class="project-paper-sidebar reveal delay-1" aria-label="Human Practices page outline">
            <nav class="page-outline" aria-labelledby="hp-outline-title">
              <p class="page-outline-title" id="hp-outline-title">On this page</p>
              <ul><li><a href="#hp-events">Engagement records</a></li><li><a href="#hp-abstract">Abstract</a></li><li><a href="#hp-introduction">Introduction</a></li><li><a href="#hp-methodology">Engagement approach</a></li><li><a href="#hp-findings">What we learned</a></li><li><a href="#hp-integration">How feedback shaped the project</a></li><li><a href="#hp-discussion">Evidence and limitations</a></li><li><a href="#hp-conclusion">Conclusion</a></li></ul>
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

      ${pageData.cards.length ? `<section class="page-section">
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

      ` : ""}
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
            ${(section.paragraphs || []).map(paragraph => `<p class="detail-lead">${paragraph}</p>`).join("")}
            ${section.images ? `<div class="engagement-gallery">${section.images.map(photo => `<figure><a href="${photo.src}" target="_blank" rel="noopener" aria-label="View full photo: ${photo.alt}"><img src="${photo.src}" alt="${photo.alt}" width="${photo.width}" height="${photo.height}" loading="lazy" /></a><figcaption>${photo.caption}</figcaption></figure>`).join("")}</div>` : ""}
            ${section.items ? `<ul class="detail-list">${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
            ${section.steps ? `<div class="detail-steps">${section.steps.map((step) => `
              <div class="detail-step"><span>${step.label}</span><p>${step.text}</p></div>
            `).join("")}</div>` : ""}
            ${section.constructs ? `<div class="construct-grid">${section.constructs.map((construct) => `
              <div class="construct-card"><span>${construct.id}</span><h3>${construct.title}</h3><p>${construct.text}</p></div>
            `).join("")}</div>` : ""}
            ${section.document ? `<figure class="education-document-reader"><iframe src="${section.document.src}" title="${section.document.title}" loading="lazy"></iframe><figcaption><a href="${section.document.src}" target="_blank" rel="noopener">Open the PDF in a new tab</a> · <a href="${section.document.src}" download>Download the guide</a></figcaption></figure>` : ""}
            ${section.note ? `<div class="evidence-note"><strong>Working note</strong><p>${section.note}</p></div>` : ""}
            ${section.source ? `<a class="detail-source-link" href="${section.source.href}" target="_blank" rel="noopener">${section.source.label} <span aria-hidden="true">↗</span></a>` : ""}
            ${section.citation ? `<p class="education-source">${section.citation}</p>` : ""}
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
        <p>© 2026 iGEM Renata.</p>
        <section class="footer-statement" id="content-license" aria-label="Content license">
          <p>Except where otherwise credited, this wiki is licensed under a <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.${window.IGEM_CONFIG?.repository ? ` <a href="${escapeHtml(window.IGEM_CONFIG.repository)}">Wiki source on iGEM GitLab</a>.` : ""}</p>
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
