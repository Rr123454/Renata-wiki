const makePage = (config) => ({
  group: "home",
  kicker: "",
  title: "",
  lead: "",
  buttons: [
    { text: "Edit this page", href: "#", style: "primary" }
  ],
  stats: [],
  cardsTitle: "",
  cardsLead: "",
  cards: [],
  ctaTitle: "",
  ctaText: "",
  ...config
});

window.SITE_DATA = {
  brand: {
    title: "iGEM Renata",
    subtitle: "Reborn through synthetic biology"
  },

  sponsorsPartners: [
    { name: "The Seva Collective", logo: "assets/sponsors/seva-collective.png" },
    { name: "University Lab Partners", logo: "assets/sponsors/university-lab-partners.png" },
    { name: "Broadcom", logo: "assets/sponsors/broadcom.png" }
  ],

  nav: [
    { key: "home", label: "Home", href: "index.html" },
    { key: "team", label: "Our Team", href: "team.html" },
    {
      key: "project",
      label: "Our Project",
      href: "index.html#our-project",
      children: [
        { key: "project-description", label: "Project Description", href: "project-description.html" },
        { key: "engineering", label: "Engineering", href: "engineering.html" }
      ]
    },
    { key: "lab-work", label: "Lab Work", href: "experiments.html" },
    {
      key: "engagement",
      label: "Engagement",
      href: "human-practices.html",
      children: [
        { key: "human-practices", label: "Human Practices", href: "human-practices.html" },
        { key: "education", label: "Education", href: "education.html" }
      ]
    }
  ],

  pages: {
    home: makePage({
      group: "home",
      kicker: "Synthetic Biology / Rebirth / Impact",
      title: "Our <span class='accent-gradient'>Project</span>",
      lead: "Explore the people, science, and impact behind our synthetic biology project.",
      ctaTitle: "CONTACTS & IMPORTANT LINKS",
      ctaText: "",
      linkColumns: [
        {
          title: "Our Team",
          links: [
            { text: "Meet Our Team", href: "team.html" },
            { text: "PIs & Mentors", href: "team.html#mentors" },
            { text: "Students", href: "team.html#students" }
          ]
        },
        {
          title: "Project",
          links: [
            { text: "Project Description", href: "project-description.html" },
            { text: "Engineering", href: "engineering.html" }
          ]
        },
        {
          title: "Lab Work",
          links: [
            { text: "Experiments", href: "experiments.html#experiments-list" }
          ]
        },
        {
          title: "Engagement & Resources",
          links: [
            { text: "Human Practices", href: "human-practices.html" },
            { text: "Education", href: "education.html" }
          ]
        }
      ]
    }),

    team: makePage({
      group: "team",
      kicker: "People / Roles / Collaboration",
      title: "Meet <span class='accent-gradient'>Our Team</span>",
      lead: "Meet the people behind Renata, see how each person contributed, and learn how to connect with us.",
      cardsTitle: "The people behind Renata",
      cardsLead: "Our team brings together students, mentors, collaborators, and community partners.",
      cards: [
        { tag: "Members", title: "Core team", text: "Add names and roles." },
        { tag: "Support", title: "Mentors", text: "Add mentors and faculty." },
        { tag: "Work", title: "Contributions", text: "Show who handled what." },
        { tag: "Connect", title: "Contact & collaborate", text: "Find our team email, institution, sponsors, and collaboration details below." }
      ],
      teamPhoto: {
        title: "Together, we are Renata",
        text: "Reserve this space for the complete team photograph.",
        imageLabel: "Full team photo"
      },
      teamGroups: [
        {
          key: "mentors",
          title: "Mentors",
          description: "Principal investigators, advisors, and community mentors guiding the project.",
          layout: "wide",
          members: [
            { name: "Emma Zschunke", role: "Primary PI" },
            { name: "Preya Shrivastava", role: "Secondary PI" },
            { name: "Matt M.", role: "Advisor" },
            { name: "Tasha B.", role: "Advisor" },
            { name: "Sharan S.", role: "Community Mentor" }
          ]
        },
        {
          key: "students",
          title: "Students",
          description: "Student leaders and members contributing across the project.",
          layout: "wide",
          members: [
            { name: "Humza S.", role: "Student Leader" },
            { name: "Karthik S.", role: "Student Leader" },
            { name: "Kavi S.", role: "Student Leader" },
            { name: "Kyle K.", role: "Student Leader" },
            { name: "Ritvin R.", role: "Student Leader" },
            { name: "Aaron T.", role: "Student" },
            { name: "Aiden R.", role: "Student" },
            { name: "Brandon", role: "Student" },
            { name: "Ella Y.", role: "Student" },
            { name: "Alex F.", role: "Student" },
            { name: "Faizaan M.", role: "Student" },
            { name: "Hannah B.", role: "Student" },
            { name: "Hanyu H.", role: "Student" },
            { name: "Kylie T.", role: "Student" },
            { name: "Margaret L.", role: "Student" },
            { name: "Matthew S.", role: "Student" },
            { name: "Ryan J.", role: "Student" },
            { name: "Tiger L.", role: "Student" },
            { name: "Toni D.", role: "Student" },
            { name: "Vanessa L.", role: "Student" },
            { name: "Yuqing Z", role: "Student" }
          ]
        }
      ]
    }),

    project: makePage({
      group: "project",
      kicker: "Problem / System / Impact",
      title: "The <span class='accent-gradient'>project</span> at a glance",
      lead: "This overview introduces the problem, the proposed system, and the project goal.",
      cardsTitle: "Project at a glance",
      cardsLead: "These three ideas frame the project before visitors continue into the full description, engineering, and results.",
      cards: [
        { tag: "Problem", title: "What is the issue?", imageLabel: "Problem image", text: "Use this column to explain the real-world problem, its scale, and who it affects." },
        { tag: "System", title: "What are we building?", imageLabel: "Project system image", text: "Use this column to introduce Renata's proposed biological system and how its major parts work together." },
        { tag: "Impact", title: "Why does it matter?", imageLabel: "Project impact image", text: "Use this column to show the intended benefit, stakeholders, and broader significance of the project." }
      ],
      ctaTitle: "Use this page as the overview",
      ctaText: "This should be the clean starting point for the deeper project pages.",
    }),

    "project-description": makePage({
      group: "project",
      kicker: "Background / Gap / Concept",
      title: "Description",
      lead: "Use this page for the full project story.",
      cardsTitle: "Main sections",
      cardsLead: "Keep the structure simple.",
      cards: [
        { tag: "Background", title: "Context", text: "Write the broader context." },
        { tag: "Gap", title: "Current limitation", text: "Show what is missing now." },
        { tag: "Concept", title: "Renata idea", text: "Explain the concept clearly." }
      ],
      ctaTitle: "Next page",
      ctaText: "After this page, lead the reader into engineering or results.",
    }),

    engineering: makePage({
      group: "project",
      kicker: "Design / Build / Learn",
      title: "<span class='accent-gradient'>Engineering</span> the system",
      lead: "Use this page to show iteration and design changes.",
      cardsTitle: "Iteration blocks",
      cardsLead: "Judges want to see how the system changed.",
      cards: [
        { tag: "Cycle 1", title: "Initial design", text: "Show the first version." },
        { tag: "Cycle 2", title: "What changed", text: "Show why you changed it." },
        { tag: "Cycle 3", title: "Final version", text: "Show the stronger version." }
      ],
      ctaTitle: "Make iteration visible",
      ctaText: "This page should prove that the project evolved thoughtfully.",
    }),

    "wet-lab": makePage({
      group: "wet-lab",
      kicker: "Build / Assays / Validation",
      title: "The <span class='accent-gradient'>wet lab</span> hub",
      lead: "This overview frames the experimental work before the deeper wet-lab pages.",
      cardsTitle: "Wet lab at a glance",
      cardsLead: "See the experimental objective, the main assays, and how the bench work supports the full project.",
      cards: [
        { tag: "Goal", title: "Objective", text: "State what the wet lab needed to show." },
        { tag: "Work", title: "Assays", text: "Summarize the main experiments." },
        { tag: "Link", title: "Connection", text: "Show how it supports the project." }
      ],
      ctaTitle: "Route into the wet-lab details",
      ctaText: "This page should send visitors to Experiments.",
    }),

    experiments: makePage({
      group: "lab-work",
      kicker: "Assays / Controls / Readouts",
      title: "<span class='accent-gradient'>Lab Work</span>",
      lead: "Use this page for the main assay structure, logic, and experimental record.",
      cardsTitle: "Main blocks",
      cardsLead: "Keep the question, control, output, and experiment timeline clear.",
      cards: [
        { tag: "Question", title: "Assay goal", text: "State what each experiment tested." },
        { tag: "Control", title: "Comparison", text: "Show controls and validation." },
        { tag: "Output", title: "Readout", text: "Show what was measured." },
        { tag: "Record", title: "Experiment notebook", text: "Trace the chronology, what each experiment answered, how the results were interpreted, and how the project continued." }
      ],
      ctaTitle: "Keep the assays structured",
      ctaText: "This page should make the experiment logic easy to follow.",
    }),

    "dry-lab": makePage({
      group: "dry-lab",
      kicker: "Modeling / Analysis / Workflow",
      title: "The <span class='accent-gradient'>dry lab</span> hub",
      lead: "This overview frames the modeling and computational analysis behind Renata.",
      cardsTitle: "Dry lab at a glance",
      cardsLead: "See the computational goal, what the team built, and how those tools changed the project.",
      cards: [
        { tag: "Goal", title: "Purpose", text: "State what the dry lab was meant to answer." },
        { tag: "Tools", title: "What was built", text: "Summarize the model or computational workflow." },
        { tag: "Impact", title: "Project effect", text: "Show how it changed the project." }
      ],
      ctaTitle: "Route into the dry-lab details",
      ctaText: "This page should send visitors to the Model.",
    }),

    engagement: makePage({
      group: "engagement",
      kicker: "Stakeholders / Outreach / Context",
      title: "<span class='accent-gradient'>Engagement</span>",
      lead: "This overview brings together the people, outreach, and real-world context surrounding the project.",
      cardsTitle: "Engagement at a glance",
      cardsLead: "See who shaped the work, what the team learned, and how that input influenced the project.",
      cards: [
        { tag: "People", title: "Who matters", text: "Show relevant groups and stakeholders." },
        { tag: "Input", title: "What you learned", text: "Summarize the main insights." },
        { tag: "Effect", title: "What changed", text: "Show how engagement affected the project." }
      ],
      ctaTitle: "Use engagement to strengthen the project",
      ctaText: "This page should show that the project exists in a real-world context.",
    }),

    "human-practices": makePage({
      group: "engagement",
      kicker: "Stakeholders / Decisions / Integration",
      title: "<span class='accent-gradient'>Human Practices</span>",
      lead: "Document the stakeholders, methods, evidence, interpretation, and project decisions that shaped Renata.",
      buttons: [],
      cards: [],
    }),

    education: makePage({
      group: "engagement",
      kicker: "Events / Audiences / Outcomes",
      title: "Project <span class='accent-gradient'>education</span>",
      lead: "Explore each education event as its own record, from the intended audience and activity to the evidence, reflection, and resulting project effect.",
      buttons: [],
      cards: [],
    }),

    partnerships: makePage({
      group: "engagement",
      kicker: "Collaboration / Shared work / Impact",
      title: "<span class='accent-gradient'>Partnerships</span>",
      lead: "Use this page for partner teams and external collaboration.",
      cardsTitle: "Partnership blocks",
      cardsLead: "Keep the value of the collaboration visible.",
      cards: [
        { tag: "Who", title: "Partner", text: "Add the collaborator and context." },
        { tag: "Work", title: "Shared contribution", text: "Describe what was done together." },
        { tag: "Impact", title: "Project effect", text: "Show why it mattered." }
      ],
      ctaTitle: "Show mutual value",
      ctaText: "The best partnership pages make the shared benefit obvious.",
    }),

    contact: makePage({
      group: "contact",
      kicker: "Email / Sponsors / Advisors",
      title: "Get in <span class='accent-gradient'>contact</span>",
      lead: "Use this page for the team email, institution, sponsors, and public contact info.",
      cardsTitle: "Contact blocks",
      cardsLead: "Keep this page short and usable.",
      cards: [
        { tag: "Email", title: "Primary contact", text: "Add the best team email here." },
        { tag: "School", title: "Institution", text: "Add school or organization details." },
        { tag: "Support", title: "Sponsors", text: "Add sponsor or advisor acknowledgments." }
      ],
      ctaTitle: "Make the contact path obvious",
      ctaText: "Outside visitors should know exactly how to reach the team.",
    })
  }
};

