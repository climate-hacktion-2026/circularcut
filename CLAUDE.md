# CLAUDE.md — Offcut-to-Order design rules

Put this file at the repo root. It's binding for every page and component you build.

The look is called **Timber Yard / Organic**: a workshop tool with a forest-green and lime palette. It pairs industrial stencil type and precise technical drawings with soft, organic shapes. The reference prototype is `reference/Offcut-to-Order Organic.dc.html`; open it in a browser. All tokens and component classes are in `offcut.css`. Import that file and use it. Don't restyle from scratch.

## Hard rules
1. **Colours come only from `offcut.css` variables.** Never hard-code a hex value. Lime `--accent` is the ONLY accent. Use it as a fill (hero band, primary button, active nav, landfill tag, kerf line) and put `--text` ink on top. Never set lime text on a light background. For green text on light backgrounds use `--a7`. Use `--ok` and `--bad` only for fit, status and validation.
2. **Four fonts, each with one job:**
   - Anton: headings, always UPPERCASE.
   - Oswald: labels, eyebrows, nav, buttons, tags. Always UPPERCASE with letter-spacing .1–.16em.
   - Public Sans: body text, input text, names.
   - IBM Plex Mono: EVERY number, dimension, unit, date and weight, e.g. `1200 × 600 MM`, `21.9 kg`, `30 SEP 2026`.
   - No serif fonts. No Inter or Roboto. Stick to the scale in `:root` (hero 128, h1 64, h2 36, h3 30, stat 40, body 16/14, meta 13, label 12).
3. **Shape language:**
   - Anything you press or type into is a pill (`--r-pill`): buttons, inputs, search, tags, nav items, status chips.
   - Containers use soft corners: cards 24px, inner boxes 14px.
   - Hero and feature cards get uneven organic radii (`--r-tag`, `--r-blobcard`).
   - **The one exception is cut diagrams:** the board and panel rectangles stay square and crisp, because they're precise drawings.
4. **Dashed borders mean "cut line" or "provisional".** Use them for:
   - dividers
   - estimates (`.card--estimate`)
   - auto-filled fields (`.input--auto`)
   - disabled buttons
   - failed results (`.card--muted`)
   - the landfill checkbox callout
   - annotations

   Solid borders mean final or confirmed.
5. **Hand-placed tilt:** a few key elements are rotated ±0.5–3°:
   - active nav (−1.2°)
   - stamps (−10° to −14°)
   - hero badge (+3°)
   - "How it works" cards (−0.8 / +0.5 / −0.4)
   - hanging tags (alternating)
   - dark callout (+0.8°)

   Never tilt body text blocks, form cards, tables or diagrams. Most of the layout stays on the grid.
