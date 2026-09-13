(function () {
  if (document.body.dataset.page !== "home") return;

  const hero = document.getElementById("renataHero");
  const story = document.getElementById("renataProjectStory");
  const main = document.getElementById("siteMain");

  if (!hero || !story || !main) return;

  story.insertAdjacentHTML(
    "afterbegin",
    `<div class="renata-story-chapter" aria-hidden="true">PATHWAY / STORY</div>`
  );

})();
