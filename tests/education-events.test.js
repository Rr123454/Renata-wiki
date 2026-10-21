"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = { window: {} };
vm.runInNewContext(read("js/site-content.js"), context);
const data = context.window.SITE_DATA;
const event = data.pages["education-event-01"];

function renderer(name, next, globals = {}) {
  const source = read("js/site.js");
  const start = source.indexOf(`  function ${name}(`);
  const end = source.indexOf(`  function ${next}(`, start);
  assert.ok(start >= 0 && end > start, name);
  return vm.runInNewContext(`(${source.slice(start, end).trim()})`, globals);
}

test("the Education Event 1 card and page share the SABPA title and May record", () => {
  const route = data.humanPracticesEventRoutes[0];
  assert.equal(route.number, "01");
  assert.equal(route.title, "SABPA OC/LA Biochem Forum at UCI");
  assert.equal(event.title, route.title);
  assert.equal(event.lead, route.summary);
  assert.equal(route.href, "education-event-01.html");
  assert.equal(route.status, "May · Forum participation");
  assert.equal(event.buttons[0].href, "human-practices.html");
  assert.doesNotMatch(JSON.stringify(event), /PLACEHOLDER|Edit this page|structural placeholder/);
  assert.match(read(route.href), /<title>SABPA OC\/LA Biochem Forum at UCI \| ULP-CA<\/title>/);
});

test("the complete event account retains participants, both perspectives, and evidence limits", () => {
  assert.deepEqual(Array.from(event.details, section => section.id), ["forum-participation", "commercial-viability", "clinical-applications", "development-reflection"]);
  const text = event.details.map(section => section.text).join("\n");
  for (const name of ["Ritvin", "Karthik", "Dr. Edward Kim", "City of Hope Orange County", "Dan Ross", "BioPharma Capital", "Han Li", "Riviera Holdings VC", "Benjamin Albaum", "VIZQ Technologies"]) {
    assert.ok(text.includes(name), name);
  }
  assert.match(text, /18th Annual SABPA OC\/LA Biomedical Forum at the Beckman Center in Irvine/);
  assert.match(text, /production and delivery could be scaled economically/);
  assert.match(text, /experimental evidence would be needed to justify further investment/);
  assert.match(text, /successful enzyme activity alone would not demonstrate that the treatment improves patient outcomes/);
  assert.match(text, /possible effects on the broader gut environment/);
  assert.match(text, /clinical translation would require additional evidence of safety and therapeutic benefit/);
  assert.match(text, /what our experiments could demonstrate from what would still be required/);
  assert.doesNotMatch(text, /2026|May \d/); // No exact date or year was supplied.
});

test("the real shared renderers include the event summary and every full paragraph", () => {
  const renderIndex = renderer("renderHumanPracticesPage", "renderStandardPage", { data });
  const index = renderIndex();
  assert.match(index, /href="education-event-01.html"/);
  assert.ok(index.includes(data.humanPracticesEventRoutes[0].title));
  assert.ok(index.includes(data.humanPracticesEventRoutes[0].summary));
  assert.doesNotMatch(index, /These event pages are placeholders/);
  const renderDetails = renderer("renderDetailSections", "renderButtons");
  for (const number of ["01", "02", "03", "04", "05", "06"]) {
    const route = data.humanPracticesEventRoutes.find(item => item.number === number);
    assert.ok(index.includes(`href="${route.href}"`));
    assert.ok(index.includes(route.title));
    assert.ok(index.includes(route.summary));
    const record = data.pages[`education-event-${number}`];
    const details = renderDetails(record.details);
    for (const section of record.details) {
      assert.ok(details.includes(`id="${section.id}"`));
      assert.ok(details.includes(`<h2>${section.title}</h2>`));
      assert.ok(details.includes(`<p class="detail-lead">${section.text}</p>`));
    }
  }
});

