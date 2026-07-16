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
      key: "wet-lab",
      label: "Wet Lab",
      href: "wet-lab.html",
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
      children: [
        { key: "model", label: "Model", href: "model.html" },
        { key: "software", label: "Software", href: "software.html" },
        { key: "pcs", label: "PCS", href: "pcs.html" }
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
      title: "Build a <span class='accent-gradient'>better wiki</span>",
      lead: "A bold homepage for Renata. Keep the story simple, visual, and easy to judge.",
      buttons: [
        { text: "Project", href: "project.html", style: "primary" },
        { text: "PCS", href: "pcs.html", style: "secondary" }
      ],
      stats: [
        { value: "Renata", label: "identity" },
        { value: "PCS", label: "workflow" },
        { value: "Judging", label: "focus" }
      ],
      cardsTitle: "Start here",
      cardsLead: "Use the homepage to route people into the right pages.",
      cards: [
        { tag: "Project", title: "Project story", text: "Add the problem, the system, and why it matters." },
        { tag: "PCS", title: "Workflow page", text: "Show the project pipeline clearly and visually." },
        { tag: "Judging", title: "Judge map", text: "Point judges to the strongest evidence pages." }
      ],
      ctaTitle: "Keep the homepage simple",
      ctaText: "The homepage should be a launch point, not a wall of text.",
      ctaButton: { text: "Open Judging", href: "judging.html", style: "primary" }
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