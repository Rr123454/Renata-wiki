/* The PDF and its accessible text version share one authored notebook record. */
(function (root) {
  "use strict";
  function pageFromHash(hash, anchors) {
    let id;
    try { id = decodeURIComponent(hash.replace(/^#/, "")); } catch { return null; }
    if (id === "notebook") return 1;
    return anchors[id] || anchors[`notebook-${id}`] || null;
  }
  function init(win, doc) {
    // Preserve links made while the PDF lived beside the Wetlab article.
    if (doc.body?.dataset.page === "wet-lab") {
      const redirect = () => {
        if (!/^#(?:notebook(?:-(?:assembly|reporter|growth-response|assay))?|assay-notebook)$/.test(win.location.hash)) return;
        const destination = new URL("wet-lab-notebook.html", win.location.href);
        destination.search = win.location.search;
        destination.hash = win.location.hash;
        win.location.replace(destination.href);
      };
      win.addEventListener("hashchange", redirect);
      redirect(); return;
    }
    const panel = doc.getElementById("notebook");
    if (!panel || panel.dataset.readerReady) return;
    panel.dataset.readerReady = "true";
    const frame = panel.querySelector("[data-notebook-frame]");
    const select = panel.querySelector("[data-notebook-select]");
    if (!frame || !select) return;
    const pdf = frame.getAttribute("src").split("#")[0];
    const anchors = Object.fromEntries([...panel.querySelectorAll("[data-notebook-page]")].map(anchor => [anchor.id, Number(anchor.dataset.notebookPage)]));
    const validPages = new Set([1, ...Object.values(anchors)]);
    let current = 1;
    function showPage(value) {
      const requested = Number(value);
      const page = validPages.has(requested) ? requested : 1;
      select.value = String(page);
      if (current !== page) {
        // Native PDF viewers can ignore fragment-only updates. A page-specific
        // query makes this a real frame navigation while retaining PDF controls.
        const separator = pdf.includes("?") ? "&" : "?";
        frame.setAttribute("src", `${pdf}${separator}notebook-page=${page}#page=${page}&view=FitH&navpanes=0`);
        current = page;
      }
    }
    function followHash(hash = win.location.hash) {
      const page = pageFromHash(hash, anchors);
      if (page) showPage(page);
    }
    select.addEventListener("change", () => showPage(select.value));
    win.addEventListener("hashchange", () => followHash());
    doc.addEventListener("click", event => {
      const link = event.target.closest?.('a[href^="#"]');
      if (link) followHash(link.getAttribute("href"));
    });
    followHash();
    return { showPage, followHash };
  }
  const api = { init, pageFromHash };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else init(root, root.document);
})(typeof window === "undefined" ? globalThis : window);
