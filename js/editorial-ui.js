(function () {
  if (document.body.dataset.page === "home") return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "renata-back-to-top";
  button.setAttribute("aria-label", "Back to top");
  button.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.appendChild(button);

  function updateBackToTop() {
    button.classList.toggle("visible", window.scrollY > 520);
  }

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  /* Project Description: keep the lightweight section list useful while reading. */
  const sections = [...document.querySelectorAll(".project-paper-section[id]")];
  const links = [...document.querySelectorAll('#project-panel-links a[href^="#"]')];

  if (sections.length && links.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (!visible) return;

        links.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("current", isCurrent);
          if (isCurrent) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0, 0.12, 0.35],
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
})();
