/* Project paper: abstract, DBTL stages, and traceable supporting records. */
(function (root) {
  "use strict";
  const escape = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  function recordMarkup(record) {
    return `<details class="project-engineering-record" id="${escape(record.id)}">
      <summary><span class="detail-eyebrow">${escape(record.eyebrow)}</span><strong class="project-record-title" id="${escape(record.id)}-title">${escape(record.title)}</strong></summary>
      <div class="project-record-body">
        ${record.text ? `<p>${record.text}</p>` : ""}
        ${record.items ? `<ul>${record.items.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}
        ${record.steps ? `<ol class="project-engineering-steps">${record.steps.map(step => `<li><strong>${escape(step.label)}</strong><p>${step.text}</p></li>`).join("")}</ol>` : ""}
        ${record.note ? `<aside class="project-paper-note"><strong>Evidence and decisions</strong><p>${record.note}</p></aside>` : ""}
        ${record.source ? `<p><a href="${escape(record.source.href)}">${escape(record.source.label)}</a></p>` : ""}
      </div>
    </details>`;
  }

  function vectorFigure(figure) {
    if (!figure) return "";
    return `<figure class="project-vector-figure" id="figure-expression-vector">
      <span class="project-legacy-anchor" id="figure-pathway" aria-hidden="true"></span>
      ${figure.src ? `<a href="${escape(figure.src)}" target="_blank" rel="noopener noreferrer"><img src="${escape(figure.src)}" alt="${escape(figure.alt || figure.title)}" loading="lazy" /></a>` : `
        <div class="project-vector-placeholder">
          <p class="project-figure-label">Schematic placeholder</p>
          <strong>${escape(figure.placeholder)}</strong>
          <ol class="project-vector-parts" aria-label="Proposed expression construct, in sequence order">${figure.architecture.map(part => `<li>${escape(part)}</li>`).join("")}</ol>
          <small>Proposed architecture · verified map pending</small>
        </div>`}
      <figcaption><strong>Figure 1.</strong> ${figure.caption}</figcaption>
    </figure>`;
  }

  function outlineBranch(id, label, children) {
    return `<li class="project-outline-branch" data-outline-branch="${escape(id)}">
      <div class="project-outline-row"><a href="#${escape(id)}">${escape(label)}</a><button type="button" data-outline-toggle aria-expanded="true" aria-controls="outline-${escape(id)}" aria-label="Toggle ${escape(label)} subsections" hidden><span aria-hidden="true">⌄</span></button></div>
      <ul id="outline-${escape(id)}" class="project-outline-children">${children}</ul>
    </li>`;
  }

  function renderDescription(pageData) {
    const description = pageData.description || {sections: [{id:"abstract",title:"Abstract",html:pageData.paper?.abstract || ""}], references: []};
    return `<section class="project-paper-page" id="project-description"><div class="container project-paper-layout">
      <aside class="project-paper-sidebar" aria-label="Project Description page outline">
        <nav class="page-outline" data-project-outline aria-labelledby="project-outline-title"><div class="project-outline-heading"><p class="page-outline-title" id="project-outline-title">On this page</p><button type="button" data-outline-collapse aria-expanded="true" aria-controls="project-outline-list" aria-label="Toggle page contents" hidden>⌄</button></div>
          <ul id="project-outline-list">${description.sections.map(s=>`<li><a href="#${escape(s.id)}">${escape(s.title)}</a></li>`).join("")}<li><a href="#description-references">References</a></li></ul>
        </nav><a class="page-outline-related" href="engineering.html#dbtl-cycle">Engineering — DBTL cycle ↗</a>
      </aside>
      <article class="project-paper" aria-labelledby="project-paper-title"><header class="project-paper-header"><p class="project-paper-type">Background / Problem / Proposed approach</p><h1 id="project-paper-title">Project Description</h1></header>
        ${description.sections.map(s=>`<section class="project-paper-section" id="${escape(s.id)}"><h2>${escape(s.title)}</h2>${s.html}</section>`).join("")}
        <section class="project-paper-section" id="description-references"><h2>References</h2><ol>${description.references.filter(r=>!r.supplementary).map(r=>`<li id="description-ref-${r.number}">${r.html}</li>`).join("")}</ol><h3>Supplementary background</h3><ol start="12">${description.references.filter(r=>r.supplementary).map(r=>`<li id="description-ref-${r.number}">${r.html}</li>`).join("")}</ol></section>
      </article></div></section>`;
  }

  function renderCurrentEngineering(pageData) {
    const engineering = pageData.engineering;
    const report = engineering.currentReport;
    const retainedReferences = (pageData.paper?.references || []).filter(ref => !ref.internal && !report.referencesHtml.includes(escape(ref.href)));
    const nextReference = (report.referencesHtml.match(/id="engineering-ref-/g) || []).length + 1;
    const retainedReferenceMarkup = retainedReferences.length ? `<section id="engineering-retained-references"><h3>Additional references</h3><ol class="engineering-reference-list" start="${nextReference}">${retainedReferences.map((ref,index) => `<li id="engineering-ref-${nextReference+index}">${ref.citation} <a href="${escape(ref.href)}" target="_blank" rel="noopener noreferrer">${escape(ref.href)}</a></li>`).join('')}</ol></section>` : '';
    // Keep earlier bookmarks usable without bringing the superseded layout back.
    const legacyAnchors = ["engineering-current", "design", "build", "test", "learn", "methodology", "results", "conclusion", "figure-expression-vector", "figure-pathway", "figure-pcs-development", "figure-pcs-use", "figure-status", ...(engineering.details || []).map(record => record.id)];
    return `<section class="project-paper-page project-dbtl-paper" id="engineering-page">
      <div class="container project-paper-layout">
        <aside class="project-paper-sidebar" aria-label="Engineering page outline">
          <nav class="page-outline" data-project-outline data-outline-autocollapse="false" aria-labelledby="project-outline-title">
            <div class="project-outline-heading"><p class="page-outline-title" id="project-outline-title">On this page</p><button type="button" data-outline-collapse aria-expanded="true" aria-controls="project-outline-list" aria-label="Toggle page contents" hidden><span aria-hidden="true">⌄</span></button></div>
            <ul id="project-outline-list">
              <li><a href="#abstract">Abstract</a></li>
              ${outlineBranch("engineering", "DBTL Cycle", report.outline.map((cycle,index) => `<li><a href="#${escape(cycle.id)}">Cycle ${index+1}</a></li>`).join(''))}
              <li><a href="#engineering-current-references">References</a></li>
            </ul>
          </nav>
          <a class="page-outline-related" href="project-description.html#abstract">Project Description ↗</a>
          <a class="page-outline-related" href="model.html">Molecular figures and model analysis ↗</a>
          <a class="page-outline-related" href="wet-lab.html">Wetlab records ↗</a>
        </aside>
        <article class="project-paper" aria-labelledby="project-paper-title">
          <header class="project-paper-header"><p class="project-paper-type">Design / Build / Test / Learn</p><h1 id="project-paper-title">Engineering</h1></header>
          <section class="project-paper-section" id="abstract" aria-labelledby="engineering-abstract-title">
            <h2 id="engineering-abstract-title">Abstract</h2>${report.abstractHtml}
          </section>
          <section class="project-paper-section project-engineering" id="engineering" aria-labelledby="engineering-title">
            <span class="project-legacy-anchor" id="dbtl-cycle" aria-hidden="true"></span>
            ${legacyAnchors.map(id => `<span class="project-legacy-anchor" id="${escape(id)}" aria-hidden="true"></span>`).join('')}
            <h2 id="engineering-title">DBTL Cycle</h2>
            <p>Four cycles connect structural study, mutant screening, and two rounds of protein expression. Expression and purification were measured; reliable folding, target-band identity, and LCA sulfation remain unconfirmed.</p>
            ${report.cyclesHtml}
          </section>
          <section class="project-paper-section" id="engineering-current-references" aria-labelledby="engineering-references-title">
            <span class="project-legacy-anchor" id="engineering-sources" aria-hidden="true"></span>
            <h2 id="engineering-references-title">References</h2>
            ${report.referencesHtml}${retainedReferenceMarkup}
          </section>
        </article>
      </div>
    </section>`;
  }

  function render(pageData) {
    if (pageData.projectView === "description") return renderDescription(pageData);
    if (pageData.engineering?.currentReport) return renderCurrentEngineering(pageData);
    const paper = pageData.paper || {};
    const engineering = pageData.engineering || {};
    const stages = paper.dbtl?.stages || [];
    const records = new Map((engineering.details || []).map(record => [record.id, record]));
    return `<section class="project-paper-page project-dbtl-paper" id="engineering-page">
      <div class="container project-paper-layout">
        <aside class="project-paper-sidebar" aria-label="Project page outline">
          <nav class="page-outline" data-project-outline aria-labelledby="project-outline-title">
            <div class="project-outline-heading"><p class="page-outline-title" id="project-outline-title">On this page</p><button type="button" data-outline-collapse aria-expanded="true" aria-controls="project-outline-list" aria-label="Toggle page contents" hidden><span aria-hidden="true">⌄</span></button></div>
            <ul id="project-outline-list">
              ${outlineBranch("engineering", "DBTL Cycle", stages.map(stage => outlineBranch(stage.id, `${stage.label} — ${stage.title}`, `
                ${stage.id === "design" ? '<li><a href="#figure-expression-vector">Figure 1 — Expression vector</a></li>' : ""}
                ${stage.records.map(id => records.get(id)).filter(Boolean).map(record => `<li><a href="#${escape(record.id)}">${escape(record.title)}</a></li>`).join("")}
              `)).join(""))}
              ${outlineBranch("engineering-sources", "References", (paper.references || []).filter(reference => !reference.internal).map((reference, index) => `<li><a href="${escape(reference.href)}" target="_blank" rel="noopener noreferrer">${index + 1}. ${escape(reference.title)}</a></li>`).join(""))}
            </ul>
          </nav>
          <a class="page-outline-related" href="project-description.html#abstract">Project Description ↗</a>
          <a class="page-outline-related" href="model.html">Molecular figures and model analysis ↗</a>
          <a class="page-outline-related" href="wet-lab.html">Wetlab records ↗</a>
        </aside>
        <article class="project-paper" aria-labelledby="project-paper-title">
          <header class="project-paper-header"><p class="project-paper-type">Design / Build / Test / Learn</p><h1 id="project-paper-title">Engineering</h1></header>
          <section class="project-paper-section project-engineering" id="engineering" aria-labelledby="engineering-title">
            <span class="project-legacy-anchor" id="dbtl-cycle" aria-hidden="true"></span>
            <p class="project-paper-section-number">The engineering cycle</p><h2 id="engineering-title">DBTL Cycle</h2>
            <p>${paper.dbtl?.intro || engineering.intro || ""}</p>
            <nav class="project-cycle-nav" aria-label="Design–build–test–learn stages">${stages.map((stage, index) => `<a href="#${escape(stage.id)}"><span>${String(index + 1).padStart(2, "0")}</span>${escape(stage.label)}</a>`).join("")}</nav>
            ${stages.map((stage, index) => `<section class="project-dbtl-stage" id="${escape(stage.id)}" aria-labelledby="${escape(stage.id)}-title">
              ${stage.id === "design" ? '<span class="project-legacy-anchor" id="methodology" aria-hidden="true"></span>' : ""}
              ${stage.id === "build" ? '<span class="project-legacy-anchor" id="figure-pcs-development" aria-hidden="true"></span>' : ""}
              <p class="project-stage-label">${String(index + 1).padStart(2, "0")} / ${escape(stage.label)}</p>
              <h3 id="${escape(stage.id)}-title">${escape(stage.title)}</h3>
              ${stage.text}
              ${stage.id === "design" ? vectorFigure(paper.vectorFigure) : ""}
              ${stage.status ? `<aside class="project-paper-note" id="results"><strong>Wet-lab data and results</strong><p>${stage.status}</p></aside>` : ""}
              ${stage.id === "learn" ? `<div id="conclusion">${paper.conclusion || ""}</div><span class="project-legacy-anchor" id="figure-pcs-use" aria-hidden="true"></span><span class="project-legacy-anchor" id="figure-status" aria-hidden="true"></span>` : ""}
              <ul class="project-stage-links">${stage.links.map(link => `<li><a href="${escape(link.href)}">${escape(link.label)}</a></li>`).join("")}</ul>
              <div class="project-supporting-records" aria-label="Supporting ${escape(stage.label.toLowerCase())} records">${stage.records.map(id => records.get(id)).filter(Boolean).map(recordMarkup).join("")}</div>
            </section>`).join("")}
            <p id="engineering-sources">${engineering.sourceNote || ""}</p>
          </section>
        </article>
      </div>
    </section>`;
  }

  root.RenataProject = { render };
})(typeof window === "undefined" ? globalThis : window);
