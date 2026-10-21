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
    title: "ULP-CA",
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
      key: "project", label: "Our Project", heading: "Our project.", description: "",
      children: [
        { key: "engineering", label: "Engineering", href: "engineering.html#dbtl-cycle", icon: "DNA", description: "Explore our Design–Build–Test–Learn cycle." },
        { key: "project-description", label: "Project Description", href: "project-description.html#abstract", icon: "Stomach", description: "Explore the problem, scientific background, and proposed SulFlux system." }
      ]
    },
    {
      key: "lab-work", label: "Lab Work", icon: "DNA",
      heading: "Lab work.",
      description: "",
      children: [
        {
          key: "wet-lab", label: "Wetlab", href: "wet-lab.html", icon: "DNA",
          description: "Experimental process, wet-lab plans, and protocols.",
          children: [
            { key: "wet-lab-background", label: "Process/Background", href: "wet-lab.html#process-background" },
            { key: "wet-lab-model", label: "Model Wetlab", href: "wet-lab.html#model-wetlab" },
            { key: "wet-lab-protocols", label: "Experimentation/Protocols", href: "wet-lab.html#experimentation-protocols" }
          ]
        },
        { key: "wet-lab-notebook", label: "Notebook", href: "wet-lab-notebook.html", icon: "DNA", description: "Bench notebook, PDF reader, and text entries." },
        { key: "model", label: "Model", href: "model.html", icon: "Stomach", description: "Enzyme engineering, predictions, comparisons, and analysis." }
      ]
    },
    {
      key: "engagement",
      label: "Engagement",
      href: "human-practices.html",
      icon: "Mic",
      heading: "Engagement.",
      description: "",
      children: [
        { key: "human-practices", label: "Human practices", href: "human-practices.html", icon: "Mic", description: "Stakeholder perspectives and project decisions." },
        { key: "education", label: "Education", href: "education.html", icon: "Plant", description: "Learning, outreach, and shared curiosity." },
        { key: "contribution", label: "Contribution", href: "contribution.html", icon: "DNA", description: "iGEM Kickstart and our Registry part." }
      ]
    }
  ],

  pages: {
    home: makePage({
      group: "home",
      kicker: "Synthetic Biology / Rebirth / Impact",
      title: "Home",
      lead: "Explore the people, science, and impact behind our synthetic biology project.",
      ctaTitle: "CONTACTS & IMPORTANT LINKS",
      ctaText: "",
      linkColumns: [
        {
          title: "Our Team",
          links: [
            { text: "Meet Our Team", href: "team.html" },
            { text: "PIs & Mentors", href: "team.html#mentors" },
            { text: "Students", href: "team.html#students" },
            { text: "Contribution", href: "contribution.html" }
          ]
        },
        {
          title: "Our Project",
          links: [
            { text: "Engineering", href: "engineering.html#dbtl-cycle" },
            { text: "Project Description", href: "project-description.html#abstract" }
          ]
        },
        {
          title: "Lab Work",
          links: [
            { text: "Wetlab", href: "wet-lab.html" },
            { text: "Notebook", href: "wet-lab-notebook.html" },
            { text: "Model", href: "model.html" }
          ]
        },
        {
          title: "Engagement",
          links: [
            { text: "Human Practices", href: "human-practices.html" },
            { text: "Education", href: "education.html" },
            { text: "Contribution", href: "contribution.html" }
          ]
        }
      ]
    }),

    "igem-kickstart": makePage({
      group: "engagement",
      kicker: "Engagement / Contribution / iGEM Kickstart",
      title: "iGEM Kickstart: The Guide We Wish We Had",
      lead: "Research fundamentals, shared from our first year with the next generation of iGEM teams.",
      buttons: []
    }),

    contribution: makePage({
      group: "engagement",
      kicker: "Engagement / Contribution",
      title: "Contribution",
      lead: "Resources and lessons from our team, shared with the iGEM community.",
      buttons: []
    }),

    team: makePage({
      group: "team",
      kicker: "People / Roles / Collaboration",
      title: "Meet <span class='accent-gradient'>Our Team</span>",
      lead: "Meet the people behind Renata, see how each person contributed, and learn how to connect with us.",
      cardsTitle: "The people behind Renata",
      cardsLead: "Our team brings together students, mentors, collaborators, and community partners.",
      cards: [
        { tag: "Members", title: "Core team", text: "PLACEHOLDER: Add names and roles." },
        { tag: "Support", title: "Mentors", text: "PLACEHOLDER: Add mentors and faculty." },
        { tag: "Work", title: "Contributions", text: "Show who handled what." },
        { tag: "Connect", title: "Contact & collaborate", text: "Find our team email, institution, sponsors, and collaboration details below." }
      ],
      teamGroups: [
        {
          key: "mentors",
          title: "Mentors",
          description: "Principal investigators, advisors, and community mentors guiding the project.",
          layout: "wide",
          members: [
            { name: "Emma Zschunke", photo: "assets/Team Images/Emma Zschunke.png", role: "Primary PI" },
            { name: "Preya Shrivastava", photo: "assets/Team Images/Preya.png", role: "Secondary PI" },
            { name: "Matt M.", photo: "assets/Team Images/Matt M.png", role: "Advisor" },
            {
              name: "Dr. Tasha Barr", photo: "assets/Team Images/Tasha B.png", role: "Mentor",
              bio: "My name is Dr. Tasha Barr, and I am a mentor for the Renata iGEM team. I graduated from Sheldon High School in Sacramento, California, in 2007, and I went on to earn my B.S. in Biochemistry and Molecular Biology from UC Davis and my Ph.D. in Biomedical Sciences from UC Riverside. As a mentor, my role is to support the team throughout the iGEM experience by providing guidance in molecular biology, experimental design, troubleshooting, and scientific communication. I decided to join Renata because I enjoy mentoring students and helping them gain hands-on experience with biotechnology and research. I’m especially excited to help the team develop their scientific skills while also encouraging them to think creatively and collaboratively.\n\nMy goals for iGEM this year are to help the students take ownership of their project, build confidence in the laboratory, and understand what it means to approach a scientific problem from start to finish. I also want them to have an experience that shows them that they are capable of doing meaningful work in STEM and contributing their own ideas to a scientific project."
            },
            { name: "Sharan S.", photo: "assets/Team Images/Sharan.png", role: "Community Mentor" },
            {
              name: "Samantha Renusch", photo: "assets/Team Images/Samantha.png", role: "Scientific Mentor",
              bio: "My name is Samantha Renusch, and I am the Director of Education for Workforce Development at University Lab Partners. I have a background in molecular biology, immunology, biotechnology, and bioinformatics, and I oversee educational and research programs at the IMPOWER Learning Lab at Soka University. My role with the team is primarily as a scientific mentor and laboratory resource. I help students develop their research plans, learn laboratory techniques, troubleshoot experiments, and think about how their project can move from an idea to something that could have a real-world impact. I decided to join Renata because I really enjoy mentoring students who are willing to take ownership of ambitious scientific projects. What I especially like about iGEM is that it goes far beyond simply doing experiments. Students have to think about the science, engineering, communication, entrepreneurship, community impact, and how their idea could potentially become something much bigger.\n\nMy goal for iGEM this year is to help the students become increasingly independent scientists. I want them to understand not only how to perform an experiment, but why they are doing it, how to interpret the results, how to respond when something does not work, and how to communicate their science effectively. Ultimately, I want them to come out of the experience feeling like they are capable of developing and leading their own research projects."
            }
          ]
        },
        {
          key: "students",
          title: "Students",
          description: "Student leaders and members contributing across the project.",
          layout: "wide",
          members: [
            {
              name: "Humza Shahzad", photo: "assets/Team Images/Humza Shahzad.jpeg", role: "Student", school: "Troy High School", classYear: "2027",
              bio: "Hi, my name is Humza Shahzad, I’m 17 and am an incoming senior at Troy High School. I am one of the co-founders of Renata alongside my comrade and best friend Karthik Sajeev. We created this organization to improve the accessibility to biotechnology research opportunities in our community, and the vision I have for Renata entails earning a Top 10 Ranking at the iGEM Grand Jamboree as a first-year team and establishing a community-tied program that is rooted in collaborative science long after I leave high school."
            },
            {
              name: "Karthik Sajeev", photo: "assets/Team Images/Karthik.jpeg", role: "Student", school: "Troy High School", classYear: "2027",
              bio: "I'm a senior at Troy, and I love to spend my time meeting new people. I'm interested in biomedical engineering and biotechnology, and I lead the Education and Human Practices sub-teams within Renata. I love watching Unstable Universe and hanging out with my friends in my free time! A fun fact about me is that I have a playlist for virtually every mood I'm in!"
            },
            { name: "Kavi Shrivastava", photo: "assets/Team Images/Kavi S.jpg", role: "Student", school: "Northwood High School",
              bio: "I’m Kavi Shrivastava from Northwood High School, and I am a Student Leader and Wetlab Manager. I am motivated to engage with iGEM to produce meaningful and sustainable scientific research."
            },
            {
              name: "Kyle Kao", photo: "assets/Team Images/Kyle Kao.png", role: "Student", school: "Troy High School", classYear: "2027",
              bio: "In my free time, I like to watch Unstable Universe (those who know) and play Valorant (don't ask me to queue with you because I'm absolute garbage). I'm excited to see where we can take our team! A fun fact about me is that I didn't learn to swim until I was 13 🥹"
            },
            { name: "Ritvin Rejith", photo: "assets/Team Images/ritvin.png", role: "Student", school: "Troy High School", classYear: "2027",
              bio: "Hi, I'm Ritvin! I go to Troy High School and am in the graduating class of 2027. I'm a senior at Troy and I manage the Wiki and Software. I play volleyball (varsity) and tennis. I love to rewatch the How To Train Your Dragon series and the movies when I get the time to do so. I also love to go on sunset walks daily and sit by the lake to watch the sunset." },
            {
              name: "Aaron Torres", photo: "assets/Team Images/Aaron Torres.webp", role: "Student", school: "Troy High School", classYear: "2029",
              bio: "My name is Aaron. I am 15 years old and I go to Troy High School. I am in wiki/web development as well as business. I joined Renata because I wanted to learn more about biology. Something else I also wanted to do was gain some experience in business."
            },
            {
              name: "Aidan R.", photo: "assets/Team Images/Aidan Reyes.png", role: "Student", school: "Damien High School",
              bio: "Hey, I’m Aidan, a 17-year-old from Damien High School! With Renata, I help coordinate funding and outreach. I joined the team because I wanted to be part of efforts in synthetic biology and research. Renata offered a place where I could grow in my own skills, collaborate with people who care about science as much as I do, and contribute to a project with real impact. My goal for this year is simply to grow as much as I can in my science communication skills as it relates to our project and research on the whole, and to better understand how projects like those from iGEM function."
            },
            {
              name: "Brandon Trinh", photo: "assets/Team Images/Brandon Trinh.jpeg?v=fa3905d4145a", role: "Student", school: "Chino Hills High School", classYear: "2027",
              bio: "I’m Brandon, I’m 17, and I go to Chino Hills High School. I’m part of Dry Lab. I decided to join Renata because Humza told me to and because I love science. I hope we get top 10 and make it to Paris!"
            },
            { name: "Ella Y.", photo: "assets/Team Images/ella.jpg", role: "Student" },
            {
              name: "Alex Fang", photo: "assets/Team Images/Alex.png", role: "Student", school: "Troy High School", classYear: "2027",
              bio: "I am a man of many loves, from sports and music to the act of lying down. But what I love most is working with other people on research."
            },
            {
              name: "Hannah Bae", photo: "assets/Team Images/Hannah.jpeg", role: "Student", school: "Northwood High School",
              bio: "I’m Hannah Bae, I’m 17, and I go to Northwood High School. I am a wet lab researcher, so my role includes researching scientific literature, creating experimental workflows with specific assays/procedures, and executing advanced labwork with my teammates! I decided to join Renata because I wanted to advance my laboratory skills and apply my existing knowledge of microbiology to a real-world setting. I love how Renata mimics a real-life bioengineering startup company, and I am motivated to contribute my best efforts and uplift both wet and dry lab! Renata for Gold!!!"
            },
            {
              name: "Hanyu Huang", photo: "assets/Team Images/Hanyu Huang.jpg", role: "Student", school: "Troy High School", classYear: "2027",
              bio: "I’m Hanyu Huang, I’m 17, and I go to Troy High School. I work on Business Department fundraising. My goal is to focus purely on the fundraising and marketing aspects of the iGEM project and gain experience in managing a large amount of funds."
            },
            {
              name: "Kylie Tien", photo: "assets/Team Images/Kylie T.jpg", role: "Student", school: "Troy High School", classYear: "2027",
              bio: "I’m Kylie Tien, I’m 16, and I go to Troy High School. I am a Dry Lab & Business Member. I joined Renata in hopes of expanding my experience in biology and dry lab research, and to collaborate with a team that is dedicated to solving real-world problems."
            },
            {
              name: "Margaret Lin", photo: "assets/Team Images/picture - Margaret Lin.png", role: "Student", school: "Troy High School", schoolStage: "Senior",
              bio: "I’m Margaret! I go to Troy and I’m the wiki/webdev head. I help record all of Renata’s progress to share our successes and failures, and I’m with Renata to help with documentation and data analysis. I hope that we’ll all do our best and learn from each other!"
            },
            {
              name: "Matthew She", photo: "assets/Team Images/Matthew She.jpeg", role: "Student", school: "Diamond Bar High School", classYear: "2029",
              bio: "My name is Matthew She, and I am 14 years old. I go to Diamond Bar High School and I am in Renata’s Business team doing fundraising and marketing. I joined Renata to gain experience in the biotech field and see how a competition team operates. I want to help manage the finances of Renata this year and support our team in fundraising and outreach."
            },
            {
              name: "Ryan Jian", photo: "assets/Team Images/Ryan Jian.jpeg", role: "Student", school: "Troy High School", schoolStage: "Junior", classYear: "2028",
              bio: "I like playing piano in my free time and working on AI projects. I am interested in iGEM Human Practices because it gives experience in logistical planning and the human practices side of projects. HP gives skills that can be applied beyond a synthetic biology competition. One fun fact is that I have two dogs."
            },
            {
              name: "Tiger Liu", photo: "assets/Team Images/Liu Tiger - headshot in suit - Tiger Liu.jpg", role: "Student", school: "Troy High School", schoolStage: "Junior", classYear: "2028",
              bio: "Hi, my name is Tiger Liu, I’m 15 years old and I currently attend Troy High School. I am part of the dry-lab department in Renata and specifically I am working on plasmid engineering. I decided to join Renata because I wanted to pursue my passion in biology and get involved with Renata’s fascinating synthetic biology project."
            },
            { name: "Toni D.", photo: "assets/Team Images/Toni Densmore.jpeg", role: "Student" },
            {
              name: "Vanessa Liang", photo: "assets/Team Images/Vanessa Liang.jpeg", role: "Student", school: "Claremont High School", classYear: "2029",
              bio: "Hi, I’m Vanessa and I’m 15. I go to Claremont High School. I’m the secretary of the group. I am responsible for taking attendance during the group meetings and assisting wherever I’m needed. I decided to join Renata to learn more about synthetic biology and be part of a team that works on real-world science problems. I want to gain experience and work with people that I normally wouldn’t meet at school. My goal this year is to learn as much as I can while helping as much as I can."
            },
            {
              name: "Yuqing Zhuo", photo: "assets/Team Images/skylar zhuo.jpg", role: "Student", school: "Troy High School", schoolStage: "Senior",
              bio: "My name is Yuqing Zhuo and I am 17 years old. I am an upcoming senior at Troy High School."
            },
            {
              name: "Deena Singh", photo: "assets/Team Images/Deena Singh.jpeg", role: "Student", school: "Arnold O. Beckman High School", schoolStage: "Junior", classYear: "2028",
              bio: "Hi! My name is Deena Singh, I’m 16 years old, and I’m a student at Beckman High School. This year, I’ll be serving as the Fundraising Manager for Renata’s iGEM team.\n\nI decided to join Renata because I wanted to contribute to a project that combines science with real-world impact. I was especially drawn to the collaborative nature of iGEM and the opportunity to support research that can potentially improve patient outcomes.\n\nAs Fundraising Manager, my goal is to build strong relationships with sponsors, engage with our community, and help the team reach our fundraising goals so we can focus on developing a successful project. I’m also looking forward to learning more about biotechnology, gaining more experience in outreach and fundraising, and helping our team make the biggest impact we can with our project."
            },
            {
              name: "Noah Chu", photo: "assets/Team Images/Noah Chu.jpeg", role: "Student", school: "Troy High School", classYear: "2027",
              bio: "Hi! My name is Noah, and I'm a senior at Troy High School. In my free time, I enjoy cooking, keeping aquariums, making video projects, and practicing photography. I also play tennis and run cross country and track and field. Fun fact: I'm a real Canadian."
            },
            {
              name: "Lakshya Gupta", photo: "assets/Team Images/Lakshya Gupta.jpg", role: "Student", school: "Troy High School", classYear: "2027",
              bio: "I make music and film and am interested in philosophy. I work on visualizing the molecules for the explanation video."
            }
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
      cardsLead: "PLACEHOLDER: Keep the structure simple.",
      cards: [
        { tag: "Background", title: "Context", text: "Write the broader context." },
        { tag: "Gap", title: "Current limitation", text: "Show what is missing now." },
        { tag: "Concept", title: "Renata idea", text: "PLACEHOLDER: Explain the concept clearly." }
      ],
      ctaTitle: "Next page",
      ctaText: "The project description brings together the methodology, engineering decisions, and results.",
    }),

    "wet-lab": makePage({
      group: "wet-lab",
      kicker: "Build / Assays / Validation",
      title: "The <span class='accent-gradient'>wet lab</span> hub",
      lead: "This overview frames the experimental work before the deeper wet-lab pages.",
      cardsTitle: "Wet lab at a glance",
      cardsLead: "See the experimental objective, the main assays, and how the bench work supports the full project.",
      cards: [
        { tag: "Goal", title: "Objective", text: "PLACEHOLDER: State what the wet lab needed to show." },
        { tag: "Work", title: "Assays", text: "PLACEHOLDER: Summarize the main experiments." },
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
      cardsLead: "PLACEHOLDER: Keep the question, control, output, and experiment timeline clear.",
      cards: [
        { tag: "Question", title: "Assay goal", text: "PLACEHOLDER: State what each experiment tested." },
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
        { tag: "Goal", title: "Purpose", text: "PLACEHOLDER: State what the dry lab was meant to answer." },
        { tag: "Tools", title: "What was built", text: "PLACEHOLDER: Summarize the model or computational workflow." },
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
        { tag: "Input", title: "What you learned", text: "PLACEHOLDER: Summarize the main insights." },
        { tag: "Effect", title: "What changed", text: "Show how engagement affected the project." }
      ],
      ctaTitle: "Use engagement to strengthen the project",
      ctaText: "This page should show that the project exists in a real-world context.",
    }),

    "human-practices": makePage({
      group: "engagement",
      kicker: "Stakeholders / Decisions / Integration",
      title: "<span class='accent-gradient'>Human Practices</span>",
      lead: "Explore the stakeholder interviews, community outreach, and professional feedback that shaped RENATA’s project decisions.",
      buttons: [],
      cards: [],
    }),

    education: makePage({
      group: "engagement",
      kicker: "Education",
      title: "Project <span class='accent-gradient'>education</span>",
      lead: "Explore our learning activities, interviews, community outreach, and professional exchanges.",
      buttons: [],
      cards: [],
    }),

    partnerships: makePage({
      group: "engagement",
      kicker: "Collaboration / Shared work / Impact",
      title: "<span class='accent-gradient'>Partnerships</span>",
      lead: "Use this page for partner teams and external collaboration.",
      cardsTitle: "Partnership blocks",
      cardsLead: "PLACEHOLDER: Keep the value of the collaboration visible.",
      cards: [
        { tag: "Who", title: "Partner", text: "PLACEHOLDER: Add the collaborator and context." },
        { tag: "Work", title: "Shared contribution", text: "PLACEHOLDER: Describe what was done together." },
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
      cardsLead: "PLACEHOLDER: Keep this page short and usable.",
      cards: [
        { tag: "Email", title: "Primary contact", text: "PLACEHOLDER: Add the best team email here." },
        { tag: "School", title: "Institution", text: "PLACEHOLDER: Add school or organization details." },
        { tag: "Support", title: "Sponsors", text: "PLACEHOLDER: Add sponsor or advisor acknowledgments." }
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
    summary: "PLACEHOLDER: Document the hierarchical Golden Gate/JUMP build, screening, and sequence verification record.",
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

window.SITE_DATA.educationOverview = {
  "title": "Overview",
  "paragraphs": [
    "We started RENATA from the dream of two high schoolers wanting to bring synthetic biology and bioengineering to Orange County, and throughout our journey, we realized just how difficult it can be for students to enter the field. Throughout our process of creating this team, we spent countless hours pouring over research papers and learned fundamentals of engineering, experiencing firsthand how much background knowledge we needed to have before even starting to develop our project.",
    "We wanted to change that for other students. After all, we believed that other students deserved the same opportunities within science, regardless of how much experience they had with science. RENATA started as two high schoolers who shared an interest in biology and wanted to turn that curiosity into something tangible and applicable for the people around them.",
    "With this in mind, we developed a few educational initiatives aimed at different age groups and levels of scientific understanding. Through our ULP education event, we introduced over 30 children to DNA and genetics using LEGO Blocks and beads. At Troy High School, we organized hands-on biotechnology experiments to demonstrate how microorganisms and enzymes work, connecting these concepts to our own research. Finally, we collaborated with other iGEM teams to develop an online educational resource for students interested in beginning their own journeys in synthetic biology.",
    "Through these initiatives, we hoped to give students something we wished we had when starting RENATA: An introduction to synthetic biology that made the subject easier to understand and gave them somewhere to begin on their own journey."
  ],
  "source": "1. RENATA. “Overview and Education Initiatives.” User-supplied write-up, n.d."
};

window.SITE_DATA.contributionRoutes = [
  {
    id: "kickstart",
    number: "01",
    title: "iGEM Kickstart: The Guide We Wish We Had",
    summary: "Humza Shahzad’s beginner research guide brings together the fundamentals of gene design, plasmids, DNA assembly, and experimental reasoning, shared through our collaboration with NBJF and DBHS-CA.",
    href: "igem-kickstart.html",
    status: "Research fundamentals / Shared resource"
  },
  {
    id: "registry-part",
    number: "02",
    title: "Registry Part: BBa_26TR5LM8",
    summary: "Explore the linked part entry in the iGEM Registry of Standard Biological Parts.",
    href: "https://registry.igem.org/parts/bba-26tr5lm8",
    status: "Biological parts / iGEM Registry",
    action: "View Registry entry",
    external: true
  }
];

window.SITE_DATA.educationEventRoutes = [
  {
    "number": "01",
    "title": "ULP Education Event: Introducing Children to Genetics",
    "summary": "RENATA worked with ULP to introduce over 30 children ages nine and above to DNA, genetics, and synthetic biology through LEGO and bead activities.",
    "href": "education-ulp.html",
    "status": "Hands-on genetics education"
  },
  {
    "number": "02",
    "title": "Butterfly Project: Exploring DNA",
    "summary": "An interactive workshop for grades 3–6, bringing DNA to life through strawberry DNA extraction and a genetics activity.",
    "href": "education-butterfly.html",
    "status": "Elementary-school workshop"
  },
  {
    "number": "03",
    "title": "Troy Biotechnology Education Day",
    "summary": "Microscopy, yeast fermentation, and enzyme activity stations at Troy High School.",
    "href": "education-troy.html",
    "status": "High-school biotechnology"
  },
  {
    "number": "04",
    "title": "Biotechnology Youth Literacy Directive (BYLD)",
    "summary": "A student-led club introducing biotechnology, synthetic biology, and DNA analysis through lectures and a pathway into iGEM research.",
    "href": "education-byld.html",
    "status": "Student-led biotechnology education"
  },
  {
    "number": "05",
    "title": "iGEM Kickstart: The Guide We Wish We Had",
    "summary": "A research fundamentals guide shared through our open-source education collaboration with NBJF and DBHS-CA.",
    "href": "education-kickstart.html",
    "status": "Collaborative learning resource"
  }
];

const makeEducationEvent = (number) => makePage({
  group: "engagement",
  kicker: `Education Event ${number} / Event Record`,
  title: `Education <span class='accent-gradient'>event ${number}</span>`,
  lead: "PLACEHOLDER: Replace this placeholder with the event's verified name, date, location, audience, and learning objective.",
  buttons: [{ text: "Back to education", href: "education.html", style: "secondary" }],
  cardsTitle: "Event record",
  cardsLead: "PLACEHOLDER: Document what the team planned, delivered, observed, and learned from this specific event.",
  cards: [
    { tag: "Context", title: "Audience and objective", text: "PLACEHOLDER: Identify the participants, their prior knowledge, and the learning objective chosen for them." },
    { tag: "Activity", title: "What happened", text: "PLACEHOLDER: Describe the format, materials, facilitation, and event chronology." },
    { tag: "Evidence", title: "What was observed", text: "PLACEHOLDER: Add attendance, feedback, participant work, survey responses, or other direct evidence." },
    { tag: "Effect", title: "What changed", text: "PLACEHOLDER: Explain the team's interpretation and how this event shaped later education or project decisions." }
  ],
  details: [
    {
      eyebrow: "Event chronology",
      title: "Plan, delivery, and follow-up",
      text: "PLACEHOLDER: Keep the sequence and evidence for this event together so readers can trace what the team did and why.",
      steps: [
        { label: "Before", text: "PLACEHOLDER: Record the audience need, learning objective, preparation, and planned method of evaluation." },
        { label: "During", text: "PLACEHOLDER: Document the activity sequence, participation, questions, adaptations, and materials used." },
        { label: "After", text: "PLACEHOLDER: Report the direct evidence, limitations, interpretation, and next decision." }
      ],
      note: "PLACEHOLDER: This page is a structural placeholder. Replace prompts with verified event records and avoid claiming outcomes that the collected evidence cannot support."
    }
  ]
});

window.SITE_DATA.pages["education-event-01"] = makePage({
  "group": "engagement",
  "kicker": "Human Practices 01 / May",
  "title": "SABPA OC/LA Biochem Forum at UCI",
  "lead": "Ritvin and Karthik presented RENATA’s early project ideas and explored the commercial and clinical considerations for developing SultFlux.",
  "buttons": [
    {
      "text": "Back to Human Practices",
      "href": "human-practices.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "Forum at a glance",
  "cardsLead": "RENATA’s participation in the 18th Annual SABPA OC/LA Biomedical Forum.",
  "cards": [
    {
      "tag": "When",
      "title": "May",
      "text": "18th Annual SABPA OC/LA Biomedical Forum."
    },
    {
      "tag": "Where",
      "title": "Beckman Center",
      "text": "Irvine, California."
    },
    {
      "tag": "Team",
      "title": "Ritvin and Karthik",
      "text": "Sharing RENATA’s preliminary progress and early project ideas."
    },
    {
      "tag": "Focus",
      "title": "Commercial and clinical potential",
      "text": "Exploring the evidence, scalability, cost, safety, and delivery considerations for SultFlux."
    }
  ],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "forum-participation",
      "eyebrow": "01 / Participation",
      "title": "Introducing RENATA at the forum",
      "text": "In May, RENATA attended the 18th Annual SABPA OC/LA Biomedical Forum at the Beckman Center in Irvine, where Ritvin and Karthik had the opportunity to introduce our early project ideas to professionals in biotechnology, healthcare, entrepreneurship, and venture capital. Notable participants included Dr. Edward Kim of City of Hope Orange County, Dan Ross of BioPharma Capital, Han Li of Riviera Holdings VC, and Benjamin Albaum, co-founder and CEO of VIZQ Technologies. We used this opportunity to present RENATA’s preliminary progress, pitch SultFlux, and seek perspectives on its potential development in the industry itself."
    },
    {
      "id": "commercial-viability",
      "eyebrow": "02 / Commercial viability",
      "title": "From experimental concept to a feasible product",
      "text": "We wanted to understand what would be required to translate SultFlux, our proposed bacterial system for sulfating lithocholic acid (LCA), from an experimental concept into a potentially useful healthcare technology. We focused on two dimensions of our project’s potential impact: commercial viability and clinical applications. From an investment perspective, we wanted to understand what would make SultFlux a feasible biomedical product rather than simply a successful laboratory experiment. This meant considering whether our engineered bacterial system could consistently sulfate sufficient quantities of lithocholic acid (LCA), whether its production and delivery could be scaled economically, and what experimental evidence would be needed to justify further investment. These questions encouraged us to think about development costs, manufacturing, and the practical limitations of bringing a synthetic biology-based product to market."
    },
    {
      "id": "clinical-applications",
      "eyebrow": "03 / Clinical applications",
      "title": "Distinguishing enzyme activity from patient benefit",
      "text": "From a clinical perspective, we examined the distinction between demonstrating LCA sulfation and establishing a meaningful therapeutic benefit. Although our proposed system aims to modify LCA in the gastrointestinal tract, successful enzyme activity alone would not demonstrate that the treatment improves patient outcomes. We therefore considered the challenges of safely delivering engineered bacteria to the intestine, controlling their activity, evaluating possible effects on the broader gut environment, and determining whether the resulting changes in bile acid composition could benefit patients experiencing post-cholecystectomy symptoms."
    },
    {
      "id": "development-reflection",
      "eyebrow": "04 / Reflection",
      "title": "What this means for future development",
      "text": "The forum helped us recognize that SultFlux would need to satisfy different standards at each stage of development. Our immediate research could establish whether the engineered system functions as intended, but clinical translation would require additional evidence of safety and therapeutic benefit, while commercialization would depend on scalability, cost, and a viable delivery strategy. We incorporated these considerations into our broader evaluation of RENATA's future applications, distinguishing what our experiments could demonstrate from what would still be required to develop an accessible biomedical treatment.",
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ],
  "parentPage": "human-practices"
});
window.SITE_DATA.pages["education-event-02"] = makePage({
  "group": "engagement",
  "kicker": "Human Practices 02 / Clinical Interview",
  "title": "Interview with Gastroenterologist and Team",
  "lead": "Dr. Singh discussed PCS diagnosis, existing treatment limitations, and the practical questions shaping RENATA’s proposed approach.",
  "buttons": [
    {
      "text": "Back to Human Practices",
      "href": "human-practices.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "Interview at a glance",
  "cardsLead": "A professional perspective on PCS and feedback on RENATA’s project direction.",
  "cards": [
    {
      "tag": "Interview",
      "title": "Dr. Singh",
      "text": "Discussing gastrointestinal complications following gallbladder removal."
    },
    {
      "tag": "Diagnosis",
      "title": "Overlapping symptoms",
      "text": "Considering possible causes of diarrhea and bloating before attributing them to bile acid metabolism."
    },
    {
      "tag": "Treatment",
      "title": "Everyday limitations",
      "text": "Discussing cholestyramine, medication interactions, and the challenges of daily use."
    },
    {
      "tag": "Reflection",
      "title": "Project practicality",
      "text": "Considering patient needs, existing medications, and the broader gut microbiome."
    }
  ],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "pcs-diagnosis",
      "eyebrow": "01 / Diagnosis",
      "title": "Understanding the challenges of diagnosing PCS",
      "text": "To better understand Post-Cholecystectomy Syndrome (PCS) from a professional’s perspective and for feedback on our project’s direction, we interviewed Dr. Singh about challenges he’s faced around diagnosing and treating patients with gastrointestinal complications following a gallbladder removal. One of the first things we discussed was how difficult PCS can be to diagnose, due to the fact that symptoms such as diarrhea and bloating often overlap with other gastrointestinal conditions such as IBS (Irritable Bowel Syndrome). During our interview, he told RENATA that physicians have to consider many possible causes before determining whether a patient’s symptoms are related to bile acid metabolism."
    },
    {
      "id": "existing-treatments",
      "eyebrow": "02 / Existing treatments",
      "title": "Discussing treatment limitations and daily use",
      "text": "Following this, we started to discuss different existing treatments within the medical sphere, such as cholestyramine, which patients can take to bind bile acids in the digestive tract. While these medications can help patients manage their current symptoms, Dr. Singh explained to us the limitations and concerns that patients and physicians have alike when dealing with this treatment. Cholestyramine has an unpleasant taste and can interfere with the absorption of other medications, as well as how difficult it may be in order to take cholestyramine on a day-to-day basis. To RENATA, this meant a lot, as our proposed treatment aims to use the BtSULT enzyme in order to modify secondary bile acids instead of simply binding to them."
    },
    {
      "id": "project-practicality",
      "eyebrow": "03 / Project practicality",
      "title": "Considering patient needs and the gut microbiome",
      "text": "Moving on, when we introduced our project, Dr. Singh challenged us to consider whether our approach was practical on a realistic scale. He mentioned to us that although digestive symptoms may be present after a gallbladder removal on a much wider patient scale, long-term complications have a smaller patient base, and many can be treated using existing medications. He also encouraged our team to investigate the relationship between the gut microbiome and other gastrointestinal symptoms, and suggested that focusing only on bile acids may overlook other factors that contribute to the discomfort of patients."
    },
    {
      "id": "interview-reflection",
      "eyebrow": "04 / Reflection",
      "title": "Reconsidering the potential benefit of our approach",
      "text": "This interview helped us think more critically about our project at hand, and made us rethink how patients could benefit the most from our proposed treatment and whether our approach could offer a meaningful edge over existing medications.",
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ],
  "parentPage": "human-practices"
});
window.SITE_DATA.pages["education-event-03"] = makePage({
  "group": "engagement",
  "kicker": "Human Practices 03 / Patient Interviews",
  "title": "Interview with Two Patients to Understand Personal Experiences",
  "lead": "Two patient interviews explored daily life after gallbladder removal and highlighted ease of use, clinical testing, and transparency about potential risks.",
  "buttons": [
    {
      "text": "Back to Human Practices",
      "href": "human-practices.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "Patient perspectives at a glance",
  "cardsLead": "Two individual experiences informed the questions RENATA asks about its proposed treatment.",
  "cards": [
    {
      "tag": "Approach",
      "title": "Two individual interviews",
      "text": "Listening to how gallbladder removal and continuing digestive symptoms affect everyday life."
    },
    {
      "tag": "Patient 1",
      "title": "Long-term daily adjustments",
      "text": "Chronic diarrhea, dietary restrictions, and the impact on meals and special occasions."
    },
    {
      "tag": "Patient 2",
      "title": "Relief with remaining challenges",
      "text": "Improvement after surgery alongside continuing difficulty with oily and fatty foods."
    },
    {
      "tag": "Learning",
      "title": "Usability and transparency",
      "text": "Simple administration, clinical testing, and clear information about potential side effects and risks."
    }
  ],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "patient-interview-context",
      "eyebrow": "01 / Listening to patients",
      "title": "Understanding everyday experiences",
      "text": "In addition to Dr. Singh and his personal feedback on what PCS entails and how he has seen it within the medical environment, we wanted to hear from patients who have experienced or are currently experiencing PCS and how that affects their everyday lives. To do this, we conducted two individual patient interviews, each revealing different challenges that surround gallbladder removal and the possible long-term effects of doing so."
    },
    {
      "id": "first-patient-experience",
      "eyebrow": "02 / Patient 1",
      "title": "Living with long-term dietary restrictions",
      "text": "Our first patient had a cholecystectomy in 2009 after having gastrointestinal problems, which included pancreatitis and gallbladder dysfunction. After surgery, her digestive symptoms continued, which left her with chronic diarrhea and dietary restrictions that she has dealt with for over 16 years. She described having to avoid fried food and other dietary triggers, relying on fiber supplements, digestive enzymes, exercise, and strict diet adjustments in order to make her symptoms more manageable. One personal account she had was not being able to have holiday meals or eat on special occasions, as that could disrupt her routine and worsen her symptoms. She explained to us that current medications, including Prilosec, had done little to help her. Prilosec (omeprazole) is a proton pump inhibitor that reduces the amount of acid produced in the stomach.[2]",
      "source": {
        "label": "2. “Omeprazole.” MedlinePlus, U.S. National Library of Medicine. Accessed 21 Oct. 2026.",
        "href": "https://medlineplus.gov/druginfo/meds/a693050.html"
      }
    },
    {
      "id": "second-patient-experience",
      "eyebrow": "03 / Patient 2",
      "title": "Improvement after surgery and remaining food sensitivities",
      "text": "Our second patient was an elderly Chinese man who shared a different experience than our first. Before undergoing his gallbladder removal surgery, he mentioned that he struggled with gas, severe bloating, digestive discomfort, and the constant feeling that food was sitting in his chest without being digested. Due to this, his appetite and energy were heavily affected. We learned that his gallbladder removal cleared up most of his discomfort, but he still struggles with oily and fatty foods, particularly those in Chinese cuisine."
    },
    {
      "id": "patient-interview-learning",
      "eyebrow": "04 / Learning moment",
      "title": "Ease of use, clinical testing, and transparency",
      "text": "When we discussed our possible treatment through RENATA, he emphasized to us that <strong>an ideal medication should be simple to use, especially for older patients</strong>. He also expressed concerns about long-term side effects from using a medication of this sort. Our first patient also put an emphasis on the importance of clinical testing and transparency regarding potential side effects or risks of using medication that is biotechnology-based.",
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ],
  "parentPage": "human-practices"
});

window.SITE_DATA.pages["education-event-04"] = makePage({
  "group": "engagement",
  "kicker": "Human Practices 04 / Online Patient Outreach",
  "title": "Facebook Patient Responses",
  "lead": "International Facebook outreach revealed varied experiences after gallbladder removal and helped prioritize convenience and tolerability in RENATA’s design.",
  "buttons": [
    {
      "text": "Back to Human Practices",
      "href": "human-practices.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "Outreach at a glance",
  "cardsLead": "Listening beyond our existing networks to understand everyday concerns after gallbladder removal.",
  "cards": [
    {
      "tag": "Approach",
      "title": "Facebook communities",
      "text": "Reaching people and groups beyond the team’s personal connections and Orange County."
    },
    {
      "tag": "Reach",
      "title": "International outreach",
      "text": "Contacting communities in the United Kingdom, Australia, Canada, and across the United States."
    },
    {
      "tag": "Responses",
      "title": "Different lived experiences",
      "text": "Accounts ranged from smooth recoveries to long-term digestive symptoms and difficulty accessing medication."
    },
    {
      "tag": "Design priorities",
      "title": "Convenience and tolerability",
      "text": "Considering how a proposed prebiotic–probiotic approach could fit patients’ daily lives."
    }
  ],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "outreach-motivation",
      "eyebrow": "01 / Motivation",
      "title": "Hearing from people beyond our networks",
      "text": "While our two patient interviews provided valuable insights into patients and how they have been affected by gallbladder removals, we realized that we could broaden the range of patient perspectives we heard. We wanted to get insights into PCS from people beyond our personal connections, email contacts, and Orange County."
    },
    {
      "id": "international-outreach",
      "eyebrow": "02 / Outreach",
      "title": "Connecting through Facebook communities",
      "text": "Thinking about this, we turned to technology. With Facebook communities, we could reach people beyond our networks, in other countries and continents. We reached out to people and groups in the United Kingdom, Australia, Canada, and all across the United States in order to hear about symptoms or issues post-gallbladder removal."
    },
    {
      "id": "patient-response-themes",
      "eyebrow": "03 / Responses",
      "title": "Varied recoveries and everyday challenges",
      "text": "One unique aspect of our research was the fact that responses varied very significantly. We found patients who had pretty seamless surgeries, whereas others had major digestive problems for years or decades after surgery. We heard from a patient who experienced malabsorption issues for almost 12 years, and another patient mentioned how unpredictable digestive symptoms led to them having to organize their days around bathroom visits. One person also mentioned how difficult it is to get cholestyramine, and other responders in the same thread agreed."
    },
    {
      "id": "outreach-reflection",
      "eyebrow": "04 / Reflection",
      "title": "Broadening the concerns we considered",
      "text": "Overall, our experience with Facebook showed us how technology could contribute to our research. By reaching people outside of our community, state, country, and continent, we were able to learn about concerns that we might not have identified through our interviews or through literature that we read."
    },
    {
      "id": "convenience-learning",
      "eyebrow": "05 / Learning moment",
      "title": "Making convenience a design priority",
      "text": "These responses made us reconsider how patients would take our proposed treatment. After receiving these Facebook responses and going through our research after interviewing patients and professionals within the field, we realized that developing an effective enzyme was only one part of the whole. For patients, one of the most important parts of medicine was <strong>how convenient it would be to take medications without introducing additional complications into their already-difficult lifestyles</strong>."
    },
    {
      "id": "prebiotic-probiotic-design",
      "eyebrow": "06 / Design direction",
      "title": "Exploring a prebiotic–probiotic approach",
      "text": "With this in mind, we moved towards developing a prebiotic–probiotic approach, with the goal of minimizing unwanted side effects associated with existing medications. This shift led us to consider how our engineered probiotic could work alongside existing prebiotic components and broadened our focus beyond the BtSULT enzyme itself. The patient and professional feedback we received helped us establish <strong>convenience and tolerability as major factors in our design</strong>.",
      "note": "Evidence boundary: These self-selected Facebook responses describe personal experiences. They cannot establish symptom prevalence or demonstrate the safety, effectiveness, or improved tolerability of RENATA’s proposed approach. Reduced side effects remain a design goal requiring experimental and clinical evaluation. Source 1: RENATA. “Facebook Patient Responses.” Team-provided outreach account, supplied 21 Oct. 2026.",
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ],
  "parentPage": "human-practices"
});

window.SITE_DATA.pages["education-event-05"] = makePage({
  "group": "engagement",
  "kicker": "Human Practices 05 / Community Service",
  "title": "Seva Collective Event",
  "lead": "RENATA helped package and distribute food while sharing its PCS research with volunteers and families from communities across Orange County.",
  "buttons": [
    {
      "text": "Back to Human Practices",
      "href": "human-practices.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "Community service at a glance",
  "cardsLead": "Putting selfless service into practice while learning to communicate our research beyond the biotechnology community.",
  "cards": [
    {
      "tag": "Organizer",
      "title": "SEVA Collective",
      "text": "A community service event supporting individuals and families in need."
    },
    {
      "tag": "Contribution",
      "title": "Food packaging and distribution",
      "text": "Working alongside fellow volunteers to help meet immediate community needs."
    },
    {
      "tag": "Community",
      "title": "Across Orange County",
      "text": "Volunteers came from Santa Ana, Irvine, Tustin, Costa Mesa, and other communities around us."
    },
    {
      "tag": "Learning",
      "title": "Accessible science communication",
      "text": "Discussing RENATA’s PCS research with people outside the biotechnology field."
    }
  ],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "seva-community-service",
      "eyebrow": "01 / Community service",
      "title": "Packaging and distributing food together",
      "text": "As a team, we participated in a community service event organized by SEVA Collective, where we helped package and distribute food to individuals and families in need. The event brought together volunteers from across Orange County, including Santa Ana, Irvine, Tustin, and Costa Mesa, which gave us the opportunity to work alongside people from other communities around us."
    },
    {
      "id": "seva-science-conversations",
      "eyebrow": "02 / Community conversations",
      "title": "Making our research easier to understand",
      "text": "Throughout the event, our members spoke to fellow volunteers and families about RENATA and explained our research into post-cholecystectomy syndrome (PCS) and how our proposed treatment could potentially help patients. This event was different from the scientific conferences we attended, as it allowed us to discuss our research with people outside of the biotechnology field. These conversations helped us practice our presentation skills and make our project easier for people to understand."
    },
    {
      "id": "seva-service-reflection",
      "eyebrow": "03 / Reflection",
      "title": "Putting selfless service into practice",
      "text": "Beyond sharing our research, we wanted to put the meaning of <strong>“seva,” or selfless service, into practice</strong> by contributing to the community around us. This gave us an opportunity to help serve people facing immediate needs and reminded us of the communities we hope our research can ultimately benefit.",
      "note": "Source 1: RENATA. “Seva Collective Event.” Team-provided event account, supplied 21 Oct. 2026.",
      "images": [
        {
          "page": 8,
          "src": "assets/engagement/page-08-1.jpg",
          "width": 1800,
          "height": 1350,
          "alt": "RENATA members volunteering at the SEVA Collective event.",
          "caption": "RENATA members volunteering at the SEVA Collective event."
        }
      ],
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ],
  "parentPage": "human-practices"
});

window.SITE_DATA.pages["education-event-06"] = makePage({
  "group": "engagement",
  "kicker": "Human Practices 06 / July",
  "title": "27th Annual San Diego MedChem Symposium at UCSD",
  "lead": "RENATA shared its progress in July and discussed enzyme engineering, simulation-based evaluation, and patient-informed design with industry professionals.",
  "buttons": [
    {
      "text": "Back to Human Practices",
      "href": "human-practices.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "Symposium at a glance",
  "cardsLead": "Sharing the project’s development since the May SABPA forum and gathering feedback on the next iteration.",
  "cards": [
    {
      "tag": "When",
      "title": "July",
      "text": "27th Annual San Diego MedChem Symposium."
    },
    {
      "tag": "Where",
      "title": "UC San Diego",
      "text": "Conversations with researchers and pharmaceutical professionals."
    },
    {
      "tag": "Progress",
      "title": "Patient-informed design",
      "text": "A PCS-focused BtSULT approach and proposed prebiotic–probiotic delivery strategy."
    },
    {
      "tag": "Feedback",
      "title": "Enzyme engineering",
      "text": "Discussion of enzymatic activity, substrate specificity, and simulation-based evaluation."
    }
  ],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "medchem-participation",
      "eyebrow": "01 / Participation",
      "title": "Sharing progress at UC San Diego",
      "text": "Following our patient and professional interviews, RENATA travelled to UC San Diego in July to attend the 27th Annual San Diego MedChem Symposium. The event brought together researchers and pharmaceutical professionals from organizations such as Scripps Research, Schrödinger, Novartis, Johnson &amp; Johnson, and Pfizer. At our visit to SABPA in May, we were still introducing our initial project ideas, but at this symposium we had the opportunity to showcase how far RENATA had progressed throughout the season through multiple project iterations."
    },
    {
      "id": "medchem-project-progress",
      "eyebrow": "02 / Project progress",
      "title": "Explaining how patient feedback shaped the project",
      "text": "By this point we had narrowed our focus to post-cholecystectomy syndrome (PCS) and developed our proposed approach of using a custom-engineered BtSULT enzyme to modify secondary bile acids. Our Human Practices research had also influenced considerations about how patients would need to receive treatment, which led us towards a prebiotic–probiotic delivery approach with the goals of minimizing side effects and improving ease of use. At UCSD, we shared this progress with industry professionals and explained how feedback from patients and responses from people suffering from similar issues had shaped the direction of our research."
    },
    {
      "id": "medchem-engineering-feedback",
      "eyebrow": "03 / Industry feedback",
      "title": "Discussing enzyme design and evaluation",
      "text": "We also discussed enzyme engineering and our approach with scientists experienced in small-molecule design and drug development. We received feedback on factors to consider when creating a custom enzyme, including enzymatic activity, substrate specificity, and how we interpreted scores from the simulation software used in our project. These conversations helped us identify areas for further development and investigation as we continued to refine our project. Overall, the symposium allowed RENATA to share its progress, receive industry feedback, and reconsider how we were engineering our enzymes.",
      "note": "The account reports professional feedback on enzyme engineering. It supplies no named simulation metrics, score values, thresholds, or final candidate-selection evidence; this feedback alone does not establish improved enzyme activity.",
      "images": [
        {
          "page": 10,
          "src": "assets/engagement/page-10-1.jpg",
          "width": 1800,
          "height": 1350,
          "alt": "RENATA members in conversation at the San Diego MedChem Symposium.",
          "caption": "RENATA members in conversation at the San Diego MedChem Symposium."
        },
        {
          "page": 10,
          "src": "assets/engagement/page-10-2.jpg",
          "width": 1800,
          "height": 1350,
          "alt": "RENATA members and symposium participants at UC San Diego.",
          "caption": "RENATA members and symposium participants at UC San Diego."
        },
        {
          "page": 10,
          "src": "assets/engagement/page-10-3.jpg",
          "width": 1800,
          "height": 1350,
          "alt": "A group photograph from the San Diego MedChem Symposium.",
          "caption": "A group photograph from the San Diego MedChem Symposium."
        }
      ],
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ],
  "parentPage": "human-practices"
});

window.SITE_DATA.pages["education-ulp"] = makePage({
  "group": "engagement",
  "kicker": "Education Event / ULP",
  "title": "ULP Education Event: Introducing Children to Genetics",
  "lead": "RENATA worked with ULP to introduce over 30 children ages nine and above to DNA, genetics, and synthetic biology through LEGO and bead activities.",
  "buttons": [
    {
      "text": "Back to education",
      "href": "education.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "Bringing DNA into the classroom",
  "cardsLead": "Hands-on models introduce DNA sequences and observable traits through familiar materials.",
  "cards": [
    {
      "tag": "Participants",
      "title": "Over 30 children",
      "text": "Ages nine and above, with limited experience in molecular biology."
    },
    {
      "tag": "Collaboration",
      "title": "RENATA and ULP",
      "text": "Our first education initiative introducing DNA, genetics, and synthetic biology."
    },
    {
      "tag": "Activity 1",
      "title": "LEGO DNA sequences",
      "text": "Using colored bricks to explore bases, sequence order, and genetic information."
    },
    {
      "tag": "Activity 2",
      "title": "Beads and traits",
      "text": "Representing selected observable characteristics and discussing variation."
    }
  ],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "ulp-classroom",
      "eyebrow": "01 / Introduction",
      "title": "Bringing DNA into the Classroom",
      "text": "For our first education initiative, RENATA worked with ULP to introduce over 30 children ages nine and above to the fundamentals of DNA, genetics, and synthetic biology overall.",
      "paragraphs": [
        "To us, teaching synthetic biology presented us with quite an interesting question. How do you explain a molecule that can’t be seen with the naked eye to a student who might never have studied cells before?",
        "We began to tackle this problem by introducing DNA as a set of instructions that organisms use in order to develop and function. Furthering this, we introduced the relationship between DNA and observable characteristics. Traits such as hair texture and certain inherited physical features such as height helped provide some familiar examples for how genetic information can influence and come to create an organism as a whole. Through this, our students were given something that they already understood before we introduced more unfamiliar concepts",
        "From there, we explained the basic idea behind synthetic biology. Scientists can study genetic information, and through processes within genetic engineering, modify certain sequences to change how an organism functions. This is a similar principle behind many iGEM projects, including RENATA’s work.",
        "However, we wanted students not only to listen and see these ideas, but also experience them tangibly instead of simply relying on verbal explanations. With this in mind, we designed two activities that turned genetic concepts into a tangible model that students could experience in front of them."
      ]
    },
    {
      "id": "ulp-lego-dna",
      "eyebrow": "02 / Activity 1",
      "title": "Activity 1: Building DNA using LEGO Bricks",
      "text": "Our first activity used LEGO blocks to represent the four kinds of nucleotide bases that make up DNA. Each DNA base was represented by a different type of color of block, which allowed students to distinguish between adenine, thymine, cytosine, and guanine. Students could then arrange the blocks into sequences, which created a simplified physical representation of genetic information.",
      "paragraphs": [
        "The purpose of this activity was to explain why the order of DNA bases matters. Two sequences can contain the same bases but result in unique genetic information being stored, as those bases are organized differently. By rearranging their LEGO bricks, students could see that the sequence itself was important even when the building materials were the same.",
        "We connected this idea to the way genetic changes can influence an organism’s traits. In real biological systems, certain sequences of DNA contain instructions for making proteins. Proteins perform many of the functions necessary for life, and changes to the sequences encoding them can sometimes change their structure or activity.",
        "This also gave us a way to introduce genetic engineering without beginning with unfamiliar laboratory techniques. If genetic information is stored in sequences, scientists can modify biological functions by changing those sequences to their liking. Although the LEGO model simplified the actual complexity of DNA, it gave students a starting point for understanding how genetic information can be modified.",
        "All in all, this activity allowed students to experiment with different arrangements themselves, which allowed them to directly work with the model, compare their own sequences, and ask questions about how those changes may affect a living organism on a long term scale."
      ]
    },
    {
      "id": "ulp-bead-traits",
      "eyebrow": "03 / Activity 2",
      "title": "Activity 2: Exploring DNA Traits Through Beads",
      "text": "Our second activity was centered around defining the relationship between genetics and physical characteristics that an organism has. We developed a trait chart that students could use to identify some of their own physical characteristics. Different colored beads corresponded to different responses on the chart, hence allowing students to create a physical representation of their selected traits. This gave a look into how inherited genetic information can relate to observable physical characteristics, which is a little different from the LEGO activity we had done previously.",
      "paragraphs": [
        "Students used their completed bead arrangements to compare traits that they had recorded down from their own personal perspectives. This also helped introduce the concept of variation between individuals and why members of the same species can have different physical characteristics. Additionally, this activity created opportunities to discuss inheritance and the relationship between genes and traits. We introduced these ideas through simplified examples appropriate for the students' ages, since many physical characteristics are influenced by multiple genes and environmental factors.",
        "When designing this activity, one of the main considerations that we put into picture was to make science personal enough for students to understand. DNA is quite an abstract concept when understood as a double helix or sequence of nucleotides. However, when students are able to see their own characteristics, it gives students a familiar example of why genetic information matters."
      ],
      "images": [
        {
          "page": 14,
          "src": "assets/engagement/page-14-1.jpg",
          "width": 1350,
          "height": 1800,
          "alt": "Genetics activity worksheets and colored beads at the ULP workshop.",
          "caption": "Genetics activity worksheets and colored beads at the ULP workshop."
        },
        {
          "page": 16,
          "src": "assets/engagement/page-16-1.jpg",
          "width": 1350,
          "height": 1800,
          "alt": "Children working with genetics activity materials at ULP.",
          "caption": "Children working with genetics activity materials at ULP."
        },
        {
          "page": 16,
          "src": "assets/engagement/page-16-2.jpg",
          "width": 1350,
          "height": 1800,
          "alt": "RENATA facilitating the ULP genetics activities.",
          "caption": "RENATA facilitating the ULP genetics activities."
        }
      ]
    },
    {
      "id": "ulp-synthetic-biology",
      "eyebrow": "04 / Educational purpose",
      "title": "Educational Purpose and Synthetic Biology Connection",
      "text": "After introducing DNA sequences and inherited traits, we connected the two activities to the basic principles of synthetic biology. The LEGO activity showed students how genetic information is organized, while the bead activity gave them examples of how biological characteristics can vary. Together, they provided a base for explaining to younger individuals how scientists study genetic information and attempt to modify biological systems.",
      "paragraphs": [
        "Our ULP event was designed as an introduction to genetics for students who had limited experience with molecular biology. We taught over 30 children through activities that allowed them to build models, examine their own characteristics, and discuss the concepts behind their work. The LEGO and bead activities were selected because they made different parts of genetics easier to visualize. One dealt with the information stored in DNA, while the other dealt with observable characteristics influenced by genetics. These activities also gave us experience explaining scientific concepts without relying on the terminology we normally use when discussing our project."
      ],
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ]
});

window.SITE_DATA.pages["education-troy"] = makePage({
  "group": "engagement",
  "kicker": "Education Event / Troy High School",
  "title": "Troy Biotechnology Education Day",
  "lead": "Microscopy, yeast fermentation, and enzyme activity stations at Troy High School.",
  "buttons": [
    {
      "text": "Back to education",
      "href": "education.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "From classroom to research",
  "cardsLead": "Introducing biotechnology through hands-on experimental stations.",
  "cards": [
    {
      "tag": "Education day",
      "title": "Hands-on biotechnology",
      "text": "Students explored how living organisms function through experiments at Troy High School."
    }
  ],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "troy-classroom",
      "title": "Bringing Biotechnology into the High School Classroom",
      "text": "After our education event at ULP, we wanted to move towards a more complex and experimental side of explaining synthetic biology and our project. Our event at Troy High School gave the opportunity for students to see how living organisms function through hands-on experiments.",
      "paragraphs": [
        "Our event was comprised of three experimental stations, each of them focusing on a different biological process involved in synthetic biology. Karthik prepared most of the experimental setups, and Humza led a presentation that introduced concepts behind the activities that the participants would do. Our idea for the event was that students would move between the presentation and experiments, learning about a particular concept before visiting the corresponding station. After each activity, we returned to the presentation to explain the significance and relevance to biotechnology and RENATA’s project goals.",
        "Part of our presentation was also an introduction to the research that RENATA partook in throughout the season. Our presentation covered the role of bile acids in digestion, the BtSULT enzyme we were engineering to modify secondary bile acids, and our proposed use of probiotic bacteria as a delivery system."
      ],
      "images": [
        {
          "page": 20,
          "src": "assets/engagement/page-20-1.jpg",
          "width": 1800,
          "height": 1350,
          "alt": "Introducing bile acids and RENATA’s project during the Troy presentation.",
          "caption": "Introducing bile acids and RENATA’s project during the Troy presentation."
        },
        {
          "page": 20,
          "src": "assets/engagement/page-20-2.jpg",
          "width": 1800,
          "height": 1350,
          "alt": "Discussing enzyme engineering with students at Troy.",
          "caption": "Discussing enzyme engineering with students at Troy."
        }
      ]
    },
    {
      "id": "troy-microscopy",
      "title": "Activity 1: Observing Bacteria Under a Microscope",
      "text": "Our first station introduced students to microorganisms through yogurt. We prepared samples of plain yogurt and milk for students to examine under microscopes, which allowed them to compare the two and get a look into how bacteria affect and influence fermentation.",
      "paragraphs": [
        "During this activity, we also discussed the importance of using controls within experiments. Comparing the yogurt sample with milk gave students a reference point for interpreting what they observed. We taught the lesson of needing evidence to see an observed difference, which is an important lesson when doing any sort of biological research.",
        "We selected this experiment because bacteria are central to RENATA's proposed treatment. Our project involves engineering probiotic bacteria, and yogurt provided students with a recognizable example of microorganisms that performed useful biological functions. From there, we could explain how synthetic biologists take advantage of these natural capabilities and engineer bacteria to perform additional functions, including those with potential medical applications, as explained in the presentation."
      ]
    },
    {
      "id": "troy-yeast",
      "title": "Activity 2: Yeast Balloon Experiment",
      "text": "Our second activity gave a look into how microorganisms respond to different nutrients. We showed this through a yeast fermentation experiment. After preparing containers with varying types and amounts of sugar, students were able to see how yeast produced carbon dioxide that inflated balloons attached to each container. By comparing balloons, students were able to see how changes in nutrient availability affected fermentation.",
      "paragraphs": [
        "We connected this experiment to RENATA’s proposed probiotic treatment, and explained how engineered bacteria depend on their surrounding environment in order to function effectively. In the same way that the yeast responded to different available nutrients, our engineered bacteria would need to operate under the conditions of the gastrointestinal tract."
      ],
      "images": [
        {
          "page": 23,
          "src": "assets/engagement/page-23-1.jpg",
          "width": 1800,
          "height": 1350,
          "alt": "Students observing the yeast balloon experiment.",
          "caption": "Students observing the yeast balloon experiment."
        }
      ]
    },
    {
      "id": "troy-enzyme",
      "title": "Activity 3: Investigating Enzyme Activity Through Foam",
      "text": "Our final station focused on enzymes, which is the same biological component that most directly relates to RENATA’s research. We tried to show the activity of catalase, and by capturing released oxygen in soap bubbles, we created a visible reaction that students could observe and compare across multiple experimental conditions.",
      "paragraphs": [
        "We used varying amounts of hydrogen peroxide to demonstrate how the concentration of a substrate can influence enzyme activity. Students observed the foam produced by the reactions, and we discussed why increasing the amount of substrate can initially increase reaction activity but eventually reaches a point where another factor becomes limiting. We also included a control to demonstrate the importance of having the correct substrate available for an enzyme to perform its function.",
        "The catalase experiment gave students a way to understand these ideas through an observable reaction. They could see how changing experimental conditions affected the output of an enzyme, providing context for why RENATA needed to evaluate its own enzyme designs carefully. The foam experiment used a different enzyme and reaction from our project, but the underlying questions about enzyme activity were closely related to the work we were conducting."
      ],
      "images": [
        {
          "page": 23,
          "src": "assets/engagement/page-23-2.jpg",
          "width": 1350,
          "height": 1800,
          "alt": "Students working together at an experimental station.",
          "caption": "Students working together at an experimental station."
        },
        {
          "page": 23,
          "src": "assets/engagement/page-23-3.jpg",
          "width": 1800,
          "height": 1350,
          "alt": "Foam reactions from the enzyme activity demonstration.",
          "caption": "Foam reactions from the enzyme activity demonstration."
        }
      ]
    },
    {
      "id": "troy-takeaway",
      "title": "Takeaway and Connection",
      "text": "Through our three experimental stations, we wanted students to understand how different biological processes come together in synthetic biology research. The yogurt experiment explained microorganisms and their useful functions, the yeast balloon experiment demonstrated how environmental conditions can affect microbial activity, and the catalase experiment explored the role of enzymes in chemical reactions. By alternating between presentation and the experimental stations, students could observe the biological principles behind our research and understand how they apply to an actual biotechnology project. Through this event, we hoped to make synthetic biology more accessible to our school's students and give them a firsthand look at the scientific concepts and experimental reasoning involved in developing RENATA.",
      "paragraphs": []
    }
  ]
});

window.SITE_DATA.pages["education-byld"] = makePage({
  "group": "engagement",
  "kicker": "Education Event / Student-led biotechnology",
  "title": "Biotechnology Youth Literacy Directive (BYLD)",
  "lead": "A student-led club introducing biotechnology, synthetic biology, and DNA analysis through lectures and a pathway into iGEM research.",
  "buttons": [{ "text": "Back to education", "href": "education.html", "style": "secondary" }],
  "cards": [],
  "details": [
    {
      "id": "troy-byld",
      "title": "Biotechnology Youth Literacy Directive (BYLD)",
      "text": "Karthik and Humza founded the Biotechnology Youth Literacy Directive (BYLD), a student-led club dedicated to introducing biotechnology and synthetic biology to students at our school. Through multiple lectures on DNA analysis techniques and their applications in research, we helped students explore concepts beyond their regular biology classes. BYLD also served as a pathway into RENATA, encouraging students interested in biotechnology to get involved in iGEM and participate in hands-on synthetic biology research.",
      "paragraphs": [],
      "images": [
        {
          "page": 24,
          "src": "assets/engagement/page-24-1.jpg",
          "width": 1800,
          "height": 1350,
          "alt": "Students attending a BYLD classroom session.",
          "caption": "Students attending a BYLD classroom session."
        }
      ],
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ]
});

window.SITE_DATA.pages["experiment-assembly"] = makePage({
  group: "lab-work",
  kicker: "Experiment 01 / Assembly",
  title: "Assembly and <span class='accent-gradient'>verification</span>",
  lead: "A dedicated record for the hierarchical Golden Gate/JUMP build and the evidence used to confirm each assembly stage.",
  buttons: [{ text: "Back to experiments", href: "experiments.html", style: "secondary" }],
  cardsTitle: "Experiment record",
  cardsLead: "PLACEHOLDER: Replace each working prompt with the dated methods, observations, and files from the completed experiment.",
  cards: [
    { tag: "Question", title: "What was tested?", text: "Whether the selected Level 0 parts assemble into the intended transcriptional units and higher-level construct." },
    { tag: "Method", title: "How was it tested?", text: "PLACEHOLDER: Record reaction composition, cycling conditions, transformation, colony screening, and sequence verification." },
    { tag: "Controls", title: "What was compared?", text: "PLACEHOLDER: Document negative controls, positive controls, expected fragment sizes, and acceptance criteria." },
    { tag: "Readout", title: "What was measured?", text: "PLACEHOLDER: Add colony counts, screening results, gel images, sequencing traces, and final construct maps." }
  ],
  details: [
    {
      eyebrow: "Method and reproducibility",
      title: "From kit parts to an assembly-ready map",
      text: "PLACEHOLDER: Keep the materials, setup, procedure, experimental conditions, and deviations alongside the experiment they support.",
      steps: [
        { label: "1", text: "Select the destination backbone and confirm assembly level, antibiotic marker, and recipient role." },
        { label: "2", text: "Choose one bacterial promoter and RBS per cassette, balancing expression against host burden." },
        { label: "3", text: "Confirm each CDS identity, orientation, completeness, codon optimization, and internal Type IIS sites." },
        { label: "4", text: "PLACEHOLDER: Add double terminators and verify insulation between the two transcriptional units." },
        { label: "5", text: "PLACEHOLDER: Record part IDs, well locations, flanking enzymes, and 5-prime/3-prime fusion overhangs." },
        { label: "6", text: "Build and validate the hierarchical assembly in Benchling, then export the annotated map for wet-lab review." }
      ],
      note: "This is a design checklist rather than a bench-ready method. Add reaction volumes, cycling conditions, controls, transformation, screening, and sequence verification before execution."
    },
    {
      eyebrow: "Interpretation and continuation",
      title: "Connect the build result to the next decision",
      text: "PLACEHOLDER: State what the evidence directly confirms, identify failed or ambiguous junctions, and explain which construct advanced to characterization.",
      steps: [
        { label: "Chronology", text: "PLACEHOLDER: Add the experiment date and its place in the build sequence." },
        { label: "Interpretation", text: "PLACEHOLDER: Explain what the screening and sequencing evidence supports." },
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
    text: "PLACEHOLDER: Record normalized sfGFP fluorescence and growth for every condition, then connect the observed differences to the next regulatory design decision.",
    steps: [
      { label: "Chronology", text: "PLACEHOLDER: Add the date, replicate structure, and order of experimental events." },
      { label: "Answers", text: "PLACEHOLDER: State which comparisons directly answer the operator and transcription-factor questions." },
      { label: "Interpretation", text: "Separate supported conclusions from uncertainty and technical limitations." },
      { label: "Continuation", text: "PLACEHOLDER: Identify the regulatory configuration selected for follow-up work." }
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
    { tag: "Method", title: "How was it tested?", text: "PLACEHOLDER: Add the concentration series, exposure timing, culture conditions, sampling schedule, and normalization method." },
    { tag: "Controls", title: "What was compared?", text: "PLACEHOLDER: Document vehicle, untreated, reporter, and growth controls with the replicate design." },
    { tag: "Readout", title: "What was measured?", text: "PLACEHOLDER: Add optical density, fluorescence, normalized response, uncertainty, and any exclusion criteria." }
  ],
  details: [{
    eyebrow: "Interpretation and continuation",
    title: "Separate response from growth burden",
    text: "Interpret fluorescence together with growth so a stressed culture is not mistaken for a regulatory response.",
    steps: [
      { label: "Chronology", text: "PLACEHOLDER: Add the date, time course, and relationship to reporter characterization." },
      { label: "Interpretation", text: "PLACEHOLDER: Identify the concentration range supported by both growth and reporter evidence." },
      { label: "Continuation", text: "PLACEHOLDER: Explain how the result changed the next assay or construct decision." }
    ],
    note: "Current evidence boundary: the repository proposes a bile-acid concentration series; completed growth-response data have not yet been reported."
  }]
});

window.SITE_DATA.experimentRecordTabs = {
  "experiment-assembly": {
    notebookLead: "Record each assembly attempt in chronological order, including deviations, observations, verification evidence, interpretation, and the next build decision.",
    notebook: [
      { label: "Entry 01", title: "Assembly setup", text: "PLACEHOLDER: Add the date, construct version, selected parts, reaction setup, operators, and any deviations from the planned workflow." },
      { label: "Entry 02", title: "Transformation and screening", text: "PLACEHOLDER: Add colony observations, plate controls, screening results, images, and links to the raw record." },
      { label: "Entry 03", title: "Verification and continuation", text: "PLACEHOLDER: Add gel or sequencing evidence, interpret accepted and failed junctions, and state which construct advanced or was redesigned." }
    ],
    protocolsLead: "Keep the assembly, transformation, screening, and verification procedures beside the experiment they support.",
    protocols: [
      { label: "Protocol 01", title: "Golden Gate/JUMP assembly", text: "PLACEHOLDER: Add the validated reaction composition, part-to-vector ratios, enzyme system, cycling program, controls, and acceptance criteria." },
      { label: "Protocol 02", title: "Transformation and colony screening", text: "PLACEHOLDER: Add the competent-cell method, recovery, selection, plating, colony-screening procedure, and required controls." },
      { label: "Protocol 03", title: "Construct verification", text: "PLACEHOLDER: Add the digest, PCR, or sequencing workflow used to confirm identity, orientation, junctions, and complete construct sequence." }
    ]
  },
  "experiment-reporter": {
    notebookLead: "Track every reporter run with its four experimental conditions, replicate structure, observations, normalized readouts, interpretation, and follow-up decision.",
    notebook: [
      { label: "Entry 01", title: "Culture and condition setup", text: "PLACEHOLDER: Add the date, construct identities, culture conditions, replicate plan, instrument settings, and deviations." },
      { label: "Entry 02", title: "Reporter measurements", text: "PLACEHOLDER: Add growth and fluorescence observations for all four conditions with links to raw plate-reader files." },
      { label: "Entry 03", title: "Interpretation and continuation", text: "PLACEHOLDER: State which comparisons answer the operator and transcription-factor questions and which configuration advanced." }
    ],
    protocolsLead: "Document the shared procedure used to compare promoter, operator, and transcription-factor effects across the reporter matrix.",
    protocols: [
      { label: "Protocol 01", title: "Reporter culture preparation", text: "PLACEHOLDER: Add inoculation, growth, induction or exposure conditions, plate layout, timing, and biological and technical replicate requirements." },
      { label: "Protocol 02", title: "Growth and fluorescence measurement", text: "PLACEHOLDER: Add instrument settings, sampling schedule, blank correction, fluorescence normalization, and quality-control criteria." },
      { label: "Protocol 03", title: "Four-condition comparison", text: "Define the planned contrasts, uncertainty reporting, exclusion rules, and criteria used to identify a supported regulatory effect." }
    ]
  },
  "experiment-growth-response": {
    notebookLead: "Record each bile-acid response run chronologically, keeping concentration preparation, growth behavior, reporter output, exclusions, and decisions together.",
    notebook: [
      { label: "Entry 01", title: "Concentration-series setup", text: "PLACEHOLDER: Add the date, bile-acid identity, stock preparation, concentration range, plate map, controls, and replicate plan." },
      { label: "Entry 02", title: "Growth and reporter observations", text: "PLACEHOLDER: Add time-resolved optical density and fluorescence data, anomalies, exclusions, and links to raw files." },
      { label: "Entry 03", title: "Interpretation and continuation", text: "PLACEHOLDER: Identify the range supported by both growth and normalized reporter evidence, then record the next assay decision." }
    ],
    protocolsLead: "Keep concentration preparation, exposure, measurement, and analysis procedures together for reproducible growth-response testing.",
    protocols: [
      { label: "Protocol 01", title: "Bile-acid concentration preparation", text: "PLACEHOLDER: Add stock solvent, dilution sequence, final concentration range, vehicle matching, storage, and handling requirements." },
      { label: "Protocol 02", title: "Exposure and time-course measurement", text: "PLACEHOLDER: Add culture state, exposure timing, incubation conditions, plate layout, sampling intervals, and instrument settings." },
      { label: "Protocol 03", title: "Normalization and analysis", text: "PLACEHOLDER: Add blank correction, growth normalization, replicate aggregation, uncertainty reporting, exclusion criteria, and supported comparison tests." }
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

window.SITE_DATA.pages["project-description"].engineering = { details: [
  {
    id: "assembly-design-cycle",
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
    id: "assembly-evidence-map",
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
] };

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
    text: "PLACEHOLDER: Keep the experimental story chronological while showing what each experiment was meant to answer, how the team interpreted its results, and how that interpretation shaped the work that followed.",
    steps: [
      { label: "Chronology", text: "PLACEHOLDER: Record when the experiment occurred and place it in the sequence of the project." },
      { label: "Answers", text: "PLACEHOLDER: State the question the experiment addressed and what the result directly answered." },
      { label: "Interpretation", text: "PLACEHOLDER: Explain what the team concluded from the result, including uncertainty and limitations." },
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

window.SITE_DATA.humanPracticesEventRoutes = [
  {
    "number": "01",
    "title": "SABPA OC/LA Biochem Forum at UCI",
    "summary": "Ritvin and Karthik presented RENATA’s early project ideas and explored the commercial and clinical considerations for developing SultFlux.",
    "href": "education-event-01.html",
    "status": "May · Forum participation"
  },
  {
    "number": "02",
    "title": "Interview with Gastroenterologist and Team",
    "summary": "Dr. Singh discussed PCS diagnosis, existing treatment limitations, and the practical questions shaping RENATA’s proposed approach.",
    "href": "education-event-02.html",
    "status": "Clinical interview"
  },
  {
    "number": "03",
    "title": "Interview with Two Patients to Understand Personal Experiences",
    "summary": "Two patient interviews explored daily life after gallbladder removal and highlighted ease of use, clinical testing, and transparency about potential risks.",
    "href": "education-event-03.html",
    "status": "Patient interviews"
  },
  {
    "number": "04",
    "title": "Facebook Patient Responses",
    "summary": "International Facebook outreach revealed varied experiences after gallbladder removal and helped prioritize convenience and tolerability in RENATA’s design.",
    "href": "education-event-04.html",
    "status": "Online patient outreach"
  },
  {
    "number": "05",
    "title": "Seva Collective Event",
    "summary": "RENATA helped package and distribute food while sharing its PCS research with volunteers and families from communities across Orange County.",
    "href": "education-event-05.html",
    "status": "Community service"
  },
  {
    "number": "06",
    "title": "27th Annual San Diego MedChem Symposium at UCSD",
    "summary": "RENATA shared its progress in July and discussed enzyme engineering, simulation-based evaluation, and patient-informed design with industry professionals.",
    "href": "education-event-06.html",
    "status": "July · Symposium participation"
  }
];

window.SITE_DATA.pages["education-butterfly"] = makePage({
  "group": "engagement",
  "kicker": "Education Event / Elementary-school workshop",
  "title": "Butterfly Project: Exploring DNA",
  "lead": "An interactive workshop for grades 3–6, bringing DNA to life through strawberry DNA extraction and a genetics activity.",
  "buttons": [
    {
      "text": "Back to education",
      "href": "education.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "",
  "cardsLead": "",
  "cards": [],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "butterfly-workshop",
      "title": "Making DNA tangible",
      "text": "As part of RENATA’s education initiatives, we collaborated with the Butterfly Project in order to organize an interactive workshop for students in grades 3-6. Our goal was to introduce the major topic of DNA to younger students, while comparing it to other examples of how living organisms function. Since our project involves genetically engineering bacteria to produce an enzyme that modifies bile acids, we wanted to help younger students understand the basic science that makes this possible, to one day bring students closer to the sphere of synthetic biology. Rather than immediately defining what DNA was, we compared DNA to a recipe book that contains instructions that tell cells how to grow and function.",
      "paragraphs": [
        "One of the main activities was the hands-on strawberry DNA extraction experiment that the students partook in. Students worked in small groups to extract and observe DNA from strawberries, which allowed them to see the genetic material we had discussed during the presentation. We also introduced a genetics interactive activity, in which students were able to use randomly assigned characteristics to design a fictional person, which helped them understand how genetic information can influence physical traits. These activities all helped students acquire foundations of genetic engineering in a way that was accessible to elementary school students.",
        "This workshop also allowed us to connect our educational initiatives to RENATA’s main mission of making synthetic biology more accessible to kids all around Southern California. The same basic principles that we introduced to the kids at Butterfly Project are central to our own project. Even though our project involves the use of much more complex genetic engineering techniques, we wanted students to understand that biotechnology starts with the same concepts that they learned in our workshops. By introducing these ideas at a younger age, we hoped to encourage students to pursue and explore biology and biotechnology for their futures."
      ],
      "source": {
        "href": "https://docs.google.com/presentation/d/1ZaP8tsoNI2AWXiIO51uNXv36VdJprCPBiwy03zgKXto/edit?usp=sharing",
        "label": "Strawberry DNA — workshop presentation"
      },
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ]
});

window.SITE_DATA.pages["education-kickstart"] = makePage({
  "group": "engagement",
  "kicker": "Education Event / Collaborative learning resource",
  "title": "iGEM Kickstart: The Guide We Wish We Had",
  "lead": "A research fundamentals guide shared through our open-source education collaboration with NBJF and DBHS-CA.",
  "buttons": [
    {
      "text": "Back to education",
      "href": "education.html",
      "style": "secondary"
    }
  ],
  "stats": [],
  "cardsTitle": "",
  "cardsLead": "",
  "cards": [],
  "ctaTitle": "",
  "ctaText": "",
  "details": [
    {
      "id": "kickstart-collaboration",
      "title": "A Shared Starting Point",
      "text": "In collaboration with iGEM teams NBJF and DBHS-CA, RENATA contributed to a larger open-source education initiative designed to help new iGEMmers establish their own iGEM teams. Humza drew from the challenges we faced as a team in our first year and created the guide “Beginner's Guide to High School iGEM: Research Fundamentals”, compiling the scientific knowledge he wished he had when co-founding our team.",
      "paragraphs": [
        "The guide introduces viewers to the fundamentals of synthetic biology, covering DNA, proteins, the DBTL cycle, genetic circuit design, gene regulation, plasmids, and DNA assembly techniques such as Golden Gate Assembly. Also, it provides diagrams and references to additional research resources, which help students understand how these concepts apply to actual work in the laboratory. We wanted this collaboration to be a way for us to help make the early stages of synthetic biology less overwhelming, which gives future iGEM teams an accessible point to start their journey without requiring them to piece together hundreds of hours of foundational knowledge that we had to learn independently!"
      ]
    },
    {
      "id": "kickstart-reader",
      "title": "Read the Research Fundamentals Guide",
      "document": {
        "src": "assets/kickstart/research-fundamentals.pdf",
        "title": "Beginner’s Guide to High School iGEM: Research Fundamentals"
      },
      "source": {
        "href": "igem-kickstart.html",
        "label": "Explore the full guide in Contribution"
      },
      "citationType": "internal",
      "citation": "1. RENATA. “Writeup Education + HP.” Team-supplied PDF, n.d."
    }
  ]
});
