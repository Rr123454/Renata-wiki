/* Shared, local-only navigation for the reading pages and both homepages. */
(function (root) {
  "use strict";
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const badge = (name, size) => `<img class="renata-nav-icon" src="assets/nav-icons/${escape(name)}.png" width="${size}" height="${size}" alt="" decoding="async" />`;

  function render(items, { pageKey = "home", group = "home", orbit = false } = {}) {
    return `<button class="renata-nav-toggle" type="button" aria-expanded="false" aria-controls="renata-nav-list"><span>Explore Renata</span><span class="renata-nav-toggle-symbol" aria-hidden="true">＋</span></button>
      <ul class="renata-nav-list" id="renata-nav-list">${items.map((item, index) => {
        const active = item.key === group || item.key === pageKey;
        if (!item.children) return `<li><a class="renata-nav-trigger${active ? " is-active" : ""}" href="${escape(orbit && item.key === "home" ? "home-orbit.html" : item.href)}"${item.key === pageKey ? ' aria-current="page"' : ""}>${escape(item.label)}</a></li>`;
        const panelId = `renata-nav-${item.key}`;
        return `<li class="renata-nav-group">
          <button class="renata-nav-trigger${active ? " is-active" : ""}" type="button" aria-expanded="false" aria-controls="${escape(panelId)}" id="${escape(panelId)}-trigger">${escape(item.label)}<span class="renata-nav-chevron" aria-hidden="true"></span></button>
          <div class="renata-nav-panel" id="${escape(panelId)}" aria-labelledby="${escape(panelId)}-trigger" hidden>
            <div class="renata-nav-intro">
              <span class="renata-nav-eyebrow">0${index} / ${escape(item.label)}</span>
              ${badge(item.icon, 80)}
              <p class="renata-nav-heading">${escape(item.heading)}</p>
              <p class="renata-nav-description">${escape(item.description)}</p>
            </div>
            <div class="renata-nav-pages"><span class="renata-nav-eyebrow">Explore this section</span>
              <ul>${item.children.map(child => {
                const current = child.key === pageKey;
                const inSection = !current && pageKey.startsWith(`${child.key}-`);
                return `<li><a class="renata-nav-card${inSection ? " is-section" : ""}" href="${escape(child.href)}"${current ? ' aria-current="page"' : ""}>
                  ${badge(child.icon, 48)}
                  <span class="renata-nav-copy"><strong>${escape(child.label)}</strong><small>${escape(child.description)}</small></span>
                  <span class="renata-nav-arrow" aria-hidden="true">${current ? "●" : "↗"}</span>
                </a></li>`;
              }).join("")}</ul>
            </div>
          </div>
        </li>`;
      }).join("")}</ul>`;
  }

  function init(nav, win = window) {
    if (!nav || nav.dataset.navReady) return;
    nav.dataset.navReady = "true";
    const doc = nav.ownerDocument;
    const mobile = win.matchMedia("(max-width: 980px)");
    const hover = win.matchMedia("(hover: hover) and (pointer: fine)");
    const toggle = nav.querySelector(".renata-nav-toggle");
    const list = nav.querySelector(".renata-nav-list");
    const triggers = [...nav.querySelectorAll(".renata-nav-trigger")];
    const entries = [...nav.querySelectorAll(".renata-nav-group")].map(group => ({
      group, trigger: group.querySelector(".renata-nav-trigger"), panel: group.querySelector(".renata-nav-panel")
    }));
    let opened = null;
    let pinned = null;
    let hoverTimer;
    const cancelHover = () => win.clearTimeout(hoverTimer);

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
      opened = entry;
      entry.trigger.setAttribute("aria-expanded", "true");
      entry.panel.hidden = false;
    }

    function setMobileMenu(expanded) {
      toggle.setAttribute("aria-expanded", String(expanded));
      list.hidden = mobile.matches && !expanded;
      if (!expanded) close();
    }

    toggle.addEventListener("click", () => setMobileMenu(toggle.getAttribute("aria-expanded") !== "true"));
    entries.forEach(entry => {
      entry.trigger.addEventListener("click", () => {
        if (opened === entry && pinned === entry) close();
        else { open(entry); pinned = entry; }
      });
      entry.group.addEventListener("pointerenter", event => {
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
      entry.panel.addEventListener("keydown", event => {
        const links = [...entry.panel.querySelectorAll("a")];
        const index = links.indexOf(doc.activeElement);
        if (index < 0 || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links[next].focus();
      });
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
      if (!opened && !(mobile.matches && !list.hidden)) return;
      event.preventDefault();
      if (opened) close(true);
      else if (mobile.matches) { setMobileMenu(false); toggle.focus(); }
    });
    doc.addEventListener("pointerdown", event => {
      if (nav.contains(event.target)) return;
      if (nav.contains(doc.activeElement)) {
        if (mobile.matches) toggle.focus();
        else close(true);
      }
      setMobileMenu(false);
    });
    nav.addEventListener("focusout", () => {
      win.setTimeout(() => {
        if (!nav.contains(doc.activeElement)) setMobileMenu(false);
      }, 0);
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) {
        // Keep same-page anchor navigation from leaving focus in a hidden panel.
        const mobileOpen = mobile.matches && !list.hidden;
        close(true);
        if (mobileOpen) toggle.focus();
        setMobileMenu(false);
      }
    });
    mobile.addEventListener("change", () => {
      const needsFocus = nav.contains(doc.activeElement);
      setMobileMenu(false);
      if (needsFocus) (mobile.matches ? toggle : triggers[0]).focus();
    });
    setMobileMenu(false);
  }

  function mount(nav, data, options) {
    if (!nav || !data) return;
    nav.innerHTML = render(data.nav, options);
    init(nav);
  }
  const api = { render, init, mount };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    root.RenataNavigation = api;
    const orbitNav = root.document.querySelector("[data-orbit-navigation]");
    if (orbitNav) mount(orbitNav, root.SITE_DATA, { orbit: true });
  }
})(typeof window === "undefined" ? globalThis : window);
