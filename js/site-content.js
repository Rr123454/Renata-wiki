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
  ctaButton: { text: "Back Home", href: "index.html", style: "primary" },
  ...config
});

window.SITE_DATA = {
  brand: {
    title: "iGEM Renata",
    subtitle: "Reborn through synthetic biology"
  },

  nav: [
    { key: "home", label: "Home", href: "index.html" },
    { key: "team", label: "Team", href: "team.html" },
    {
      key: "project",
      label: "Project",
      href: "project.html",
      children: [
        { key: "project-description", label: "Project Description", href: "project-description.html" },
        { key: "engineering", label: "Engineering", href: "engineering.html" },
        { key: "results", label: "Results", href: "results.html" }
      ]
    },
    {
      key: "lab-work",
      label: "Lab Work",
      href: "wet-lab.html",
      menuOnly: true,
      children: [
        {
          key: "wet-lab",
          label: "Wet Lab",
          href: "wet-lab.html",
          description: "Build, assays, and validation",
          children: [
            { key: "experiments", label: "Experiments", href: "experiments.html" },
            { key: "protocols", label: "Protocols", href: "protocols.html" },
            { key: "notebook", label: "Notebook", href: "notebook.html" }
          ]
        },
        {
          key: "dry-lab",
          label: "Dry Lab",
          href: "dry-lab.html",
          description: "Models, software, and workflow",
          children: [
            { key: "model", label: "Model", href: "model.html" },
            { key: "software", label: "Software", href: "software.html" },
            { key: "pcs", label: "PCS", href: "pcs.html" }
          ]
        }
      ]
    },
    {
      key: "engagement",
      label: "Engagement",
      href: "engagement.html",
      children: [
        { key: "human-practices", label: "Human Practices", href: "human-practices.html" },
        { key: "education", label: "Education", href: "education.html" },
        { key: "partnerships", label: "Partnerships", href: "partnerships.html" }
      ]
    },
    { key: "judging", label: "Judging", href: "judging.html" },
    { key: "contact", label: "Contact", href: "contact.html" }
  ],

  pages: {
    home: makePage({
      group: "home",
      kicker: "Synthetic Biology • Rebirth • Impact",
      title: "Meet <span class='accent-gradient'>Renata</span>",
      lead: "Explore the people, science, and impact behind our synthetic biology project.",
      buttons: [
        { text: "Project", href: "project.html", style: "primary" },
        { text: "PCS", href: "pcs.html", style: "secondary" }
      ],
      stats: [
        { value: "Renata", label: "identity" },
        { value: "PCS", label: "workflow" },
        { value: "Judging", label: "focus" }
      ],
      cardsTitle: "Explore our work",
      cardsLead: "Every part of Renata is connected. Choose a section to follow the story from idea to impact.",
      cards: [
        { tag: "People", title: "Team", href: "team.html", imageLabel: "Team photo", text: "Meet the students, advisors, and collaborators bringing Renata to life." },
        { tag: "Idea", title: "Project", href: "project.html", imageLabel: "Project overview", text: "Discover the problem we chose, the system we designed, and the change we hope to create." },
        { tag: "Build", title: "Wet Lab", href: "wet-lab.html", imageLabel: "Wet lab research", text: "Follow our experiments, protocols, and biological validation from bench to result." },
        { tag: "Compute", title: "Dry Lab", href: "dry-lab.html", imageLabel: "Dry lab modeling", text: "Explore the models, software, and computational workflow supporting our design." },
        { tag: "Impact", title: "Engagement", href: "engagement.html", imageLabel: "Community engagement", text: "See how human practices, education, and partnerships shaped the project." },
        { tag: "Evidence", title: "Judging", href: "judging.html", imageLabel: "Judging highlights", text: "Find a clear map of our strongest evidence, achievements, and award criteria." },
        { tag: "Connect", title: "Contact", href: "contact.html", imageLabel: "Contact the team", text: "Reach the Renata team, learn about our institution, or start a conversation." }
      ],
      ctaTitle: "Ready to dive deeper?",
      ctaText: "Start with the project story, then follow the evidence through our lab work and community engagement.",
      ctaButton: { text: "Explore the project", href: "project.html", style: "primary" }
    }),

    team: makePage({
      group: "team",
      kicker: "People • Roles • Collaboration",
      title: "The <span class='accent-gradient'>team</span> behind Renata",
      lead: "Add members, roles, advisors, and collaborators here.",
      cardsTitle: "Team blocks",
      cardsLead: "Keep this page short and readable.",
      cards: [
        { tag: "Members", title: "Core team", text: "Add names and roles." },
        { tag: "Support", title: "Advisors", text: "Add mentors and faculty." },
        { tag: "Work", title: "Contributions", text: "Show who handled what." }
      ],
      ctaTitle: "Keep the team page clean",
      ctaText: "This page should introduce people quickly.",
      ctaButton: { text: "Contact", href: "contact.html", style: "primary" }
    }),

    project: makePage({
      group: "project",
      kicker: "Problem • System • Impact",
      title: "The <span class='accent-gradient'>project</span> at a glance",
      lead: "Use this page for the overall problem, the system, and the project goal.",
      cardsTitle: "Core sections",
      cardsLead: "These three pieces should define the page.",
      cards: [
        { tag: "Problem", title: "What is the issue?", text: "State the real-world problem." },
        { tag: "System", title: "What are we building?", text: "Explain the project idea simply." },
        { tag: "Impact", title: "Why does it matter?", text: "Show who benefits and why." }
      ],
      ctaTitle: "Use this page as the overview",
      ctaText: "This should be the clean starting point for the deeper project pages.",
      ctaButton: { text: "Project Description", href: "project-description.html", style: "primary" }
    }),

    "project-description": makePage({
      group: "project",
      kicker: "Background • Gap • Concept",
      title: "Project <span class='accent-gradient'>description</span>",
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
      ctaButton: { text: "Engineering", href: "engineering.html", style: "primary" }
    }),

    engineering: makePage({
      group: "project",
      kicker: "Design • Build • Learn",
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
      ctaButton: { text: "Results", href: "results.html", style: "primary" }
    }),

    results: makePage({
      group: "project",
      kicker: "Evidence • Readouts • Meaning",
      title: "<span class='accent-gradient'>Results</span>",
      lead: "Use this page for the strongest project results and what they mean.",
      cardsTitle: "Result blocks",
      cardsLead: "Keep the outputs simple and clear.",
      cards: [
        { tag: "Data", title: "Main result", text: "Show the strongest result first." },
        { tag: "Meaning", title: "Interpretation", text: "Explain what the result means." },
        { tag: "Limits", title: "Next step", text: "Show what still needs work." }
      ],
      ctaTitle: "Keep the results readable",
      ctaText: "Judges should be able to understand the meaning of the data quickly.",
      ctaButton: { text: "Judging", href: "judging.html", style: "primary" }
    }),

    "wet-lab": makePage({
      group: "wet-lab",
      kicker: "Build • Assays • Validation",
      title: "The <span class='accent-gradient'>wet lab</span> hub",
      lead: "Use this page to frame the wet-lab work before the deeper pages.",
      cardsTitle: "Wet lab blocks",
      cardsLead: "This page should act as the wet-lab gateway.",
      cards: [
        { tag: "Goal", title: "Objective", text: "State what the wet lab needed to show." },
        { tag: "Work", title: "Assays", text: "Summarize the main experiments." },
        { tag: "Link", title: "Connection", text: "Show how it supports the project." }
      ],
      ctaTitle: "Route into the wet-lab details",
      ctaText: "This page should send visitors to Experiments, Protocols, and Notebook.",
      ctaButton: { text: "Experiments", href: "experiments.html", style: "primary" }
    }),

    experiments: makePage({
      group: "wet-lab",
      kicker: "Assays • Controls • Readouts",
      title: "<span class='accent-gradient'>Experiments</span>",
      lead: "Use this page for the main assay structure and logic.",
      cardsTitle: "Main blocks",
      cardsLead: "Keep the question, control, and output clear.",
      cards: [
        { tag: "Question", title: "Assay goal", text: "State what each experiment tested." },
        { tag: "Control", title: "Comparison", text: "Show controls and validation." },
        { tag: "Output", title: "Readout", text: "Show what was measured." }
      ],
      ctaTitle: "Keep the assays structured",
      ctaText: "This page should make the experiment logic easy to follow.",
      ctaButton: { text: "Protocols", href: "protocols.html", style: "primary" }
    }),

    protocols: makePage({
      group: "wet-lab",
      kicker: "Methods • Conditions • Reproducibility",
      title: "<span class='accent-gradient'>Protocols</span>",
      lead: "Use this page for method details and reproducibility.",
      cardsTitle: "Protocol blocks",
      cardsLead: "Keep the methods concrete and repeatable.",
      cards: [
        { tag: "Setup", title: "Materials", text: "List the core materials and setup." },
        { tag: "Method", title: "Procedure", text: "Write the main steps clearly." },
        { tag: "Notes", title: "Important details", text: "Add conditions that matter most." }
      ],
      ctaTitle: "Keep the methods useful",
      ctaText: "This page should help readers actually follow the work.",
      ctaButton: { text: "Notebook", href: "notebook.html", style: "primary" }
    }),

    notebook: makePage({
      group: "wet-lab",
      kicker: "Dates • Milestones • Traceability",
      title: "Project <span class='accent-gradient'>notebook</span>",
      lead: "Use this page for progress over time.",
      cardsTitle: "Notebook blocks",
      cardsLead: "Keep entries organized and meaningful.",
      cards: [
        { tag: "Time", title: "Chronology", text: "Show when major work happened." },
        { tag: "Reason", title: "Why", text: "State the reason for each block of work." },
        { tag: "Outcome", title: "Result", text: "Show what it led to." }
      ],
      ctaTitle: "Make the notebook readable",
      ctaText: "This page should help people track the project clearly over time.",
      ctaButton: { text: "Engineering", href: "engineering.html", style: "primary" }
    }),

    "dry-lab": makePage({
      group: "dry-lab",
      kicker: "Modeling • Software • Analysis",
      title: "The <span class='accent-gradient'>dry lab</span> hub",
      lead: "Use this page to frame all computational work.",
      cardsTitle: "Dry lab blocks",
      cardsLead: "This page should guide people into the deeper dry-lab pages.",
      cards: [
        { tag: "Goal", title: "Purpose", text: "State what the dry lab was meant to answer." },
        { tag: "Tools", title: "What was built", text: "Summarize the model or software." },
        { tag: "Impact", title: "Project effect", text: "Show how it changed the project." }
      ],
      ctaTitle: "Route into the dry-lab details",
      ctaText: "This page should send visitors to Model, Software, and PCS.",
      ctaButton: { text: "Model", href: "model.html", style: "primary" }
    }),

    model: makePage({
      group: "dry-lab",
      kicker: "Assumptions • Variables • Prediction",
      title: "Project <span class='accent-gradient'>model</span>",
      lead: "Use this page for the model, its assumptions, and what it predicts.",
      cardsTitle: "Model blocks",
      cardsLead: "Keep the model understandable.",
      cards: [
        { tag: "Setup", title: "Assumptions", text: "State the key assumptions." },
        { tag: "Output", title: "Predictions", text: "Show the main outputs." },
        { tag: "Use", title: "Project effect", text: "Show what the model changed." }
      ],
      ctaTitle: "Keep the model meaningful",
      ctaText: "The model page should explain why the model mattered.",
      ctaButton: { text: "PCS", href: "pcs.html", style: "primary" }
    }),

    software: makePage({
      group: "dry-lab",
      kicker: "Tool • Input • Output",
      title: "Project <span class='accent-gradient'>software</span>",
      lead: "Use this page for the software, its use, and its value.",
      cardsTitle: "Software blocks",
      cardsLead: "Keep the software story practical.",
      cards: [
        { tag: "Purpose", title: "What it does", text: "State the problem the software solves." },
        { tag: "Flow", title: "How it works", text: "Show the input-output flow." },
        { tag: "Value", title: "Why it matters", text: "Tie it to the project." }
      ],
      ctaTitle: "Keep the software practical",
      ctaText: "This page should explain function and value quickly.",
      ctaButton: { text: "Judging", href: "judging.html", style: "primary" }
    }),

    pcs: makePage({
      group: "dry-lab",
      kicker: "Design • Construct • Screen • Characterize",
      title: "The <span class='accent-gradient'>PCS workflow</span>",
      lead: "Use this page for the project pipeline and how each phase connects.",
      cardsTitle: "PCS phases",
      cardsLead: "Keep the workflow visual and simple.",
      cards: [
        { tag: "P", title: "Design", text: "Target, logic, and planning." },
        { tag: "C", title: "Construct", text: "System build and setup." },
        { tag: "S", title: "Screen", text: "Selection and validation." },
        { tag: "C", title: "Characterize", text: "Performance and meaning." }
      ],
      ctaTitle: "Make PCS a signature page",
      ctaText: "If one workflow page defines Renata, it should be this one.",
      ctaButton: { text: "Results", href: "results.html", style: "primary" }
    }),

    engagement: makePage({
      group: "engagement",
      kicker: "Stakeholders • Outreach • Context",
      title: "<span class='accent-gradient'>Engagement</span>",
      lead: "Use this page as the hub for outward-facing work.",
      cardsTitle: "Engagement blocks",
      cardsLead: "Keep the connection to the project visible.",
      cards: [
        { tag: "People", title: "Who matters", text: "Show relevant groups and stakeholders." },
        { tag: "Input", title: "What you learned", text: "Summarize the main insights." },
        { tag: "Effect", title: "What changed", text: "Show how engagement affected the project." }
      ],
      ctaTitle: "Use engagement to strengthen the project",
      ctaText: "This page should show that the project exists in a real-world context.",
      ctaButton: { text: "Human Practices", href: "human-practices.html", style: "primary" }
    }),

    "human-practices": makePage({
      group: "engagement",
      kicker: "Stakeholders • Decisions • Integration",
      title: "<span class='accent-gradient'>Human Practices</span>",
      lead: "Use this page to show who you talked to and what changed because of it.",
      cardsTitle: "Human Practices blocks",
      cardsLead: "Keep this page concrete.",
      cards: [
        { tag: "Who", title: "Stakeholders", text: "Identify the important voices." },
        { tag: "Insight", title: "What they said", text: "Summarize the useful input." },
        { tag: "Change", title: "What shifted", text: "Show the project change directly." }
      ],
      ctaTitle: "Make the effect visible",
      ctaText: "Judges should clearly see how outside input shaped the project.",
      ctaButton: { text: "Project", href: "project.html", style: "primary" }
    }),

    education: makePage({
      group: "engagement",
      kicker: "Audience • Material • Outcome",
      title: "Project <span class='accent-gradient'>education</span>",
      lead: "Use this page for the audience, material, and result of your educational work.",
      cardsTitle: "Education blocks",
      cardsLead: "Keep the educational work measurable and easy to read.",
      cards: [
        { tag: "Audience", title: "Who it was for", text: "Add the target audience." },
        { tag: "Material", title: "What you made", text: "Add the lesson, event, or materials." },
        { tag: "Outcome", title: "What happened", text: "Add the result or response." }
      ],
      ctaTitle: "Keep the page measurable",
      ctaText: "The page should show what was taught and what came from it.",
      ctaButton: { text: "Partnerships", href: "partnerships.html", style: "primary" }
    }),

    partnerships: makePage({
      group: "engagement",
      kicker: "Collaboration • Shared work • Impact",
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
      ctaButton: { text: "Team", href: "team.html", style: "primary" }
    }),

    judging: makePage({
      group: "judging",
      kicker: "Medal map • Evidence • Navigation",
      title: "<span class='accent-gradient'>Judging</span>",
      lead: "Use this page to map claims and medal criteria to the right pages.",
      cardsTitle: "Judging blocks",
      cardsLead: "This page should save judges time.",
      cards: [
        { tag: "Map", title: "Criteria map", text: "Point each criterion to the right page." },
        { tag: "Proof", title: "Evidence", text: "Show where the strongest proof lives." },
        { tag: "Integration", title: "Connections", text: "Show how the project pieces support each other." }
      ],
      ctaTitle: "Make the wiki easy to score",
      ctaText: "A strong judging page helps the whole site feel organized.",
      ctaButton: { text: "Project", href: "project.html", style: "primary" }
    }),

    contact: makePage({
      group: "contact",
      kicker: "Email • Sponsors • Advisors",
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
      ctaButton: { text: "Email the Team", href: "mailto:yourteamemail@example.com", style: "primary" }
    })
  }
};

