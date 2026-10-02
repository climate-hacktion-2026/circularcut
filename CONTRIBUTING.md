# Contributing (team workflow)

## Timing

Do not commit application code, designs, or assets before **9:00am AEST, Fri 2 Oct
2026** — the hacking rules require building from scratch once the clock starts.
Planning docs, this scaffold, and README edits are fine before then.

## Branching

- `main` stays deployable/demo-able at all times.
- Work in feature branches: `feat/<short-name>`, `fix/<short-name>`.
- Open a PR into `main`, at least one teammate reviews before merge.

## Commits

- Small, frequent commits over one big dump — judges and teammates can follow progress.
- Reference what changed, not why it was asked for.

## Disclosures (required for submission)

Every time you add an outside library, dataset, API, template, or use an AI tool for
something beyond trivial autocomplete, add a line to
[`docs/DISCLOSURES.md`](docs/DISCLOSURES.md) immediately — don't try to reconstruct
this list at submission time.

## Stopping

Stop new features when the building deadline hits (9:00pm AEDT, Sun 4 Oct). Small bug
fixes after that are fine; new functionality is not.

## Note on branding

The EarthSync logo used in the original scaffold repo was designed before kickoff.
It is **not** included here yet. If/when we add it, log it as a line in
`docs/DISCLOSURES.md` (what it is, that it predates the event) rather than treating
the clean history here as making that question moot — a fresh repo fixes the
commit-timestamp problem, it doesn't change when the asset was actually made.
