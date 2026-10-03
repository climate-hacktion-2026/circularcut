# EarthSync — Offcut-to-Order

Team repo for [Climate Hack-tion](https://hackjunction.app/hackathons/climate-hack-tion) — Build for 2035, 2–4 October 2026.

A marketplace that matches one workshop's leftover timber offcuts to another
workshop's next cutting job, with a real kerf-aware cut-plan calculator — not just
a listing board.

**🔗 [Live demo](https://climate-hacktion-2026.github.io/offcut-to-order/)** — served
from the `feat/offcut-to-order-prototype` branch until [PR #1](https://github.com/climate-hacktion-2026/offcut-to-order/pull/1)
is reviewed and merged into `main`.

## Event basics

| | |
|---|---|
| Theme | Build for 2035 — turn a COP31 priority into a practical, testable solution |
| Format | Fully online — Junction (hub), Discord (community), Webex (closing) |
| Dates | Opens 9:00am Fri 2 Oct → Submissions close 9:00pm Sun 4 Oct (AEST/AEDT) |
| Team nationality | Australia |
| Repo visibility | Public, must stay live until winners are announced |

Links: [Event hub](https://hackjunction.app/hackathons/climate-hack-tion) ·
[Discord](https://discord.gg/Rm4wUd89s) ·
[Participant guide](https://hackjunction.app/participate/52/guide)

## COP31 priority

- [x] Green Industrialization
- [x] Zero Waste & Methane Reduction
- [ ] Electrification
- [ ] Resilient Cities & Buildings
- [ ] Awareness Across All Areas

## Team

| Name | GitHub | Role |
|---|---|---|
| Kai | [@KaiCryan](https://github.com/KaiCryan) | |
| Shah Noor Mostafa | [@shahnoormostafa-coder](https://github.com/shahnoormostafa-coder) | |
| | | |

Teams need **3–5 members** — this roster needs at least one more person before registration.

## Project

- **Problem & target users:** Small workshops often have usable timber offcuts
  while a nearby workshop is about to buy new material for a similar job. There's
  no easy way for either side to find the other, or to know in advance whether a
  given offcut will actually fit a job's panel list.
- **Solution & intended impact:** A marketplace where sellers list offcuts
  (species, dimensions, thickness, condition) and buyers describe the panels they
  need. A guillotine cut-planner checks the panels against an offcut with the saw
  kerf and rotation accounted for, tries the buyer's exact ask first and a
  flex-adjusted version if that fails, then lets the buyer reserve the material.
  Impact is tracked as area/weight actually diverted from new stock, with an
  explicitly-labelled scenario CO₂e estimate (editable assumptions, not a measured
  figure) rather than an overclaimed number.
- **Tech stack:** Static HTML/CSS/JS (no build step), inline SVG for the cut
  diagrams, deployed as a Claude Artifact for the live demo; this repo holds the
  source.

## Judging criteria (for reference while building)

| Criterion | Weight |
|---|---|
| COP31 alignment | 30% |
| Build quality | 30% |
| Creativity | 20% |
| Presentation clarity | 20% |

## Repo conventions

- See [CONTRIBUTING.md](CONTRIBUTING.md) for workflow/branching.
- See [docs/DISCLOSURES.md](docs/DISCLOSURES.md) — log every outside tool, library,
  dataset, API, and AI tool used, as required by the submission rules.
- See [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md) for what the final
  Junction submission needs.

## License

MIT — see [LICENSE](LICENSE).