window.SITE_DATA.experimentRoutes = [
  {
    number: "01",
    title: "Assembly and verification",
    summary: "Document the hierarchical Golden Gate/JUMP build, screening, and sequence verification record.",
    href: "experiment-assembly.html",
    status: "Planned record"
  },
  {
    number: "02",
    title: "Reporter characterization",
    summary: "Compare the four sfGFP constructs to separate promoter, operator, and transcription-factor effects.",
    href: "experiment-reporter.html",
    status: "Planned record"
  },
  {
    number: "03",
    title: "Bile-acid growth response",
    summary: "Track growth and normalized fluorescence across a concentration series within tolerated conditions.",
    href: "experiment-growth-response.html",
    status: "Planned record"
  }
];

window.SITE_DATA.labWorkModel = {
  title: "Project model",
  imageLabel: "Project model image",
  text: "Place the final model figure here. Its caption should state the model assumptions, variables, principal predictions, and the specific laboratory decisions those predictions informed."
};

window.SITE_DATA.educationEventRoutes = [
  {
    number: "01",
    title: "Education event 01",
    summary: "Add the event name, date, audience, format, and central learning objective.",
    href: "education-event-01.html",
    status: "Event record placeholder"
  },
  {
    number: "02",
    title: "Education event 02",
    summary: "Add the event name, date, audience, format, and central learning objective.",
    href: "education-event-02.html",
    status: "Event record placeholder"
  },
  {
    number: "03",
    title: "Education event 03",
    summary: "Add the event name, date, audience, format, and central learning objective.",
    href: "education-event-03.html",
    status: "Event record placeholder"
  }
];