test("Education Event 2 links to the completed interview record", () => {
  const route = data.humanPracticesEventRoutes[1];
  const record = data.pages["education-event-02"];
  assert.equal(route.title, "Interview with Gastroenterologist and Team");
  assert.equal(record.title, route.title);
  assert.equal(record.lead, route.summary);
  assert.equal(route.status, "Clinical interview");
  assert.equal(route.href, "education-event-02.html");
  assert.equal(record.buttons[0].href, "human-practices.html");
  assert.doesNotMatch(JSON.stringify(record), /PLACEHOLDER|Edit this page|structural placeholder/);
  assert.match(read(route.href), /<title>Interview with Gastroenterologist and Team \| ULP-CA<\/title>/);
});

test("the interview preserves clinical feedback and identifies the treatment as proposed", () => {
  const record = data.pages["education-event-02"];
  assert.deepEqual(Array.from(record.details, section => section.id), ["pcs-diagnosis", "existing-treatments", "project-practicality", "interview-reflection"]);
  const text = record.details.map(section => section.text).join("\n");
  for (const phrase of ["Dr. Singh", "IBS (Irritable Bowel Syndrome)", "consider many possible causes", "interfere with the absorption of other medications", "day-to-day basis", "proposed treatment aims to use the BtSULT enzyme", "long-term complications have a smaller patient base", "relationship between the gut microbiome", "focusing only on bile acids may overlook other factors", "meaningful edge over existing medications"]) {
    assert.ok(text.includes(phrase), phrase);
  }
  assert.doesNotMatch(record.kicker, /2026|May/); // No interview date was supplied.
});

test("Education Event 3 links to the completed patient interview record", () => {
  const route = data.humanPracticesEventRoutes[2];
  const record = data.pages["education-event-03"];
  assert.equal(route.title, "Interview with Two Patients to Understand Personal Experiences");
  assert.equal(record.title, route.title);
  assert.equal(record.lead, route.summary);
  assert.equal(route.status, "Patient interviews");
  assert.equal(route.href, "education-event-03.html");
  assert.equal(record.buttons[0].href, "human-practices.html");
  assert.doesNotMatch(JSON.stringify(record), /PLACEHOLDER|Edit this page|structural placeholder/);
  assert.match(read(route.href), /<title>Interview with Two Patients to Understand Personal Experiences \| ULP-CA<\/title>/);
});

test("patient accounts retain their differences, learning points, and evidence boundaries", () => {
  const record = data.pages["education-event-03"];
  assert.deepEqual(Array.from(record.details, section => section.id), ["patient-interview-context", "first-patient-experience", "second-patient-experience", "patient-interview-learning"]);
  const text = record.details.map(section => section.text).join("\n");
  for (const phrase of ["cholecystectomy in 2009", "over 16 years", "pancreatitis and gallbladder dysfunction", "holiday meals", "including Prilosec, had done little to help her", "reduces the amount of acid produced in the stomach", "cleared up most of his discomfort", "particularly those in Chinese cuisine", "<strong>an ideal medication should be simple to use, especially for older patients</strong>", "long-term side effects", "clinical testing and transparency"]) {
    assert.ok(text.includes(phrase), phrase);
  }
  assert.equal(record.details[0].note, undefined);
  assert.doesNotMatch(renderer('renderDetailSections', 'renderButtons')(record.details), /Working note|These are two personal accounts shared with the team/);
  assert.equal(record.details[1].source.href, "https://medlineplus.gov/druginfo/meds/a693050.html");
  assert.doesNotMatch(record.kicker, /2026|May/); // No interview date was supplied.
});

test("Education Event 4 links to the Facebook outreach record", () => {
  const route = data.humanPracticesEventRoutes[3];
  const record = data.pages["education-event-04"];
  assert.equal(route.title, "Facebook Patient Responses");
  assert.equal(record.title, route.title);
  assert.equal(record.lead, route.summary);
  assert.equal(route.status, "Online patient outreach");
  assert.equal(route.href, "education-event-04.html");
  assert.equal(record.buttons[0].href, "human-practices.html");
  assert.doesNotMatch(JSON.stringify(record), /PLACEHOLDER|Edit this page/);
  const html = read(route.href);
  assert.match(html, /<title>Facebook Patient Responses \| ULP-CA<\/title>/);
  assert.match(html, /data-page="education-event-04"/);
});