// DBTL 2 working record, organized by the pages where each decision is most useful.
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
    note: "The PDF records this as an experimental plan; characterization data have not yet been reported."
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
  }
];

window.SITE_DATA.pages.protocols.details = [
  {
    eyebrow: "Planned workflow",
    title: "From kit parts to an assembly-ready map",
    steps: [
      { label: "1", text: "Select the destination backbone and confirm assembly level, antibiotic marker, and recipient role." },
      { label: "2", text: "Choose one bacterial promoter and RBS per cassette, balancing expression against host burden." },
      { label: "3", text: "Confirm each CDS identity, orientation, completeness, codon optimization, and internal Type IIS sites." },
      { label: "4", text: "Add double terminators and verify insulation between the two transcriptional units." },
      { label: "5", text: "Record part IDs, well locations, flanking enzymes, and 5-prime/3-prime fusion overhangs." },
      { label: "6", text: "Build and validate the hierarchical assembly in Benchling, then export the annotated map for wet-lab review." }
    ],
    note: "This is a design checklist, not a bench-ready protocol. Reaction volumes, cycling conditions, controls, transformation, screening, and sequence verification must be added before execution."
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

window.SITE_DATA.pages.judging.details = [
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
    note: "Evidence boundary: this cycle documents research and experimental design. It does not yet establish successful assembly, expression, LCA sulfation, or bile-responsive regulation.",
    source: { label: "View the original DBTL 2 working document", href: "assets/documents/golden-gate-dbtl-2.pdf" }
  }
];
