/* Progressive enhancement of the rendered roster. The team photo is untouched. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else api.init();
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";
  // Separate launches enough to follow each card from the slot to its own place.
  const DEAL_TIMING = Object.freeze({ flight: 680, stagger: 160, scrollSettle: 50 });
  function dealFrames(origin, target, index) {
    const x = origin.left + origin.width / 2 - target.left - target.width / 2;
    const y = origin.top + origin.height / 2 - target.top - target.height / 2;
    const tilt = x > 0 ? 18 : -18;
    const fan = (index % 3 - 1) * 12;
    const launchScale = Math.min(.32, origin.width / target.width);
    return [
      { transform: `translate(${x}px, ${y}px) rotate(0deg) scale(${launchScale}, .035)`, opacity: 1, offset: 0 },
      // Feed straight out of the slot before the card fans toward its destination.
      { transform: `translate(${x}px, ${y + 32}px) rotate(0deg) scale(${launchScale}, .18)`, opacity: 1, offset: .18 },
      { transform: `translate(${x + fan}px, ${y + 76}px) rotate(${tilt}deg) scale(.38)`, opacity: 1, offset: .36, easing: "cubic-bezier(.2,.7,.3,1)" },
      { transform: `translate(${x * .16}px, ${y * .12 - 12}px) rotate(${-tilt * .2}deg) scale(.92)`, opacity: 1, offset: .78 },
      { transform: "translate(0, -3px) rotate(-.3deg) scale(1.015)", opacity: 1, offset: .94 },
      { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1, offset: 1 }
    ];
  }
  function dealerArt() {
    return `<svg class="team-dealer-art" viewBox="0 0 300 180" aria-hidden="true">
      <g class="team-dealer-machine">
        <image href="assets/story/dealer-machine.png" x="0" y="0" width="300" height="180" preserveAspectRatio="xMidYMid meet"/>
        <!-- Cards launch from the machine's front output slot. -->
        <rect class="team-deck-source" x="115" y="111" width="70" height="18" fill="transparent"/>
      </g>
    </svg>`;
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
    function settleActive(deferOffscreen = false, keepVisible = false) {
      [...active.keys()].forEach(card => {
        // Visible flights keep gliding toward their own grid position while
        // the page moves. Cancel only cards whose resting position left view.
        const parent = card.offsetParent;
        const bounds = parent ? parent.getBoundingClientRect() : null;
        const target = bounds ? { top: bounds.top + card.offsetTop + parent.clientTop, bottom: bounds.top + card.offsetTop + parent.clientTop + card.offsetHeight,
          left: bounds.left + card.offsetLeft + parent.clientLeft, right: bounds.left + card.offsetLeft + parent.clientLeft + card.offsetWidth } : card.getBoundingClientRect();
        if (keepVisible && isVisible(target)) return;
        // Cancel the transform before measuring its actual grid position.
        settle(card);
        if (deferOffscreen && !isVisible(card.getBoundingClientRect())) card.classList.add("is-waiting");
      });
      if (!keepVisible || !active.size) {
        if (handMotion) { handMotion.cancel(); handMotion = null; }
      }
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
      // Do not spend the initial flights behind the loading-screen overlay.
      if (page.querySelector?.(".site-loader")) { scheduleDeal(100); return; }
      const next = visibleWaiting();
      if (!next) return;
      const { card, bounds } = next;
      card.classList.remove("is-waiting"); card.classList.add("is-dealing");
      const motion = card.animate(dealFrames(deck.getBoundingClientRect(), bounds, cards.indexOf(card)), {
        duration: DEAL_TIMING.flight, easing: "linear"
      });
      const motions = [motion];
      active.set(card, motions);
      // Canceled flights from a previous replay must never alter the new deal.
      const finish = () => { if (active.get(card) === motions) settle(card); };
      motion.finished.then(finish, finish);
      // Each emitted card triggers a short recoil, like powered feed rollers.
      {
        if (handMotion) handMotion.cancel();
        handMotion = hand.animate([
          { transform: "translateY(0) scaleY(1)" },
          { transform: "translateY(-3px) scaleY(.97)", offset: .18 },
          { transform: "translateY(2px) scaleY(1.02)", offset: .52 },
          { transform: "translateY(-1px) scaleY(.99)", offset: .8 },
          { transform: "translateY(0) scaleY(1)" }
        ], { duration: DEAL_TIMING.stagger, easing: "cubic-bezier(.22,.7,.25,1)" });
        handMotion.finished.catch(() => {});
      }
      scheduleDeal(DEAL_TIMING.stagger);
    }
    function onScroll() {
      if (!enabled) return;
      // Keep visible flights smooth; queue off-screen cards for their next visit.
      stopTimer(); settleActive(true, true);
      scheduleDeal(DEAL_TIMING.scrollSettle);
    }
    function onVisibilityChange() {
      if (page.hidden) { stopPending(); settleActive(true); }
      else if (enabled) scheduleDeal(0);
    }
    function begin() {
      showAll();
      if (replay) replay.disabled = reduced.matches;
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
      ${dealerArt()}
      <div class="team-dealer-actions"><button type="button" data-deal-show>Show all cards</button></div>`;
    roster.prepend(dealer);
    groups.forEach((group, groupIndex) => {
      group.querySelector(".detail-eyebrow").textContent = `0${groupIndex + 1} / ${group.querySelectorAll(".member-card").length} people`;
      [...group.querySelectorAll(".member-card")].forEach((card, index) => {
        const inner = document.createElement("div"), front = document.createElement("div");
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
        inner.append(front);
        card.appendChild(inner);
      });
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const replay = null;
    const deck = dealer.querySelector(".team-deck-source");
    const hand = dealer.querySelector(".team-dealer-machine");
    const controller = createDealController({ cards, dealer, deck, hand, replay, reduced, view: window, page: document });
    function measureHeader() {
      const header = document.getElementById("siteHeader");
      roster.style.setProperty("--dealer-top", `${header ? header.getBoundingClientRect().height : 0}px`);
      roster.style.setProperty("--dealer-height", `${dealer.getBoundingClientRect().height}px`);
    }
    dealer.querySelector("[data-deal-show]").addEventListener("click", controller.showAll);
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
  return { DEAL_TIMING, dealFrames, dealerArt, createDealController, init };
});
