# Handoff: CircularCut — "Timber Yard / Organic" design language

## Overview
CircularCut is a B2B web marketplace that matches one workshop's leftover timber offcuts to another workshop's next cutting job. It was built for a climate hackathon (Green Industrialization; Zero Waste & Methane Reduction). This package carries the visual language, so new pages built in Claude Code look and feel identical to the prototype.

## About the design files
`reference/CircularCut Organic.dc.html` is a **design reference built in HTML**: a prototype of the intended look, not production code. Open it in a browser (keep `support.js` next to it).

Recreate the designs in the target codebase's stack, e.g. React/Next, Vue or Svelte. If there is no stack yet, choose one; Next.js + plain CSS is suggested. Use **`offcut.css`** as the real stylesheet: its tokens and classes were extracted 1:1 from the prototype.

## Fidelity
**High-fidelity.** Colours, type, radii, shadows, tilt angles and component treatments are final; recreate them exactly. Copy in the prototype is realistic sample data.

## Files in this package
- `CLAUDE.md`: the binding design rules. Copy it to the repo root so Claude Code reads it on every task.
- `offcut.css`: design tokens plus the component layer (shell, buttons, cards, fields, tags, stamps, hanging tags, diagrams, blobs, hero).
- `icons.svg`: the tool-glyph icon sprite (square, planks, clipboard, saw blade, tape measure, search).
- `wave-edge.js`: generator for the wavy hero edge (`clip-path`).
- `reference/CircularCut Organic.dc.html` + `support.js`: the 5-screen prototype (frames 1a–1e).
- `logo/`: "seed blade" brand mark (full colour, single colour, tile/favicon, horizontal lockup) as SVG. Rules are in CLAUDE.md §Logo; the visual sheet is `screenshots/06-logo-sheet.png`.
- `screenshots/00-landing.png`, `07-about-contact.png`: public pages.
- `screenshots/01-overview.png` … `05-impact.png`: full-length 1440px captures of each screen, for visual comparison. Dashed green sticky notes in the captures are design annotations; don't ship them.

## Landing page (`reference/CircularCut Landing.dc.html`, `screenshots/00-landing.png`)
The public marketing page is fluid (max content width 1320px, side padding 64px) and has no sidebar. It has four sections only; keep it that simple.
1. **Hero:** lime band with a wavy bottom edge and three translucent blobs.
   - Top nav: logo + wordmark, 3 text links, and a dark "List an offcut" button.
   - Two-column grid (`auto-fit, minmax(520px,1fr)`, gap 88px).
   - Left column, in order: a pill rubber-stamp eyebrow; the H1 "Your offcut is someone's next job." in Anton (`clamp(64px,8.4vw,128px)`, line-height .88, text-wrap balance); a 480px-max lede at line-height 1.55; two 56px CTAs (dark + secondary); a mono reassurance line.
   - Right column: the product visual. A tilted `.hang` tag (−5°) pinned above a result card (+1.2°) that holds a cut diagram and the FITS stamp.
2. **Proof row:** three big mono numbers with Oswald labels. No cards.
3. **How it works:** eyebrow, a 64px Anton H2, and 3 tilted step cards (outlined lime Anton numerals, body 17px at line-height 1.65, max 320px).
4. **Closing CTA:** dark band with a wavy top edge, a 96px Anton H2, one line, one lime button, and a dashed-rule footer line carrying the honesty notes. A faint lime blade watermark sits bottom-right.

**Whitespace rule:** give the space to what carries meaning. That means the headline/lede/CTA stack, the gutter between hero text and visual, the diagram card's padding, and step-card copy. Keep nav, proof row and footer tight.