const makeEducationEvent = (number) => makePage({
  group: "engagement",
  kicker: `Education Event ${number} / Event Record`,
  title: `Education <span class='accent-gradient'>event ${number}</span>`,
  lead: "Replace this placeholder with the event's verified name, date, location, audience, and learning objective.",
  buttons: [{ text: "Back to education", href: "education.html", style: "secondary" }],
  cardsTitle: "Event record",
  cardsLead: "Document what the team planned, delivered, observed, and learned from this specific event.",
  cards: [
    { tag: "Context", title: "Audience and objective", text: "Identify the participants, their prior knowledge, and the learning objective chosen for them." },
    { tag: "Activity", title: "What happened", text: "Describe the format, materials, facilitation, and event chronology." },
    { tag: "Evidence", title: "What was observed", text: "Add attendance, feedback, participant work, survey responses, or other direct evidence." },
    { tag: "Effect", title: "What changed", text: "Explain the team's interpretation and how this event shaped later education or project decisions." }
  ],
  details: [
    {
      eyebrow: "Event chronology",
      title: "Plan, delivery, and follow-up",
      text: "Keep the sequence and evidence for this event together so readers can trace what the team did and why.",
      steps: [
        { label: "Before", text: "Record the audience need, learning objective, preparation, and planned method of evaluation." },
        { label: "During", text: "Document the activity sequence, participation, questions, adaptations, and materials used." },
        { label: "After", text: "Report the direct evidence, limitations, interpretation, and next decision." }
      ],
      note: "This page is a structural placeholder. Replace prompts with verified event records and avoid claiming outcomes that the collected evidence cannot support."
    }
  ]
});

