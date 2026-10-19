/* A visual identity layer. Dealing, portraits, profiles and roster order stay
   under their existing controllers. No layout measurements or animation loops. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else api.init(root.document);
})(typeof window === "undefined" ? globalThis : window, function () {
  "use strict";

  function setText(scope, selector, text) {
    const element = scope.querySelector(selector);
    if (element) element.textContent = text;
  }

  function init(doc) {
    if (doc?.body?.dataset.page !== "team") return false;
    const roster = doc.querySelector(".team-card-table");
    if (!roster || roster.dataset.teamSpace) return false;
    roster.dataset.teamSpace = "true";

    const hero = doc.querySelector(".orbit-page-hero");
    if (hero) {
      const lines = hero.querySelectorAll(".orbit-title-line > span");
      if (lines.length === 2) {
        lines[0].textContent = "Our team.";
        lines[1].textContent = "The SulFlux crew.";
      }
      setText(hero, ".orbit-page-lead", "Meet the mentors and students behind Renata. Open a crew card to discover the people shaping SulFlux.");
      setText(hero, ".orbit-scene-caption > span", "RENATA / SULFLUX CREW");
      setText(hero, ".orbit-scene-center text", "SULFLUX / CREW");
      const bottle = hero.querySelector(".orbit-scene-center image");
      if (bottle) {
        bottle.setAttribute("href", "assets/orbit/bottle.svg");
        bottle.setAttribute("x", "248");
        bottle.setAttribute("y", "160");
        bottle.setAttribute("width", "104");
        bottle.setAttribute("height", "165");
        bottle.classList.add("team-space-bottle");
      }
    }

    setText(roster, ".team-dealer-copy > span", "Renata / SulFlux crew");
    setText(roster, ".team-dealer-copy > strong", "Meet the people on board.");
    setText(roster, ".team-dealer-copy > p", "Mentors, then students. Select a card to meet a team member.");
    setText(roster, ".team-dealer-art text", "S");
    return true;
  }

  return { init };
});
