<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/circularcut-lockup-dark.svg">
    <img src="assets/circularcut-lockup.svg" alt="CircularCut" width="420">
  </picture>
</p>

# EarthSync — CircularCut

Team repo for [Climate Hack-tion](https://hackjunction.app/hackathons/climate-hack-tion) — Build for 2035, 2–4 October 2026.

CircularCut helps small makers turn existing rectangular offcuts into inputs for
their next order. It connects material discovery, a cutting plan, buyer approval,
and a record of completed reuse.

**GitHub Pages preview:** https://climate-hacktion-2026.github.io/circularcut/ — static landing and About pages.
**Interactive demo:** https://offcut-to-order-circularcut-demo.earthsync-circularcut-demo.workers.dev/app — Cloudflare Workers + D1; anonymous cookie-based workspaces contain demo data that visitors can change.

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

## COP31 alignment

- **Primary:** Green Industrialization
- **Secondary:** Zero Waste & Methane Reduction, through waste prevention and
  keeping useful material in use

## Team

| Name | GitHub | Role |
|---|---|---|
| Kai | [@KaiCryan](https://github.com/KaiCryan) | Product design & prototype development |
| Shah | [@shahnoormostafa-coder](https://github.com/shahnoormostafa-coder) | Prototype engineering & video narration |
| Jaycee | [@jayceemaimia-debug](https://github.com/jayceemaimia-debug) | Project description & prototype ideation |
| Tasfia | [@tasfiadija1](https://github.com/tasfiadija1) | Punchline & prototype support |
| Shelly | [@ui-ue](https://github.com/ui-ue) | Presentation design & prototype ideation |

## The problem

A small furniture or joinery workshop may have a new order while clean, usable
plywood sits in another workshop. The practical barrier is whether that offcut can
meet the order's material, thickness, dimensions, and cutting requirements.

Finding surplus stock is only the first step. A few millimetres lost to the saw
blade can make a promising piece unsuitable. Without a clear fit check and
collection details, a maker may choose new material instead.

## Our solution

The seller lists dimensions, material, thickness, condition and defect notes,
pickup details, and what would otherwise happen to the offcut. The buyer enters
required pieces, quantities, and minimum acceptable dimensions.

CircularCut then:

- checks available stock against the order;
- accounts for blade width, edge trim, and permitted rotation;
- searches for a feasible layout, including small size adjustments within the
  buyer's stated limits;
- shows final dimensions, cutting steps, utilisation, and remaining material;
- requires the buyer to approve final dimensions before reservation; and
- tracks reservation, collection, and completed reuse as separate milestones.

Our creative approach is to connect a maker's acceptable design flexibility with
the material already available. A small approved change can make an offcut usable
for an order.

## The demonstration

The sample order requests two 400 × 400 mm panels from an 800 × 450 mm offcut,
with a 3 mm blade allowance. The side-by-side arrangement needs
400 + 3 + 400 = 803 mm, exceeding the offcut's width.

The buyer allows widths down to 390 mm. CircularCut finds a layout with two
398 × 400 mm panels: 398 + 3 + 398 = 799 mm. The buyer reviews and approves the
dimensions before reserving.

In the sample completion flow, recording only one finished panel adds 0.159 m² of
reused material. Reserving or collecting the offcut alone adds no completed reuse.
All sample stock and outcomes are clearly labelled demonstration data.

## How we built and validated it

We built an interactive web prototype with an editable order workbench, offcut
library, visual cutting plans, reservation and pickup workflow, reuse ledger,
pilot feedback log, and impact/evidence view.

The cutting engine uses deterministic geometry calculations. It searches practical
rectangular layouts and checks boundaries, blade clearance, permitted dimensions,
material compatibility, and area accounting. It returns validated layouts when
found; it does not guarantee the globally optimal solution.

Software tests cover exact-fit failure, permitted adjustments, blade and edge
allowances, rotation, incompatible stock, and material accounting. Workflow checks
cover approval, reservation, collection, and partial completion.

The prototype includes seller-reported alternative destinations and feedback
records with source labels. A physical maker trial has not yet been completed.
Makers must inspect dimensions, condition, grain, and machine setup before using a
plan.

### Tech stack

Next.js and React with inline SVG cut diagrams, shadcn/ui and Radix UI primitives,
Drizzle ORM over Cloudflare D1, and a custom Timber Yard / Organic design system in
`app/globals.css`. See [`docs/DISCLOSURES.md`](docs/DISCLOSURES.md) for the full
dependency list.

## Impact and route to adoption

CircularCut supports circular production by making existing material easier to use
in a real order, potentially reducing new-material purchases and waste. Its scope
is clean rectangular offcuts for non-structural panel uses.

Our proposed pilot will involve five local workshops and twenty real orders. We
will catalogue measured offcuts, record their alternative destinations, compare
matching time with usual procurement, and have makers review cutting plans. We
will track approvals, successful collections, completed pieces, reused area,
weighed mass where available, and whether a planned new-material purchase was
replaced. Failed matches and pickup difficulties will guide improvements.

Reuse outcomes and disposal baselines are self-reported. Landfill diversion,
carbon savings, and methane reductions would require further evidence; we do not
claim those as measured results.

**Our vision:** one workshop's leftover becomes another workshop's next useful
product.

## AI declaration

ChatGPT/OpenAI assisted prototype development and submission preparation. Claude
assisted an alternative team prototype and design work. Gemini generated
illustrative animation. The video narration was recorded by a team member.

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
