/* A larger portrait and biography, opened from any roster card. */
(function (factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else api.init(window, document);
})(function () {
  "use strict";
  function profileMap(groups) {
    return new Map(groups.flatMap(group => (group.members || []).map((member, index) => [
      `${group.key}:${index}`,
      typeof member === "string" ? { name: member, role: group.memberLabel } : member
    ])));
  }
  function schoolLine(member) {
    return [member.school, member.schoolStage, member.classYear && `Class of ${member.classYear}`].filter(Boolean).join(" · ");
  }
  function init(view, page) {
    if (page.body.dataset.page !== "team" || page.getElementById("team-profile-dialog")) return;
    const roster = page.querySelector(".team-roster");
    if (!roster) return;
    const profiles = profileMap(view.SITE_DATA.pages.team.teamGroups);
    const dialog = page.createElement("dialog");
    dialog.id = "team-profile-dialog";
    dialog.className = "team-profile-dialog";
    dialog.setAttribute("aria-labelledby", "team-profile-name");
    dialog.setAttribute("aria-describedby", "team-profile-bio");
    dialog.innerHTML = `
      <button class="team-profile-close" type="button" aria-label="Close profile" autofocus><span aria-hidden="true">×</span></button>
      <div class="team-profile-layout">
        <div class="team-profile-photo"></div>
        <div class="team-profile-copy">
          <p class="team-profile-role"></p>
          <h2 id="team-profile-name"></h2>
          <p class="team-profile-school"></p>
          <p id="team-profile-bio" class="team-profile-bio"></p>
        </div>
      </div>`;
    page.body.appendChild(dialog);
    const photo = dialog.querySelector(".team-profile-photo");
    const name = dialog.querySelector("#team-profile-name");
    const role = dialog.querySelector(".team-profile-role");
    const school = dialog.querySelector(".team-profile-school");
    const bio = dialog.querySelector("#team-profile-bio");
    const close = dialog.querySelector(".team-profile-close");
    let opener, zoom;
    roster.addEventListener("click", event => {
      const trigger = event.target.closest("[data-member-profile]");
      if (!trigger || !roster.contains(trigger)) return;
      const member = profiles.get(trigger.dataset.memberProfile);
      if (!member) return;
      const portrait = trigger.closest(".member-card").querySelector(".member-photo-placeholder, .member-photo");
      const origin = portrait && portrait.getBoundingClientRect();
      photo.replaceChildren(...(portrait ? [portrait.cloneNode(true)] : []));
      name.textContent = member.name;
      role.textContent = member.role || "";
      school.textContent = schoolLine(member);
      school.hidden = !school.textContent;
      bio.textContent = member.bio || "Bio coming soon.";
      opener = trigger;
      page.body.classList.add("team-profile-is-open");
      dialog.showModal();
      dialog.scrollTop = 0;
      close.focus({ preventScroll: true });
      if (zoom) zoom.cancel();
      if (origin && typeof photo.animate === "function" && !view.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const target = photo.getBoundingClientRect();
        const x = origin.left + origin.width / 2 - target.left - target.width / 2;
        const y = origin.top + origin.height / 2 - target.top - target.height / 2;
        const scale = Math.min(origin.width / target.width, origin.height / target.height);
        zoom = photo.animate([
          { transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity: .4 },
          { transform: "translate(0, 0) scale(1)", opacity: 1 }
        ], { duration: 240, easing: "cubic-bezier(.2,.65,.25,1)" });
      }
    });
    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    // Native dialog supplies Escape, focus containment and background inertness.
    dialog.addEventListener("close", () => {
      if (zoom) { zoom.cancel(); zoom = null; }
      page.body.classList.remove("team-profile-is-open");
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    });
  }
  return { profileMap, schoolLine, init };
});