window.SITE_DATA.pages["education-event-01"] = makeEducationEvent("01");
window.SITE_DATA.pages["education-event-02"] = makeEducationEvent("02");
window.SITE_DATA.pages["education-event-03"] = makeEducationEvent("03");

window.SITE_DATA.pages["experiment-assembly"] = makePage({
  group: "lab-work",
  kicker: "Experiment 01 / Assembly",
  title: "Assembly and <span class='accent-gradient'>verification</span>",
  lead: "A dedicated record for the hierarchical Golden Gate/JUMP build and the evidence used to confirm each assembly stage.",
  buttons: [{ text: "Back to experiments", href: "experiments.html", style: "secondary" }],
  cardsTitle: "Experiment record",
  cardsLead: "Replace each working prompt with the dated methods, observations, and files from the completed experiment.",
  cards: [
    { tag: "Question", title: "What was tested?", text: "Whether the selected Level 0 parts assemble into the intended transcriptional units and higher-level construct." },
    { tag: "Method", title: "How was it tested?", text: "Record reaction composition, cycling conditions, transformation, colony screening, and sequence verification." },
    { tag: "Controls", title: "What was compared?", text: "Document negative controls, positive controls, expected fragment sizes, and acceptance criteria." },
    { tag: "Readout", title: "What was measured?", text: "Add colony counts, screening results, gel images, sequencing traces, and final construct maps." }
  ],
  details: [
    {
      eyebrow: "Method and reproducibility",
      title: "From kit parts to an assembly-ready map",
      text: "Keep the materials, setup, procedure, experimental conditions, and deviations alongside the experiment they support.",
      steps: [
        { label: "1", text: "Select the destination backbone and confirm assembly level, antibiotic marker, and recipient role." },
        { label: "2", text: "Choose one bacterial promoter and RBS per cassette, balancing expression against host burden." },
        { label: "3", text: "Confirm each CDS identity, orientation, completeness, codon optimization, and internal Type IIS sites." },
        { label: "4", text: "Add double terminators and verify insulation between the two transcriptional units." },
        { label: "5", text: "Record part IDs, well locations, flanking enzymes, and 5-prime/3-prime fusion overhangs." },
        { label: "6", text: "Build and validate the hierarchical assembly in Benchling, then export the annotated map for wet-lab review." }
      ],
      note: "This is a design checklist rather than a bench-ready method. Add reaction volumes, cycling conditions, controls, transformation, screening, and sequence verification before execution."
    },
    {
      eyebrow: "Interpretation and continuation",
      title: "Connect the build result to the next decision",
      text: "State what the evidence directly confirms, identify failed or ambiguous junctions, and explain which construct advanced to characterization.",
      steps: [
        { label: "Chronology", text: "Add the experiment date and its place in the build sequence." },
        { label: "Interpretation", text: "Explain what the screening and sequencing evidence supports." },
        { label: "Continuation", text: "Link the accepted construct or redesign to the next experiment." }
      ],
      note: "Current evidence boundary: the repository contains an assembly strategy, while completed assembly and verification results have not yet been reported."
    }
  ]
});