test("Facebook outreach preserves response themes and qualified design learning", () => {
  const record = data.pages["education-event-04"];
  assert.deepEqual(Array.from(record.details, section => section.id), ["outreach-motivation", "international-outreach", "patient-response-themes", "outreach-reflection", "convenience-learning", "prebiotic-probiotic-design"]);
  const text = record.details.map(section => section.text).join("\n");
  for (const phrase of ["Orange County", "United Kingdom, Australia, Canada", "United States", "seamless surgeries", "years or decades", "malabsorption issues for almost 12 years", "organize their days around bathroom visits", "difficult it is to get cholestyramine", "other responders in the same thread agreed", "prebiotic–probiotic approach", "existing prebiotic components", "convenience and tolerability as major factors in our design"]) {
    assert.ok(text.includes(phrase), phrase);
  }
  const note = record.details[5].note;
  assert.match(note, /self-selected Facebook responses/);
  assert.match(note, /cannot establish symptom prevalence/i);
  assert.match(note, /design goal requiring experimental and clinical evaluation/);
  assert.doesNotMatch(record.kicker, /2026|May/); // No outreach date was supplied.
});

test("Education Event 5 links to the Seva Collective record", () => {
  const route = data.humanPracticesEventRoutes[4];
  const record = data.pages["education-event-05"];
  assert.equal(route.title, "Seva Collective Event");
  assert.equal(record.title, route.title);
  assert.equal(record.lead, route.summary);
  assert.equal(route.status, "Community service");
  assert.equal(route.href, "education-event-05.html");
  assert.equal(record.buttons[0].href, "human-practices.html");
  assert.doesNotMatch(JSON.stringify(record), /PLACEHOLDER|Edit this page/);
  const html = read(route.href);
  assert.match(html, /<title>Seva Collective Event \| ULP-CA<\/title>/);
  assert.match(html, /data-page="education-event-05"/);
});

test("Seva record preserves service, community conversations, and reflection", () => {
  const record = data.pages["education-event-05"];
  assert.deepEqual(Array.from(record.details, section => section.id), ["seva-community-service", "seva-science-conversations", "seva-service-reflection"]);
  const text = record.details.map(section => section.text).join("\n");
  for (const phrase of ["organized by SEVA Collective", "package and distribute food", "individuals and families in need", "Santa Ana, Irvine, Tustin, and Costa Mesa", "fellow volunteers and families", "post-cholecystectomy syndrome (PCS)", "proposed treatment could potentially help", "outside of the biotechnology field", "practice our presentation skills", "selfless service", "immediate needs", "hope our research can ultimately benefit"]) {
    assert.ok(text.includes(phrase), phrase);
  }
  assert.doesNotMatch(record.kicker, /2026|May/); // No event date was supplied.
});

test("Education Event 6 links to the July MedChem symposium record", () => {
  const route = data.humanPracticesEventRoutes[5];
  const record = data.pages["education-event-06"];
  assert.equal(route.title, "27th Annual San Diego MedChem Symposium at UCSD");
  assert.equal(record.title, route.title);
  assert.equal(record.lead, route.summary);
  assert.equal(route.status, "July · Symposium participation");
  assert.equal(route.href, "education-event-06.html");
  assert.equal(record.buttons[0].href, "human-practices.html");
  const html = read(route.href);
  assert.match(html, /<title>27th Annual San Diego MedChem Symposium at UCSD \| ULP-CA<\/title>/);
  assert.match(html, /data-page="education-event-06"/);
});

test("MedChem account preserves progress and marks missing design evidence explicitly", () => {
  const record = data.pages["education-event-06"];
  assert.deepEqual(Array.from(record.details, section => section.id), ["medchem-participation", "medchem-project-progress", "medchem-engineering-feedback"]);
  const text = record.details.map(section => section.text).join("\n");
  for (const phrase of ["UC San Diego in July", "Scripps Research", "Schrödinger", "Novartis", "Johnson &amp; Johnson", "Pfizer", "SABPA in May", "post-cholecystectomy syndrome (PCS)", "custom-engineered BtSULT", "goals of minimizing side effects", "substrate specificity", "simulation software"]) {
    assert.ok(text.includes(phrase), phrase);
  }
  assert.match(record.details[2].note, /no named simulation metrics, score values, thresholds/);
  assert.doesNotMatch(JSON.stringify(record), /details pending|medchem-design-follow-up/);
  assert.match(record.details[2].note, /does not establish improved enzyme activity/);
  assert.doesNotMatch(text, /July \d|2026|TALK ABOUT/);
});

