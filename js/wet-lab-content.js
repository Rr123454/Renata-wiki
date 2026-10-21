/* Source-backed bench record. Page numbers refer to physical PDF pages. */
(function (root) {
  "use strict";
  const assetUrl = path => root.IGEM_ASSET_URL ? root.IGEM_ASSET_URL(path) : path;
  const figure = (file, page, title, caption, alt) => ({ file: assetUrl(`assets/wet-lab/${file}`), page, title, caption, alt });
  root.RENATA_WETLAB = {
    pdf: "assets/documents/igem-renata-lab-documentation-2026.pdf",
    pdfSha256: "7ed8512b366732aa3587e594f098db952740fdd2c99bb6eae8272daf04bb9514",
    pageCount: 74,
    citation: 'RENATA. "iGEM Renata Lab Documentation 2026." 2026. Team laboratory record, 74 pp.',
    status: "Recorded through 19 October 2026",
    summary: "Our bench work follows BtSULT constructs from transformation and colony screening to expression, protein recovery, and biochemical characterization. The latest notebook entry records visible SDS-PAGE bands; TLC remained inconclusive. LCA sulfation and improved enzyme activity have not been established by this record.",
    records: [
      {
        id: "assembly", title: "Transformation & host expression", pages: "1–4, 57, 66–69", page: 2,
        question: "Can the expression constructs be introduced into a bacterial host and recovered as colonies for screening?",
        evidence: "The document records BL21 transformation work with BtSULT and SulFlux constructs, repeated unsuccessful attempts in September, and colonies available for renewed screening at the end of September.",
        interpretation: "Colony growth supplies screening candidates. The failed pUC19 control attempts also leave the transformation process or materials in question; the record cannot attribute every failure to an experimental plasmid.",
        next: "Reconcile construct, plate, and colony identifiers with the PCR record before assigning a variant to a recovered colony.",
        paragraphs: [
          "The documented construct framework uses a pET-28a(+) backbone, a T7-associated expression system, kanamycin selection, and a His-tag for downstream recovery. The source identifies the host as BL21; its exact strain designation should be retained in the underlying strain record.",
          "Initial colony growth was recorded in July. September attempts included SF2, SF3, and BtSULT-labelled preparations, followed by pUC19/DH5α control work. A successful control was recorded on 22 September after earlier control failures. The following counts appear with the 30 September–1 October work; the source provides no count for 2B."
        ],
        tables: [{ title: "Recorded colony counts · 30 September–1 October", columns: ["Sample label", "Colonies recorded"], rows: [["1A", "13"], ["1B", "19"], ["2A", "13"], ["2B", "Unreported"], ["3A", "80–100"], ["3B", "180–200"]], note: "Source p. 68. Ranges are preserved. These counts have no transformation-efficiency denominator." }],
        methods: "The source describes heat-shock transformation, recovery, selective plating, restreaking, and growth of isolated colonies. The complete materials and procedure are retained in the original document (pp. 3–4; duplicated on pp. 28–29)."
      },
      {
        id: "screening", title: "Colony PCR & insert screening", pages: "4–10, 33–37, 60, 68–70", page: 4,
        question: "Do the recovered colonies contain DNA consistent with the expected expression construct?",
        evidence: "The overview reports bands around 2 kb in several DBTL1 samples and in the later screening panel dated 8 October. July notebook entries also report S1–S7 bands. October 3 positive-colony assignments conflict between the weekly summary and detailed entry.",
        interpretation: "A band at the expected size supports insert screening. The supplied record does not establish sequence-confirmed mutation identities, and the numbered sample key is inconsistent across sections.",
        next: "Resolve the lane-to-colony and colony-to-variant mapping against original sample sheets before linking these gels to a specific engineered variant.",
        paragraphs: ["T7-primer colony PCR and agarose gel electrophoresis were used to compare products with a DNA ladder. The document describes an expected product around 2 kb, incorporating vector-flanking sequence, the template gene, and tags. It reports newly streaked and older colonies separately in the first DBTL screening panels."],
        figures: [
          figure("colony-screening.png", 5, "October colony-screening panel", "Four source gel panels dated 8 October 2026. Original labels are preserved. The caption reports expected-size bands, while the variant-number mapping requires reconciliation.", "Four annotated colony-PCR gels with sample labels and approximately 2 kb bands marked in the source."),
          figure("colony-gel-a.jpeg", 33, "DBTL1 · Gel A", "Original gel image; the source lane key appears on PDF pp. 8–9.", "DBTL1 agarose gel A with two rows of sample lanes."),
          figure("colony-gel-b.jpeg", 34, "DBTL1 · Gel B", "Original gel image; the source lane key appears on PDF p. 9.", "DBTL1 agarose gel B with two rows of sample lanes."),
          figure("colony-gel-c.jpeg", 35, "DBTL1 · Gel C", "Original gel image; the source lane key appears on PDF pp. 9–10.", "DBTL1 agarose gel C with two rows of sample lanes.")
        ],
        tables: [{ title: "DBTL1 lane order, left to right", columns: ["Gel / row", "Recorded order"], rows: [["A / upper", "Ladder, B1, B2, B3, B4, B5, B6, B7"], ["A / lower", "Ladder, S1, S2, S3, S4, S5, S6, S7"], ["B / upper", "Ladder, B8, B9, B10, b1, b2, b3, b4"], ["B / lower", "Ladder, S8, S9, S10, Su1, Su2, su3, Su4"], ["C / upper", "Ladder, b5, b6, b7, b8, su5, su6, su7"], ["C / lower", "Ladder, su8; remaining lanes blank in the key"]], note: "Source pp. 8–10: B/b denote BT0416 control colonies and S/su denote SulFlux. Uppercase labels indicate older colonies; lowercase labels indicate newly streaked colonies. Capitalization above follows the source." }],
        methods: "The source records colony picking, T7-primer PCR, agarose separation, and blue-light visualization. Full procedures and gel preparation are on pp. 5–7 and 30–32. The current page keeps the screening outcome separate from sequence verification."
      },
      {
        id: "expression-plan", title: "Growth & induction", pages: "10–13, 38–39, 42–43, 58–60, 70–71", page: 10,
        question: "How were screened cultures grown and prepared for expression comparisons?",
        evidence: "The team compared inoculation ratios, monitored OD600, and investigated IPTG and skim-milk conditions. On 10 October, three selected cultures had two-hour OD600 values of 0.700, 0.492, and 0.717.",
        interpretation: "OD600 records culture density. These readings alone cannot establish protein yield or show that the two induction approaches are equivalent. The growth plot also includes reference expectations alongside measured culture curves.",
        next: "Link each culture, induction condition, recovered fraction, and downstream assay to a consistent sample identifier. Check the conflicting dilution and IPTG-volume entries before reusing the protocol.",
        paragraphs: ["The narrative describes moving screened colonies into larger cultures, monitoring an OD600 window of 0.4–0.8, inducing expression, and harvesting material for lysis. It also records practical limits on cooling the shaker during expression. The July notebook says 1:100 was selected for more manageable growth after scheduling-related overgrowth.", "Skim milk was explored when IPTG availability was limited. Its use is documented as an experimental condition; this record does not validate it as an equivalent substitute. The exact culture and inducer amounts vary between the narrative, procedure tables, and notebook."],
        tables: [{ title: "10 October · two-hour culture-density readings", columns: ["Culture", "OD600"], rows: [["1AB", "0.700"], ["2AE", "0.492"], ["3BE", "0.717"]], note: "Source pp. 70–71. These values are culture-density readings, with no protein concentration inferred." }],
        figures: [figure("growth-curve.png", 11, "DBTL1 growth record", "Original growth graphic, including its reference-growth curve and expected zones. The source caption reports OD600 0.56 at three hours for a SulFlux 1:75 culture after a shaker-speed adjustment. The plot title identifies WT BtSULT; those labels should be checked against the raw data.", "Growth chart comparing an ideal reference with 1:100 and 1:75 IPTG-labelled culture curves and shaded expected-growth zones.")],
        methods: "Growth monitoring, culture preparation, IPTG stock and induction notes are preserved on pp. 10–13 and 38–43. Several dilution labels and additions are internally inconsistent, so the website does not silently standardize them into a validated recipe."
      },
      {
        id: "purification", title: "Cell lysis & His-tag recovery", pages: "13–14, 40–41, 61–65, 68, 71", page: 13,
        question: "Can protein-containing material be recovered from induced cultures for subsequent characterization?",
        evidence: "The record describes B-PER extraction with lysozyme, DNase, and protease-inhibitor supplementation, followed by nickel-affinity His-Spin purification. It includes crude-lysate and eluted-fraction measurements as well as repeated low-reading samples.",
        interpretation: "These steps yield fractions for comparison. A BCA signal in an eluted fraction does not by itself identify BtSULT, quantify its purity, or establish that the enzyme remains active.",
        next: "Keep crude, flow-through, wash, and elution identities connected to the relevant gel and assay records; reconcile buffer and sample-preparation entries before interpreting recovery.",
        paragraphs: ["The team used B-PER bacterial protein extraction reagent and a nickel-charged His-affinity matrix (Zymo His-Spin Protein Miniprep, P2002). The source also lists an elution-buffer formulation. Its composition and compatibility with later functional work need confirmation in the bench record.", "August notes describe lysis-buffer homogeneity concerns and a decision to add lysozyme and DNase fresh. September pooled His-tag fractions produced low or mostly negative BCA readings. The team proposed sample loss or degradation; those explanations remain hypotheses in the supplied evidence."],
        methods: "The original lysis and purification materials, loading conditions, wash steps, and elution notes appear on pp. 13–14 and 40–41. Their wording is retained in the PDF; the article uses a descriptive workflow summary."
      },
      {
        id: "quantification", title: "BCA protein quantification", pages: "1, 15–18, 44–47, 62–65, 68, 71–72", page: 15,
        question: "What protein-assay signal was recovered before and after the purification workflow?",
        evidence: "The document reports a purified-sample mean of 238.759 µg/mL with σ = 32.558 µg/mL and a standard-curve R² of approximately 0.95. It also supplies August comparison charts and a later BSA calibration curve.",
        interpretation: "The summary omits sample-group, date, and replicate-count metadata. BCA is treated here as a protein-quantity readout; the record does not establish target-specific purity or catalytic activity. Wavelength, replication, and unit discrepancies limit quantitative comparisons.",
        next: "Verify the plate-reader export, wavelength, blank correction, standard preparation, dilution factors, sample identities, and replicate structure before finalizing quantitative conclusions.",
        paragraphs: ["The source describes BSA standards and comparison of crude lysate with eluted material. Its overview says measurements were made in duplicate at 595 nm; the detailed procedure says triplicate at 480 nm, while the chemistry discussion describes a complex absorbing near 562 nm. The active acquisition settings cannot be resolved from this document alone.", "The numbers below are transcribed from the supplied figures, with their original units and labels identified. The crude-lysate chart prints g/mL; that unit needs verification. The purified-fraction chart uses µg/mL. No conversion between these charts has been applied.", "The source caption interprets the purified/crude comparison as 15–20% of cellular protein. Concentration comparisons alone, without fraction volumes and target-specific identification, do not establish a mass recovery or a purity percentage."],
        tables: [
          { title: "6 August · crude-lysate chart values", columns: ["Chart label", "Value", "Unit printed on chart"], rows: [["Bt", "7.13", "g/mL — verify"], ["Bt-IPTG", "7.23", "g/mL — verify"], ["SF", "8.76", "g/mL — verify"], ["SF-IPTG", "9.47", "g/mL — verify"]], note: "Source p. 18. Replicate counts and uncertainty are absent from the chart." },
          { title: "6 August · loaded and purified fractions", columns: ["Chart condition", "Loaded sample (µg/mL)", "Purified fraction (µg/mL)"], rows: [["Bt-SULT (6xHis)", "260", "54"], ["Bt-SULT IPTG (6xHis)", "323", "91"], ["SultFlux (6xHis)", "333", "99"], ["SultFlux IPTG (6xHis)", "266", "102"]], note: "Source p. 18. The second series is labelled ‘Recombinant Protein’ in the original chart; target identity is unverified by BCA alone." }
        ],
        figures: [
          figure("bca-standard-curve.png", 15, "Reported BSA standard curve", "The source plot displays R² = 0.953. It is retained as the team's calibration graphic; raw plate values and acquisition settings still need reconciliation.", "BSA calibration plot showing absorbance against concentration and the source linear fit with R squared 0.953."),
          figure("bca-crude-lysate.png", 18, "6 August · crude lysate", "Original chart with its printed g/mL axis preserved. Verify this unit before quantitative reuse.", "Bar chart showing Bt 7.13, Bt-IPTG 7.23, SF 8.76, and SF-IPTG 9.47; the source axis is labelled g per mL."),
          figure("bca-purified-comparison.png", 18, "6 August · fraction comparison", "Original loaded-sample and ‘Recombinant Protein’ series. The chart supplies concentration estimates without proving the identity or purity of the recovered protein.", "Paired bars for four conditions showing loaded values 260, 323, 333, 266 and recovered values 54, 91, 99, 102 micrograms per mL.")
        ],
        methods: "BCA materials, standard preparation, plate layout, working-reagent instructions, and reading notes are available on pp. 15–18 and 44–47. Conflicting wavelengths, duplicate/triplicate wording, reagent-ratio notation, and lysis-component amounts remain visible in the source."
      },
      {
        id: "protein-gels", title: "SDS-PAGE characterization", pages: "19–23, 48–52, 72–73", page: 19,
        question: "Do the recovered fractions produce visible protein bands that can be compared with a molecular-weight ladder?",
        evidence: "The 17 October notebook entry reports no bands. The repeat on 19 October records visible bands using a stained ladder and Odyssey CLx imaging after changes to handling and running conditions.",
        interpretation: "Visible bands support a successful protein-visualization step. The provided record does not include a verified target-band assignment, densitometric purity estimate, or enzyme-activity result.",
        next: "Attach the final gel image and matched lane sheet, then verify the expected target size and sample identities before assigning any band to BtSULT or comparing variants.",
        paragraphs: ["The source describes SDS-PAGE followed by Coomassie staining and comparison of whole-protein and His-tag fractions. It records IPTG- and milk-labelled conditions in the earlier lane maps, and old versus newly purified material in the repeat.", "After the 17 October failure, the team considered loading and buffer temperature as possible contributors. The 19 October entry records chilled running buffer, a stained ladder, buffer-filled empty wells, and a longer, lower-voltage run. These changes accompany the later bands; the record does not isolate which change affected the result."],
        tables: [{ title: "19 October · source lane maps", columns: ["Lane", "Gel 3 · newly purified", "Gel 4 · earlier purified"], rows: [["1", "Protein ladder", "Protein ladder"], ["2", "1AB (IPTG+)", "LDS blank"], ["3", "1AB (milk)", "1AB (IPTG+)"], ["4", "LDS blank", "LDS blank"], ["5", "2AE (IPTG+)", "2AE (IPTG+)"], ["6", "2AE (milk)", "2AE (milk)"], ["7", "3BE (IPTG+)", "3BE (IPTG+)"], ["8–10", "LDS blanks", "LDS blanks"]], note: "Source p. 21 explicitly asks for confirmation that these identities and induction conditions match the prepared samples. These are documented lane plans, pending that check." }],
        methods: "Sample preparation, electrophoresis, staining, destaining, and interpretation criteria are documented on pp. 19–23 and 48–52. The supplied notebook contains a result statement for the final gel; a final gel image is still needed for the website."
      },
      {
        id: "assay-plan", title: "TLC & the functional-assay question", pages: "23–25, 53–55, 72–73", page: 23,
        question: "Can the assay distinguish LCA from a sulfated product after reaction with the recovered protein?",
        evidence: "The source describes LCA/PAPS reaction setups and supplies TLC plate photographs. Both the 17 and 19 October notebook entries call the TLC outcome inconclusive. The later entry records unavailable standard visualization reagent and exploration of acetic acid with UV visualization.",
        interpretation: "The supplied TLC evidence does not demonstrate LCA conversion, product identity, substrate specificity, or improved catalytic activity. The photographs have no reconciled lane key or definitive product assignment in the supplied record.",
        next: "Resolve the visualization and solvent documentation, establish interpretable substrate/product controls, and connect the final plate image to sample identities before evaluating sulfation.",
        paragraphs: ["The intended endpoint is biochemical evidence that BtSULT can sulfate LCA. The source workflow combines enzyme samples, LCA, PAPS, and the listed buffers before TLC separation and visualization.", "The notebook discusses plate drying and gypsum deposits as possible contributors to an inconclusive practice run. The protocol also retains conflicting solvent-volume entries and both planned PMA staining and substituted visualization wording. These are unresolved method-record issues; the website does not present them as a finalized assay."],
        figures: [1, 2, 3, 4, 5].map(n => figure(`tlc-plate-${n}.jpeg`, 55, `TLC source photograph ${n}`, "Unaltered photograph from the source. Sample assignments and a confirmed product interpretation are unavailable.", `Source TLC photograph ${n} under UV illumination; no verified product assignment is provided.`)),
        methods: "The source retains reaction setup, solvent preparation, spotting, development, and visualization notes on pp. 23–25 and 53–55. Use the original record to review the unresolved entries; a confirmed functional result remains outstanding."
      }
    ],
    checks: [
      ["Sample identity", "The p. 5 caption maps label 1 to F147S_E144D and 2 to F147S. The notebook's SF2/SF3 and numbered mappings on pp. 66 and 68 reverse that assignment."],
      ["3 October PCR", "The weekly and detailed entries on pp. 68–69 disagree about which colonies were positive. No single reconciled list is asserted here."],
      ["Quantification", "BCA wavelength, replicate count, reagent-ratio notation, and chart units conflict. The reported mean and standard deviation on p. 1 lack a linked sample group and n."],
      ["Culture and induction settings", "Some dilution ratios disagree with their listed volumes; one IPTG addition also conflicts with the other entries. Exact conditions need confirmation against the bench sheets."],
      ["TLC method", "Solvent-volume and visualization instructions are inconsistent. The latest notebook still reports an inconclusive assay."],
      ["Chronology", "The blank 09/31 cell is an invalid date and is excluded from the timeline. The documented 10–21 August pause is retained."]
    ]
  };
})(typeof window === "undefined" ? globalThis : window);