window.SITE_DATA.pages["experiment-reporter"] = makePage({
  group: "lab-work",
  kicker: "Experiment 02 / Regulation",
  title: "Reporter <span class='accent-gradient'>characterization</span>",
  lead: "A four-condition sfGFP comparison designed to separate promoter, operator, and transcription-factor effects.",
  buttons: [{ text: "Back to experiments", href: "experiments.html", style: "secondary" }],
  cardsTitle: "Four-condition design",
  cardsLead: "Each condition isolates a specific regulatory comparison within the same reporter framework.",
  cards: [
    { tag: "A", title: "Promoter + sfGFP", text: "Constitutive reference without an operator or separate transcription factor." },
    { tag: "B", title: "Operator + promoter + sfGFP", text: "Measures the effect of adding the candidate operator sequence." },
    { tag: "A + C", title: "Promoter + sfGFP, plus TF", text: "Tests whether the transcription factor changes the operator-free reporter." },
    { tag: "B + C", title: "Operator + promoter + sfGFP, plus TF", text: "Tests regulation when the operator and transcription factor are both present." }
  ],
  details: [{
    eyebrow: "Experiment record",
    title: "Question, readout, and interpretation",
    text: "Record normalized sfGFP fluorescence and growth for every condition, then connect the observed differences to the next regulatory design decision.",
    steps: [
      { label: "Chronology", text: "Add the date, replicate structure, and order of experimental events." },
      { label: "Answers", text: "State which comparisons directly answer the operator and transcription-factor questions." },
      { label: "Interpretation", text: "Separate supported conclusions from uncertainty and technical limitations." },
      { label: "Continuation", text: "Identify the regulatory configuration selected for follow-up work." }
    ],
    note: "Current evidence boundary: this reporter matrix is documented as an experimental plan; characterization data have not yet been reported."
  }]
});