test("all five Education initiative cards are populated", () => {
  for (const route of data.educationEventRoutes) {
    assert.doesNotMatch(JSON.stringify(data.pages[route.href.replace('.html', '')]), /no formal learning-assessment results were supplied/);
  }
  assert.equal(data.educationEventRoutes.length, 5);
  assert.doesNotMatch(JSON.stringify(data.educationEventRoutes), /PLACEHOLDER/);
  const index = renderer("renderEducationPage", "renderExperimentRecordPage", { data })();
  assert.doesNotMatch(index, /Entries marked as placeholders/);
});

test("Education owns five initiatives and Human Practices owns six records alongside its paper", () => {
  const renderEvents = renderer("renderEducationPage", "renderExperimentRecordPage", { data });
  const renderHP = renderer("renderHumanPracticesPage", "renderStandardPage", { data });
  const hp = renderHP();
  assert.match(hp, /id="hp-events"/);
  const education = renderEvents();
  assert.match(education, /Education event pages/);
  for (const route of data.educationEventRoutes) {
    assert.ok(education.includes(`href="${route.href}"`));
    const record = data.pages[route.href.replace(".html", "")];
    assert.match(record.kicker, /^Education Event/);
    assert.equal(record.buttons[0].href, "education.html");
    assert.equal(record.buttons[0].text, "Back to education");
  }
  for (const id of ["hp-abstract", "hp-methodology", "hp-findings", "hp-integration", "hp-conclusion"]) {
    assert.ok(hp.includes(`id="${id}"`), id);
  }
  assert.doesNotMatch(education, /Content coming soon/);
  const navigation = require("../js/navigation.js").render(data.nav, { pageKey: "education-event-01", group: "engagement" });
  assert.match(navigation, /class="renata-nav-card is-section" href="human-practices.html"/);
  assert.doesNotMatch(navigation, /class="renata-nav-card is-section" href="education.html"/);
});

test("ULP genetics event preserves all four sections and renders every paragraph", () => {
  const record = data.pages["education-ulp"];
  assert.equal(record.title, data.educationEventRoutes[0].title);
  assert.deepEqual(Array.from(record.details, section => section.id), ["ulp-classroom", "ulp-lego-dna", "ulp-bead-traits", "ulp-synthetic-biology"]);
  const html = renderer("renderDetailSections", "renderButtons")(record.details);
  for (const section of record.details) {
    for (const paragraph of [section.text, ...(section.paragraphs || [])]) assert.ok(html.includes(paragraph));
  }
  for (const phrase of ["over 30 children ages nine and above", "adenine, thymine, cytosine, and guanine", "multiple genes and environmental factors"]) assert.ok(html.includes(phrase), phrase);
  assert.doesNotMatch(html, /no formal learning-assessment results were supplied/);
  assert.match(read("education-ulp.html"), /data-page="education-ulp"/);
  const { pageChapter } = require("../js/orbit-pages.js");
  for (const route of data.educationEventRoutes) {
    const key = route.href.replace(".html", "");
    const chapter = pageChapter(key, data.pages[key]);
    assert.equal(chapter.key, "education");
    assert.equal(chapter.next, "education.html");
  }
});

test("the Education overview appears before event cards and preserves the supplied account", () => {
  const html = renderer("renderEducationPage", "renderExperimentRecordPage", { data })();
  assert.doesNotMatch(html, /Content status|Formal learning-assessment results|experiment-evidence-note/);
  assert.equal(data.educationOverview.paragraphs.length, 4);
  for (const paragraph of data.educationOverview.paragraphs) assert.ok(html.includes(paragraph));
  assert.ok(html.indexOf('id="education-overview"') < html.indexOf('class="experiment-route-list"'));
  assert.ok(!html.includes(data.educationOverview.source));
  assert.equal(data.educationEventRoutes.filter(route => route.href === "education-ulp.html").length, 1);
  assert.equal(data.educationEventRoutes.filter(route => route.href === "education-troy.html").length, 1);
});

