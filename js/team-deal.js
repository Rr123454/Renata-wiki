/* Progressive enhancement of the rendered roster. The team photo is untouched. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else api.init();
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";
  // Cards follow the scroll closely, so the flight is short and the gap between
  // cards is small enough that a row lands almost together.
  const DEAL_TIMING = Object.freeze({ flight: 420, stagger: 55, hand: 320, scrollSettle: 50 });
  function dealFrames(origin, target, index) {
    const x = origin.left + origin.width / 2 - target.left - target.width / 2;
    const y = origin.top + origin.height / 2 - target.top - target.height / 2;
    const tilt = x > 0 ? 12 : -12;
    return [
      { transform: `translate(${x}px, ${y}px) rotate(${tilt + index % 3 * 3}deg) scale(.18)`, opacity: 0, offset: 0 },
      { transform: `translate(${x * .82}px, ${y * .62 - 24}px) rotate(${tilt * .7}deg) scale(.46)`, opacity: 1, offset: .25 },
      { transform: `translate(${x * .26}px, ${y * .12 - 14}px) rotate(${tilt * .2}deg) scale(.88)`, opacity: 1, offset: .65 },
      { transform: "translate(0, -2px) rotate(-.3deg) scale(1)", opacity: 1, offset: .92 },
      { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1, offset: 1 }
    ];
  }
  function dealerArt() {
    return `<svg class="team-dealer-art" viewBox="0 0 300 180" aria-hidden="true">
      <defs><linearGradient id="dealer-skin" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffe8cd"/><stop offset="1" stop-color="#eab18c"/></linearGradient><linearGradient id="dealer-card" x2="1" y2="1"><stop stop-color="#f8b879"/><stop offset="1" stop-color="#db8050"/></linearGradient></defs>
      <ellipse cx="141" cy="153" rx="101" ry="13" fill="#051c48" opacity=".4"/>
      <g class="team-deck-fan" stroke="#10295d" stroke-width="2.5" fill="#d78959"><rect x="72" y="66" width="84" height="100" rx="9" transform="rotate(-17 114 116)"/><rect x="75" y="59" width="84" height="100" rx="9" transform="rotate(10 117 109)"/><path d="M78 154 147 174M73 150 145 170" stroke="#fff1bc" stroke-width="1.5" opacity=".7"/></g>
      <g class="team-deck-source"><rect x="76" y="52" width="84" height="100" rx="9" fill="url(#dealer-card)" stroke="#10295d" stroke-width="2.5"/><rect x="83" y="59" width="70" height="86" rx="6" fill="none" stroke="#ffe5b7" stroke-width="1.5"/><path d="m118 76 22 26-22 26-22-26Z" fill="#fff1bc" stroke="#173e84" stroke-width="1.5"/><text x="118" y="110" text-anchor="middle" font-family="Trebuchet MS,sans-serif" font-weight="800" font-size="22" fill="#173e84">S</text><path d="m90 68 3 3-3 3-3-3Zm56 64 3 3-3 3-3-3Z" fill="#fff1bc"/></g>
      <g class="team-dealer-hand" stroke="#805440" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" fill="url(#dealer-skin)">
        <!-- A relaxed side-on grip: four curled fingers support the edge;
             the opposing thumb rests on the top card. -->
        <path d="M251 91 225 78Q209 68 192 79L170 94Q158 106 164 120L178 141Q190 153 209 145L235 136 259 128Z"/>
        <g class="team-dealer-finger" data-finger="little" style="--finger-pivot:218px 116px">
          <path d="M226 115 222 139Q220 151 210 151Q201 151 201 142L205 125"/>
          <path d="M208 140q4-3 9-1l-1 6q-4 3-8 0Z" fill="#fff0dd" stroke="#bc876a" stroke-width=".8"/>
        </g>
        <g class="team-dealer-finger" data-finger="ring" style="--finger-pivot:202px 113px">
          <path d="M212 114 206 146Q203 158 192 157Q182 155 185 143L191 120"/>
          <path d="M191 144q5-3 10 0l-2 7q-4 2-9-1Z" fill="#fff0dd" stroke="#bc876a" stroke-width=".8"/>
          <path d="m192 133 11 2" fill="none" stroke="#c78e71" stroke-width="1"/>
        </g>
        <g class="team-dealer-finger" data-finger="middle" style="--finger-pivot:185px 108px">
          <path d="M195 110 187 143Q183 155 173 153Q162 151 166 139L175 114"/>
          <path d="M173 140q5-3 10 1l-3 7q-5 1-9-2Z" fill="#fff0dd" stroke="#bc876a" stroke-width=".8"/>
          <path d="m175 128 11 3" fill="none" stroke="#c78e71" stroke-width="1"/>
        </g>
        <g class="team-dealer-finger" data-finger="index" style="--finger-pivot:172px 102px">
          <path d="M183 105 172 133Q167 145 157 141Q148 138 152 128L164 103"/>
          <path d="M158 128q5-2 10 2l-3 7q-5 1-9-3Z" fill="#fff0dd" stroke="#bc876a" stroke-width=".8"/>
          <path d="m161 119 11 4" fill="none" stroke="#c78e71" stroke-width="1"/>
        </g>
        <path d="M226 84Q207 74 190 83L171 97 161 112Q178 122 191 113L208 102" stroke="none"/>
        <g class="team-dealer-finger" data-finger="thumb" style="--finger-pivot:208px 97px">
          <path d="M211 87Q195 82 182 88L146 100Q134 104 138 114Q142 124 155 120L184 113Q201 115 211 105"/>
          <path d="M142 105q4-3 10-3l4 11q-5 4-10 2-5-3-4-10Z" fill="#fff0dd" stroke="#bc876a" stroke-width=".9"/>
          <path d="m173 99 5 12" fill="none" stroke="#c78e71" stroke-width="1"/>
        </g>
        <path d="M213 112q7 5 4 13m10-35 8 7" fill="none" stroke="#c78e71" stroke-width="1.2"/>
        <path d="m243 78 46 19-17 48-40-14Z" fill="#173e84" stroke="#10295d" stroke-width="2.5"/>
        <path class="team-dealer-cuff" d="m242 81 10 4-16 44-9-4Z" fill="#ffcf78" stroke-width="1"/>
        <path d="m258 88-15 42" stroke="#6586b6" stroke-width="1"/>
        <circle cx="261" cy="122" r="3" fill="#fff1bc" stroke="#10295d" stroke-width="1"/>
      </g>
    </svg>`;
  }
  function createDealController({ cards, dealer, deck, hand, replay, reduced, view, page }) {
    const active = new Map();
    let timer = 0, generation = 0, enabled = false, handMotion, handSlid = false, fingerMotions = [];
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
        fingerMotions.forEach(motion => motion.cancel()); fingerMotions = [];
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
      const next = visibleWaiting();
      if (!next) { handSlid = false; return; }
      const { card, bounds } = next;
      card.classList.remove("is-waiting"); card.classList.add("is-dealing");
      const motion = card.animate(dealFrames(deck.getBoundingClientRect(), bounds, cards.indexOf(card)), {
        duration: DEAL_TIMING.flight, easing: "cubic-bezier(.2,.65,.25,1)"
      });
      const motions = [motion];
      active.set(card, motions);
      // Canceled flights from a previous replay must never alter the new deal.
      const finish = () => { if (active.get(card) === motions) settle(card); };
      motion.finished.then(finish, finish);
      // One articulated sweep releases a fan of cards. The next visible batch
      // gets its own gesture; individual cards never make the hand jitter.
      if (!handSlid) {
        handSlid = true;
        if (handMotion) handMotion.cancel();
        fingerMotions.forEach(motion => motion.cancel());
        handMotion = hand.animate([
          { transform: "translate(0, 0) rotate(0deg)" },
          { transform: "translate(3px, -2px) rotate(1deg)", offset: .18 },
          { transform: "translate(-14px, -3px) rotate(-3deg)", offset: .52 },
          { transform: "translate(-5px, -1px) rotate(-1deg)", offset: .8 },
          { transform: "translate(0, 0) rotate(0deg)" }
        ], { duration: DEAL_TIMING.hand, easing: "cubic-bezier(.22,.7,.25,1)" });
        handMotion.finished.catch(() => {});
        fingerMotions = [...(hand.querySelectorAll?.("[data-finger]") || [])].map((finger, index) => {
          const angle = finger.dataset.finger === "thumb" ? -7 : 1.5 + index * .5;
          const motion = finger.animate([
            { transform: "rotate(0deg)" },
            { transform: `rotate(${angle}deg)`, offset: .52 },
            { transform: "rotate(0deg)" }
          ], { duration: DEAL_TIMING.hand, easing: "cubic-bezier(.22,.7,.25,1)" });
          motion.finished.catch(() => {});
          return motion;
        });
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
      handSlid = false;
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
    const hand = dealer.querySelector(".team-dealer-hand");
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
