"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { DEAL_TIMING, dealFrames, dealerArt, createDealController } = require("../js/team-deal.js");
const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");

test("cards start at the deck and settle in their exact grid position", () => {
  const origin = { left: 400, top: 80, width: 70, height: 80 };
  for (const [left, top, width] of [[20,300,240],[720,600,180],[20,220,140]]) {
    const target = { left, top, width, height: 280 };
    const frames = dealFrames(origin, target, 1);
    assert.ok(frames[0].transform.includes(`translate(${435-left-width/2}px, ${120-top-140}px)`));
    assert.equal(frames.at(-1).transform, "translate(0, 0) rotate(0deg) scale(1)");
    assert.equal(frames.at(-1).opacity, 1);
    assert.equal(frames[0].opacity, 1, "cards are visible immediately at the slot");
    assert.ok(frames[1].transform.includes(`translate(${435-left-width/2}px, ${152-top-140}px)`), "feed straight down before fanning outward");
  }
});

test("individual cards use distinct intermediate flight paths and share an exact landing", () => {
  const origin = { left: 400, top: 80, width: 70, height: 18 };
  const target = { left: 40, top: 420, width: 180, height: 280 };
  const flights = [0, 1, 2].map(index => dealFrames(origin, target, index));
  assert.equal(new Set(flights.map(frames => JSON.stringify(frames.slice(1, -1)))).size, 3);
  for (const frames of flights) {
    assert.deepEqual(frames.at(-1), flights[0].at(-1));
    assert.equal(frames.at(-1).opacity, 1);
  }
});