window.SITE_DATA.pages["experiment-growth-response"] = makePage({
  group: "lab-work",
  kicker: "Experiment 03 / Response",
  title: "Bile-acid <span class='accent-gradient'>growth response</span>",
  lead: "A concentration-series record for interpreting growth tolerance alongside normalized reporter output.",
  buttons: [{ text: "Back to experiments", href: "experiments.html", style: "secondary" }],
  cardsTitle: "Experiment record",
  cardsLead: "Use the same structure for every concentration, replicate, and time point.",
  cards: [
    { tag: "Question", title: "What was tested?", text: "How bile-acid concentration affects host growth and reporter behavior within the selected experimental range." },
    { tag: "Method", title: "How was it tested?", text: "Add the concentration series, exposure timing, culture conditions, sampling schedule, and normalization method." },
    { tag: "Controls", title: "What was compared?", text: "Document vehicle, untreated, reporter, and growth controls with the replicate design." },
    { tag: "Readout", title: "What was measured?", text: "Add optical density, fluorescence, normalized response, uncertainty, and any exclusion criteria." }
  ],
  details: [{
    eyebrow: "Interpretation and continuation",
    title: "Separate response from growth burden",
    text: "Interpret fluorescence together with growth so a stressed culture is not mistaken for a regulatory response.",
    steps: [
      { label: "Chronology", text: "Add the date, time course, and relationship to reporter characterization." },
      { label: "Interpretation", text: "Identify the concentration range supported by both growth and reporter evidence." },
      { label: "Continuation", text: "Explain how the result changed the next assay or construct decision." }
    ],
    note: "Current evidence boundary: the repository proposes a bile-acid concentration series; completed growth-response data have not yet been reported."
  }]
});

window.SITE_DATA.experimentRecordTabs = {
  "experiment-assembly": {
    notebookLead: "Record each assembly attempt in chronological order, including deviations, observations, verification evidence, interpretation, and the next build decision.",
    notebook: [
      { label: "Entry 01", title: "Assembly setup", text: "Add the date, construct version, selected parts, reaction setup, operators, and any deviations from the planned workflow." },
      { label: "Entry 02", title: "Transformation and screening", text: "Add colony observations, plate controls, screening results, images, and links to the raw record." },
      { label: "Entry 03", title: "Verification and continuation", text: "Add gel or sequencing evidence, interpret accepted and failed junctions, and state which construct advanced or was redesigned." }
    ],
    protocolsLead: "Keep the assembly, transformation, screening, and verification procedures beside the experiment they support.",
    protocols: [
      { label: "Protocol 01", title: "Golden Gate/JUMP assembly", text: "Add the validated reaction composition, part-to-vector ratios, enzyme system, cycling program, controls, and acceptance criteria." },
      { label: "Protocol 02", title: "Transformation and colony screening", text: "Add the competent-cell method, recovery, selection, plating, colony-screening procedure, and required controls." },
      { label: "Protocol 03", title: "Construct verification", text: "Add the digest, PCR, or sequencing workflow used to confirm identity, orientation, junctions, and complete construct sequence." }
    ]
  },
  "experiment-reporter": {
    notebookLead: "Track every reporter run with its four experimental conditions, replicate structure, observations, normalized readouts, interpretation, and follow-up decision.",
    notebook: [
      { label: "Entry 01", title: "Culture and condition setup", text: "Add the date, construct identities, culture conditions, replicate plan, instrument settings, and deviations." },
      { label: "Entry 02", title: "Reporter measurements", text: "Add growth and fluorescence observations for all four conditions with links to raw plate-reader files." },
      { label: "Entry 03", title: "Interpretation and continuation", text: "State which comparisons answer the operator and transcription-factor questions and which configuration advanced." }
    ],
    protocolsLead: "Document the shared procedure used to compare promoter, operator, and transcription-factor effects across the reporter matrix.",
    protocols: [
      { label: "Protocol 01", title: "Reporter culture preparation", text: "Add inoculation, growth, induction or exposure conditions, plate layout, timing, and biological and technical replicate requirements." },
      { label: "Protocol 02", title: "Growth and fluorescence measurement", text: "Add instrument settings, sampling schedule, blank correction, fluorescence normalization, and quality-control criteria." },
      { label: "Protocol 03", title: "Four-condition comparison", text: "Define the planned contrasts, uncertainty reporting, exclusion rules, and criteria used to identify a supported regulatory effect." }
    ]
  },
  "experiment-growth-response": {
    notebookLead: "Record each bile-acid response run chronologically, keeping concentration preparation, growth behavior, reporter output, exclusions, and decisions together.",
    notebook: [
      { label: "Entry 01", title: "Concentration-series setup", text: "Add the date, bile-acid identity, stock preparation, concentration range, plate map, controls, and replicate plan." },
      { label: "Entry 02", title: "Growth and reporter observations", text: "Add time-resolved optical density and fluorescence data, anomalies, exclusions, and links to raw files." },
      { label: "Entry 03", title: "Interpretation and continuation", text: "Identify the range supported by both growth and normalized reporter evidence, then record the next assay decision." }
    ],
    protocolsLead: "Keep concentration preparation, exposure, measurement, and analysis procedures together for reproducible growth-response testing.",
    protocols: [
      { label: "Protocol 01", title: "Bile-acid concentration preparation", text: "Add stock solvent, dilution sequence, final concentration range, vehicle matching, storage, and handling requirements." },
      { label: "Protocol 02", title: "Exposure and time-course measurement", text: "Add culture state, exposure timing, incubation conditions, plate layout, sampling intervals, and instrument settings." },
      { label: "Protocol 03", title: "Normalization and analysis", text: "Add blank correction, growth normalization, replicate aggregation, uncertainty reporting, exclusion criteria, and supported comparison tests." }
    ]
  }
};

