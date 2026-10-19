/* A short, skippable loading screen; it never locks scrolling or hides content. */
(function () {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const started = performance.now();
  const loader = document.createElement("div");
  loader.className = "site-loader";
  loader.innerHTML = '<div class="site-loader-art" aria-hidden="true"><img src="assets/nav-icons/Phoenix.png" width="62" height="62" alt="" /></div><strong>Renata</strong><p role="status">Preparing your next chapter…</p><div class="site-loader-track" aria-hidden="true"><span></span></div><button type="button">Skip intro</button>';
  document.body.appendChild(loader);
  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    // A focused Skip button must not disappear underneath keyboard users.
    if (loader.contains(document.activeElement)) {
      const main = document.getElementById("siteMain");
      if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
    }
    loader.classList.add("is-dismissed");
    window.setTimeout(() => loader.remove(), reduced.matches ? 0 : 500);
    document.removeEventListener("keydown", onKey);
  }
  function onKey(event) { if (event.key === "Escape") dismiss(); }
  loader.querySelector("button").addEventListener("click", dismiss);
  document.addEventListener("keydown", onKey);
  window.setTimeout(dismiss, 3200);
  window.addEventListener("pageshow", event => { if (event.persisted) dismiss(); });
  document.addEventListener("DOMContentLoaded", () => {
    if (dismissed) return;
    const marked = [...document.querySelectorAll("[data-preload]")].flatMap(node => node.dataset.preload.split(" "));
    const sources = [...new Set(marked.length ? marked : [...document.querySelectorAll(".orbit-page-scene image")].map(node => node.getAttribute("href")))].slice(0, 6);
    let loaded = 0;
    const pending = sources.map(src => new Promise(resolve => {
      const image = new Image();
      image.onload = image.onerror = () => {
        loaded++;
        if (!dismissed) loader.querySelector(".site-loader-track > span").style.transform = `scaleX(${loaded / sources.length})`;
        resolve();
      };
      image.src = src;
    }));
    Promise.allSettled(pending).then(() => {
      if (dismissed) return;
      loader.querySelector(".site-loader-track > span").style.transform = "scaleX(1)";
      window.setTimeout(dismiss, reduced.matches ? 0 : Math.max(0, 450 - (performance.now() - started)));
    });
  }, { once: true });
})();
