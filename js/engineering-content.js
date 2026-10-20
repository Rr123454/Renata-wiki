/* Engineering section of Project Description, summarized from the team's records. */
(function () {
  "use strict";

  const page = window.SITE_DATA.pages["project-description"];
  const engineering = page.engineering;
  const reference = page.paper.references[0];
  const source = `<a class="project-paper-citation" href="${reference.href}" target="_blank" rel="noopener noreferrer" aria-label="Source 1: Dry Lab Documentation">[1]</a>`;
  const notebook = "model.html";

  engineering.intro = "Assembly, enzyme design, and experimental integration address different questions within the same proposed system. These records trace how sequence comparisons, predicted structures, and experimental planning changed Renata’s design decisions.";
  engineering.decisions = [
    {
      tag: "Assembly",
      title: "Define a modular build",
      text: "The Golden Gate/JUMP plan separates pathway assembly from a reporter comparison of promoter, operator, and transcription-factor effects."
    },
    {
      tag: "Enzyme design",
      title: "Revise the structural hypothesis",
      text: "Alignment, docking, and sequence redesign generated candidate variants. Conflicting residue mappings and changing geometric criteria require another comparison before selection."
    },
    {
      tag: "Integration",
      title: "Connect predictions to measurements",
      text: "Expression, product identification, and kinetic measurements are planned to test the candidates and supply parameters for pathway modelling."
    }
  ];

  engineering.details = [...engineering.details,
    {
      id: "enzyme-design-cycle",
      eyebrow: "Computational enzyme-design cycle",
      title: "From a reference pocket to candidate variants",
      text: `The BtSULT investigation asks how LCA and isoalloLCA are positioned and how sequence changes affect their predicted local geometry. The reported computational work informs an experimental comparison. ${source}`,
      steps: [
        { label: "Design", text: "Compare BtSULT with human SULT2A1 using sequence alignment and structural overlays. Treat candidate cofactor and pocket correspondences as hypotheses to examine." },
        { label: "Build", text: "Construct computational inputs for single substitutions, ProteinMPNN redesigns, lid-graft proposals, and a six-alanine variant. Preserve each sequence and its parent numbering." },
        { label: "Test", text: "Compare reported docking poses, named atom-pair distances, repeated predictions, and model confidence. Record changes in search setup and comparison criteria." },
        { label: "Learn", text: "Revise ambiguous residue assignments and narrow the questions for a matched WT-versus-variant comparison. Product formation and enzyme activity still require measurement." }
      ],
      note: "This cycle describes computational design and assessment. The Golden Gate DBTL record addresses construct assembly and regulation; the two records have distinct evidence and completion states.",
      source: { href: `${notebook}#alignment`, label: "Read the sequence, structure, and docking record" }
    },
    {
      id: "enzyme-design-revisions",
      eyebrow: "What changed and why",
      title: "Residue assignments and rankings remain provisional",
      text: `The working document contains successive interpretations. Keeping the revisions visible explains why the present design has no confidently identified catalytic base. ${source}`,
      items: [
        `The initial sequence comparison placed human H99 against BtSULT K220; H215 was then proposed for structural inspection. The <a href="${notebook}#pymol">overlay measurements</a> did not establish catalytic equivalence.`,
        `A later report assigned human H99 to BtSULT E136. The <a href="${notebook}#corrections">subsequent structural review retracted that mapping</a> and left the catalytic base unresolved.`,
        `The <a href="${notebook}#redesign">variant screen</a> changed its substrate–cofactor distance cutoff from 6 Å to 5 Å. Passing counts and rankings must be reconciled against the individual runs and atom definitions.`,
        `The six-alanine variant has one reported complex with a 3.35 Å LCA–PAPS distance. Its substrate-interface ipTM is 0.529; this round lacks a matched WT complex. These values leave the pose and functional interpretation provisional.`
      ],
      note: "The next design comparison needs consistent inputs and criteria, matched WT models, and an experimental readout of the intended sulfated product. Geometric pass counts describe predictions."
    },
    {
      id: "system-integration-decisions",
      eyebrow: "Dry-to-wet-lab handoff",
      title: "Resolve the construct before testing the pathway",
      text: `The expression and cofactor plans contain alternative designs. A final construct needs a single, traceable choice of gene set, promoter logic, backbone, and tag arrangement. ${source}`,
      items: [
        `The <a href="wet-lab.html#expression-plan">purified-enzyme expression plan</a> uses a T7-driven His6–SUMO–BtSULT fusion. In that arrangement, cleavage separates the His6 tag from the enzyme unless a second tag is encoded; the purification plan must follow the verified map.`,
        `Cofactor-supply drafts discuss native BT0413–BT0415 partners and an alternative KlATPSL/PcAPSK module. Single-construct and two-plasmid arrangements remain design options.`,
        `The <a href="wet-lab.html#assembly">assembly record</a> holds the Golden Gate/JUMP build and verification plan. The <a href="wet-lab.html#reporter">reporter record</a> holds the promoter/operator/transcription-factor matrix.`,
        `The proposed Anderson-promoter comparison measures OD600 and sfGFP to compare expression. It answers a separate question from the four-condition operator/transcription-factor experiment.`
      ],
      note: "The six-week master plan uses its own DBTL 1 and DBTL 2 labels for enzyme characterization and integrated cofactor supply. Those labels describe proposed phases and do not establish completed bench work.",
      source: { href: "wet-lab.html#six-week-plan", label: "Read the planned experimental milestones" }
    },
    {
      id: "measurements-to-model",
      eyebrow: "Planned feedback into the model",
      title: "Use measured parameters to guide the next iteration",
      text: `The proposed ODE work links expression, enzyme kinetics, and PAPS supply. Each module needs measurements with defined units and assumptions before it can support a design decision. ${source}`,
      steps: [
        { label: "Expression", text: "Compare background-corrected growth and reporter signals with replicate records. Calibrate any conversion from reporter output to enzyme abundance." },
        { label: "Kinetics", text: "Verify product identity and obtain initial-rate measurements across substrate and cofactor conditions. Retain controls and uncertainty alongside fitted parameters." },
        { label: "PAPS supply", text: "Define the selected cofactor module and fit it to measured data. Evaluate model predictions with independent observations before using them to prioritize another build." }
      ],
      note: "The supplied record contains a modelling plan. A completed kinetic dataset and fitted ODE model have yet to be reported.",
      source: { href: "wet-lab.html#assay-plan", label: "Read the enzyme characterization plan" }
    }
  ];

  // Keep provenance in the paper's existing References panel, with one source number.
  reference.citation += " Engineering source tabs include BT Engineering, Model Wiki Writeup, Biomni summary, Dry + Wet Bridge, ODE Modeling, and MD Sample SOP.";
  engineering.sourceNote = `Detailed computational observations and method references are collected in the <a href="model.html">Model</a>. Experimental plans and their future records are organized in <a href="wet-lab.html">Wet Lab</a> and the <a href="wet-lab-notebook.html">Wet Lab Notebook</a>. ${source}`;
})();