6. **Buttons have physical depth:** solid fill, 2px ink border and a 4px offset bottom shadow. On `:active` they move down 4px and lose the shadow. Variants: primary (lime), dark, secondary (white), ghost (dashed underline). Disabled buttons have a dashed outline, no fill and no shadow.
7. **Signature components (use them, don't reinvent them):**
   - `.stamp`: circular double-ring rubber stamp overlapping a card's top-right corner. It's the ONLY way to show Fits or No fit.
   - `.stamp-rect`: small pill stamp for "Scenario estimate", "Uncited" and table statuses.
   - `.hang`: hanging luggage-tag listing card with punched hole, string and alternating tilt.
   - `.diagram`: technical drawing on 12px grid paper. Arrowed dimension lines with end ticks, crosshatched waste, and a lime kerf line with stitch ticks.
   - `.hero` + `--wave-edge`: lime band with a wavy bottom edge and translucent blobs.
   - `.brand-mark`: the seed-blade logo, `logo/offcut-mark-lime.svg`, at 58px in the sidebar.
   - `.blob--page-*`: two soft blobs behind each page's main area. The parent needs `isolation:isolate`.
8. **Icons:** only use `icons.svg`, or new icons built to the same spec: 24 grid, stroke 2, square caps, miter joins, geometric tool shapes. Don't use emoji or rounded icon libraries.
9. **Layout shell is fixed:**
   - 240px dark sidebar with the seed-blade brand mark, dashed rule, 5 nav items and a dashed workshop box at the bottom.
   - Main area padding 40px, section gap 32px, card padding 24px (32px for form and feature cards), grid gap 20px.
   - Stat rows have 4 equal columns. The marketplace grid has 3 columns with a 40px row gap and 30px column gap.
   - Above 1200px wide, keep this. Below, collapse the grids to 2 and then 1 column, and turn the sidebar into a top bar. Keep the same tokens.
10. **Copy voice:** plain, workshop-practical, specific. Use real numbers, species and suburbs. Write "Otherwise landfill-bound", not "eco-friendly". Never present an estimate as a measurement, and never claim a methane figure.
11. **Contrast:** body text ≥ 4.5:1. Use `--muted` for secondary text and never go lighter. Text on lime is always `--text`.

## Marketing pages
The landing page (`reference/Offcut-to-Order Landing.dc.html`) is the model for every public page.
- No sidebar. A fluid layout with max width 1320px and 64px side padding.
- A lime hero with a wavy edge, one strong Anton headline, a lede of 480px or less, at most 2 CTAs, and one product visual (a tag plus a diagram and stamp). Never a stock photo.
- Public pages so far: Landing and About & contact. Share one nav (How it works · Marketplace · About · Sign in · List an offcut) and one dark footer band.
- People cards reuse `.hang` with a blob-masked photo. Social links are pill buttons with text and ↗, never brand-logo icons.
- Forms on public pages use pill inputs and the primary offset-shadow button. On success, swap the form for a green circular `.stamp` ("Thanks!").
- At most 4 sections. Leave generous space around the headline and anything complex; keep chrome tight. Don't add sections or stats without a reason.

## Page template
```html
<div class="app">
  <aside class="sidebar">…brand, .sidebar-rule, nav.nav > a.nav-item[aria-current=page], .sidebar-foot</aside>
  <main class="main">
    <div class="blob blob--page-tr"></div><div class="blob blob--page-bl"></div>
    <header><span class="eyebrow">Context</span><h1 class="h1">Page title</h1><p class="lede">One-sentence purpose.</p></header>
    …content in .card / grids…
  </main>
</div>
```

## Logo (`logo/`): "The seed blade"
The mark is one solid shape: a 12-tooth saw blade with hooked, seed-head teeth, a hub cut-out and a seed dot, rotated −10°. It has no strokes, rings, gradients or shadows.
- **Primary mark** (`offcut-mark.svg`): lime blade on a hand-drawn forest-green blob. The default wherever the mark stands alone, e.g. the sidebar brand spot, which replaces the old ring stamp. Use `offcut-mark-lime.svg` on dark-green surfaces.
- **Single colour** (`offcut-mark-mono.svg`, currentColor): the bare blade. `-mono-ink` for light grounds, `-mono-white` for dark ones. Use it for print and on lime.
- **Tile** (`offcut-tile.svg`, `favicon.svg`): 64-unit square with rx 16. Favicon, avatar, and anything under 24px. `offcut-tile-lime.svg` is the inverse.
- **Lockup** (`offcut-lockup*.svg`): mark plus OFFCUT-TO-ORDER in Anton, uppercase, tracking −0.005em, gap 0.2× the mark height. On dark or lime grounds, use the bare blade with no blob. In the app, rebuild it as an inline SVG plus live Anton text. The SVG files need the Anton webfont; outline the text before print.
- Minimum sizes: mark 24px, lockup 28px mark height, tile 16px. Clear space is at least the hub diameter on every side.
- Never outline the blade, use a perfect circle for the container, sharpen the teeth, or recolour outside forest, lime and white.
- Favicon: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`

## Visual reference
`screenshots/00-landing.png`, `01-overview.png`, `02-marketplace.png`, `03-list-an-offcut.png`, `04-plan-a-cut.png` and `05-impact.png`, plus `06-logo-sheet.png`. When unsure how something should look, compare against these. Dashed `.note` stickies are annotations; don't ship them.

## Checklist before finishing any page
- [ ] No hex values outside `offcut.css`; no new fonts
- [ ] All numbers and units in Plex Mono; headings in Anton UPPERCASE
- [ ] Pressables are pills with the offset-shadow press; cards are 24px with a 3px border-colour drop shadow
- [ ] At most 2–3 tilted elements on the page
- [ ] Estimates are dashed and stamped "Scenario estimate"
- [ ] Fit or no-fit shown only with `.stamp`
