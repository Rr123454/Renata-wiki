/* Shared navigation for the SulFlux homepage and research pages. */
(function (root) {
  "use strict";
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const badge = (name, size) => `<img class="renata-nav-icon" src="assets/nav-icons/${escape(name)}.png" width="${size}" height="${size}" alt="" decoding="async" />`;

  function render(items, { pageKey = "home", group = "home" } = {}) {
    return `<ul class="renata-nav-list" id="renata-nav-list">${items.map((item, index) => {
        const active = item.key === group || item.key === pageKey;
        if (!item.children) return `<li><a class="renata-nav-trigger${active ? " is-active" : ""}" href="${escape(item.href)}"${item.key === pageKey ? ' aria-current="page"' : ""}>${escape(item.label)}</a></li>`;
        const panelId = `renata-nav-${item.key}`;
        return `<li class="renata-nav-group">
          <div class="renata-nav-row">
          <button class="renata-nav-trigger${active ? " is-active" : ""}" type="button" aria-expanded="false" aria-controls="${escape(panelId)}" id="${escape(panelId)}-trigger">${escape(item.label)}<span class="renata-nav-chevron" aria-hidden="true"></span></button>
          <span class="renata-nav-shortcuts">${item.children.map(child => `<a class="renata-nav-shortcut${child.key === pageKey ? " is-current" : ""}" href="${escape(child.href)}" aria-label="${escape(child.label)}" title="${escape(child.label)}">${badge(child.icon, 32)}</a>`).join("")}</span>
          </div>
          <div class="renata-nav-panel" id="${escape(panelId)}" aria-labelledby="${escape(panelId)}-trigger" hidden>
            <div class="renata-nav-intro">
              <span class="renata-nav-eyebrow">0${index} / ${escape(item.label)}</span>
              <p class="renata-nav-heading">${escape(item.heading)}</p>
              <p class="renata-nav-description">${escape(item.description)}</p>
            </div>
            <div class="renata-nav-pages"><span class="renata-nav-eyebrow">Explore this section</span>
              <ul>${item.children.map(child => {
                const current = child.key === pageKey;
                const inSection = !current && (pageKey.startsWith(`${child.key}-`) || (child.key === "wet-lab" && pageKey.startsWith("experiment-") && !pageKey.startsWith("experiment-enzyme-design")) || (child.key === "model" && pageKey.startsWith("experiment-enzyme-design")));
                return `<li><a class="renata-nav-card${inSection ? " is-section" : ""}" href="${escape(child.href)}"${current ? ' aria-current="page"' : ""}>
                  <span class="renata-nav-copy"><strong>${escape(child.label)}</strong><small>${escape(child.description)}</small></span>
                  <span class="renata-nav-arrow" aria-hidden="true">${current ? "●" : "↗"}</span>
                </a>${child.children?.length ? `<ul class="renata-nav-subpages" aria-label="${escape(child.label)} pages">${child.children.map(sub => `<li><a href="${escape(sub.href)}"${sub.key === pageKey ? ' aria-current="page"' : ""}>${escape(sub.label)} <span aria-hidden="true">↗</span></a></li>`).join("")}</ul>` : ""}</li>`;
              }).join("")}</ul>
            </div>
          </div>
        </li>`;
      }).join("")}</ul>`;
  }

  function header(data, options) {
    return `<div class="container header-inner">
      <a href="index.html" class="brand" aria-label="iGEM Renata, homepage">
        <span class="brand-logo-wrap"><img src="assets/logo.png" alt="" class="brand-logo" width="52" height="52" /></span>
        <span class="brand-text">${escape(data.brand.title)}</span>
      </a>
      <nav class="renata-nav" aria-label="Main navigation">${render(data.nav, options)}</nav>
    </div>`;
  }

  function init(nav, win = window) {
    if (!nav || nav.dataset.navReady) return;
    nav.dataset.navReady = "true";
    const doc = nav.ownerDocument;
    const mobile = win.matchMedia("(max-width: 980px)");
    const hover = win.matchMedia("(hover: hover) and (pointer: fine)");
    const list = nav.querySelector(".renata-nav-list");
    const triggers = [...nav.querySelectorAll(".renata-nav-trigger")];
    const entries = [...nav.querySelectorAll(".renata-nav-group")].map(group => ({
      group, trigger: group.querySelector(".renata-nav-trigger"), panel: group.querySelector(".renata-nav-panel")
    }));
    let opened = null;
    let pinned = null;
    let hoverTimer;
    const cancelHover = () => win.clearTimeout(hoverTimer);
    function measureHeader() {
      const siteHeader = nav.closest(".site-header");
      if (!siteHeader) return;
      const box = siteHeader.getBoundingClientRect();
      nav.style.setProperty("--nav-panel-top", `${box.bottom}px`);
      doc.documentElement.style.setProperty("--site-header-height", `${box.height}px`);
    }

    function close(restoreFocus = false) {
      cancelHover();
      if (!opened) return;
      const previous = opened;
      previous.trigger.setAttribute("aria-expanded", "false");
      previous.panel.hidden = true;
      opened = pinned = null;
      if (restoreFocus) previous.trigger.focus();
    }

    function open(entry) {
      cancelHover();
      if (opened === entry) return;
      close();
      measureHeader();
      opened = entry;
      entry.trigger.setAttribute("aria-expanded", "true");
      entry.panel.hidden = false;
    }

    entries.forEach(entry => {
      entry.trigger.addEventListener("click", () => {
        if (opened === entry && pinned === entry) close();
        else { open(entry); pinned = entry; }
      });
      entry.trigger.addEventListener("pointerenter", event => {
        if (mobile.matches || !hover.matches || event.pointerType !== "mouse" || pinned) return;
        // Do not move or hide keyboard focus when the mouse happens to cross the header.
        if (opened?.panel.contains(doc.activeElement)) return;
        cancelHover();
        hoverTimer = win.setTimeout(() => open(entry), 120);
      });
      entry.group.addEventListener("pointerleave", () => {
        cancelHover();
        if (!pinned && !entry.panel.contains(doc.activeElement)) hoverTimer = win.setTimeout(() => close(), 180);
      });
      entry.panel.addEventListener("pointerenter", cancelHover);
      entry.panel.addEventListener("keydown", event => {
        const links = [...entry.panel.querySelectorAll("a")];
        const index = links.indexOf(doc.activeElement);
        if (index < 0 || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links[next].focus();
      });
    });
    nav.querySelectorAll(".renata-nav-shortcut").forEach(link => {
      link.addEventListener("focus", () => close());
    });
    triggers.forEach((trigger, index) => {
      trigger.addEventListener("focus", () => {
        if (opened && opened.trigger !== trigger) close();
      });
      trigger.addEventListener("keydown", event => {
        const entry = entries.find(item => item.trigger === trigger);
        if (entry && ["ArrowDown", "ArrowUp"].includes(event.key)) {
          event.preventDefault();
          open(entry);
          const links = entry.panel.querySelectorAll("a");
          links[event.key === "ArrowDown" ? 0 : links.length - 1]?.focus();
        } else if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
          event.preventDefault();
          close();
          triggers[(index + (event.key === "ArrowRight" ? 1 : -1) + triggers.length) % triggers.length].focus();
        }
      });
    });
    doc.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if (!opened) return;
      event.preventDefault();
      close(true);
    });
    doc.addEventListener("pointerdown", event => {
      if (nav.contains(event.target)) return;
      close(opened?.panel.contains(doc.activeElement));
    });
    nav.addEventListener("focusout", () => {
      win.setTimeout(() => {
        if (!nav.contains(doc.activeElement)) close();
      }, 0);
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) {
        // Keep same-page anchor navigation from leaving focus in a hidden panel.
        close(opened?.panel.contains(event.target));
      }
    });
    mobile.addEventListener("change", () => {
      close(opened?.panel.contains(doc.activeElement));
      measureHeader();
    });
    list.addEventListener("scroll", () => close(opened?.panel.contains(doc.activeElement)), { passive: true });
    win.addEventListener?.("resize", measureHeader);
    if (win.ResizeObserver) new win.ResizeObserver(measureHeader).observe(nav);
    measureHeader();
  }

  function mount(nav, data, options) {
    if (!nav || !data) return;
    nav.innerHTML = render(data.nav, options);
    init(nav);
  }
  const api = { render, header, init, mount };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    root.RenataNavigation = api;
  }
})(typeof window === "undefined" ? globalThis : window);