## About & contact page (`reference/CircularCut About.dc.html`, `screenshots/07-about-contact.png`)
This page uses the same shell as the landing page: lime hero with wavy edge, then content, then a dark footer band.
1. **Hero:** stamp eyebrow, H1 "The people behind the offcuts.", lede, and two CTAs (Contact us → #contact, Leave feedback → #feedback). On the right, a tilted hanging tag shows the competition, its two category tags, and the university.
2. **Team:** a grid of `.hang` cards (`auto-fit, minmax(228px,1fr)`). Each card has a photo in an organic blob mask, name (Anton 28), role (Oswald, `--a7`), degree · university (mono), a one-line contribution, a dashed rule, and pill links (LinkedIn ↗ / GitHub ↗ / Email ↗). Tilts alternate.
3. **Contact:** one strong card (uneven radius, 2px ink border, 5px offset shadow). It holds a big mono mailto link and secondary buttons for the GitHub repo, LinkedIn and the pitch deck.
4. **Feedback:** two columns. The left (sticky) holds the heading and a lede. The right is a form card:
   - role pill toggles (Judge / Workshop owner / Maker / Other)
   - a 1–5 usefulness rating as blob-shaped buttons; the selected one is lime with an offset shadow
   - a textarea and an optional email field
   - a "Send feedback" button that swaps the form for a green "Thanks!" rubber stamp with a "Send another" link
5. **Footer band:** brand mark and the honesty line.

**Placeholders to replace:** `[Competition name]`, `[University]`, `[City]`, team names, roles, bios, profile URLs, the email address and the pitch-deck link. Team photos are drop-in slots in the prototype; in production use 1:1 images in the same blob masks. Feedback needs a real backend, e.g. a form service or an API route.

## Screens (in the reference)
All five screens are 1440px wide and share a 240px sidebar.
1. **Overview (1a).** Content, top to bottom:
   - Lime hero band with wavy edge. It holds the 128px Anton title, a 21px lede, Dark + Secondary buttons, and a tilted pill badge naming the hackathon categories.
   - 4-stat row. The CO₂e stat is dashed and stamped "Scenario est.".
   - Before/after card: two cut diagrams, each with a circular stamp (No fit / Fits).
   - 3 tilted "How it works" cards (List → Match & Adjust → Reserve).
2. **Marketplace (1b).** Contents:
   - Page header.
   - Pill search bar plus primary "+ List an offcut".
   - Results meta line.
   - 3-column grid of `.hang` tags. Each tag shows species in Anton 28, seller · suburb, a status chip, a dashed rule, W×H in Plex Mono 38, thickness and weight, condition and landfill tags, and an action.
   - The action button depends on status: Reserve (primary), "Reserved elsewhere" (disabled), View record (ghost).
3. **List an offcut (1c).** Two columns:
   - Left: a form card (max 760px) with numbered dashed section rules: 01 Seller, 02 The offcut, 03 Notes.
     - The species field autocompletes; its dropdown has a 4px offset shadow.
     - Width, height, thickness and density sit in a 4-column row. Density is auto-filled (dashed border).
     - Below the measurements: a live weight/area line, the condition select, and the landfill checkbox in a dashed callout.
     - Publish + Save draft buttons.
   - Right: a live `.hang` preview.
4. **Plan a cut (1d).** Two columns:
   - Left (480px):
     - Inputs: source select, kerf input, rotation checkbox.
     - An editable panels table with a dark header row, mono cells and a "+ Add panel" row.
   - Right: stacked result cards.
     - Fit: `.card--strong` with green stamp, diagram, legend, a yield line, and Reserve + Message seller buttons.
     - No fit: `.card--muted` with red stamp, the overflow panel dashed in red, an explanation, and a disabled Reserve button.
5. **Impact (1e).** Contents:
   - Header and 4-stat row.
   - Two-column row, 2fr / 1fr:
     - Estimate card (dashed). It shows the "Scenario estimate" stamp, a big mono figure (88px), the formula, two unit inputs, and a citation field with an "Uncited" stamp.
     - Dark tilted callout: "No methane figure claimed".
   - Reservations table: Oswald header with a 2px ink rule, mono rows with dashed rules, and pill status stamps.

## Interactions & behaviour
- **Buttons:** hover is `brightness(1.07)`. Active is `translateY(4px)`, shadow removed, 60ms transition.
- **Nav:** hover tints the item with 10% of the ground colour. The active item is lime, rotated −1.2°, with a 3px dark shadow.
- **Plan a cut** recalculates on every edit; there is no run button. Reserve stays disabled until a valid fit exists.
- **Marketplace** filters as you type. Status updates live, and Reserve disables when a piece is held elsewhere.
- **List an offcut:**
  - Picking a species pre-fills its density (field shown dashed, still editable).
  - Publish is disabled until species and W/H/T are valid.
  - The preview tag updates live.
- **Impact:** the estimate recalculates when either assumption changes. It stays stamped "Uncited" until a source is entered.
- **Focus:** `:focus-visible` shows a 2px `--a7` outline, offset 3px. Focused inputs get a 2px ink border and a 3px lime offset shadow.

## Design tokens
All tokens live in `offcut.css :root`:
- **Colours:**
  - bg #EDF1E8, surface #FFFFFF, text #1E2E24
  - accent #D4E57C, a7 #3E6B2E, ok #3F7A3A, bad #B4472F
  - border #D3DCCC, muted #56645A, hatch #9DB096, note #EEF5D0, shadow-deep #0F1A13
- **Type:**
  - Anton (display), Oswald (labels), Public Sans (body), IBM Plex Mono (data), loaded from Google Fonts.
  - Scale: 128 / 64 / 36 / 30 / 40 stat / 38 dim / 16 / 14 / 13 / 12 / 11.
- **Radius:** pill 999, card 24, inner 14, tag `30 22 26 22`, blob card `44 26 52 30`. Diagram rectangles have none.
- **Shadows** are hard offsets only, never blurred:
  - card `0 3px 0 var(--border)`
  - strong card or button `0 4px 0 var(--text)`
  - dark button `0 4px 0 #0F1A13`
  - dark callout `0 4px 0 var(--accent)`
- **Spacing:** 4px base, 4–56px. Sidebar 240, page padding 40, card padding 24/32, gaps 20/32.

## Diagram construction
- Draw dimensions at 0.30–0.36 px per mm.
- Lay out a grid: 22px dimension track + board, 8px gap.
- **Horizontal dimension:** 1.5px end ticks (left/right borders), a 9×10 CSS-triangle arrowhead at each end, and 1.5px lines with a mono 12px label in the middle.
- **Vertical dimension:** the same, rotated, with the label in `writing-mode:vertical-rl`.
- **Board:** 2px ink border filled with a 45°/−45° crosshatch (waste). Panels are white, 1.5px ink border, with an Oswald name and mono size.
- **Kerf:** at the cut x position, a 2px dashed lime line with 2px lime stitch ticks every 12px.
- **Legend:** Panel / Waste / Kerf 3 mm, mono 11px.

## Assets
There are no raster assets; the icons are in `icons.svg`. If you add photos, place them in a 24px-radius container. Don't wash them out with filters.
