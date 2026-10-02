/* Progressive enhancement of the rendered roster. The team photo is untouched. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else api.init();
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";
  const DEAL_TIMING = Object.freeze({ flight: 360, stagger: 50, hand: 140, scrollSettle: 90 });
  function dealFrames(origin, target, index) {
    const x = origin.left + origin.width / 2 - target.left - target.width / 2;
    const y = origin.top + origin.height / 2 - target.top - target.height / 2;
    const tilt = x > 0 ? 12 : -12;
    return [
      { transform: `translate(${x}px, ${y}px) rotate(${tilt + index % 3 * 3}deg) scale(.18)`, opacity: 0, offset: 0 },
      { transform: `translate(${x * .78}px, ${y * .68}px) rotate(${tilt}deg) scale(.42)`, opacity: 1, offset: .25 },
      { transform: "translate(0, -6px) rotate(-1deg) scale(1.01)", opacity: 1, offset: .85 },
      { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1, offset: 1 }
    ];
  }
  function createDealController({ cards, dealer, deck, hand, replay, reduced, view, page }) {
    const active = new Map();
    let timer = 0, generation = 0, enabled = false, handMotion;
    function stopTimer() { view.clearTimeout(timer); timer = 0; }
    function settle(card) {
      const motions = active.get(card);
      active.delete(card);
      card.classList.remove("is-waiting", "is-dealing");
      if (motions) motions.forEach(animation => animation.cancel());
    }
    function isVisible(bounds) {
      const top = Math.max(0, dealer.getBoundingClientRect().bottom);
      return bounds.bottom > top && bounds.top < view.innerHeight - 24
        && bounds.right > 0 && bounds.left < view.innerWidth;
    }
    function settleActive(deferOffscreen = false) {
      [...active.keys()].forEach(card => {
        // Cancel the transform before measuring its actual grid position.
        settle(card);
        if (deferOffscreen && !isVisible(card.getBoundingClientRect())) card.classList.add("is-waiting");
      });
      if (handMotion) { handMotion.cancel(); handMotion = null; }
    }
    function stopPending() {
      stopTimer();
    }
    function showAll() {
      enabled = false; generation++;
      stopPending(); settleActive();
      cards.forEach(card => card.classList.remove("is-waiting", "is-dealing"));
    }
    function visibleWaiting() {
      for (const card of cards) {
        if (!card.classList.contains("is-waiting")) continue;
        const bounds = card.getBoundingClientRect();
        // Rebuild priority from the current viewport at every deal. Cards above
        // and below it keep their place in the queue until they appear again.
        if (isVisible(bounds)) return { card, bounds };
      }
    }
    function scheduleDeal(delay) {
      stopTimer();
      if (!enabled || page.hidden) return;
      const run = generation;
      timer = view.setTimeout(() => {
        if (run !== generation) return;
        timer = 0; dealNext();
      }, delay);
    }
    function dealNext() {
      if (!enabled || page.hidden || reduced.matches) return;
      const next = visibleWaiting();
      if (!next) return;
      const { card, bounds } = next;
      card.classList.remove("is-waiting"); card.classList.add("is-dealing");
      const motion = card.animate(dealFrames(deck.getBoundingClientRect(), bounds, cards.indexOf(card)), {
        duration: DEAL_TIMING.flight, easing: "cubic-bezier(.2,.65,.25,1)"
      });
      const flip = card.querySelector(".team-card-inner").animate([
        { transform: "rotateY(-180deg)", offset: 0 },
        { transform: "rotateY(-180deg)", offset: .2 },
        { transform: "rotateY(0deg)", offset: .8 },
        { transform: "rotateY(0deg)", offset: 1 }
      ], { duration: DEAL_TIMING.flight, easing: "ease-out" });
      const motions = [motion, flip];
      active.set(card, motions);
      // Canceled flights from a previous replay must never alter the new deal.
      const finish = () => { if (active.get(card) === motions) settle(card); };
      motion.finished.then(finish, finish);
      flip.finished.catch(() => {});
      if (handMotion) handMotion.cancel();
      handMotion = hand.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(-9deg) translate(-5px, 3px)" }, { transform: "rotate(0deg)" }], { duration: DEAL_TIMING.hand });
      handMotion.finished.catch(() => {});
      scheduleDeal(DEAL_TIMING.stagger);
    }
    function onScroll() {
      if (!enabled) return;
      // Land in-flight cards before their measured deck/target positions move.
      // Resume from fresh layout once the wheel/touch/anchor movement settles.
      stopTimer(); settleActive(true);
      scheduleDeal(DEAL_TIMING.scrollSettle);
    }
    function onVisibilityChange() {
      if (page.hidden) { stopPending(); settleActive(true); }
      else if (enabled) scheduleDeal(0);
    }
    function begin() {
      showAll();
      replay.disabled = reduced.matches;
      if (reduced.matches || !cards.every(card => typeof card.animate === "function")) return;
      enabled = true;
      cards.forEach(card => card.classList.add("is-waiting"));
      scheduleDeal(0);
    }
    function showCard(card) {
      // Keyboard focus reveals only its own card, leaving other rows queued.
      if (cards.includes(card)) settle(card);
    }
    return { begin, showAll, showCard, onScroll, onVisibilityChange };
  }
  function init() {
    if (document.body.dataset.page !== "team") return;
    const roster = document.querySelector(".team-roster");
    if (!roster || roster.classList.contains("team-card-table")) return;
    const cards = [...roster.querySelectorAll(".member-card")];
    const groups = [...roster.querySelectorAll(".team-group-section")];
    roster.classList.add("team-card-table");
    const dealer = document.createElement("div");
    dealer.className = "team-dealer";
    dealer.innerHTML = `<div class="team-dealer-copy"><span>The Renata roster</span><strong>Mentors, then students.</strong><p>Scroll to meet the people behind the project.</p></div>
      <svg class="team-dealer-art" viewBox="0 0 200 120" aria-hidden="true">
        <g fill="#aebbff" stroke="#24305e" stroke-width="1.5">
          <rect x="56" y="34" width="67" height="77" rx="5" transform="rotate(-12 89 74)"/>
          <rect x="60" y="30" width="67" height="77" rx="5" transform="rotate(8 94 69)"/>
          <rect class="team-deck-source" x="61" y="27" width="67" height="77" rx="5"/>
          <rect x="67" y="33" width="55" height="65" rx="3" fill="none"/>
          <path d="M95 45 112 66 95 87 78 66Z" fill="#fffaf2"/>
        </g>
        <text x="95" y="73" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="22" fill="#24305e">R</text>
        <g class="team-dealer-hand" stroke="#24305e" stroke-width="1.5" stroke-linejoin="round">
          <path d="M187 9 169 1 143 20 116 17Q109 17 108 23L81 26Q74 27 76 32Q77 36 85 35L111 33 91 44Q85 48 90 52Q93 55 99 52L120 43 110 53Q106 60 112 62Q116 64 121 59L140 44 163 39Z" fill="#fff0d8"/>
          <path d="M163 0 185 0 200 15 179 44 163 36 178 12Z" fill="#24305e"/>
          <path d="M164 35 177 42 181 37 168 30Z" fill="#ff7180"/>
        </g>
      </svg>
      <div class="team-dealer-actions"><button type="button" data-deal-replay>Replay deal</button><button type="button" data-deal-show>Show all cards</button></div>`;
    roster.prepend(dealer);
    groups.forEach((group, groupIndex) => {
      group.querySelector(".detail-eyebrow").textContent = `0${groupIndex + 1} / ${group.querySelectorAll(".member-card").length} people`;
      [...group.querySelectorAll(".member-card")].forEach((card, index) => {
        const inner = document.createElement("div"), front = document.createElement("div"), back = document.createElement("div");
        inner.className = "team-card-inner";
        front.className = "team-card-front";
        front.dataset.cardLabel = `${group.id === "mentors" ? "M" : "S"}${String(index + 1).padStart(2, "0")}`;
        while (card.firstChild) front.appendChild(card.firstChild);
        for (const position of ["top", "bottom"]) {
          const corner = document.createElement("span");
          corner.className = `team-card-index team-card-index--${position}`;
          corner.textContent = front.dataset.cardLabel;
          corner.setAttribute("aria-hidden", "true");
          front.appendChild(corner);
        }
        back.className = "team-card-back";
        back.setAttribute("aria-hidden", "true");
        back.innerHTML = "<span>R</span>";
        inner.append(front, back);
        card.appendChild(inner);
      });
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const replay = dealer.querySelector("[data-deal-replay]");
    const deck = dealer.querySelector(".team-deck-source");
    const hand = dealer.querySelector(".team-dealer-hand");
    const controller = createDealController({ cards, dealer, deck, hand, replay, reduced, view: window, page: document });
    function measureHeader() {
      const header = document.getElementById("siteHeader");
      roster.style.setProperty("--dealer-top", `${header ? header.getBoundingClientRect().height : 0}px`);
      roster.style.setProperty("--dealer-height", `${dealer.getBoundingClientRect().height}px`);
    }
    dealer.querySelector("[data-deal-show]").addEventListener("click", controller.showAll);
    replay.addEventListener("click", controller.begin);
    reduced.addEventListener("change", controller.begin);
    roster.addEventListener("focusin", event => {
      const card = event.target.closest(".member-card");
      if (card && (card.classList.contains("is-waiting") || card.classList.contains("is-dealing"))) controller.showCard(card);
    });
    document.addEventListener("visibilitychange", controller.onVisibilityChange);
    window.addEventListener("scroll", controller.onScroll, { passive: true });
    window.addEventListener("resize", () => { measureHeader(); controller.onScroll(); });
    if (window.ResizeObserver) new ResizeObserver(measureHeader).observe(document.getElementById("siteHeader"));
    measureHeader(); controller.begin();
  }
  return { DEAL_TIMING, dealFrames, createDealController, init };
});
