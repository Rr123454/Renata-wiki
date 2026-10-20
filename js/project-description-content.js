/* Project-level synthesis. Detailed observations and procedures live in Lab Work. */
(function () {
  "use strict";
  const page = window.SITE_DATA.pages["project-description"];
  const documentUrl = "https://docs.google.com/document/d/1hq1qmFW4YEaZQYAjRaq6p3PTumQB0m1oRSfn-F4U6K4/edit?tab=t.0";
  const sources = [
    {
      title: "Dry Lab Documentation",
      href: documentUrl,
      citation: "iGEM Renata. <cite>Dry Lab Documentation</cite>. Google Docs, unpublished working notes. Accessed 6 Oct. 2026."
    },
    {
      title: "BtSULT substrate selectivity",
      href: "https://doi.org/10.1038/s41564-022-01176-y",
      citation: "Yao, Lina, et al. “A Biosynthetic Pathway for the Selective Sulfonation of Steroidal Metabolites by Human Gut Bacteria.” <cite>Nature Microbiology</cite>, vol. 7, no. 9, 2022, pp. 1404–18."
    },
    {
      title: "Phosphatase-coupled activity assays",
      href: "https://doi.org/10.1016/j.ab.2012.01.003",
      citation: "Prather, Brittany, et al. “Golgi-Resident PAP-Specific 3′-Phosphatase-Coupled Sulfotransferase Assays.” <cite>Analytical Biochemistry</cite>, vol. 423, no. 1, 2012, pp. 86–92."
    }
  ];
  const cite = number => `<a class="project-paper-citation" href="${sources[number - 1].href}" target="_blank" rel="noopener noreferrer" aria-label="Source ${number}: ${sources[number - 1].title}">[${number}]</a>`;
  page.title = "Our Project";

  page.paper = {
    abstract: `<p>Post-cholecystectomy syndrome (PCS) is the motivating context for Renata’s investigation of bile-acid chemistry after gallbladder removal. Our research goal is to test a synthetic biology route for converting lithocholic acid (LCA) into its sulfated form. Clinical benefit in PCS has yet to be established. ${cite(1)}</p><p>The proposed system combines an engineered BtSULT enzyme with a supply of PAPS, its sulfate donor. Published wild-type BtSULT substrate preferences motivate examining how the bent 5β-LCA scaffold fits the enzyme. ${cite(2)} Sequence comparison, structural overlays, docking, and complex prediction guide candidate design; the DBTL cycle connects these choices to expression-vector construction, transformation, and planned enzyme-characterization assays. ${cite(1)}</p><p>The current wet-lab record contains experimental plans and controls. Completed transformation, expression, product-formation, and kinetic datasets have yet to be supplied. Computational comparisons nominate candidates and revise earlier active-site assumptions, while BtSULT’s catalytic base remains unresolved. These findings guide the next experimental comparison. Full enzyme-engineering analysis is collected in the <a href="model.html">Model</a>; methods and future observations are organized in <a href="wet-lab.html">Wet Lab</a> and the <a href="wet-lab-notebook.html">Wet Lab Notebook</a>. ${cite(1)}</p>`,
    methodology: `
      <h3>Enzyme design and structural comparison</h3>
      <p>The computational workflow begins with BtSULT Q8AAP8 and human SULT2A1 reference structures. Clustal Omega sequence alignment and PyMOL overlays locate candidate cofactor and substrate-binding regions. LCA and isoalloLCA docking then informs single substitutions, ProteinMPNN sequence redesign, and lid-graft proposals. Complex predictions are compared using named atom distances and model-confidence values. Riff-Diff and RFdiffusion3 remain proposed extensions. ${cite(1)}</p>
      <p><a href="model.html#inputs">Reference inputs and computational methods</a></p>

      <h3>Expression and pathway architecture</h3>
      <p>The pathway concept combines BtSULT with a dedicated PAPS-supply module. The working designs consider KlATPSL/PcAPSK and native bacterial cofactor-synthesis partners; gene identity, promoter choice, and single- versus two-plasmid organization remain design decisions. A separate T7–His6–SUMO–BtSULT construct is proposed for purified-enzyme characterization in BL21(DE3). ${cite(1)}</p>
      <p><a href="#engineering">Engineering decisions</a> · <a href="wet-lab.html#expression-plan">Expression and purification plan</a></p>

      <h3>Experimental measurements</h3>
      <p>The proposed validation covers expression and solubility, purified-enzyme kinetics, product identity, cofactor supply, and transport. Gel and protein measurements characterize the expressed material. Product-specific measurements are needed to establish LCA sulfate formation. A PAP-specific phosphatase-coupled assay can report donor turnover after its coupling response and background are validated. ${cite(1)} ${cite(3)}</p>
      <p><a href="wet-lab.html#assay-plan">Assay questions, controls, and interpretation</a></p>

      <h3>ODE modelling and parameter estimation</h3>
      <p>The MATLAB plan separates expression, enzyme kinetics, and PAPS supply. Proposed sfGFP/OD600 time courses and normalized protein measurements inform expression; substrate and cofactor scans inform kinetic parameters. The model will require calibrated rate data and uncertainty estimates. A fitted model and complete experimental dataset have yet to be supplied. ${cite(1)}</p>
      <p><a href="model.html#wet-lab-candidates">Wet-lab candidate selection</a></p>`,
    results: `
      <p>The working document reports computational observations from several distinct rounds. These findings guide candidate selection and the design of activity measurements. ${cite(1)}</p>
      <h3>Variant comparison</h3>
      <p>In the later three-run geometry screen, E144D, F147S, and F147S/E144D each pass the source's geometric criterion in three of three predictions. Their reported LCA–PAPS distances are 4.21 ± 0.23, 4.47 ± 0.45, and 4.33 ± 0.33 Å, respectively; WT is reported at 5.21 ± 0.05 Å with zero of three passing runs. The source leaves the ± statistic undefined and changes its distance cutoff between rounds. ${cite(1)}</p>
      <p><a href="model.html#variant-comparison">Full comparison and interpretation</a></p>
      <h3>Six-alanine model</h3>
      <p>A separate Boltz-2 model of E144A/W161A/K211A/F248A/F249A/T252A reports an LCA oxygen–PAPS sulfur distance of 3.35 Å. Interface confidence is lower for the substrate (ipTM 0.529) than for the cofactor (0.775). This round contains a single static complex and lacks a matched WT complex generated with the same setup. ${cite(1)}</p>
      <p><a href="model.html#corrections">Model evidence and limitations</a></p>
      <h3>What changed in the interpretation</h3>
      <p>Early H215 and E136 catalytic assignments did not provide a reliable residue map. The later structural review retracts the E136 correspondence and leaves BtSULT's catalytic base unresolved. Favorable predicted distances support experimental comparisons; the supplied records contain no completed activity assay establishing improved LCA conversion. ${cite(1)}</p>`,
    conclusion: `<p>The computational work narrows the candidates for comparison and identifies a key uncertainty in the catalytic-site interpretation. The next experimental questions concern whether each variant expresses, produces the intended sulfated product, and changes the measured reaction rate relative to WT. Those measurements will also determine which parameters can enter the pathway model. ${cite(1)}</p><p><a href="model.html">Enzyme-engineering analysis</a> · <a href="wet-lab.html">Wet-lab plans and methods</a> · <a href="wet-lab-notebook.html">Wet-lab notebook</a></p>`,
    evidenceFigure: {
      src: "assets/dry-lab/cofactor-region.png",
      alt: "Historical PyMOL overlay of the candidate BtSULT cofactor region with human reference residues and PAP",
      title: "Cofactor-region comparison",
      caption: `Original cofactor-region comparison from the team's working notes: BtSULT candidates in magenta, human residues in yellow, and PAP in orange. The overlay informed initial mapping; PAP lacks PAPS's transferable sulfuryl group. ${cite(1)}`
    },
    references: sources,
    vectorFigure: {
      title: "Expression vector",
      placeholder: "Expression-vector image to be added",
      architecture: ["T7 promoter", "RBS", "His6", "SUMO", "ULP1 cleavage site", "BtSULT variant", "Stop / terminators"],
      caption: `Schematic placeholder for the proposed pET-28a(+) expression construct. The labelled sequence follows the working design; the verified vector map and experimental image have yet to be supplied. ${cite(1)}`
    },
    dbtl: {
      intro: `Our design–build–test–learn cycle connects the expression construct to the evidence needed for the next iteration. Bench stages below are planned; the expandable records retain the documented design decisions and computational findings. ${cite(1)}`,
      stages: [
        {
          id: "design", label: "Design", title: "Expression Vector",
          text: `<p>The enzyme-characterization plan uses a T7-driven His6–SUMO–BtSULT fusion in pET-28a(+), with BL21(DE3) as the expression chassis. Sequence identity, fusion boundaries, and the final construct map need confirmation before interpreting expression. ${cite(1)}</p><p>His6 is attached to SUMO in this arrangement. Cleavage therefore separates that tag from BtSULT unless another tag is encoded on the enzyme. The pathway’s cofactor gene set and single- versus two-plasmid organization remain design choices.</p>`,
          links: [{ href: "wet-lab.html#expression-plan", label: "Expression and purification plan" }, { href: "model.html", label: "Enzyme-design rationale and model" }],
          records: ["system-integration-decisions", "enzyme-design-cycle"]
        },
        {
          id: "build", label: "Build", title: "Transformation Experiments",
          text: `<p>The build plan connects construct assembly to transformation, selection, screening, and sequence verification. Each attempt needs a dated record of the construct version, controls, observations, and the evidence used to accept or revise the build. ${cite(1)}</p><p>Completed transformation and verification results have yet to be reported. The assembly strategy and its evidence boundary remain available below.</p>`,
          links: [{ href: "wet-lab.html#assembly", label: "Assembly and transformation plan" }, { href: "wet-lab-notebook.html", label: "Wet-lab notebook" }],
          records: ["assembly-design-cycle", "assembly-evidence-map"]
        },
        {
          id: "test", label: "Test", title: "Enzyme Characterization Assay",
          text: `<p>The planned comparison asks whether WT and candidate variants express, form the intended sulfated product, and differ in measured reaction rate. Expression and solubility records, protein normalization, substrate/cofactor series, blanks, and inactive-enzyme controls are needed to interpret the assay. ${cite(1)}</p><p>A PAP-specific phosphatase-coupled readout can support turnover measurements after its response and background are validated. Product identity requires appropriate product-specific evidence. ${cite(3)}</p>`,
          status: "Current data status: the record supplies computational observations and assay plans. Completed product-identification and enzyme-kinetics datasets have yet to be supplied.",
          links: [{ href: "wet-lab.html#assay-plan", label: "Assay logic and controls" }, { href: "model.html#wet-lab-candidates", label: "Model candidates for experimental testing" }],
          records: ["measurements-to-model"]
        },
        {
          id: "learn", label: "Learn", title: "Reflections / What We’d Change",
          text: `<p>Resolve the catalytic-site mapping, use consistent atom definitions and ranking criteria, and compare WT with variants under matched settings. For bench work, confirm construct identity and tag placement, validate the assay background, and establish product identity before interpreting a change in activity. ${cite(1)}</p>`,
          links: [{ href: "model.html#corrections", label: "Computational findings and revised interpretation" }, { href: "wet-lab-notebook.html", label: "Record the next experimental decision" }],
          records: ["enzyme-design-revisions"]
        }
      ]
    }
  };
})();
