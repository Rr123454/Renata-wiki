(function renderSite() {
  const content = window.SITE_CONTENT;
  if (!content) return;

  function setHTML(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderCards(containerId, cards, type = "default") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = cards
      .map((card, index) => {
        const delayClass = index === 1 ? "delay-1" : index === 2 ? "delay-2" : "";
        return `
          <article class="card reveal tilt-card ${delayClass}">
            <h3>${card.title}</h3>
            <p>${card.text}</p>
          </article>
        `;
      })
      .join("");
  }

  function renderHero() {
    setText("heroEyebrow", content.hero.eyebrow);
    setHTML("heroTitle", content.hero.title);
    setText("heroLead", content.hero.lead);
    setText("scrollCueText", content.hero.scrollCue);

    const primaryBtn = document.getElementById("heroPrimaryBtn");
    const secondaryBtn = document.getElementById("heroSecondaryBtn");

    if (primaryBtn) {
      primaryBtn.textContent = content.hero.primaryButton.text;
      primaryBtn.href = content.hero.primaryButton.href;
    }

    if (secondaryBtn) {
      secondaryBtn.textContent = content.hero.secondaryButton.text;
      secondaryBtn.href = content.hero.secondaryButton.href;
    }

    const statsContainer = document.getElementById("heroStats");
    if (statsContainer) {
      statsContainer.innerHTML = content.hero.stats
        .map(
          (stat) => `
            <div class="hero-stat">
              <strong>${stat.value}</strong>
              <span>${stat.label}</span>
            </div>
          `
        )
        .join("");
    }

    const badgesContainer = document.getElementById("heroBadges");
    if (badgesContainer) {
      badgesContainer.innerHTML = content.hero.badges
        .map(
          (badge) => `
            <div class="hero-badge">
              <strong>${badge.title}</strong>
              <span>${badge.subtitle}</span>
            </div>
          `
        )
        .join("");
    }
  }

  function renderSimpleSection(sectionKey, ids) {
    const section = content[sectionKey];
    if (!section) return;

    setText(ids.chip, section.chip);
    setText(ids.title, section.title);
    setText(ids.lead, section.lead);
    renderCards(ids.cards, section.cards);
  }

  function renderPCS() {
    const pcs = content.pcs;
    setText("pcsChip", pcs.chip);
    setText("pcsTitle", pcs.title);
    setText("pcsLead", pcs.lead);
    setText("pcsRailTitle", pcs.railTitle);

    const dotsContainer = document.getElementById("pcsDots");
    const stepsContainer = document.getElementById("pcsSteps");

    if (dotsContainer) {
      dotsContainer.innerHTML = pcs.steps
        .map((step, index) => {
          const percent =
            pcs.steps.length === 1
              ? 50
              : 8 + (index * 84) / (pcs.steps.length - 1);

          return `
            <button
              class="pcs-dot ${index === 0 ? "active" : ""}"
              data-step-index="${index}"
              style="top:${percent}%"
              aria-label="Go to PCS step ${index + 1}"
            >
              <span class="pcs-dot-label">${String(index + 1).padStart(2, "0")} · ${step.title}</span>
            </button>
          `;
        })
        .join("");
    }

    if (stepsContainer) {
      stepsContainer.innerHTML = pcs.steps
        .map((step, index) => {
          const delayClass = index === 1 || index === 2 ? "delay-1" : index === 3 ? "delay-2" : "";
          return `
            <article class="pcs-step-card reveal tilt-card ${delayClass}" data-step-card="${index}">
              <div class="pcs-step-number">${String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3>${step.title}</h3>
                <p>${step.text}</p>
                <div class="pcs-tag-row">
                  ${step.tags.map((tag) => `<span class="pcs-tag">${tag}</span>`).join("")}
                </div>
              </div>
            </article>
          `;
        })
        .join("");
    }
  }

  function renderContact() {
    setText("contactChip", content.contact.chip);
    setText("contactTitle", content.contact.title);
    setText("contactLead", content.contact.lead);

    const button = document.getElementById("contactButton");
    if (button) {
      button.textContent = content.contact.buttonText;
      button.href = content.contact.buttonHref;
    }
  }

  function renderFooter() {
    setText("footerLeft", content.footer.left);
    setText("footerRight", content.footer.right);
  }

  renderHero();

  renderSimpleSection("about", {
    chip: "aboutChip",
    title: "aboutTitle",
    lead: "aboutLead",
    cards: "aboutCards"
  });

  renderSimpleSection("project", {
    chip: "projectChip",
    title: "projectTitle",
    lead: "projectLead",
    cards: "projectCards"
  });

  renderPCS();

  renderSimpleSection("judging", {
    chip: "judgingChip",
    title: "judgingTitle",
    lead: "judgingLead",
    cards: "judgingCards"
  });

  renderSimpleSection("team", {
    chip: "teamChip",
    title: "teamTitle",
    lead: "teamLead",
    cards: "teamCards"
  });

  renderContact();
  renderFooter();
})();