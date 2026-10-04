# CircularCut · EarthSync

An interactive hackathon prototype that helps small workshops find a usable rectangular offcut for their next order, approve a feasible cutting plan, and record what was actually reused.

![CircularCut workbench](docs/circularcut-opening-1790949059689.jpg)

## The problem and audience

A small maker may be willing to use reclaimed material but cannot quickly establish whether another workshop's stock meets an order's material, thickness, dimensions and cutting constraints. CircularCut connects the order to a concrete cutting plan and a record of completion.

Primary challenge alignment: **Green Industrialization**. Secondary alignment: **Zero Waste & Methane Reduction**, through keeping useful material in use. This prototype does not quantify methane or emissions reductions.

## The 90-second demonstration

1. Open **Workbench** with the sample order: two 400 × 400 mm display panels, 18 mm birch plywood, 3 mm blade allowance.
2. Turn **Allow a small size adjustment** off. The 800 mm offcut fails: 400 + 3 + 400 = 803 mm. Larger exact-fit stock remains available.
3. Turn adjustment on. Inside the buyer's approved 390–400 mm width range, two **398 × 400 mm** panels fit. The diagram shows 88.4% panel utilisation, blade loss and remaining material. Step through the cuts.
4. Choose **Review & reserve**, inspect the final dimensions and approve them. The saved record opens in **Reuse ledger**.
5. Mark it collected, then record the pieces actually made. Select only one panel to demonstrate that the impact view records **0.1592 m²**, rounded to 0.159 m² on screen, rather than the planned 0.3184 m². Leave unmeasured weight blank.
6. Open **Impact & evidence**. Sample outcomes are explicitly separated from user-entered outcomes. Reset the sample workshop before the next demo.

## What works

- Editable orders with multiple part types, quantities, buyer-approved minimum sizes, blade allowance, edge trim and optional rotation.
- Matching by material, thickness, condition, availability and geometric feasibility. Matches are ordered by the listed material price, rather than an unsupported total-cost estimate.
- Scaled SVG cutting diagrams, cut sequences, piece dimensions, remaining rectangles and material accounting.
- Server-recomputed plans and explicit approval before reservation, including a guard against simultaneous reservations.
- Persistent personal workspaces and code-based shared exchanges, with common offcut inventory and reservation → collection → actual reuse records in Cloudflare D1.
- Seller-controlled defect notes, pickup availability/location/contact, alternative destination and supporting explanation; reservation snapshots preserve that baseline.
- Buyer/seller pickup conversations and recipient-specific in-app reservation updates.
- Maker interview questions and a feedback log separating synthetic examples, actual interviews and physical trials.
- Partial-completion reporting, optional measured mass and a maker-reported new-purchase counterfactual.
- Searchable inventory, an add-offcut form, CSV ledger export and printable cutting/outcome records.

## Evidence and honest limits

All initial workshops, offcuts, prices and distances are **fictional demonstration data**. Reservations generate an in-app update for the seller. Buyer and seller can coordinate pickup in their reservation conversation; payment, transport and physical collection remain manual. No email or text message is sent. User-entered stock and completion outcomes are self-reported. Panel area is a geometric calculation. The impact view separately reports completed reused area with a recorded seller-reported landfill baseline; that baseline is not independently verified and is not proof of avoided emissions. Existing reservation snapshots without a baseline remain unknown. Estimated pickup distances are listing inputs, not live routes or personalised distances.

The deterministic engine searches six guillotine layouts and shared whole-millimetre reductions of up to 20 mm per dimension. It returns a validated plan when found. It does not guarantee the global optimum, and failure to find a plan is not proof that no possible layout exists. It supports one rectangular offcut per order and non-structural panel uses. Condition, dimensions, grain and machine setup need physical inspection before cutting.

