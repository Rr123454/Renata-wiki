(function setupInteractions() {
  const revealElements = document.querySelectorAll(".reveal");
  const scrollProgress = document.getElementById("scrollProgress");
  const scrollTrailFill = document.getElementById("scrollTrailFill");
  const navbar = document.getElementById("navbar");
  const heroCard = document.getElementById("heroCard");
  const heroLogo = document.getElementById("heroLogo");
  const heroSection = document.getElementById("home");
  const heroSpotlight = document.getElementById("heroSpotlight");
  const magneticElements = document.querySelectorAll("[data-magnetic]");
  const tiltCards = document.querySelectorAll(".tilt-card");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");
  const parallaxElements = document.querySelectorAll(".parallax-element");
  const orb1 = document.querySelector(".bg-orb-1");
  const orb2 = document.querySelector(".bg-orb-2");
  const orb3 = document.querySelector(".bg-orb-3");
  const emberField = document.getElementById("emberField");

  const customCursor = document.getElementById("customCursor");
  const customCursorDot = document.getElementById("customCursorDot");

  const pcsSection = document.getElementById("pcs");
  const pcsRailFill = document.getElementById("pcsRailFill");
  const pcsDots = document.querySelectorAll(".pcs-dot");
  const pcsCards = document.querySelectorAll(".pcs-step-card");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((el) => observer.observe(el));

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function updateNavActive(scrollTop) {
    let currentSection = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 160;
      const height = section.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  function updatePCSProgress() {
    if (!pcsSection || !pcsRailFill || pcsCards.length === 0) return;

    const rect = pcsSection.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const total = rect.height + viewHeight * 0.35;
    const traveled = viewHeight - rect.top - viewHeight * 0.16;
    const progress = clamp(traveled / total, 0, 1);

    pcsRailFill.style.height = `${progress * 100}%`;

    pcsCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const active =
        cardRect.top < viewHeight * 0.68 &&
        cardRect.bottom > viewHeight * 0.34;

      card.classList.toggle("active-step", active);
      if (pcsDots[index]) {
        pcsDots[index].classList.toggle("active", active);
      }
    });
  }

  function updateParallax(scrollTop) {
    parallaxElements.forEach((el) => {
      const speed = Number(el.dataset.parallaxSpeed || 0.1);
      el.style.transform = `translateY(${scrollTop * speed * -0.18}px)`;
    });

    if (orb1) orb1.style.transform = `translateY(${scrollTop * 0.10}px)`;
    if (orb2) orb2.style.transform = `translateY(${scrollTop * -0.08}px)`;
    if (orb3) orb3.style.transform = `translateY(${scrollTop * 0.06}px)`;
  }

  function updateScrollEffects() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = progress + "%";
    if (scrollTrailFill) scrollTrailFill.style.height = progress + "%";

    if (navbar) {
      if (scrollTop > 18) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    updateNavActive(scrollTop);
    updatePCSProgress();
    updateParallax(scrollTop);
  }

  window.addEventListener("scroll", updateScrollEffects, { passive: true });
  window.addEventListener("load", updateScrollEffects);
  window.addEventListener("resize", updateScrollEffects);

  if (heroSection && heroSpotlight) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      heroSpotlight.style.setProperty("--spotlight-x", `${x}%`);
      heroSpotlight.style.setProperty("--spotlight-y", `${y}%`);
    });

    heroSection.addEventListener("mouseleave", () => {
      heroSpotlight.style.setProperty("--spotlight-x", "50%");
      heroSpotlight.style.setProperty("--spotlight-y", "50%");
    });
  }

  magneticElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.10}px, ${y * 0.10}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -10;
      const rotateY = ((x / rect.width) - 0.5) * 10;

      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  if (heroCard && heroLogo) {
    heroCard.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 900) return;

      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -11;
      const rotateY = ((x / rect.width) - 0.5) * 11;

      heroCard.style.transform =
        `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      heroLogo.style.transform = "translateZ(26px) scale(1.05)";
    });

    heroCard.addEventListener("mouseleave", () => {
      heroCard.style.transform = "";
      heroLogo.style.transform = "";
    });
  }

  pcsDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      const target = pcsCards[index];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  function createEmbers(count = 18) {
    if (!emberField) return;

    for (let i = 0; i < count; i += 1) {
      const ember = document.createElement("span");
      ember.className = "ember";
      ember.style.left = `${Math.random() * 100}%`;
      ember.style.top = `${60 + Math.random() * 45}%`;
      ember.style.animationDuration = `${7 + Math.random() * 8}s`;
      ember.style.animationDelay = `${Math.random() * 8}s`;
      ember.style.width = `${5 + Math.random() * 6}px`;
      ember.style.height = ember.style.width;
      emberField.appendChild(ember);
    }
  }

  createEmbers();

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;

    if (customCursor && customCursorDot && window.innerWidth > 768) {
      customCursor.style.transform = `translate(${cursorX - 21}px, ${cursorY - 21}px)`;
      customCursorDot.style.transform = `translate(${dotX - 5}px, ${dotY - 5}px)`;
    }

    requestAnimationFrame(animateCursor);
  }

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const interactiveSelectors = "a, button, .card, .pcs-step-card, .hero-card, .contact-box";

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (customCursor) customCursor.classList.add("active");
    });

    el.addEventListener("mouseleave", () => {
      if (customCursor) customCursor.classList.remove("active");
    });
  });

  animateCursor();
})();