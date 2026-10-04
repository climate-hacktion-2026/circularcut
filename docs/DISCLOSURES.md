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

## AI tools

| Tool | Used for |
|---|---|
| Claude (Claude Code) | Restyled the CircularCut app (globals.css, shell/nav layout, component markup) to the Timber Yard/Organic design system; cut-diagram recolouring; this disclosures update |
| Claude (claude.ai Design) | Earlier visual-design wireframe exploration and the Offcut-to-Order logo/mark, generated during the event window |
| OpenAI ChatGPT app-building platform ("site creator" / Vinext starter) | Shah's original CircularCut build: project scaffold, cutting-plan engine, exchange/reservation backend, ChatGPT sign-in integration (`app/chatgpt-auth.ts`), Cloudflare D1 hosting config (`.openai/hosting.json`) |

**Needs confirming with Shah before submission:** the exact OpenAI product/tool name and how much of the original app logic (vs. scaffold) was AI-generated through it, so this line is precise rather than inferred from the repo's config files.

## Other assets / templates

| Item | Source | License |
|---|---|---|
| Anton, Oswald, Public Sans, IBM Plex Mono | Google Fonts, loaded via `next/font/google` | Open Font License |
| Offcut-to-Order logo (`assets/offcut-*.svg`, `public/logo/`) | AI-generated via Claude Design, 3 Oct 2026 | Original work, team-owned |
| `shadcn-tailwind-4.13.0.css` (`source/vendor/`) | shadcn/ui generated theme layer | MIT, see `vendor/shadcn-tailwind-4.13.0.LICENSE.md` |

## Note

The original EarthSync logo from the first scaffold repo (designed before kickoff)
is intentionally **not** used here. The current logo above was generated fresh
during the event window, so it carries no pre-event timing issue.
