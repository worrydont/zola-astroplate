## Context

The current white-label theming (archived `add-white-label-theming`) duplicates the token list across four layers, forces every CSS variable with `!important`, gates the dev customizer with a checked-in `customizer_enabled` boolean, hand-rolls the TOML exporter, copy-pastes section-toggle logic, and loses customizer state on refresh. The theme ships a committed `static/css/generated.css` (Tailwind v4, `compile_sass = false`); custom properties declared in `@theme` survive minification and remain overridable via the cascade. Alpine.js is already loaded. This design rebuilds the same capability on a single source of truth without adding a build pipeline.

## Goals / Non-Goals

**Goals:**
- One source of truth for token defaults (Tailwind `@theme`) and one source of truth for the token *set* (`data/tokens.toml`).
- Eliminate `!important`; rely on cascade order.
- Dev customizer that cannot leak to production and needs no manual flag flip.
- Customizer state that survives page refresh (`sessionStorage`).
- Section toggles via a single reusable macro with build-omit / dev-hide behavior.

**Non-Goals:**
- New theme features beyond the existing brand/section capability.
- Multi-theme/preset picker (DaisyUI-style `data-theme`).
- Touching `site-scaffolding`.
- Covering sections not on today's homepage (`hero`, `blog`, `footer`, `navigation`) or the phantom `about` key (deferred — see Open Questions).

## Decisions

### D1. Token defaults: Tailwind `@theme` only; partial emits overrides only
`generated.css` already declares `:root { --color-primary: … }` from `@theme`. `theme-vars.html` renders a `<style>` block in `<head>` **after** the stylesheet `<link>`, emitting a variable **only when the key is present** in `config.extra.theme`. Equal specificity + later source position ⇒ override wins. No `!important`.
- **Why over current:** removes the hardcoded `{% else %}` default block (2nd copy of defaults) and lets `bg-primary` etc. keep working from CSS defaults when config is empty.
- **Alternative rejected:** TOML registry as canonical defaults — reintroduces a sync burden against committed CSS (explicitly disliked).

### D2. Token registry in `data/tokens.toml`, consumed by loops
A single list defines each token: `key` (TOML/config key), `css_var` (custom property name), `group` (`light` | `dark` | `font`). Loaded once via `load_data(path="…/tokens.toml")`. Three consumers iterate it:
1. `theme-vars.html` — emit override line per token whose `key` is set.
2. `customizer.html` — render an input per token.
3. Export — JS iterates the same key set (registry serialized to the Alpine component) to build TOML.
- **Why:** the token set is defined once; adding a token = one row. Kills the 4× duplication and the hand-written `getToml()`.
- **Alternative rejected:** Tera array literal inside `theme-vars.html` — theme-local but not reusable and still template-bound; user chose a data file.

### D3. Dev gating via `ZOLA_ENV` environment variable
Templates branch on `get_env(name="ZOLA_ENV", default="") == "dev"`. `mise run serve` exports `ZOLA_ENV=dev`; `mise run build` does not set it, so the customizer include and dev section behavior are absent from production output. No checked-in flag.
- **Why over current `customizer_enabled`:** the old flag is committed config — it ships enabled if forgotten (README itself warns). An env var set by the dev task is ephemeral and cannot leak.
- **Tera constraint:** `{% extends %}` requires a string literal, so a literally-separate `base.dev.html` cannot be conditionally extended. Instead, `base.html` carries a single guarded `{% include "partials/customizer.html" %}` behind the `get_env` check — same separation of concern (prod output never contains it) without a file-swap hack.
- **Alternative rejected:** physical base-file swap script (git churn, fragile).

### D4. Customizer initial state from `getComputedStyle`
On `init()`, read each token's current value via `getComputedStyle(document.documentElement).getPropertyValue(css_var)` rather than embedding hex literals.
- **Why:** removes the 3rd copy of defaults; the customizer always reflects whatever the cascade actually produced (CSS default or zola.toml override).

### D5. `sessionStorage` persistence layer
Cascade precedence: (1) `generated.css` `@theme` defaults → (2) `theme-vars.html` zola.toml overrides → (3) `sessionStorage` draft applied as inline styles on `documentElement` (dev only).
- `init()`: if a draft exists in `sessionStorage`, apply it to `:root` inline styles and populate inputs; else seed inputs from `getComputedStyle` (D4).
- On any input change: update inline style + write the whole draft object to `sessionStorage`.
- "Reset": clear the `sessionStorage` key; values fall back to layers 1–2.
- **Why `sessionStorage` over `localStorage`:** per-tab, ephemeral working draft — matches "experiment, then export" intent without polluting long-term state.

### D6. Section toggles via one Tera macro
A macro `section(id, enabled, dev)` wraps section rendering. Production (`dev` false): if disabled, the wrapper is **not emitted** at all. Dev (`dev` true): always emit `<div id="section-{id}">` with `display:none` when disabled, so the customizer can toggle live via `getElementById`.
- **Why:** replaces ~4 copy-pasted `is defined` ladders in `index.html`; reconciles the spec promise ("absent from output") with the customizer's need for a live target.
- Per-section `enabled` resolves from `config.extra.sections.<id>` (default true), with optional page-level `section.extra.<id>.enable` override preserved where it exists today.

## Risks / Trade-offs

- **`get_env` availability is load-bearing.** → Verify `get_env` is exposed in Zola 0.22 templates as the *first* implementation task; if unavailable, fall back to a minimal env-derived `[extra]` value injected by the `serve` task (still not a committed flag). Captured in Open Questions.
- **Cascade-order override (no `!important`) depends on `<style>` after the `<link>`.** → Assert ordering in `base.html`/head partial; covered by a spec scenario inspecting head source.
- **Registry serialized into Alpine `x-data` could grow large.** → Acceptable; dev-only output, never shipped to prod.
- **`sessionStorage` inline styles outrank zola.toml overrides during a dev session.** → Intended (draft beats config); Reset restores. Documented in customizer UI.
- **Removing `customizer_enabled` is BREAKING for the consuming site.** → Drop the key from `worrydont-zola/zola.toml` in the same rollout; no runtime error if left (just ignored), so low blast radius.

## Migration Plan

1. Verify `get_env` (Open Question Q1) before template work.
2. Add `data/tokens.toml`; refactor `theme-vars.html` to loop + emit-overrides-only, no `!important`.
3. Rewrite `customizer.html`: registry-driven inputs, `getComputedStyle` seeding, `sessionStorage` persist/reset, registry-driven export.
4. Add the section macro; replace `index.html` ladders.
5. Wire `base.html` include behind `get_env`; set `ZOLA_ENV=dev` in `mise run serve`.
6. Update README (remove manual-flag production warning).
7. In `worrydont-zola`: drop `customizer_enabled` from `zola.toml`; bump submodule pointer.

Rollback: revert the submodule pointer bump in `worrydont-zola`; prior committed theme still works.

## Open Questions

- **Q1 (blocking impl):** Is `get_env` available in Zola 0.22 templates? Resolve before D3 template work.
- **Q2 (deferred, non-blocking):** Should the deferred sections (`hero`, `blog`, `footer`, `navigation`) and the phantom `about` key be added later? Tracked as an unchecked task; macro design already supports adding them as one-line registrations.