const registerExperimentResourcePages = (recordKey, experimentTitle) => {
  window.SITE_DATA.pages[recordKey].recordKey = recordKey;
  window.SITE_DATA.pages[recordKey].recordView = "overview";

  window.SITE_DATA.pages[`${recordKey}-notebook`] = makePage({
    group: "lab-work",
    recordKey,
    recordView: "notebook",
    kicker: `${experimentTitle} / Notebook`,
    title: `${experimentTitle} <span class='accent-gradient'>notebook</span>`,
    lead: "A dedicated chronological record for this experiment's setup, observations, interpretation, and continuation decisions.",
    buttons: [{ text: "Back to experiments", href: "experiments.html", style: "secondary" }],
    cards: []
  });

  window.SITE_DATA.pages[`${recordKey}-protocols`] = makePage({
    group: "lab-work",
    recordKey,
    recordView: "protocols",
    kicker: `${experimentTitle} / Protocols`,
    title: `${experimentTitle} <span class='accent-gradient'>protocols</span>`,
    lead: "A dedicated procedure record for this experiment's preparation, controls, measurements, and validation criteria.",
    buttons: [{ text: "Back to experiments", href: "experiments.html", style: "secondary" }],
    cards: []
  });
};

registerExperimentResourcePages("experiment-assembly", "Assembly and verification");
registerExperimentResourcePages("experiment-reporter", "Reporter characterization");
registerExperimentResourcePages("experiment-growth-response", "Bile-acid growth response");

window.SITE_DATA.pages["project-description"].details = [
  {
    eyebrow: "Biological rationale",
    title: "A two-cassette route to LCA sulfation",
    text: "Renata's proposed construct pairs the BtSULT sulfotransferase with a dedicated PAPS-supply module. BtSULT is intended to convert lithocholic acid (LCA) to sulfated LCA, while KIATPSL and PcAPSK support production of PAPS, the required sulfate donor.",
    items: [
      "Cassette 1: Anderson promoter - RBS - BtSULT CDS - double terminator",
      "Cassette 2: Anderson promoter - RBS - KIATPSL + PcAPSK CDS - double terminator",
      "Both transcriptional units are intended for a compatible JUMP destination backbone"
    ],
    note: "Design status: proposed architecture. Final part IDs, promoter strengths, junctions, and host optimization still require confirmation."
  }
];

window.SITE_DATA.pages.engineering.details = [
  {
    eyebrow: "DBTL cycle 2",
    title: "Design, build, test, learn",
    text: "This cycle moves from a modular pathway concept to a characterization plan that can distinguish constitutive expression from operator- and transcription-factor-dependent behavior.",
    steps: [
      { label: "Design", text: "Define two pathway cassettes and a four-condition sfGFP reporter matrix." },
      { label: "Build", text: "Assemble Level 0 parts into Level 1 transcriptional units with Type IIS cloning and JUMP-compatible vectors." },
      { label: "Test", text: "Measure sfGFP across promoter/operator and transcription-factor conditions, then vary bile-acid concentration within growth-tolerant ranges." },
      { label: "Learn", text: "Use expression and growth data to select regulatory logic before committing it to the full BtSULT/PAPS circuit." }
    ],
    note: "This cycle records an experimental plan; characterization data have not yet been reported."
  },
  {
    eyebrow: "DBTL 2 evidence map",
    title: "What this cycle establishes",
    items: [
      "A biologically motivated two-cassette BtSULT/PAPS pathway architecture",
      "A hierarchical Golden Gate/JUMP assembly strategy",
      "A four-condition reporter experiment for separating operator and transcription-factor effects",
      "A documented set of part-selection and compatibility checks",
      "Explicit unresolved decisions to carry into the next design review"
    ],
    note: "Evidence boundary: this cycle documents research and experimental design. It does not yet establish successful assembly, expression, LCA sulfation, or bile-responsive regulation."
  }
];

