/* The same source records, arranged by bench work and computational analysis.
   No procedures are executed and no results are manufactured by this module. */
(function (root) {
  "use strict";
  const data = root.SITE_DATA;
  const enzyme = data.experimentRecordTabs["experiment-enzyme-design"].content;
  const esc = text => String(text || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const plain = text => String(text || "").replace(/<[^>]*>/g, "");
  const wetIds = new Set(["handoff", "expression-plan", "assay-plan", "master-plan"]);
  const legacyRecords = [
    { key: "experiment-assembly", id: "assembly", title: "Assembly & transformation", question: "Was the intended construct assembled and verified?", interpretation: "Colony growth alone cannot establish the identity of a construct. The record needs screening and sequence evidence before a build can advance.", decision: "Identify an accepted construct, or record the failed junction and the next redesign." },
    { key: "experiment-reporter", id: "reporter", title: "Reporter characterization", question: "What changes when the operator and transcription factor are added?", interpretation: "Compare the four conditions alongside growth and normalized fluorescence. Distinguish an operator-associated change from a general effect of the transcription factor.", decision: "Select a regulatory configuration only after the controls and replicate uncertainty support the comparison." },
    { key: "experiment-growth-response", id: "growth-response", title: "Bile-acid growth response", question: "How does exposure affect both growth and reporter output?", interpretation: "Interpret the fluorescence signal with the growth record. Growth burden can change the apparent reporter response.", decision: "Carry forward a concentration range supported by both growth and reporter evidence." }
  ];

  // Extract complete top-level sections from our authored HTML, including any
  // nested sections. Keeping their markup intact preserves tables and citations.
  function sections(html) {
    const result = [];
    let depth = 0, start = 0, id = "";
    for (const match of html.matchAll(/<\/?section\b[^>]*>/g)) {
      if (match[0].startsWith("</")) {
        if (--depth === 0) result.push({ id, html: html.slice(start, match.index + match[0].length) });
      } else {
        if (depth++ === 0) { start = match.index; id = match[0].match(/\bid="([^"]+)"/)?.[1] || ""; }
      }
    }
    return result;
  }
  const overview = sections(enzyme.overview);
  const analysis = sections(enzyme.notebook);
  const methods = sections(enzyme.protocols);
  // These provenance notes sit outside the source sections; retain them with
  // the corresponding computational record rather than losing them in extraction.
  const introductions = Object.fromEntries(Object.entries(enzyme).map(([view, html]) => [view, html.match(/<p class="dry-lab-intro">[\s\S]*?<\/p>/)?.[0] || ""]));
  const sourceSection = overview.find(section => section.id === "sources").html;
  const wetSections = methods.filter(section => wetIds.has(section.id));
  const modelSections = [...overview, ...analysis, ...methods].filter(section => !wetIds.has(section.id) && section.id !== "sources");
  const wetFragments = /href="#(handoff|expression-plan|assay-plan|master-plan)"/g;
  const canonicalLinks = html => html.replace(/href="experiment-enzyme-design(-notebook|-protocols)?\.html(?:#([^"]*))?"/g, (_match, view, fragment) => {
    const anchor = fragment || (view === "-notebook" ? "notebook" : view === "-protocols" ? "methods" : "overview");
    return `href="${wetIds.has(anchor) ? "wet-lab" : "model"}.html#${anchor}"`;
  });
  const modelLinks = html => canonicalLinks(html.replace(wetFragments, 'href="wet-lab.html#$1"'));
  const wetSource = root.RENATA_WETLAB;
  const records = wetSource?.records || [];
  const sourceNote = `<p class="lab-source-note">Source: iGEM Renata. <cite>Dry Lab Documentation</cite>. Team working notes, reviewed 6 Oct. 2026. <a href="#source-1">[1]</a> Source wording, uncertainty, and proposed-work labels are retained below.</p>`;
  const toc = links => `<aside class="lab-sidebar"><nav data-outline-auto aria-label="Sections in this page"><p>On this page</p>${links.map(([id, title]) => `<a href="#${id}">${title}</a>`).join("")}</nav><a class="lab-related" href="project-description.html#dbtl-cycle">Project DBTL cycle ↗</a></aside>`;
  const shell = (title, lead, body, links, key) => `<section class="lab-page container" aria-labelledby="lab-page-title"><header class="lab-page-header"><p class="detail-eyebrow">Our Lab Work / Computational record</p><h1 id="lab-page-title">${title}</h1><p>${lead}</p><p class="lab-related-links"><a href="wet-lab.html">Experimental validation ↗</a></p></header><div class="lab-layout">${toc(links)}<article class="lab-article">${body}</article></div></section>`;
  const details = entries => entries.map(entry => `<section class="lab-subsection"><p class="detail-eyebrow">${entry.eyebrow || "Record"}</p><h3>${entry.title}</h3>${entry.text ? `<p>${entry.text}</p>` : ""}${entry.steps ? `<ol>${entry.steps.map(step => `<li><strong>${step.label}.</strong> ${step.text}</li>`).join("")}</ol>` : ""}${entry.items ? `<ul>${entry.items.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}${entry.note ? `<p class="lab-record-note">${entry.note}</p>` : ""}</section>`).join("");
  const entries = list => `<ol class="lab-entry-list">${list.map(entry => `<li><p class="detail-eyebrow">${entry.label}</p><h4>${entry.title}</h4><p>${entry.text}</p></li>`).join("")}</ol>`;
  const notebookDocument = root.RENATA_WETLAB_NOTEBOOK;
  const notebookPdf = wetSource?.pdf;
  const sourceLink = (page, label) => `<a href="${notebookPdf}#page=${page}" target="_blank" rel="noopener">${esc(label || `[1, p. ${page}]`)}</a>`;
  const notebookChapters = [
    { id: "overview", page: 1, title: "Document overview" },
    { id: "assembly", page: 2, title: "Transformation" },
    { id: "screening", page: 4, title: "Colony screening" },
    { id: "expression", page: 10, title: "Growth & induction" },
    { id: "purification", page: 13, title: "Protein recovery" },
    { id: "quantification", page: 15, title: "BCA quantification" },
    { id: "protein-gels", page: 19, title: "SDS-PAGE" },
    { id: "assay", page: 23, title: "TLC" }
  ];

  function notebookViewer() {
    return `<aside class="lab-notebook-panel" id="notebook" aria-labelledby="lab-notebook-title">
      ${[...notebookChapters, ...notebookDocument.sections].map(section => `<span class="lab-notebook-anchor" id="notebook-${section.id}" data-notebook-page="${section.page}"></span>`).join("")}<span class="lab-notebook-anchor" id="assay-notebook" data-notebook-page="23"></span><span class="lab-notebook-anchor" id="notebook-reporter" data-notebook-page="56"></span><span class="lab-notebook-anchor" id="notebook-growth-response" data-notebook-page="10"></span>
      <header class="lab-column-heading"><h2 id="lab-notebook-title">Notebook</h2></header>
      <div class="lab-notebook-toolbar"><label for="notebook-section">Go to</label><select id="notebook-section" data-notebook-select><optgroup label="Workflow &amp; methods">${notebookChapters.map(section => `<option value="${section.page}">${esc(section.title)} · p. ${section.page}</option>`).join("")}</optgroup><optgroup label="Dated notebook">${notebookDocument.sections.map(section => `<option value="${section.page}">${esc(section.title)} · p. ${section.page}</option>`).join("")}</optgroup></select><a href="${notebookPdf}" target="_blank" rel="noopener">Open PDF ↗</a><a href="${notebookPdf}" download>Download</a></div>
      <iframe class="lab-notebook-pdf" data-notebook-frame src="${notebookPdf}#page=1&amp;view=FitH&amp;navpanes=0" title="Original iGEM Renata Lab Documentation 2026: 74 pages" loading="lazy"></iframe>
      <p class="lab-notebook-help">Original, unchanged PDF · 74 pages · 55.5 MB. Page numbers refer to physical PDF pages. The file may take a moment to load. If the viewer is unavailable, use Open PDF or read the chronology below.</p>
      <details class="lab-notebook-transcript"><summary>Read notebook as text · June–October chronology</summary><p>${esc(notebookDocument.notice)}</p>${notebookDocument.sections.map(section => `<section id="notebook-text-${section.id}"><p class="detail-eyebrow">${esc(notebookDocument.status)}</p><h3>${esc(section.title)}</h3><p>${esc(section.lead)}</p><p>${sourceLink(section.page, `Open source at p. ${section.page} ↗`)}</p>${entries(section.entries)}</section>`).join("")}<p>${esc(notebookDocument.planningNote)}</p><p class="lab-source-note">${esc(notebookDocument.source)}</p></details>
    </aside>`;
  }

  function wetlab() {
    const archived = legacyRecords.map(record => {
      const page = data.pages[record.key], resources = data.experimentRecordTabs[record.key];
      return `<section class="lab-section" id="${record.id === "assembly" ? "planned-assembly" : record.id}"><p class="detail-eyebrow">Earlier planning context · no result attached</p><h3>${record.title}</h3><p>${page.lead}</p><p>${record.interpretation}</p><p>${record.decision}</p><div class="lab-comparison">${page.cards.map(card => `<div><p class="detail-eyebrow">${card.tag}</p><h4>${card.title}</h4><p>${card.text}</p></div>`).join("")}</div>${details(page.details || [])}<details class="lab-method-details"><summary>Original procedure and notebook prompts</summary><p>${resources.protocolsLead}</p>${entries(resources.protocols)}<p>${resources.notebookLead}</p>${entries(resources.notebook)}</details></section>`;
    }).join("");
    const table = item => `<div class="lab-table-wrap" role="region" aria-label="${esc(item.title)}" tabindex="0"><table class="lab-data-table"><caption>${esc(item.title)}</caption><thead><tr>${item.columns.map(column => `<th scope="col">${esc(column)}</th>`).join("")}</tr></thead><tbody>${item.rows.map(row => `<tr>${row.map((cell, index) => index ? `<td>${esc(cell)}</td>` : `<th scope="row">${esc(cell)}</th>`).join("")}</tr>`).join("")}</tbody></table></div><p class="lab-source-note">${esc(item.note)}</p>`;
    const gallery = figures => figures?.length ? `<div class="lab-figure-grid${figures.length === 1 ? " lab-figure-grid--single" : ""}">${figures.map(figure => `<figure class="lab-source-figure"><a href="${figure.file}" target="_blank" rel="noopener" aria-label="Open full-size ${esc(figure.title)}"><img src="${figure.file}" alt="${esc(figure.alt)}" loading="lazy" decoding="async"></a><figcaption><strong>${esc(figure.title)}</strong><p>${esc(figure.caption)}</p>${sourceLink(figure.page)} · <a href="${figure.file}" target="_blank" rel="noopener">Full-size image ↗</a></figcaption></figure>`).join("")}</div>` : "";
    const experiments = records.map((record, index) => `<section class="lab-section" id="${record.id}"><p class="detail-eyebrow">${String(index + 1).padStart(2, "0")} / Bench workflow</p><h2>${esc(record.title)}</h2><p class="lab-source-note">${sourceLink(record.page, `[1, pp. ${record.pages}]`)}</p>${record.paragraphs.map(text => `<p>${esc(text)}</p>`).join("")}<dl class="lab-reasoning">${[["Question", record.question], ["Recorded evidence", record.evidence], ["Interpretation", record.interpretation], ["Next check", record.next]].map(([label, text]) => `<div><dt>${label}</dt><dd>${esc(text)}</dd></div>`).join("")}</dl>${(record.tables || []).map(table).join("")}${gallery(record.figures)}<details class="lab-method-details"><summary>Methods &amp; original record</summary><p>${esc(record.methods)}</p><p>${sourceLink(record.page, "Open the original workflow and methods ↗")}</p></details><p><a href="wet-lab-notebook.html#notebook-${record.id === "expression-plan" ? "expression" : record.id === "assay-plan" ? "assay" : record.id}">View this part of the notebook ↗</a></p></section>`).join("");
    const historicalMethods = wetSections.map(section => (section.id === "master-plan" ? `<span id="six-week-plan" class="lab-anchor"></span>` : "") + section.html.replace(/id="(expression-plan|assay-plan)"/, 'id="planned-$1"')).join("").replace(/href="#source-(\d+)"/g, 'href="model.html#source-$1"');
    const body = `<aside class="lab-evidence"><strong>${esc(wetSource.status)}</strong><p>${esc(wetSource.summary)}</p></aside><p class="lab-source-note">Prepared from the team's current laboratory record. Figures are extracted without alteration; reported values and missing data are preserved. ${sourceLink(1, "[1] Original document")}</p><span id="experiments-list" class="lab-anchor"></span>${experiments}<section class="lab-section" id="record-checks"><p class="detail-eyebrow">Evidence quality</p><h2>Checks still open</h2><p>These conflicts remain visible so a draft note cannot be mistaken for a verified result or a finalized procedure.</p><dl class="lab-reasoning">${wetSource.checks.map(([label, text]) => `<div><dt>${esc(label)}</dt><dd>${esc(text)}</dd></div>`).join("")}</dl></section><section class="lab-section" id="historical-plans"><h2>Earlier planning context</h2><details class="lab-method-details lab-historical"><summary>Open archived plans and prompts</summary><p>These earlier assembly, reporter, growth-response, and six-week planning notes are retained for continuity. The current PDF does not provide completed reporter or bile-acid growth-response datasets. Current dated observations appear in the Notebook.</p>${archived}<div class="lab-source-sections">${historicalMethods}</div></details></section>`;
    const links = [...records.map(record => [record.id, record.title]), ["record-checks", "Checks still open"], ["historical-plans", "Earlier planning context"]];
    return `<section class="lab-page container" aria-labelledby="lab-page-title"><header class="lab-page-header"><p class="detail-eyebrow">Our Lab Work / Bench record</p><h1 id="lab-page-title">Wetlab</h1><p>Experimental logic, evidence, and interpretation.</p><p class="lab-related-links"><a href="wet-lab-notebook.html">Open notebook ↗</a> · <a href="project-description.html#dbtl-cycle">Project DBTL cycle ↗</a></p></header><div class="lab-layout">${toc(links)}<article class="lab-article" id="work-analysis">${body}</article></div></section>`;
  }

  function notebook() {
    return `<section class="lab-page lab-page--notebook container" aria-labelledby="lab-page-title"><header class="lab-page-header"><p class="detail-eyebrow">Our Lab Work / Notebook</p><h1 id="lab-page-title">Wetlab Notebook</h1><p class="lab-related-links"><a href="wet-lab.html">Wetlab: work &amp; analysis ↗</a> · <a href="model.html">Model ↗</a></p></header>${notebookViewer()}</section>`;
  }

  function model() {
    const group = (id, title, list, introduction = "") => `<section class="lab-model-group" id="${id}"><p class="detail-eyebrow">Model / ${title}</p><h2 class="lab-group-title">${title}</h2>${introduction}${list.filter(section => section.id !== "sources" && !wetIds.has(section.id)).map(section => modelLinks(section.html)).join("")}</section>`;
    const body = `<aside class="lab-evidence"><strong>Computational evidence</strong><p>This page collects the enzyme-engineering workflow, reported predictions, complete analysis, and modelling methods. Predicted geometry and confidence scores guide candidate selection; biochemical performance still needs experimental measurement.</p></aside>${sourceNote}${group("overview", "Overview & decisions", overview)}${group("notebook", "Design record & analysis", analysis, introductions.notebook)}${group("methods", "Inputs & modelling methods", methods, introductions.protocols)}${sourceSection}`;
    return shell("Model", "The complete enzyme-engineering record: sequence and structure comparisons, redesign, predictions, interpretation, and model assumptions.", body, [["overview", "Overview & decisions"], ["notebook", "Design record & analysis"], ["variant-comparison", "Variant comparison"], ["methods", "Inputs & methods"], ["ode-plan", "ODE modelling"], ["sources", "Sources"]], "model");
  }
  for (const [key, title] of [["wet-lab", "Wetlab"], ["wet-lab-notebook", "Wetlab Notebook"], ["model", "Model"]]) data.pages[key] = { group: "lab-work", title, lead: "", buttons: [] };
  for (const key of Object.keys(data.pages).filter(key => key.startsWith("experiment-"))) {
    data.pages[key].buttons = [{ text: key.startsWith("experiment-enzyme-design") ? "Model: full analysis" : "Wetlab: work & analysis", href: key.startsWith("experiment-enzyme-design") ? "model.html" : "wet-lab.html", style: "secondary" }];
  }
  root.RenataLab = { render: key => canonicalLinks(key === "model" ? model() : key === "wet-lab-notebook" ? notebook() : wetlab()), sections, records, wetIds: [...wetIds], modelSections, notebookDocument };
})(typeof window === "undefined" ? globalThis : window);