test("Troy Education Day and BYLD have separate linked event records", () => {
  const record = data.pages["education-troy"];
  const route = data.educationEventRoutes[2];
  assert.equal(record.title, route.title);
  assert.equal(record.lead, route.summary);
  assert.equal(route.href, "education-troy.html");
  assert.deepEqual(Array.from(record.details, section => section.id), ["troy-classroom", "troy-microscopy", "troy-yeast", "troy-enzyme", "troy-takeaway"]);
  const html = renderer("renderDetailSections", "renderButtons")(record.details);
  for (const section of record.details) assert.ok(html.includes(section.text));
  assert.doesNotMatch(JSON.stringify(record), /BYLD|Biotechnology Youth Literacy Directive/);
  const byld = data.pages["education-byld"];
  const byldRoute = data.educationEventRoutes[3];
  assert.equal(byldRoute.href, "education-byld.html");
  assert.equal(byldRoute.title, byld.title);
  assert.equal(byldRoute.summary, byld.lead);
  const byldHtml = renderer("renderDetailSections", "renderButtons")(byld.details);
  assert.match(byldHtml, /Karthik and Humza founded the Biotechnology Youth Literacy Directive/);
  assert.match(byldHtml, /assets\/engagement\/page-24-1.jpg/);
  assert.match(read(byldRoute.href), /data-page="education-byld"/);
  assert.deepEqual(Array.from(data.educationEventRoutes, route => route.number), ["01", "02", "03", "04", "05"]);
  assert.match(read(route.href), /data-page="education-troy"/);
  assert.match(read(route.href), /<title>Troy Biotechnology Education Day \| ULP-CA<\/title>/);
  assert.doesNotMatch(JSON.stringify(record), /PLACEHOLDER|Edit this page|Content coming soon/);
});


test("all 37 supplied Education paragraphs are preserved in order", () => {
  const lines = read("content/education/complete-education.txt").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  const paragraphs = lines.filter(s => s.length > 150);
  const actual = [...data.educationOverview.paragraphs, ...["education-ulp","education-butterfly","education-troy","education-byld","education-kickstart"].flatMap(key => data.pages[key].details.flatMap(section=>[section.text,...(section.paragraphs||[])]).filter(Boolean))];
  assert.equal(paragraphs.length, 37);
  assert.deepEqual(Array.from(actual), paragraphs);
});
test("Human Practices records retain URLs, breadcrumbs, and full text", () => {
  assert.equal(data.humanPracticesEventRoutes.length,6);
  const hp = renderer("renderHumanPracticesPage","renderStandardPage",{data})();
  const education = renderer("renderEducationPage","renderExperimentRecordPage",{data})();
  for (const route of data.humanPracticesEventRoutes) {
    assert.ok(hp.includes(route.href));
    assert.ok(!education.includes(route.href));
    const key=route.href.replace('.html','');
    const page=data.pages[key];
    assert.equal(page.parentPage,'human-practices');
    const chapter=require('../js/orbit-pages.js').pageChapter(key,page);
    assert.equal(chapter.parent.href,'human-practices.html');
    assert.equal(chapter.next,'human-practices.html');
  }
});
test("Butterfly presentation and Kickstart PDF are accessible from their pages", () => {
  const render=renderer('renderDetailSections','renderButtons');
  const butterfly=render(data.pages['education-butterfly'].details);
  assert.match(butterfly,/Strawberry DNA/);
  assert.match(butterfly,/docs.google.com\/presentation/);
  const guide=render(data.pages['education-kickstart'].details);
  assert.match(guide,/<iframe src="assets\/kickstart\/research-fundamentals.pdf" title="[^"]+"/);
  assert.match(guide,/download>Download the guide/);
  assert.match(guide,/href="igem-kickstart.html"/);
  assert.ok(fs.existsSync(path.join(root,'assets/kickstart/research-fundamentals.pdf')));
});