Design context includes existing business resource exchanges ([CSIRO ASPIRE](https://www.csiro.au/en/research/technology-space/ai/aspire)), practical [panel cutting constraints](https://cutoptim.com/docs/2d-panel-cutting), and prior [zero-waste furniture design research](https://arxiv.org/abs/1604.00047). CircularCut combines established ideas into a focused order-to-offcut workflow; no world-first claim is made.

OpenAI assisted the hackathon build. The app does not call a live AI API. It conditionally registers inspect-workshop and stage-order WebMCP tools in browsers supporting `document.modelContext`; staging never reserves material. The current QA browser did not expose these tools, so that optional integration has not been verified there.

## Proposed real-world pilot

Recruit five local workshops and try twenty real orders. Establish the usual procurement baseline; catalogue clean, measured stock and its likely alternative use/disposal; review proposed layouts with a maker; measure matching time, approval, collection, completed pieces and reused mass. Ask whether a new purchase was replaced. Follow up on failed matches and pickup friction. This pilot is proposed, not completed research.

## Development

Node.js 24 supports the TypeScript engine tests directly. Install from the existing lockfile with `npm ci`. Source is in `app/`, `lib/` and `db/`. The app uses Vinext/React, the provided Shadcn components, Cloudflare Workers and D1.

```bash
npm run dev
./node_modules/.bin/tsc --noEmit
node tests/cutting.test.mjs
CC_TEST_IN_PROCESS=1 node tests/workflow-smoke.mjs
node tests/exchange-smoke.mjs
```

The API checks run the real route code and SQL in an isolated SQLite database when using the commands above. They simulate independent anonymous users and make no real reservations. Without `CC_TEST_IN_PROCESS=1`, the original workflow smoke test targets a locally accessible preview on `127.0.0.1:4173`. The test harness does not replace browser QA of the actual Worker/D1 binding. Start the managed preview with `sites-preview start "$PWD"`; its browser URL is `http://terminal.local:4173/`. Use the Sites build, source-save and publication workflow for deployment.

For a fresh local D1 database, build first, then apply pending schema migrations in order:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_amazing_juggernaut.sql
```

Do not replay an already-applied migration. Production migrations are applied separately by Sites. No runtime table creation or migration seed dataset is used. Platform sign-in identifies each hosted owner's workshop; anonymous preview use receives a random HttpOnly workspace cookie. Personal workspaces stay separate. A user can create a shared exchange and give its code to other people who already have site access. Joining shares that exchange’s inventory and ledger; pickup conversations are restricted to the reservation’s buyer and seller. Codes do not grant access to the site itself. The current site audience is preserved.

## Verification

Ten cutting-engine cases cover exact-fit failure, the 398 mm adaptation, permitted bounds, blade and edge allowances, rotation, incompatible/reserved stock, mixed quantities and material reconciliation. Browser QA covers the approval flow, saved reservation, collection, partial completion, impact accounting and reload persistence. The API checks cover approval and stale-plan rejection, simultaneous booking by two buyers, three-user role restrictions, private conversations, seller notifications, immutable reservation baselines, partial completion, feedback provenance, sample-reset preservation, stale-tab exchange guards and compatibility with a pre-upgrade ledger record.

## Four improvements: team walkthrough

![Updated interface with synthetic reuse and reported disposal baseline](docs/circularcut-final-1790989998346.jpg)

1. In **Exchange**, save your workshop name. Create one shared exchange with sample stock for the demonstration, or an empty exchange for a real pilot. Copy its code; each teammate joins from their own signed-in session. Their existing personal records remain in **My workshop**.
2. Expand **Seller, pickup & disposal baseline** on a matching offcut. The seller can edit these notes while it is available. A buyer’s reservation preserves the seller’s explanation; later collection alone does not count as reuse.
3. In **Reuse ledger**, open **Arrange pickup**. The buyer and seller see this conversation and receive in-app updates. Only the buyer records collection and the actual completed pieces. Refresh manually for an immediate update; the app also checks every 15 seconds while open.
4. In **Pilot feedback**, use the seven interview questions with a maker. Save synthetic examples as synthetic. An actual interview or trial requires a source reference and an explicit confirmation that it happened. No maker feedback has been collected by this build.

Migration `0001_known_gertrude_yorkes.sql` adds exchange membership, actor roles, notifications, pickup messages and feedback tables without deleting original data. Apply it after `0000_amazing_juggernaut.sql` on a fresh local database, or by itself if the original migration was already applied. Do not replay either applied migration.
