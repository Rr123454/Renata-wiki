/* Accessible chronological companion to the team's original 2026 lab record. */
(function (root) {
  "use strict";

  root.RENATA_WETLAB_NOTEBOOK = {
    title: "Wetlab notebook",
    status: "Dated bench record · June–October 2026",
    notice: "This chronology summarizes the team's dated observations and reflections. Page references use physical PDF pages. The original record contains unresolved sample-label, assay-setting, and interpretation inconsistencies; those limits are retained here. Colony growth, PCR bands, protein measurements, and SDS-PAGE bands establish different kinds of evidence. The latest entry, 19 October, records visible SDS-PAGE bands and inconclusive TLC; it does not establish LCA sulfation or improved catalytic activity.",
    source: '1. RENATA. "iGEM Renata Lab Documentation 2026." 2026, physical PDF pp. 56–74.',
    planningNote: "Procedures and planning material elsewhere in the PDF provide workflow context. The dated entries below distinguish work performed, observations recorded, explanations proposed by the team, and decisions still requiring confirmation. General labels such as ‘successful’ have been replaced with the specific observation wherever the source supplies one.",
    sections: [
      {
        id: "june",
        page: 56,
        title: "June · Training and preparation",
        lead: "The first recorded week focused on familiarization and practice. No experimental result measurements are entered for this period.",
        entries: [
          {
            label: "22–23 June 2026 · PDF p. 56",
            title: "Building laboratory familiarity",
            text: "The team recorded AlphaFold practice, the Village project, LB-broth incubation, and practice with ELISA and transformation protocols. The results row is blank, so these activities are presented as preparation rather than evidence of a completed project experiment."
          }
        ]
      },
      {
        id: "july",
        page: 57,
        title: "July · Transformation, screening, and protein recovery",
        lead: "Initial cultures and colony screens were followed by growth, induction, protein measurements, and purification work. The record also captures adjustments prompted by laboratory scheduling and sample concentration.",
        entries: [
          {
            label: "1–3 July 2026 · PDF p. 56",
            title: "Preparing the experimental workflow",
            text: "The team outlined His-tag purification, IPTG induction, sulfotransferase-assay, and SDS-PAGE procedures; sought protocol approval; prepared staining and destaining materials; and researched distribution-kit components. No assay outcome is entered for these dates."
          },
          {
            label: "7–8 July 2026 · PDF pp. 56–57",
            title: "Preparing cultures and equipment",
            text: "Entries record TB-broth preparation, inoculation, plate streaking for colony PCR, and OD600 readings. The team also researched lysis equipment and autoclave access. The detailed inoculation entry reports that colonies appeared."
          },
          {
            label: "9 July 2026 · PDF p. 57",
            title: "First-round transformation produced colonies",
            text: "The SF-plasmid transformation entry records colony growth and identifies this as the first DBTL round. Growth supplied candidates for screening; the entry does not independently verify the identity or sequence of their inserts."
          },
          {
            label: "13–14 July 2026 · PDF pp. 58–59",
            title: "Comparing growth and induction conditions",
            text: "The team tracked cultures at three inoculation ratios and recorded reaching the intended OD600 growth window. Induction work included an uninduced control and two IPTG conditions. These entries describe preparation for protein measurements; culture density alone does not establish target-protein expression."
          },
          {
            label: "15 July 2026 · PDF pp. 59–60",
            title: "BCA readings prompted sample dilution",
            text: "Following lysis, the team ran a BCA assay and recorded increasing readings over time. The notebook describes the samples as too concentrated and identifies dilution as the next handling step. No target-specific protein identity or activity measurement is recorded in this entry."
          },
          {
            label: "16 July 2026 · PDF pp. 58, 60",
            title: "Colony screening and a growth-management decision",
            text: "Colony PCR and gel electrophoresis produced reported bands for S1–S7. This supports the team's screening step, while sequence identity remains unverified in the notebook. A separate NanoDrop comparison describes higher readings in the 1:75 culture and scheduling-related overgrowth; the team selected 1:100 for subsequent work because its growth was easier to manage. The source's A280 concentration notation is ambiguous and is not reproduced as a verified quantitative comparison."
          },
          {
            label: "20–23 July 2026 · PDF p. 61",
            title: "Continuing purification and planning the functional assay",
            text: "The weekly log records overnight inoculation, diluted SF and BtSULT samples for BCA testing, His-tag/SUMO pulldown, and drafting the TLC reaction plan. Only the inoculation is given an explicit result label; the remaining entries document work or preparation without a detailed outcome."
          },
          {
            label: "29–30 July 2026 · PDF p. 61",
            title: "Testing the purification workflow",
            text: "In a week labelled ‘Start of DBTL2, Part 2,’ the team recorded BCA testing with His-tag binding buffer for two BtSULT and two SulFlux colonies, followed by His-tag pulldown with DNase. Both days are labelled successful in the weekly summary, but numerical yields and target-specific confirmation are not supplied there."
          }
        ]
      },
      {
        id: "august",
        page: 62,
        title: "August · Protein measurements and lysis troubleshooting",
        lead: "Variable protein-assay readings motivated changes in sample preparation. Some source interpretations mix culture-density and protein-assay measurements, so observations are separated from those explanations.",
        entries: [
          {
            label: "3 August 2026 · PDF p. 62",
            title: "Low readings raised a lysis question",
            text: "BCA analysis of material associated with the first DBTL protein-isolation round gave relatively low readings. The notebook asks whether sonication had failed. This was a troubleshooting hypothesis; no comparison in this entry establishes the cause."
          },
          {
            label: "4 August 2026 · PDF p. 62",
            title: "Revising lysis-buffer preparation",
            text: "The team noted a nonhomogeneous lysis-buffer preparation and recorded increasing BCA-derived protein estimates. Its recorded response was to add lysozyme and DNase on the day of use. The entry supports a preparation change, with its effect still requiring a controlled comparison."
          },
          {
            label: "5–6 August 2026 · PDF pp. 62–63",
            title: "Continuing purification and reviewing concentration",
            text: "The weekly log includes protein extraction, His-tag work, and BCA assays. The 6 August entry reports increasing readings in His-tagged samples and considers dilution. Its explanation invokes the 0.4–0.8 culture-density window while discussing protein concentration; that interpretation remains unresolved and is not treated as a validated BCA acceptance range."
          },
          {
            label: "10–21 August 2026 · PDF p. 64",
            title: "Documented pause in experiments",
            text: "Both weekly tables explicitly state that no experiments were run and no data were collected. This gap is retained so the chronology does not imply continuous experimental work."
          },
          {
            label: "25–27 August 2026 · PDF p. 65",
            title: "Low assay readings and fresh broth preparation",
            text: "After BCA preparation, the 26 August run was described as low, with blank-subtracted readings around 0.2–0.3. The entry does not establish concentration units and again compares the values with 0.4–0.8, so they are retained as reported readings rather than a verified protein-concentration result. Broth preparation was recorded the following day."
          }
        ]
      },
      {
        id: "september",
        page: 66,
        title: "September · Repeated transformations and control checks",
        lead: "A sequence of failed transformations prompted control experiments. Colonies appeared at the end of the month, while the construct-to-sample mapping still needs reconciliation with the document's overview.",
        entries: [
          {
            label: "1–3 September 2026 · PDF p. 66",
            title: "No colonies after the first repeat attempts",
            text: "The team prepared and repeated transformations using SF2 and SF3. The dated entries for 2 and 3 September report no colonies and question whether DNA concentration contributed. The notebook's variant labels conflict with the overview's numbered sample key; this chronology retains SF2 and SF3 without assigning confirmed mutation identities."
          },
          {
            label: "9 September 2026 · PDF pp. 66–67",
            title: "Comparing old and new construct preparations",
            text: "The team tested preparations labelled SF2, SF3, and BtSULT, including old and new sample identifiers. All three listed outcomes were failures. Human handling and plasmid quality were raised as possible explanations; the entry does not distinguish their contributions."
          },
          {
            label: "10–11 September 2026 · PDF p. 67",
            title: "Introducing a transformation control",
            text: "The log describes DH5α transformations with pUC19, SF2, and SF3 while investigating the repeated failures. No colonies were recorded. A failed control leaves the process or materials in question and cannot specifically establish a defect in an experimental construct."
          },
          {
            label: "16 September 2026 · PDF p. 67",
            title: "Another unsuccessful control attempt",
            text: "The dated entry records a failed pUC19 control transformation without a further explanation. This extends the troubleshooting sequence and leaves the underlying cause unresolved."
          },
          {
            label: "22–23 September 2026 · PDF pp. 67–68",
            title: "Control recovery alongside low protein readings",
            text: "The weekly summary reports a successful pUC19 control on 22 September. On 23 September, pooled His-tagged SF and BtSULT samples gave very low or mostly negative BCA readings. The team's interpretation was that the samples had been lost or degraded, but these readings alone do not establish the mechanism or the amount of intact target protein."
          },
          {
            label: "30 September–1 October 2026 · PDF p. 68",
            title: "Colonies available for renewed screening",
            text: "After another transformation and colony restreaking, the notebook records 1A: 13 colonies; 1B: 19; 2A: 13; 3A: 80–100; and 3B: 180–200. A 2B condition is listed without a colony count; its result remains unreported. These are colony counts, not calculated transformation efficiencies. The source associates the outcome with a changed sample-handling step, but provides no controlled evidence that it caused the improvement."
          }
        ]
      },
      {
        id: "october",
        page: 68,
        title: "October · Screening, characterization, and remaining questions",
        lead: "The final recorded work moves from renewed colony screening to induction, extraction, SDS-PAGE, and TLC. Visible protein bands were recorded on 19 October; the functional assay remained inconclusive.",
        entries: [
          {
            label: "3 October 2026 · PDF pp. 68–69",
            title: "PCR outcome recorded with conflicting sample identities",
            text: "The weekly summary identifies 1AA and 2AA as negative and 1AB, 2AB, 3AA, and 3AB as positive. The detailed entry instead names 1aa and 2aa, then duplicates ‘1aa and 1aa’ in its explanation. The record therefore supports that colony PCR was performed, but its positive-colony assignments need checking against the gel and original sample sheet before being used to identify a construct."
          },
          {
            label: "7–8 October 2026 · PDF pp. 69–70",
            title: "Restreaking and repeat colony PCR",
            text: "The team restreaked colonies, prepared another PCR screen, and recorded four gels covering samples labelled 1aa–af and 2aa–af. The result was described as mild banding, with some positive and some negative samples. The entry does not provide a reconciled lane-by-lane identity list."
          },
          {
            label: "10 October 2026 · PDF pp. 70–71",
            title: "Preparing selected cultures for induction",
            text: "The induction entry names 1AB, 2AE, and 3BE, with two-hour OD600 readings of 0.700, 0.492, and 0.717, respectively. It describes splitting samples between IPTG and milk conditions, although the wording about which flasks received IPTG is ambiguous. These readings document culture density; they do not establish protein yield or equivalence between the induction conditions."
          },
          {
            label: "11–15 October 2026 · PDF pp. 71–72",
            title: "Recovering protein and preparing characterization assays",
            text: "The notebook records protein extraction, BCA testing, and calculations and preparation for SDS-PAGE and TLC. The 13 October notes describe increasing protein-assay estimates and include a well planner. Labels alternate between BCA and BSA in the source; BSA is the listed calibration standard, and the assay record requires reconciliation before quantitative comparisons are finalized."
          },
          {
            label: "17 October 2026 · PDF p. 72",
            title: "SDS-PAGE and TLC required another attempt",
            text: "No bands were recorded in the SDS-PAGE run. The team considered sample loading and running-buffer temperature as possible contributors. A TLC practice run was also inconclusive; the notebook discusses gypsum deposits and insufficient plate drying as possible explanations. These are recorded troubleshooting ideas, with no confirmed cause assigned."
          },
          {
            label: "19 October 2026 · PDF pp. 72–73",
            title: "Visible protein bands; functional testing still unresolved",
            text: "The repeated SDS-PAGE run produced visible bands, using a stained ladder and Odyssey CLx imaging after changes in handling and running conditions. The notebook does not supply a verified target-band assignment, purity measurement, or evidence of catalytic activity. TLC remained inconclusive after exploring acetic acid and UV visualization because the usual visualization reagent was unavailable. The next interpretation requires verified sample identities and a functional assay capable of distinguishing substrate from product; this record establishes neither LCA conversion nor an improvement over wild-type BtSULT."
          }
        ]
      }
    ]
  };
})(typeof window === "undefined" ? globalThis : window);
