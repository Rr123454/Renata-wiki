const page = (config) => ({
  kicker: "iGEM Renata",
  heading: "Build a <span class='accent-gradient'>better story</span>",
  lead: "Replace this with your page-specific summary.",
  buttons: [
    { text: "View Project", href: "project.html", style: "primary" },
    { text: "See Judging", href: "judging.html", style: "secondary" }
  ],
  stats: [],
  spotlight: {
    label: "Page focus",
    title: "What this page should do",
    text: "Use this panel to summarize what a judge or visitor should understand in under thirty seconds.",
    points: ["State the purpose clearly", "Link decisions to evidence", "Keep the story readable", "Show why it matters"],
    links: [
      { text: "Project", href: "project.html" },
      { text: "Judging", href: "judging.html" }
    ]
  },
  cardsLabel: "Core blocks",
  cardsTitle: "What belongs here",
  cardsLead: "Use these cards as the first layer of structure for the page.",
  cards: [],
  feature: {
    label: "How to strengthen it",
    title: "Make the page judge-friendly",
    text: "A strong iGEM page does not just look good. It helps a judge see your logic, evidence, and integration quickly.",
    bullets: [
      "Open with the main question or goal",
      "Show the experimental or modeling logic",
      "Connect the work to the larger project",
      "Link out to the exact evidence page"
    ],
    noteLabel: "Editing note",
    noteTitle: "What to replace first",
    noteText: "Rewrite the intro, the three core cards, and the final callout. Those three areas do most of the storytelling."
  },
  timeline: {
    label: "Build order",
    title: "A simple way to finish this page",
    items: [
      { title: "Frame it", text: "Write the problem, purpose, or key question first." },
      { title: "Support it", text: "Add the methods, logic, or workflow that back it up." },
      { title: "Prove it", text: "Show results, figures, decisions, or stakeholder evidence." },
      { title: "Connect it", text: "Link this page back to the rest of the wiki and judging." }
    ]
  },
  cta: {
    title: "Keep the story moving",
    text: "Every page should lead naturally to the next useful page. That is how the wiki becomes easy to judge.",
    button: { text: "Back to Home", href: "index.html", style: "primary" }
  },
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
    { key: "project", label: "Project", href: "project.html" },
    { key: "project-description", label: "Project Description", href: "project-description.html" },
    { key: "engineering", label: "Engineering", href: "engineering.html" },
    { key: "results", label: "Results", href: "results.html" },
    { key: "wet-lab", label: "Wet Lab", href: "wet-lab.html" },
    { key: "experiments", label: "Experiments", href: "experiments.html" },
    { key: "protocols", label: "Protocols", href: "protocols.html" },
    { key: "notebook", label: "Notebook", href: "notebook.html" },
    { key: "dry-lab", label: "Dry Lab", href: "dry-lab.html" },
    { key: "model", label: "Model", href: "model.html" },
    { key: "software", label: "Software", href: "software.html" },
    { key: "pcs", label: "PCS", href: "pcs.html" },
    { key: "engagement", label: "Engagement", href: "engagement.html" },
    { key: "human-practices", label: "Human Practices", href: "human-practices.html" },
    { key: "education", label: "Education", href: "education.html" },
    { key: "partnerships", label: "Partnerships", href: "partnerships.html" },
    { key: "judging", label: "Judging", href: "judging.html" },
    { key: "contact", label: "Contact", href: "contact.html" }
  ],

  pages: {
    home: page({
      kicker: "Synthetic Biology • Rebirth • Impact",
      heading: "Build a <span class='accent-gradient'>judge-first wiki</span> that actually feels alive",
      lead:
        "Renata means reborn, so the site should feel like it: bold, energetic, and clear. This homepage is your launch point into the project story, PCS workflow, and judging evidence.",
      buttons: [
        { text: "Start with the Project", href: "project.html", style: "primary" },
        { text: "Jump to PCS", href: "pcs.html", style: "secondary" }
      ],
      stats: [
        { value: "Phoenix", label: "visual identity" },
        { value: "PCS", label: "workflow backbone" },
        { value: "Judging", label: "wiki-first strategy" }
      ],
      spotlight: {
        label: "Homepage role",
        title: "What visitors should understand fast",
        text:
          "The homepage should make the project memorable in seconds, then route judges into the exact pages that prove your work.",
        points: [
          "State the problem and solution clearly",
          "Show what makes Renata different",
          "Point to the PCS process and core evidence",
          "Guide judges into the right pages quickly"
        ],
        links: [
          { text: "Project", href: "project.html" },
          { text: "PCS", href: "pcs.html" },
          { text: "Judging", href: "judging.html" }
        ]
      },
      cardsLabel: "Main pathways",
      cardsTitle: "How the site should guide people",
      cardsLead:
        "A strong homepage does not try to show everything. It shows the right entry points.",
      cards: [
        {
          tag: "Project",
          title: "Explain the system",
          text: "Lead with the problem, your engineered solution, and why the idea deserves attention."
        },
        {
          tag: "PCS",
          title: "Show the workflow",
          text: "Use PCS as a visual backbone that links design, build, screening, and characterization."
        },
        {
          tag: "Judging",
          title: "Make scoring easy",
          text: "Map claims to pages so judges can verify work without hunting through the whole wiki."
        }
      ],
      feature: {
        label: "Visual direction",
        title: "Lean into rebirth, energy, and clarity",
        text:
          "The strongest aesthetic for Renata is not just orange and navy. It is ember orange, molten gold, midnight blue, and electric cyan working together.",
        bullets: [
          "Use orange and gold for heat, motion, and rebirth",
          "Use deep blues to keep the site scientific and grounded",
          "Use cyan accents for fresh contrast and a more premium feel",
          "Keep layouts structured so the visuals never overpower the content"
        ],
        noteLabel: "What to add",
        noteTitle: "Best homepage upgrade",
        noteText:
          "Once the real project summary is ready, rewrite the opening paragraph and replace the three cards with your actual story, workflow, and evidence plan."
      },
      timeline: {
        label: "Homepage build order",
        title: "How to finish this page quickly",
        items: [
          { title: "Anchor it", text: "Write one strong project sentence at the top." },
          { title: "Route it", text: "Point users into Project, PCS, and Judging." },
          { title: "Sharpen it", text: "Replace placeholder cards with the real system story." },
          { title: "Polish it", text: "Add your actual figures, diagrams, and team language." }
        ]
      },
      cta: {
        title: "Make the homepage a launchpad",
        text: "The homepage should route judges to the exact pages that prove the work, not bury the evidence under flashy design.",
        button: { text: "Open Judging Page", href: "judging.html", style: "primary" }
      }
    }),

    team: page({
      kicker: "People • Roles • Collaboration",
      heading: "The <span class='accent-gradient'>team</span> behind Renata",
      lead:
        "This page should introduce the people, structure, and collaboration style behind the project without turning into a wall of bios.",
      spotlight: {
        label: "Team page role",
        title: "Show people and contribution clearly",
        text:
          "Keep the team page readable. Judges should see who did what, how the team worked, and where guidance or mentoring fit in.",
        points: [
          "List members with roles and focus areas",
          "Add advisors, mentors, and collaborators",
          "Show how responsibilities were divided",
          "Keep descriptions short and concrete"
        ],
        links: [
          { text: "Partnerships", href: "partnerships.html" },
          { text: "Contact", href: "contact.html" }
        ]
      },
      cards: [
        { tag: "Members", title: "Core team", text: "List the main members and what each person mainly contributed." },
        { tag: "Leadership", title: "Coordination", text: "Explain how planning, meetings, and project management were handled." },
        { tag: "Support", title: "Advisors and mentors", text: "Add faculty, external mentors, or specialists who helped shape the work." }
      ]
    }),

    project: page({
      kicker: "Problem • System • Impact",
      heading: "The <span class='accent-gradient'>project</span> at a glance",
      lead:
        "This page should be the clean overview that explains the problem, current gap, your system, and what success would look like.",
      spotlight: {
        label: "Project page role",
        title: "Make the whole idea understandable fast",
        text:
          "This is the most important orientation page. A judge should understand the project before opening the deeper evidence pages.",
        points: [
          "State the need or pain point",
          "Explain the system at a high level",
          "Show why your approach is different",
          "Point to wet lab, dry lab, and engagement pages"
        ],
        links: [
          { text: "Project Description", href: "project-description.html" },
          { text: "Results", href: "results.html" },
          { text: "Judging", href: "judging.html" }
        ]
      },
      cards: [
        { tag: "Need", title: "What problem are we solving?", text: "Write the real-world issue in plain language before introducing technical detail." },
        { tag: "Solution", title: "What are we building?", text: "Summarize the engineered system so the concept is memorable and precise." },
        { tag: "Reason", title: "Why this matters", text: "Show the stakes, the beneficiaries, and the practical value of your approach." }
      ]
    }),

    "project-description": page({
      kicker: "Context • Gap • Concept",
      heading: "Project <span class='accent-gradient'>description</span>",
      lead:
        "Use this page for the full narrative: the problem background, existing limitations, and the concept behind Renata.",
      spotlight: {
        label: "Description role",
        title: "Tell the full story without losing clarity",
        text:
          "This page should go deeper than the overview, but still stay readable. Think in terms of background, gap, and proposed solution.",
        points: [
          "Explain the context carefully",
          "Show why current methods are limited",
          "Introduce your concept as a response",
          "End by leading into engineering and results"
        ],
        links: [
          { text: "Engineering", href: "engineering.html" },
          { text: "Results", href: "results.html" }
        ]
      },
      cards: [
        { tag: "Background", title: "The broader context", text: "Describe the scientific or societal context that makes the problem important." },
        { tag: "Limitation", title: "Where current approaches fall short", text: "Explain what is missing, inefficient, unsafe, inaccessible, or incomplete today." },
        { tag: "Concept", title: "How Renata responds", text: "Present your concept in a way that naturally sets up the rest of the wiki." }
      ]
    }),

    engineering: page({
      kicker: "Design • Build • Learn",
      heading: "<span class='accent-gradient'>Engineering</span> the system",
      lead:
        "This page should prove iteration. Judges want to see how the design changed over time, not just the final form.",
      spotlight: {
        label: "Engineering role",
        title: "Document iteration, not perfection",
        text:
          "A strong engineering page shows what you tried, what failed or changed, and how those changes improved the project.",
        points: [
          "Log design choices and their rationale",
          "Show why each iteration happened",
          "Link model or stakeholder input to redesign",
          "End with the final version and why it won"
        ],
        links: [
          { text: "Notebook", href: "notebook.html" },
          { text: "Model", href: "model.html" }
        ]
      },
      cards: [
        { tag: "Cycle 1", title: "Initial design", text: "Show the original assumptions, constraints, and prototype direction." },
        { tag: "Cycle 2", title: "What changed", text: "Explain how data, feasibility, or feedback pushed the design to evolve." },
        { tag: "Cycle 3", title: "Final version", text: "Present the improved design and why it is better than the first attempt." }
      ]
    }),

    results: page({
      kicker: "Evidence • Readouts • Meaning",
      heading: "<span class='accent-gradient'>Results</span> that support the story",
      lead:
        "Use this page to summarize the highest-value outputs that prove the project progressed meaningfully.",
      spotlight: {
        label: "Results role",
        title: "Show what happened and why it matters",
        text:
          "Results should not just be figures. They should answer the question: what did this tell us about the system?",
        points: [
          "Highlight the strongest readouts first",
          "State the interpretation next to the result",
          "Acknowledge limits honestly",
          "Link out to experiments, modeling, and PCS"
        ],
        links: [
          { text: "Experiments", href: "experiments.html" },
          { text: "PCS", href: "pcs.html" }
        ]
      },
      cards: [
        { tag: "Output", title: "Key observations", text: "Show the results that matter most for validating the system." },
        { tag: "Interpretation", title: "What the data means", text: "Translate the result into a project-level conclusion, not just a measurement." },
        { tag: "Limits", title: "What remains uncertain", text: "State what still needs confirmation so the page feels rigorous and trustworthy." }
      ]
    }),

    "wet-lab": page({
      kicker: "Build • Assays • Validation",
      heading: "The <span class='accent-gradient'>wet lab</span> backbone",
      lead:
        "This page should act as the wet-lab hub: what was built, how it was tested, and where the detailed evidence lives.",
      spotlight: {
        label: "Wet lab role",
        title: "Connect experiments to the overall system",
        text:
          "This page should frame the lab work before sending readers to specific experiment, protocol, and notebook pages.",
        points: [
          "Describe the wet-lab objective",
          "Show how the assays fit the project goal",
          "Link protocols and notebook entries",
          "Make the controls and logic visible"
        ],
        links: [
          { text: "Experiments", href: "experiments.html" },
          { text: "Protocols", href: "protocols.html" },
          { text: "Notebook", href: "notebook.html" }
        ]
      },
      cards: [
        { tag: "Objective", title: "What the wet lab needed to prove", text: "Define what the lab work had to show for the project to make sense." },
        { tag: "Execution", title: "How it was tested", text: "Summarize the major assays, constructs, and measurements used." },
        { tag: "Connection", title: "How it fed the project", text: "Explain how wet-lab outcomes influenced engineering, PCS, or final conclusions." }
      ]
    }),

    experiments: page({
      kicker: "Assays • Controls • Replicates",
      heading: "<span class='accent-gradient'>Experiments</span> and assay logic",
      lead:
        "Use this page to break down the experiment structure clearly enough that a judge can follow the logic even before reading the protocols.",
      spotlight: {
        label: "Experiments role",
        title: "Show structure before detail",
        text:
          "Lead with experiment purpose, control strategy, and what each assay was meant to answer.",
        points: [
          "Name the experiment question clearly",
          "Show control and comparison groups",
          "State what was measured",
          "Link to protocols and notebook evidence"
        ],
        links: [
          { text: "Protocols", href: "protocols.html" },
          { text: "Notebook", href: "notebook.html" }
        ]
      },
      cards: [
        { tag: "Assay", title: "Experimental question", text: "Each assay should clearly map to a project decision or claim." },
        { tag: "Control", title: "Validation structure", text: "Make controls, comparisons, and repeated trials visible." },
        { tag: "Output", title: "How results were used", text: "Tie experimental outputs back into engineering or project conclusions." }
      ]
    }),

    protocols: page({
      kicker: "Methods • Conditions • Reproducibility",
      heading: "<span class='accent-gradient'>Protocols</span> for reproducibility",
      lead:
        "Use this page for method detail, conditions, setup choices, and anything another team would need to repeat the work.",
      spotlight: {
        label: "Protocols role",
        title: "Make methods concrete and useful",
        text:
          "This page should help readers repeat the work, not just prove that methods existed.",
        points: [
          "List key materials and conditions",
          "State critical timings or parameters",
          "Note anything unusually sensitive or important",
          "Link back to the assay or result that used the method"
        ],
        links: [
          { text: "Experiments", href: "experiments.html" },
          { text: "Results", href: "results.html" }
        ]
      },
      cards: [
        { tag: "Inputs", title: "Materials and setup", text: "State the core materials, strains, constructs, or devices involved." },
        { tag: "Process", title: "Critical method steps", text: "Summarize the procedure in the order that matters most." },
        { tag: "Notes", title: "Reproducibility details", text: "Flag the conditions that most strongly affect success or interpretation." }
      ]
    }),

    notebook: page({
      kicker: "Chronology • Rationale • Traceability",
      heading: "The project <span class='accent-gradient'>notebook</span>",
      lead:
        "This page should make the work traceable over time, not just dump dates and images without explanation.",
      spotlight: {
        label: "Notebook role",
        title: "Turn records into a usable timeline",
        text:
          "The notebook should help a judge or teammate see what happened, when it happened, and why it mattered.",
        points: [
          "Group by weeks or milestones",
          "Keep each entry short and useful",
          "Mention the reason behind the work",
          "Link outcomes forward to later pages"
        ],
        links: [
          { text: "Engineering", href: "engineering.html" },
          { text: "Results", href: "results.html" }
        ]
      },
      cards: [
        { tag: "Time", title: "Date-based tracking", text: "Make it obvious when major design or testing moments happened." },
        { tag: "Reason", title: "Why this was done", text: "Briefly explain the purpose of each major block of work." },
        { tag: "Outcome", title: "What it led to", text: "Show how notebook work connects to evidence, iteration, and conclusions." }
      ]
    }),

    "dry-lab": page({
      kicker: "Modeling • Software • Analysis",
      heading: "The <span class='accent-gradient'>dry lab</span> foundation",
      lead:
        "Use this page as the overview for all computational work and how it shaped the rest of the project.",
      spotlight: {
        label: "Dry lab role",
        title: "Frame the computational contribution",
        text:
          "This page should tell readers what the model or software was meant to answer before they open the deeper pages.",
        points: [
          "Define the computational goal",
          "Explain how it supports experiments",
          "Show what inputs and outputs matter",
          "Link to Model, Software, and PCS"
        ],
        links: [
          { text: "Model", href: "model.html" },
          { text: "Software", href: "software.html" },
          { text: "PCS", href: "pcs.html" }
        ]
      },
      cards: [
        { tag: "Scope", title: "What the dry lab was for", text: "Explain the exact decisions or predictions the computational work supported." },
        { tag: "Structure", title: "What was built", text: "Summarize the model, simulation, algorithm, or software components." },
        { tag: "Influence", title: "How it changed the project", text: "Show where dry-lab work shaped experiments, design, or communication." }
      ]
    }),

    model: page({
      kicker: "Assumptions • Variables • Prediction",
      heading: "Project <span class='accent-gradient'>model</span>",
      lead:
        "Use this page to explain what the model represents, what assumptions it uses, and how its outputs informed the project.",
      spotlight: {
        label: "Model role",
        title: "Make the model understandable, not just technical",
        text:
          "A good modeling page makes the assumptions, inputs, and outputs readable to judges who are not specialists in the exact method.",
        points: [
          "State the biological question behind the model",
          "Name the main variables and assumptions",
          "Show what predictions matter",
          "Explain how the model affected design choices"
        ],
        links: [
          { text: "Dry Lab", href: "dry-lab.html" },
          { text: "Engineering", href: "engineering.html" }
        ]
      },
      cards: [
        { tag: "Setup", title: "Model assumptions", text: "Explain the simplifying assumptions and why they were reasonable." },
        { tag: "Behavior", title: "Key outputs", text: "Highlight the outputs or trends that mattered most to the project." },
        { tag: "Impact", title: "Decision support", text: "Show how the model informed experiments, PCS, or interpretation." }
      ]
    }),

    software: page({
      kicker: "Tooling • Interface • Usefulness",
      heading: "Project <span class='accent-gradient'>software</span>",
      lead:
        "If you built software, this page should show what it does, who it helps, and how it integrates with the rest of the project.",
      spotlight: {
        label: "Software role",
        title: "Show function and value clearly",
        text:
          "Judges should not have to guess why the software exists. State the user, task, inputs, outputs, and practical value directly.",
        points: [
          "Name the intended user or audience",
          "Describe the problem the software solves",
          "Show the input-output workflow",
          "Tie it back to the project story"
        ],
        links: [
          { text: "Dry Lab", href: "dry-lab.html" },
          { text: "Judging", href: "judging.html" }
        ]
      },
      cards: [
        { tag: "Purpose", title: "Why this tool exists", text: "Explain the exact gap or inefficiency the software addresses." },
        { tag: "Flow", title: "How it works", text: "Show the user journey from input to result in simple steps." },
        { tag: "Integration", title: "Why it matters here", text: "Make it clear how the software strengthens the overall project." }
      ]
    }),

    pcs: page({
      kicker: "Design • Construct • Screen • Characterize",
      heading: "The <span class='accent-gradient'>PCS workflow</span> as a signature page",
      lead:
        "This page should visually explain the stepwise logic of the project. If Renata has a defining workflow page, it should be this one.",
      spotlight: {
        label: "PCS role",
        title: "Turn workflow into storytelling",
        text:
          "PCS should not feel like a random protocol acronym. It should feel like the project’s engine.",
        points: [
          "Make each phase explicit and memorable",
          "Show what moves from one stage to the next",
          "Connect outputs to decisions",
          "Use this page as a bridge between wet and dry lab"
        ],
        links: [
          { text: "Wet Lab", href: "wet-lab.html" },
          { text: "Dry Lab", href: "dry-lab.html" },
          { text: "Results", href: "results.html" }
        ]
      },
      cards: [
        { tag: "P", title: "Design", text: "Define the target, system logic, and planning choices that start the workflow." },
        { tag: "C", title: "Construct", text: "Show how the designed system is assembled or implemented." },
        { tag: "S", title: "Screen", text: "Explain how promising outcomes are selected, filtered, or validated." },
        { tag: "C", title: "Characterize", text: "Measure how the final system performs and what that means for the project." }
      ],
      timeline: {
        label: "Workflow logic",
        title: "How the PCS pipeline should read",
        items: [
          { title: "Design", text: "Plan the target, construct logic, and expected behavior." },
          { title: "Construct", text: "Build the system and place it in the correct context." },
          { title: "Screen", text: "Identify candidates or outcomes worth keeping." },
          { title: "Characterize", text: "Measure performance and interpret the final behavior." }
        ]
      }
    }),

    engagement: page({
      kicker: "Stakeholders • Outreach • Integration",
      heading: "<span class='accent-gradient'>Engagement</span> beyond the bench",
      lead:
        "Use this page as the hub for how the project interacted with people, communities, and the wider world.",
      spotlight: {
        label: "Engagement role",
        title: "Show that the project exists in context",
        text:
          "This page should frame your outward-facing work before sending readers into Human Practices, Education, and Partnerships.",
        points: [
          "Identify the people who matter to the project",
          "Show what you learned from them",
          "Explain what changed because of that",
          "Keep the connection to the project explicit"
        ],
        links: [
          { text: "Human Practices", href: "human-practices.html" },
          { text: "Education", href: "education.html" },
          { text: "Partnerships", href: "partnerships.html" }
        ]
      },
      cards: [
        { tag: "Context", title: "Who the project touches", text: "Identify the audiences, stakeholders, or communities relevant to the work." },
        { tag: "Dialogue", title: "What you learned", text: "Summarize the questions, concerns, and insights that emerged from engagement." },
        { tag: "Change", title: "What shifted", text: "Explain how engagement altered the design, priorities, or communication of the project." }
      ]
    }),

    "human-practices": page({
      kicker: "Stakeholders • Decisions • Integration",
      heading: "<span class='accent-gradient'>Human Practices</span> with consequences",
      lead:
        "This page should prove that stakeholder input changed the project in a concrete way.",
      spotlight: {
        label: "Human Practices role",
        title: "Do not just list conversations",
        text:
          "A strong human-practices page shows who you engaged, what they told you, and what changed because of it.",
        points: [
          "Name the stakeholder and why they matter",
          "Summarize the insight or concern clearly",
          "Explain the resulting change in the project",
          "Connect the change to a technical or strategic page"
        ],
        links: [
          { text: "Project", href: "project.html" },
          { text: "Engineering", href: "engineering.html" }
        ]
      },
      cards: [
        { tag: "Who", title: "Relevant stakeholders", text: "Identify the experts, users, or affected groups that shaped your thinking." },
        { tag: "Insight", title: "What they told you", text: "Pull out the ideas that actually influenced the project." },
        { tag: "Action", title: "What changed", text: "Tie the feedback directly to a design, safety, communication, or implementation decision." }
      ]
    }),

    education: page({
      kicker: "Audience • Material • Outcome",
      heading: "Project <span class='accent-gradient'>education</span>",
      lead:
        "This page should explain what you taught, to whom, how you taught it, and what the outcome was.",
      spotlight: {
        label: "Education role",
        title: "Make the educational work measurable",
        text:
          "A good education page goes beyond event photos. It shows audience, design, material, and outcome clearly.",
        points: [
          "Define the audience and need",
          "Explain the content or activity design",
          "Show outcomes or feedback",
          "Keep it linked to the project mission"
        ],
        links: [
          { text: "Engagement", href: "engagement.html" },
          { text: "Partnerships", href: "partnerships.html" }
        ]
      },
      cards: [
        { tag: "Audience", title: "Who it was for", text: "Describe the learners or participants and why they were chosen." },
        { tag: "Design", title: "What you built or taught", text: "Summarize the lesson, module, event, or educational material." },
        { tag: "Outcome", title: "What happened", text: "Show impact, response, or reflection so the page has substance." }
      ]
    }),

    partnerships: page({
      kicker: "Collaboration • Contribution • Integration",
      heading: "External <span class='accent-gradient'>partnerships</span>",
      lead:
        "Use this page for partner teams, external collaborators, and any shared work that improved the project.",
      spotlight: {
        label: "Partnership role",
        title: "Show mutual value clearly",
        text:
          "This page works best when it shows what each collaboration added and why it mattered to the project.",
        points: [
          "Name the collaborator or partner",
          "Describe the exchange or shared effort",
          "State the concrete benefit",
          "Link to the relevant technical or engagement page"
        ],
        links: [
          { text: "Team", href: "team.html" },
          { text: "Engagement", href: "engagement.html" }
        ]
      },
      cards: [
        { tag: "Who", title: "Partner profile", text: "Identify the collaborator and why the partnership made sense." },
        { tag: "Work", title: "Shared contribution", text: "Describe the actual work or exchange that took place." },
        { tag: "Value", title: "Project impact", text: "Show how the partnership improved design, outreach, implementation, or judging strength." }
      ]
    }),

    judging: page({
      kicker: "Medal map • Evidence • Navigation",
      heading: "A <span class='accent-gradient'>judging page</span> that saves judges time",
      lead:
        "Your standings can depend heavily on how fast a judge can understand the project and verify the evidence. This page should be built for that exact purpose.",
      spotlight: {
        label: "Judging role",
        title: "Turn the wiki into a scoring map",
        text:
          "This page should not be vague or celebratory. It should directly route judges to the proof behind each important claim.",
        points: [
          "Map medal criteria to specific pages",
          "List the strongest evidence per category",
          "Highlight integrated human practices and iteration",
          "Make the entire wiki easier to score"
        ],
        links: [
          { text: "Project", href: "project.html" },
          { text: "Engineering", href: "engineering.html" },
          { text: "Human Practices", href: "human-practices.html" }
        ]
      },
      cards: [
        { tag: "Bronze / Silver / Gold", title: "Medal mapping", text: "Create a direct list of where each medal criterion is satisfied in the wiki." },
        { tag: "Proof", title: "Evidence links", text: "Point judges straight to the pages that verify the strongest claims." },
        { tag: "Integration", title: "Why the project is mature", text: "Show how wet lab, dry lab, PCS, and engagement strengthened one another." }
      ],
      feature: {
        label: "Most important page",
        title: "Judges should never have to hunt for proof",
        text:
          "This page exists to reduce friction. The easier it is to score your work, the stronger your standings can be.",
        bullets: [
          "Add one short claim for each category",
          "Link each claim to the exact supporting page",
          "Use simple language before technical detail",
          "Make the whole wiki feel organized and intentional"
        ],
        noteLabel: "High leverage",
        noteTitle: "Best page to improve late",
        noteText:
          "Even near the end, a strong judging page can improve how the rest of the wiki is experienced because it acts like a roadmap."
      },
      cta: {
        title: "Make judging frictionless",
        text: "A judge should be able to understand your project, verify the evidence, and see integration without needing to dig through the entire site.",
        button: { text: "Open Project Overview", href: "project.html", style: "primary" }
      }
    }),

    contact: page({
      kicker: "Reach out • Sponsors • Advisors",
      heading: "Get in <span class='accent-gradient'>contact</span> with Renata",
      lead:
        "Use this page for your public contact path, school or institution, sponsors, and any external-facing links.",
      spotlight: {
        label: "Contact role",
        title: "Keep it direct and professional",
        text:
          "This page should be short, clear, and easy to act on. It does not need too much text.",
        points: [
          "List the best email or contact channel",
          "Add school or institution details",
          "Show sponsor recognition if relevant",
          "Keep the path to contacting the team simple"
        ],
        links: [
          { text: "Team", href: "team.html" },
          { text: "Partnerships", href: "partnerships.html" }
        ]
      },
      cards: [
        { tag: "Team", title: "Primary contact", text: "Add your team email or main contact person here." },
        { tag: "Institution", title: "Affiliation", text: "State the school, lab, or organization associated with the team." },
        { tag: "Support", title: "Sponsors and advisors", text: "Add sponsor acknowledgment or external support information if needed." }
      ],
      cta: {
        title: "Make the contact path obvious",
        text: "Use one clear email or form link so outside visitors know exactly how to reach the team.",
        button: { text: "Email the Team", href: "mailto:yourteamemail@example.com", style: "primary" }
      }
    })
  }
};