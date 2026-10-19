/* The same source records, arranged by bench work and computational analysis.
   No procedures are executed and no results are manufactured by this module. */
(function (root) {
  "use strict";
  const data = root.SITE_DATA;
  const enzyme = data.experimentRecordTabs["experiment-enzyme-design"].content;
  const esc = text => String(text || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const plain = text => String(text || "").replace(/<[^>]*>/g, "");
  const wetIds = new Set(["handoff", "expression-plan", "assay-plan", "master-plan"]);
  const records = [
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
  const status = `<aside class="lab-evidence"><strong>Evidence status</strong><p>The current bench records describe experimental plans and spaces for observations. Completed transformation, enzyme-activity, and growth datasets have not been supplied. Computational predictions are reported separately in Model.</p></aside>`;
  const sourceNote = `<p class="lab-source-note">Source: iGEM Renata. <cite>Dry Lab Documentation</cite>. Team working notes, reviewed 6 Oct. 2026. <a href="#source-1">[1]</a> Source wording, uncertainty, and proposed-work labels are retained below.</p>`;
  const toc = links => `<aside class="lab-sidebar"><nav aria-label="Sections in this page"><p>On this page</p>${links.map(([id, title]) => `<a href="#${id}">${title}</a>`).join("")}</nav><a class="lab-related" href="project-description.html#dbtl-cycle">Project DBTL cycle ↗</a></aside>`;
  const shell = (title, lead, body, links, key) => `<section class="lab-page container" aria-labelledby="lab-page-title"><header class="lab-page-header"><p class="detail-eyebrow">Our Lab Work / Computational record</p><h1 id="lab-page-title">${title}</h1><p>${lead}</p><p class="lab-related-links"><a href="wet-lab.html">Experimental validation ↗</a></p></header><div class="lab-layout"><article class="lab-article">${body}</article>${toc(links)}</div></section>`;
  const details = entries => entries.map(entry => `<section class="lab-subsection"><p class="detail-eyebrow">${entry.eyebrow || "Record"}</p><h3>${entry.title}</h3>${entry.text ? `<p>${entry.text}</p>` : ""}${entry.steps ? `<ol>${entry.steps.map(step => `<li><strong>${step.label}.</strong> ${step.text}</li>`).join("")}</ol>` : ""}${entry.items ? `<ul>${entry.items.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}${entry.note ? `<p class="lab-record-note">${entry.note}</p>` : ""}</section>`).join("");
  const entries = list => `<ol class="lab-entry-list">${list.map(entry => `<li><p class="detail-eyebrow">${entry.label}</p><h4>${entry.title}</h4><p>${entry.text}</p></li>`).join("")}</ol>`;
  const notebookDocument = {
    title: "Wetlab notebook",
    status: "Undated / awaiting bench record",
    notice: "No experiment dates or completed measurements have been provided for these entries. They remain explicitly undated prompts. Add the raw file, observation, interpretation, and next decision together when a record is available.",
    source: '1. iGEM Renata. "Wetlab notebook entry prompts." Renata Wiki, 2026. js/site-content.js.',
    planningNote: "The proposed six-week milestones are a planning schedule. They do not establish an experimental chronology.",
    sections: [
      ...records.map((record, index) => ({ id: record.id, page: index + 2, title: record.title, lead: data.experimentRecordTabs[record.key].notebookLead, entries: data.experimentRecordTabs[record.key].notebook })),
      { id: "assay", page: 5, title: "Enzyme characterization assay", lead: "Keep sample and construct identity, controls, raw readouts, product confirmation, and interpretation together. The supplied documentation describes assay plans; a dated activity dataset is still required.", entries: [] }
    ]
  };
  const notebookPdf = "assets/documents/wet-lab-notebook.pdf";

  function notebookViewer() {
    return `<aside class="lab-notebook-panel" id="notebook" aria-labelledby="lab-notebook-title">
      ${notebookDocument.sections.map(section => `<span class="lab-notebook-anchor" id="notebook-${section.id}" data-notebook-page="${section.page}"></span>`).join("")}<span class="lab-notebook-anchor" id="assay-notebook" data-notebook-page="5"></span>
      <header class="lab-column-heading"><h2 id="lab-notebook-title">Notebook</h2><p>Undated prompts · PDF · 5 pages</p></header>
      <div class="lab-notebook-toolbar"><label for="notebook-section">Go to</label><select id="notebook-section" data-notebook-select><option value="1">Overview &amp; evidence status</option>${notebookDocument.sections.map(section => `<option value="${section.page}">${esc(section.title)}</option>`).join("")}</select><a href="${notebookPdf}" target="_blank" rel="noopener">Open PDF ↗</a><a href="${notebookPdf}" download>Download</a></div>
      <iframe class="lab-notebook-pdf" data-notebook-frame src="${notebookPdf}#page=1&amp;view=FitH&amp;navpanes=0" title="Wetlab notebook PDF: undated entry prompts" loading="lazy"></iframe>
      <p class="lab-notebook-help">Current entry prompts; completed bench records are still pending. If the PDF does not display, use Open PDF or the text version below.</p>
      <details class="lab-notebook-transcript"><summary>Read notebook as text</summary><p>${notebookDocument.notice}</p>${notebookDocument.sections.map(section => `<section id="notebook-text-${section.id}"><p class="detail-eyebrow">${notebookDocument.status}</p><h3>${section.title}</h3><p>${section.lead}</p>${entries(section.entries)}</section>`).join("")}<p>${notebookDocument.planningNote}</p><p class="lab-source-note">${esc(notebookDocument.source)}</p></details>
    </aside>`;
  }

  function wetlab() {
    const experiments = records.map(record => {
      const page = data.pages[record.key], resources = data.experimentRecordTabs[record.key];
      return `<section class="lab-section" id="${record.id}"><p class="detail-eyebrow">Planned experiment</p><h2>${record.title}</h2><p>${page.lead}</p><dl class="lab-reasoning"><div><dt>Question</dt><dd>${record.question}</dd></div><div><dt>Evidence / data</dt><dd>No completed dataset is attached to this record.</dd></div><div><dt>Interpretation framework</dt><dd>${record.interpretation}</dd></div><div><dt>Decision to record</dt><dd>${record.decision}</dd></div></dl><div class="lab-comparison">${page.cards.map(card => `<div><p class="detail-eyebrow">${card.tag}</p><h3>${card.title}</h3><p>${card.text}</p></div>`).join("")}</div>${details(page.details || [])}<details class="lab-method-details"><summary>Procedure documentation &amp; analysis requirements</summary><p>${resources.protocolsLead}</p>${entries(resources.protocols)}</details><p><a href="#notebook-${record.id}">View this notebook record ↗</a></p></section>`;
    }).join("");
    const body = `${status}${sourceNote}<span id="experiments-list" class="lab-anchor"></span>${experiments}<div class="lab-source-sections">${wetSections.map(section => section.id === "master-plan" ? `<span id="six-week-plan" class="lab-anchor"></span>${section.html}` : section.html).join("")}</div>${sourceSection}`;
    const links = [["assembly", "Assembly & transformation"], ["reporter", "Reporter characterization"], ["growth-response", "Growth response"], ["expression-plan", "Expression & purification"], ["assay-plan", "Enzyme characterization assay"], ["master-plan", "Planned milestones"], ["sources", "Sources"]];
    return `<section class="lab-page lab-page--combined container" aria-labelledby="lab-page-title"><header class="lab-page-header"><p class="detail-eyebrow">Our Lab Work / Bench record</p><h1 id="lab-page-title">Wetlab</h1><p>Experimental logic, evidence, and interpretation alongside the notebook record.</p><p class="lab-related-links"><a href="#notebook">Jump to notebook</a> · <a href="project-description.html#dbtl-cycle">Project DBTL cycle ↗</a></p></header><div class="lab-workspace"><article class="lab-article" id="work-analysis" aria-labelledby="work-analysis-title"><header class="lab-column-heading"><h2 id="work-analysis-title">Work &amp; analysis</h2><p>Experimental questions, evidence, and next decisions.</p></header><details class="lab-section-index"><summary>Sections in work &amp; analysis</summary><nav aria-label="Work and analysis sections">${links.map(([id, title]) => `<a href="#${id}">${title}</a>`).join("")}</nav></details>${body}</article>${notebookViewer()}</div></section>`;
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
  root.RenataLab = { render: key => canonicalLinks(key === "model" ? model() : wetlab()), sections, records, wetIds: [...wetIds], modelSections, notebookDocument };
})(typeof window === "undefined" ? globalThis : window);