window.SITE_DATA.pages["wet-lab"].details = [
  {
    eyebrow: "Assembly architecture",
    title: "Hierarchical Golden Gate with JUMP",
    text: "Type IIS restriction enzymes cut outside their recognition sites, creating designed overhangs that order multiple parts in a single reaction. The working plan uses BsaI for basic-part assembly into transcriptional units, followed by a higher-level assembly route for the multi-cassette construct.",
    steps: [
      { label: "Level 0", text: "Promoters, RBSs, coding sequences, operators, and terminators are prepared as standardized basic parts." },
      { label: "Level 1", text: "Basic parts are assembled into complete promoter-RBS-CDS-terminator transcriptional units." },
      { label: "Level 2", text: "The BtSULT and PAPS-supply transcriptional units are combined in a compatible destination backbone." }
    ],
    note: "Candidate backbone noted in the working document: pJUMP29-1A(sfGFP). Backbone level, antibiotic selection, fusion sites, and capacity must be verified before assembly."
  }
];

window.SITE_DATA.pages.experiments.details = [
  {
    eyebrow: "Reporter characterization",
    title: "Four constructs isolate regulatory effects",
    text: "sfGFP serves as the reporter for comparing basal promoter activity, operator effects, and transcription-factor-dependent regulation.",
    constructs: [
      { id: "A", title: "Promoter + sfGFP", text: "Constitutive reference without operator or separate transcription factor." },
      { id: "B", title: "Operator + promoter + sfGFP", text: "Measures the effect of adding the candidate operator sequence." },
      { id: "A + C", title: "Promoter + sfGFP, plus TF", text: "Tests whether the transcription factor changes the operator-free reporter." },
      { id: "B + C", title: "Operator + promoter + sfGFP, plus TF", text: "Tests regulation when both the operator and transcription factor are present." }
    ],
    note: "Suggested readouts: normalized sfGFP fluorescence and growth across a bile-acid concentration series, with appropriate positive and negative controls."
  },
  {
    id: "experiment-notebook",
    eyebrow: "Experiment notebook",
    title: "From question to next step",
    text: "Keep the experimental story chronological while showing what each experiment was meant to answer, how the team interpreted its results, and how that interpretation shaped the work that followed.",
    steps: [
      { label: "Chronology", text: "Record when the experiment occurred and place it in the sequence of the project." },
      { label: "Answers", text: "State the question the experiment addressed and what the result directly answered." },
      { label: "Interpretation", text: "Explain what the team concluded from the result, including uncertainty and limitations." },
      { label: "Continuation", text: "Show how that interpretation informed the next experiment, design decision, or project direction." }
    ],
    note: "Each dated entry should connect the experimental question, result, interpretation, and resulting next step, with links to its assay, method record, and raw data."
  }
];

window.SITE_DATA.pages["dry-lab"].details = [
  {
    eyebrow: "In-silico design",
    title: "Benchling assembly and compatibility checks",
    text: "The dry-lab workflow converts the biological design into an auditable hierarchical build before DNA is ordered or assembled.",
    items: [
      "Annotate every Level 0 part and its exact sequence source",
      "Check internal BsaI/BsmBI/SapI sites and assign compatible fusion overhangs",
      "Simulate Level 0-to-Level 1 and Level 1-to-Level 2 assemblies",
      "Confirm reading frames, orientations, junction scars, terminators, and antibiotic markers",
      "Export final maps, sequences, and an assembly manifest for the wet-lab team"
    ],
    note: "Open question from DBTL 2: whether a reduced two-transcription-unit route can save time without sacrificing modularity or reliable expression."
  }
];
