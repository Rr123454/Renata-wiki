// Source writeups are static HTML. Register page metadata without replacing them.
for (const [key, title] of [["wet-lab", "Wetlab"], ["wet-lab-notebook", "Notebook"]]) {
  window.SITE_DATA.pages[key] = { group: "lab-work", title, lead: "", buttons: [] };
}
