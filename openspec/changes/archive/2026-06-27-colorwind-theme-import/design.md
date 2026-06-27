## Context

The runtime customizer (`templates/partials/customizer.html`) is an Alpine.js component, dev-only (gated by `ZOLA_ENV=dev`). It reads a token registry from `data/tokens.toml`, seeds input values from `getComputedStyle`, applies changes live via `document.documentElement.style.setProperty`, persists a draft to `sessionStorage`, and exports `[extra.theme]` TOML. It is currently **export-only** and speaks the Astroplate token vocabulary (`primary`, `body`, `text`, `text_dark`, `text_light`, `light`, `dark`, `border`, their `darkmode_*` mirrors, and fonts).

colorwind.dev exports a `theme.json` with separate `light` and `dark` objects of shadcn-style semantic keys (`background`, `foreground`, `card`, `primary`, `primaryForeground`, `secondary`, `border`, `input`, `ring`, `success/warning/error/info`, etc.). The two vocabularies overlap only partially.

Hard constraint: the site ships a committed, prebuilt `generated.css` (`compile_sass = false`). Tailwind v4 generates utility classes (`bg-primary`, `text-text`) from `@theme` token names at **build time**. The runtime customizer can only recolor tokens whose utilities already exist; it cannot introduce `bg-card` / `text-primary-foreground` without a CSS rebuild. This is why the import must be a lossy projection onto the existing Astroplate tokens.

## Goals / Non-Goals

**Goals:**
- One-click import of a colorwind.dev `theme.json` that recolors the existing site at runtime.
- Reuse the existing live-preview / sessionStorage / export pipeline unchanged — import is just a new entry point that populates `values`.
- Deterministic, documented, lossy mapping; safe failure on bad input.
- Zero new tokens, zero CSS rebuild, zero new dependencies.

**Non-Goals:**
- Importing any format other than colorwind.dev `theme.json` (no shadcn `:root` blocks, no tweakcn, no `tailwind.config.js`).
- Supporting colorwind roles the theme has no slot for (they are dropped).
- **Option B**: adopting the shadcn / Tailwind-v4 semantic token vocabulary natively (new `@theme` tokens, `@theme inline { --color-x: var(--x) }` indirection bridge, component restyle, CSS rebuild). This is the known next exploration ("Astroplate & Tailwind v4 full theme support") and is explicitly deferred.

## Decisions

**Decision: Map onto existing Astroplate tokens rather than introduce new ones.**
The customizer can only move CSS custom properties that have backing utilities in `generated.css`. Projecting colorwind's semantic palette onto the existing tokens keeps the change runtime-only. Alternative considered: add the full colorwind token set to `@theme` and rebuild — rejected here as that is Option B (larger, requires component restyle to be meaningful).

**Decision: Hard-code the mapping table in the Alpine component.**
A small, fixed dictionary (`colorwind key → registry key`, per light/dark group) is the simplest source of truth and matches the spec table. Alternative considered: declare the mapping in `data/tokens.toml` as an extra field per token — deferred; it adds registry surface for a single importer and is better revisited under Option B when the vocabulary question is reopened.

**Decision: Funnel imported values through the existing `values`/`onValueChange` path.**
After parsing, the importer sets `this.values[cssVar]` for each mapped token and calls the existing apply+save logic. This guarantees import automatically inherits live preview, sessionStorage persistence, TOML export, and Reset with no duplicated logic.

**Decision: Accept both file-picker and paste, parse with `JSON.parse` + File API.**
No network, no library. Validate that the parsed object has `light` and/or `dark` objects before applying; otherwise abort with a non-blocking message and leave state untouched.

## Risks / Trade-offs

- **Lossy import surprises the user** (imported `success`/`secondary`/`card-foreground` silently vanish) → Mitigation: show a brief summary after import ("applied N colors, ignored M unsupported roles"); document the mapping in the spec.
- **Heading color drift**: colorwind has no separate heading color, so `text_dark` keeps its old value and may clash with the new `text`/`background` → Mitigation: documented as a known limitation; acceptable for a dev-only recolor tool. Resolving it cleanly is an Option B concern.
- **`card` vs `backgroundSecondary` both map to `light`**: last-writer-wins → Mitigation: define precedence in the importer (prefer `card`, fall back to `backgroundSecondary`) and state it in code comments.
- **Format drift in colorwind exports** (key renames upstream) → Mitigation: tolerant parsing (ignore unknown keys, apply what matches); no hard schema validation beyond presence of `light`/`dark`.

## Open Questions

- Should import **merge** with the current draft or **replace** it? Default decision: merge (only mapped keys are overwritten), consistent with "import is additive and Reset-revertible". Revisit if users expect a clean slate.