test("flying cards can pass above the machine without an ancestor stacking trap", () => {
  const css = read("css/team-deal.css");
  assert.match(css, /#siteMain \.team-card-table \.team-group-section\s*\{[^}]*z-index:\s*auto/);
  const dealerZ = Number(css.match(/#siteMain \.team-dealer\s*\{[^}]*z-index:\s*(\d+)/)[1]);
  const cardZ = Number(css.match(/\.member-card\.is-dealing\s*\{[^}]*z-index:\s*(\d+)/)[1]);
  assert.ok(cardZ > dealerZ, "each flying card clears the opaque dealer band");
});

test("the enhancement is team-only and does not select or replace the photo", () => {
  const js = read("js/team-deal.js");
  assert.match(js, /document.body.dataset.page !== "team"/);
  assert.match(js, /document.querySelector\("\.team-roster"\)/);
  assert.doesNotMatch(js, /team-photo|siteMain.*innerHTML/);
  const css = read("css/team-deal.css");
  assert.doesNotMatch(css, /team-photo/);
  const html = read("team.html");
  assert.ok(html.indexOf("js/team-deal.js") > html.indexOf("js/site.js"));
  assert.ok(html.indexOf("css/cosmic-theme.css") > html.indexOf("css/team-deal.css"));
});

test("dealing preserves roster order and offers an immediate complete roster", () => {
  const js = read("js/team-deal.js");
  assert.match(js, /for \(const card of cards\)/);
  assert.match(js, /while \(card.firstChild\) front.appendChild\(card.firstChild\)/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /if \(reduced.matches \|\| !cards.every/);
  assert.match(js, /data-deal-show/);
  assert.match(js, /window.addEventListener\("scroll", controller.onScroll, \{ passive: true \}\)/);
<<<<<<< HEAD
  assert.match(read("team.html"), /js\/team-deal.js\?v=[a-f0-9]{12}/);
=======
  assert.match(read("team.html"), /js\/team-deal.js\?v=20261020-individual-flight1/);
>>>>>>> d6c6ec967570a02b9fc9905f351444e63877e6ce
});

// Exercise the real controller with a deterministic clock and scrollable layout.
function harness(tops = [300, 300, 300, 300, 300]) {
  let now = 0, nextId = 0, scroll = 0;
  const jobs = new Map(), starts = [], handMotions = [];
  const view = {
    innerHeight: 800, innerWidth: 1920,
    setTimeout(fn, delay) { const id = ++nextId; jobs.set(id, { fn, at: now + delay }); return id; },
    clearTimeout(id) { jobs.delete(id); },
    requestAnimationFrame(fn) { return this.setTimeout(fn, 16); },
    cancelAnimationFrame(id) { this.clearTimeout(id); }
  };
  function animate(frames, options) {
    let resolve, reject, finished = false;
    const motion = { frames, options, canceled: false,
      finished: new Promise((yes, no) => { resolve = yes; reject = no; }),
      cancel() {
        motion.canceled = true; view.clearTimeout(job);
        if (!finished) { finished = true; reject(new Error("canceled")); }
      }
    };
    const job = view.setTimeout(() => { finished = true; resolve(); }, options.duration);
    return motion;
  }
  const cards = tops.map((top, index) => {
    const classes = new Set(), motions = [];
    return {
      motions,
      classList: {
        add(...names) { names.forEach(name => classes.add(name)); },
        remove(...names) { names.forEach(name => classes.delete(name)); },
        contains(name) { return classes.has(name); }
      },
      getBoundingClientRect: () => ({ top: top - scroll, bottom: top - scroll + 240, left: index * 150, right: index * 150 + 140, width: 140, height: 240 }),
      querySelector: () => ({ animate }),
      animate(frames, options) {
        starts.push(index);
        const motion = animate(frames, options); motions.push(motion); return motion;
      }
    };
  });
  const page = { hidden: false }, reduced = { matches: false }, replay = {};
  const controller = createDealController({
    cards, view, page, reduced, replay,
    dealer: { getBoundingClientRect: () => ({ bottom: 200 }) },
    deck: { getBoundingClientRect: () => ({ top: 80, left: 400, width: 70, height: 80 }) },
    hand: {
      animate(frames, options) { const motion = animate(frames, options); handMotions.push(motion); return motion; },
      querySelectorAll: () => ["little", "ring", "middle", "index", "thumb"].map(finger => ({ dataset: { finger },
        animate(frames, options) { const motion = animate(frames, options); motion.finger = finger; handMotions.push(motion); return motion; }
      }))
    }
  });
  async function tick(ms) {
    const end = now + ms;
    for (;;) {
      const next = [...jobs].filter(([, job]) => job.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      now = next[1].at; jobs.delete(next[0]); next[1].fn();
      await Promise.resolve(); await Promise.resolve();
    }
    now = end;
    await Promise.resolve();
  }
  return { cards, starts, handMotions, page, reduced, replay, controller, tick,
    scrollTo(value) { scroll = value; controller.onScroll(); },
    waiting: () => cards.filter(card => card.classList.contains("is-waiting")),
    dealing: () => cards.filter(card => card.classList.contains("is-dealing"))
  };
}

test("a five-card row launches individually and lands in 1320ms", async () => {
  const h = harness(); h.controller.begin();
  await h.tick(159); assert.deepEqual(h.starts, [0]);
  await h.tick(1); assert.deepEqual(h.starts, [0, 1]);
  await h.tick(1159);
  assert.deepEqual(h.starts, [0, 1, 2, 3, 4]);
  assert.equal(DEAL_TIMING.flight, 680);
  assert.equal(DEAL_TIMING.stagger, 160);
  assert.equal(h.dealing().length, 1, "the last card is still finishing its own flight");
  await h.tick(1);
  assert.equal(h.waiting().length, 0); assert.equal(h.dealing().length, 0);
  assert.ok(h.cards.every(card => card.motions.length === 1), "each roster card has one individual animation");
});

test("the loading overlay cannot consume the initial card flights", async () => {
  const h = harness([300, 300]);
  let loading = true;
  h.page.querySelector = selector => selector === ".site-loader" && loading ? {} : null;
  h.controller.begin();
  await h.tick(700);
  assert.deepEqual(h.starts, []);
  assert.equal(h.waiting().length, 2);
  loading = false;
  await h.tick(100);
  assert.deepEqual(h.starts, [0]);
  await h.tick(840);
  assert.deepEqual(h.starts, [0, 1]);
  assert.equal(h.waiting().length, 0);
  assert.equal(h.dealing().length, 0);
});

test("Show all remains immediate while the loading overlay is present", async () => {
  const h = harness();
  h.page.querySelector = selector => selector === ".site-loader" ? {} : null;
  h.controller.begin();
  await h.tick(100);
  h.controller.showAll();
  await h.tick(1000);
  assert.deepEqual(h.starts, []);
  assert.equal(h.waiting().length, 0);
});

test("cards keep their faces while the machine pulses for each individual launch", async () => {
  const js = read("js/team-deal.js");
  assert.doesNotMatch(js, /rotateY|team-card-back|backface/, "the flip and the card back are gone");
  assert.doesNotMatch(js, /data-deal-replay/, "only Show all cards remains");
  assert.match(js, /data-deal-show/);
  assert.match(js, /duration: DEAL_TIMING.stagger/);
  const slide = js.match(/handMotion = hand\.animate\(\[[\s\S]*?\]/)[0];
  assert.match(slide, /translateY\(/);
  assert.match(slide, /scaleY\(\.97\)/, "a short feed pulse accompanies dispensing");
  assert.match(dealerArt(), /assets\/story\/dealer-machine.png/);
  assert.ok(fs.existsSync(path.join(__dirname, "../assets/story/dealer-machine.png")));
  assert.doesNotMatch(dealerArt(), /team-dealer-hand|data-finger/);
  assert.match(dealerArt(), /team-deck-source/);
});

test("a fast jump prioritizes visible cards and defers interrupted and skipped rows", async () => {
  const h = harness([320,320,1100,1100,1500,1500]);
  h.controller.begin(); await h.tick(0);
  h.scrollTo(1400);
  assert.equal(h.cards[0].motions[0].canceled, true);
  assert.equal(h.dealing().length, 0);
  await h.tick(16);
  assert.ok(h.cards.slice(0,4).every(card => card.classList.contains("is-waiting")));
  await h.tick(74); assert.deepEqual(h.starts, [0,4]);
  h.scrollTo(0); await h.tick(1500);
  assert.deepEqual(h.starts, [0,4,0,1], "returning upward deals the deferred cards");
  assert.ok(h.cards.slice(0,2).every(card => !card.classList.contains("is-waiting")));
  assert.ok(h.cards.slice(2).every(card => card.classList.contains("is-waiting")));
  h.scrollTo(3000); await h.tick(100);
  assert.equal(h.waiting().length, 4, "off-screen cards remain queued");
  h.scrollTo(0); await h.tick(1500);
  assert.deepEqual(h.starts, [0,4,0,1], "completed cards never replay automatically");
  h.scrollTo(900); await h.tick(90);
  assert.deepEqual(h.starts, [0,4,0,1,2], "a skipped middle row starts when it returns");
  h.controller.showAll();
});

test("small scrolls preserve a visible card’s glide instead of snapping it into place", async () => {
  const h = harness([320, 320]);
  h.controller.begin(); await h.tick(160);
  const motion = h.cards[0].motions[0];
  h.scrollTo(20);
  assert.equal(motion.canceled, false);
  assert.equal(h.cards[0].classList.contains("is-dealing"), true);
  await h.tick(1000);
  assert.equal(h.dealing().length, 0);
  assert.deepEqual(h.starts, [0, 1]);
});

test("starting lower in the roster deals visible students before off-screen earlier rows", async () => {
  const h = harness([320,320,1100,1100,2000,2000]);
  h.scrollTo(1900); h.controller.begin(); await h.tick(1500);
  assert.deepEqual(h.starts, [4,5]);
  assert.equal(h.waiting().length, 4);
  h.scrollTo(900); await h.tick(1500);
  assert.deepEqual(h.starts, [4,5,2,3]);
  h.scrollTo(0); await h.tick(1500);
  assert.deepEqual(h.starts, [4,5,2,3,0,1]);
  assert.equal(h.waiting().length, 0);
});

test("keyboard focus reveals its selected card without consuming off-screen cards", async () => {
  const h = harness([320,1100,2000]); h.controller.begin();
  h.controller.showCard(h.cards[1]);
  assert.equal(h.cards[1].classList.contains("is-waiting"), false);
  assert.equal(h.waiting().length, 2);
  await h.tick(1500);
  assert.deepEqual(h.starts, [0]);
  assert.equal(h.cards[2].classList.contains("is-waiting"), true);
  h.controller.showAll();
});

test("cards outside the viewport horizontally stay queued until layout brings them in", async () => {
  const h = harness([300,300]);
  const bounds = h.cards[1].getBoundingClientRect;
  h.cards[1].getBoundingClientRect = () => ({ ...bounds(), left: 2000, right: 2140 });
  h.controller.begin(); await h.tick(1500);
  assert.deepEqual(h.starts, [0]); assert.equal(h.waiting().length, 1);
  h.cards[1].getBoundingClientRect = bounds;
  h.controller.onScroll(); await h.tick(1500);
  assert.deepEqual(h.starts, [0,1]); assert.equal(h.waiting().length, 0);
});

test("rapid wheel bursts wait for settled layout before starting another flight", async () => {
  const h = harness([1000,1000,1000]); h.controller.begin(); await h.tick(0);
  for (const offset of [100,200,300,400,500,600]) {
    h.scrollTo(offset); await h.tick(16);
    assert.equal(h.starts.length, 0);
  }
  await h.tick(33); assert.equal(h.starts.length, 0);
  await h.tick(1); assert.deepEqual(h.starts, [0]);
  assert.ok(h.cards[0].motions[0].frames[0].transform.includes("-400px"), "fresh scrolled target coordinates");
  h.controller.showAll();
});

test("cards partly behind the dealer can deal without another intersection callback", async () => {
  const h = harness([100,100,100]); h.controller.begin();
  await h.tick(1500);
  assert.deepEqual(h.starts, [0,1,2]); assert.equal(h.waiting().length, 0);
  h.controller.showAll();
});

test("canceling an old replay cannot clear the new flight's state", async () => {
  const h = harness([300]); h.controller.begin(); await h.tick(0);
  const old = h.cards[0].motions[0];
  h.controller.begin(); await h.tick(0);
  assert.equal(old.canceled, true);
  assert.equal(h.dealing().length, 1);
  assert.equal(h.cards[0].motions[1].canceled, false);
  await h.tick(850); assert.equal(h.dealing().length, 0);
});

test("Show all, reduced motion and unavailable animation always expose the roster", async () => {
  const h = harness(); h.controller.begin(); await h.tick(0);
  h.controller.showAll(); h.scrollTo(100); await h.tick(1000);
  assert.equal(h.waiting().length, 0); assert.equal(h.dealing().length, 0);
  assert.equal(h.starts.length, 1);
  h.reduced.matches = true; h.controller.begin(); await h.tick(1000);
  assert.equal(h.waiting().length, 0); assert.equal(h.replay.disabled, true);
  h.reduced.matches = false; h.cards[0].animate = undefined;
  h.controller.begin(); await h.tick(1000); assert.equal(h.waiting().length, 0);
});

test("leaving the browser tab settles active cards and resumes the queue on return", async () => {
  const h = harness(); h.controller.begin(); await h.tick(0);
  h.page.hidden = true; h.controller.onVisibilityChange(); await h.tick(1000);
  assert.equal(h.dealing().length, 0); assert.deepEqual(h.starts, [0]);
  h.page.hidden = false; h.controller.onVisibilityChange(); await h.tick(1500);
  assert.deepEqual(h.starts, [0,1,2,3,4]); assert.equal(h.waiting().length, 0);
});


test("each card triggers machine recoil", async () => {
  const h = harness(); h.controller.begin(); await h.tick(640);
  assert.equal(h.starts.length, 5);
  assert.equal(h.handMotions.length, 5);
  assert.ok(h.handMotions.every(m => m.options.duration === DEAL_TIMING.stagger));
  h.controller.showAll();
});

test("the machine feed pulse settles safely when motion is stopped", async () => {
  const h = harness(); h.controller.begin(); await h.tick(0);
  assert.equal(h.handMotions.length, 1);
  assert.equal(h.handMotions[0].frames[1].transform, "translateY(-3px) scaleY(.97)");
  h.scrollTo(20);
  assert.ok(h.handMotions.every(m => !m.canceled), "small scrolls preserve the release gesture");
  h.controller.showAll();
  assert.ok(h.handMotions.every(m => m.canceled));
  assert.equal(h.dealing().length, 0);
  await h.tick(1000);
  assert.equal(h.handMotions.length, 1, "stopped motion cannot restart itself");
});