test("all thirteen PDF photos appear once in their matching event records", () => {
  const source=JSON.parse(read('content/engagement/source.json'));
  assert.equal(source.pages.length,25);
  assert.equal(source.images.length,13);
  const records=[...data.educationEventRoutes,...data.humanPracticesEventRoutes].map(r=>data.pages[r.href.replace('.html','')]);
  const photos=records.flatMap(p=>p.details.flatMap(s=>s.images||[]));
  assert.equal(photos.length,13);
  assert.equal(new Set(photos.map(p=>p.src)).size,13);
  const html=records.map(p=>renderer('renderDetailSections','renderButtons')(p.details)).join('');
  for(const photo of source.images) {
    assert.ok(photos.some(p=>p.src===photo.src));
    assert.ok(fs.existsSync(path.join(root,photo.src)));
    assert.ok(html.includes(`src="${photo.src}"`));
    assert.ok(!html.includes(`Writeup Education + HP, p. ${photo.page}.`));
  }
});

test("Education prose matches the new PDF and HP has a source-backed overview", () => {
  const source=JSON.parse(read('content/engagement/source.json'));
  const normalize=s=>s.replace(/\s|\u200b/g,'');
  const pdf=normalize(source.pages.slice(10).map(p=>p.text).join(' '));
  const paragraphs=[...data.educationOverview.paragraphs,...data.educationEventRoutes.flatMap(r=>data.pages[r.href.replace('.html','')].details.flatMap(s=>[s.text,...(s.paragraphs||[])].filter(Boolean)))];
  for(const paragraph of paragraphs) assert.ok(pdf.includes(normalize(paragraph)),paragraph.slice(0,90));
  const hp=renderer('renderHumanPracticesPage','renderStandardPage',{data})();
  assert.doesNotMatch(hp,/PLACEHOLDER|At its roots, our Human Practices involvement comes from/);
  assert.doesNotMatch(hp,/Team-supplied PDF|Overview synthesized from the six event accounts/);
  assert.match(hp,/No clinical validation is reported here/);
  assert.doesNotMatch(hp,/document’s opening HP overview is unfinished/);
  assert.equal(data.educationEventRoutes.length,5);
  assert.equal(data.humanPracticesEventRoutes.length,6);
});

test("internal-file citations are omitted while external references and PDF viewers remain", () => {
  const render=renderer('renderDetailSections','renderButtons');
  const events=[...data.educationEventRoutes,...data.humanPracticesEventRoutes];
  for(const route of events) {
    const page=data.pages[route.href.replace('.html','')];
    assert.doesNotMatch(render(page.details),/Team-supplied|User-supplied|Writeup Education \+ HP|Complete Education Account|Overview and Education Initiatives/);
  }
  assert.match(render(data.pages['education-event-03'].details),/medlineplus.gov/);
  assert.match(render(data.pages['education-kickstart'].details),/<iframe/);
  assert.match(render([{title:'Published reference',citation:'Published paper citation'}]),/Published paper citation/);
});

test("shared detail pages omit all Working note callouts and preserve the main write-ups", () => {
  const render = renderer('renderDetailSections', 'renderButtons');
  let legacyNotes = 0;
  for (const [key, page] of Object.entries(data.pages)) {
    if (!page.details?.length) continue;
    const html = render(page.details);
    assert.doesNotMatch(html, /Working note|class="evidence-note"/i, key);
    for (const section of page.details) {
      if (section.note) {
        legacyNotes++;
        assert.ok(!html.includes(section.note), `${key}: legacy note is omitted`);
      }
      for (const paragraph of [section.text, ...(section.paragraphs || [])].filter(Boolean)) {
        assert.ok(html.includes(paragraph), `${key}: original prose is preserved`);
      }
    }
  }
  assert.ok(legacyNotes > 0, 'The test covers existing note-bearing records');
  const future = render([{title:'Event account',text:'Original event account.',note:'An editorial note supplied by a future import.'}]);
  assert.match(future, /Original event account\./);
  assert.doesNotMatch(future, /editorial note|Working note|evidence-note/);
});
