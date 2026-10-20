# iGEM release readiness — 20 October 2026

**Status: technically prepared for manual transfer; not yet ready to certify as a complete competition submission.** The site intentionally contains Lorem Ipsum, unfinished HP/education records and unconfirmed research. These are team-content issues, not something a build script can honestly mark complete.

## Sources and verification limits

- The [2026 template README on iGEM GitLab](https://gitlab.igem.org/2026/sses) specifies source-code storage in the official repository, media/font uploads through iGEM, iGEM-hosted runtime resources, Video Universe for video, and CC BY 4.0 licensing.
- The [2026 Special Awards criteria](https://competition.igem.org/judging/special-prizes) specify standard routes such as `/model`, `/education` and `/human-practices`; judges assess documented evidence and citation quality.
- The [2026 deliverables overview](https://competition.igem.org/deliverables/) lists Wiki and Attributions Form deadlines on 21 October and directs teams to the Deliverables Dashboard. Confirm the exact time and submission status there.
- [Rules and Policies](https://competition.igem.org/about/rules-and-policies) covers attribution, responsible AI and communication requirements.
- The [Wiki dashboard](https://teams.igem.org/go/deliverables/wiki), [Wiki requirements](https://competition.igem.org/deliverables/team-wiki), [Attributions guidance](https://competition.igem.org/deliverables/project-attribution), and [standard-page guidance](https://competition.igem.org/judging/pages-for-awards) could not be fully read through the available public text interface. **Their complete current requirements remain a team-dashboard verification item.** Do not assume an older season's attributions iframe requirement still applies. The export accepts a current public attributions link and an optional embed URL only if provided by the dashboard.
- CI follows [GitLab's static Pages workflow](https://docs.gitlab.com/user/project/pages/getting_started/pages_from_scratch/). The destination iGEM runner configuration and live routing still need verification after the manual move.

## Implemented

| Area | Local result |
| --- | --- |
| Manual transfer | Source ZIP command includes source, assets, build scripts, tests and CI; excludes `.git`, temporary reviews and local debug output. |
| Static build | Dependency-free export to `public/`, usable under a configured team prefix. No backend or external runtime libraries. |
| Judging routes | Exported `/description/`, `/engineering/`, `/model/`, `/education/`, `/human-practices/`; engineering serves the full record. |
| Licensing | CC BY 4.0 notice replaces “All rights reserved”; exported pages retain a static license/source footer. Third-party rights still require review. |
| Media | Referenced-media inventory with hashes; production URL map for iGEM uploads, including dynamically rendered navigation/figures. |
| Format portability | Export detects WebP files supplied with `.png` names and uses correct extensions without changing source pixels; fixed Ella's case-sensitive headshot path for Linux. |
| Draft protection | Release stops for missing configuration, unmapped media, draft copy, missing contribution page, external embeds and unfinished review declarations. |
| Accurate writeups | Originals, page references, reviewed transcript hashes, escaped verbatim HTML and source downloads. |
| Model document | Supplied PDF transcribed in source order, with ten original figures, nine tables, 17 references, and the four user-approved β repairs. See [source notes](model-source.md); team scientific review remains pending. |
| Accessibility | Existing keyboard navigation, reduced-motion behavior and image descriptions retained; new illustration has a descriptive accessible label. |

## Team work remaining

1. **Actual content:** replace the intentional Lorem Ipsum and placeholder HP, education, experiment and other records with approved writeups. Add the real contribution record at `contribution.html`, or adjust the builder after verifying the applicable current criterion. Do not invent results to fill a route.
2. **Scientific consistency:** the homepage currently uses the supplied “Over 60 million” and “we have created … able to bind” wording; the project/wetlab record still describes unconfirmed results. Supply the evidence/citations or an author-approved correction. This pass does not silently rewrite those paragraphs.
3. **Media hosting:** upload the 47 currently referenced media files listed in `build/wiki-audit.json` and record their actual URLs. Counts change when content changes. The local preview is not proof of compliant hosting. Videos must use iGEM Video Universe; adding local video files requires extending the build handling.
4. **Official identity and attribution:** at transfer time fill the official team slug/repository and public attributions URL. Complete and submit the current official form through the dashboard; verify the current display instructions. A generated page cannot submit the form.
5. **Credits and rights:** identify authors/sources/licenses of supplied drawings, icons, logos, photos and any borrowed material. Put required credits next to the material or in a visible credits section. Do not assume “user supplied” means “team created.” Confirm photo permissions.
6. **AI disclosure:** the footer records known Codex assistance with code/layout/animations/tests and transcription of the supplied Model writeup. Complete the model/tool identities, purposes, actual human review and any additional AI-assisted content used by the team. Do not claim a review happened before it did.
7. **Selected awards and external deliverables:** check current medal/award URLs against the team's judging selections. Add any required award pages with real evidence; verify Registry records, judging form, safety submissions and videos in their respective systems.
8. **Live verification after moving:** run the official external-content check, verify slashless standard URLs, all links/media/PDFs, mobile layouts, keyboard use, reduced motion and both rocket transitions in a browser. No live deployment or browser visual review was performed in this pass.

Only set `config/igem.json` review fields to `true` after completing the named review. These declarations do not replace evidence or iGEM's checks. The static scanner catches known resource patterns, not every possible future dynamic network request.
