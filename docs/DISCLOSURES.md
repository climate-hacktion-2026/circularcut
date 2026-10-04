# Disclosures

Required by the submission rules: list every outside tool, template, open-source
library, dataset, API, and AI tool used — including anything paid for. Keep this
updated as you go, not reconstructed at the end.

**As of 4 Oct 2026** the submission is the CircularCut app (Next.js/React/Cloudflare D1),
restyled to the "Timber Yard / Organic" design system — not the earlier static
HTML/CSS/JS prototype on the `old-prototype` branch. The table below reflects the
current submission's real stack; update again if anything changes before close.

## Outside libraries / frameworks

| Name | License | Used for |
|---|---|---|
| Next.js, React, React DOM | MIT | App framework / UI runtime |
| Tailwind CSS v4, tw-animate-css | MIT | Utility CSS layer underneath the custom design-token stylesheet |
| shadcn/ui component source, Radix UI (`radix-ui`), `class-variance-authority`, `tailwind-merge`, `clsx` | MIT | Accessible UI primitives (dialog, select, tabs, table, checkbox, switch, etc.) |
| lucide-react | ISC | Icon set used alongside the custom `icons.svg` sprite |
| Drizzle ORM, `drizzle-kit` | Apache-2.0 / MIT | Database schema + migrations |
| Cloudflare Wrangler, Cloudflare D1 | Apache-2.0 / Cloudflare ToS | Local/production SQLite-compatible database and dev server |
| Vite, `vinext` (Next-on-Vite build tooling) | MIT | Build pipeline |
| `sonner` | MIT | Toast notifications |
| `react-hook-form`, `zod`, `@hookform/resolvers` | MIT | Form state and validation (where used by shadcn primitives) |
| `date-fns`, `react-day-picker`, `embla-carousel-react`, `recharts`, `vaul`, `cmdk`, `input-otp`, `react-resizable-panels`, `next-themes`, `@base-ui/react` | MIT | Transitive dependencies of the shadcn/ui component set (not all individually used on-screen) |

## Datasets / APIs

| Name | Source | Used for |
|---|---|---|
| — | | None — all listings, prices, distances and feedback in the demo are fictional sample data |

## AI declaration

The team has agreed on the following statement as its authoritative AI
declaration:

> ChatGPT/OpenAI assisted prototype development and submission preparation.
> Claude assisted an alternative team prototype and design work. Gemini generated
> illustrative animation. The video narration was recorded by a team member.

## Other assets / templates

| Item | Source | License |
|---|---|---|
| Anton, Oswald, Public Sans, IBM Plex Mono | Google Fonts, loaded via `next/font/google` | Open Font License |
| CircularCut logo (`assets/offcut-*.svg`, `public/logo/`) | AI-generated via Claude Design, 3 Oct 2026 | Original work, team-owned |
| `shadcn-tailwind-4.13.0.css` (`source/vendor/`) | shadcn/ui generated theme layer | MIT, see `vendor/shadcn-tailwind-4.13.0.LICENSE.md` |
| About page team photos (`public/team/kai.jpg`, `shah.jpg`, `jaycee.jpg`) | Team members' own photos | Original, team-owned |
| About page placeholder photo (`public/team/shelly.jpg`) | "Laughing Kookaburra - male.jpg" by Peter Firminger, via Wikimedia Commons, cropped | CC BY 2.0 |
| About page placeholder photo (`public/team/tasfia.png`) | Team-supplied replacement image | Source and licence to be confirmed by the team |

## Note

The original EarthSync logo from the first scaffold repo (designed before kickoff)
is intentionally **not** used here. The current logo above was generated fresh
during the event window, so it carries no pre-event timing issue.
