## Why

The shipped white-label theming (archived `add-white-label-theming`) works but is structurally fragile: token defaults are hand-copied across four layers, every CSS variable is force-set with `!important`, the dev-only customizer is gated by a checked-in `customizer_enabled` boolean that ships to production if forgotten, the TOML exporter is hand-rolled string concatenation, and the section-toggle logic is copy-pasted per section. Customizer state is also lost on every page refresh. This redesign keeps the same user-facing capability (re-brand a site from config + live-preview) but rebuilds it on a single source of truth.

## What Changes

- **Token defaults: one source of truth.** Tailwind `@theme` in `generated.css` is the only place defaults live. `theme-vars.html` emits CSS variable overrides **only for keys actually set** in `zola.toml` `[extra.theme]`, with **no `!important`** — a `<style>` block placed in `<head>` after the stylesheet link wins by cascade order. **BREAKING**: removes the hardcoded `{% else %}` default block and all inline default literals.
- **Token registry data file.** Introduce `data/tokens.toml` (loaded via Zola `load_data`) as the single list of tokens (`key`, `css_var`, `group`). Three consumers loop over it: override emission, customizer inputs, and TOML export — eliminating the 4× duplication and the `getToml()` string concatenation.
- **Customizer reads live values.** Initial customizer input values come from `getComputedStyle(documentElement)`, not hardcoded hex literals.
- **Dev gating via environment, not config.** Replace `customizer_enabled` with a build-time signal: `get_env(name="ZOLA_ENV", default="")  == "dev"`. `mise run serve` exports `ZOLA_ENV=dev`; `mise run build` does not, so the customizer is physically absent from production output. **BREAKING**: `customizer_enabled` is removed.
- **Session persistence (new).** Customizer state (colors, fonts, section toggles) persists in `sessionStorage` and is reapplied on `init()`, surviving page refresh. A Reset clears it.
- **Section toggles via one macro.** A single Tera `{% macro %}` replaces the per-section copy-paste. Hybrid behavior: production truly omits disabled sections (no wrapper); dev always renders the wrapper and uses `display:none` when disabled so the customizer can toggle live.

## Capabilities

### New Capabilities
<!-- None; this redesign reshapes existing capabilities rather than adding new ones. -->

### Modified Capabilities
- `theming-tokens`: defaults sourced solely from Tailwind `@theme`; overrides emitted only for set keys with no `!important`; tokens defined in a `data/tokens.toml` registry consumed by a loop.
- `runtime-customizer`: dev visibility gated by `ZOLA_ENV` env var instead of `customizer_enabled`; initial values read from `getComputedStyle`; state persisted to `sessionStorage`; TOML export derived from the registry.
- `section-toggles`: rendering consolidated into one reusable macro; hybrid build-omit / dev-hide behavior.

## Impact

- **Theme submodule** `themes/zola-astroplate`:
  - `templates/partials/theme-vars.html`, `templates/partials/customizer.html`, `templates/index.html`, `templates/base.html`.
  - New `data/tokens.toml`.
  - `mise.toml` tasks (`serve` exports `ZOLA_ENV=dev`).
  - README customizer/production-warning section (rewritten — no manual flag to flip).
- **Consuming site** `worrydont-zola`: `zola.toml` `[extra.theme]` drops `customizer_enabled`; no other required edits (overrides remain opt-in).
- **Load-bearing assumption to verify in design:** Zola `get_env` is available in templates.
- **Deferred (out of scope, flagged):** the 4 additional sections from the old spec (`hero`, `blog`, `footer`, `navigation`) and the phantom `about` key (present in root config, no matching section). This change covers only the 4 sections on the homepage today: `banner`, `features`, `testimonials`, `cta`.
