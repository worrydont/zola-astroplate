## Why

The runtime customizer is export-only and speaks the theme's bespoke Astroplate token vocabulary. Designers increasingly build palettes in ecosystem tools like [colorwind.dev](https://colorwind.dev/), which export a `theme.json` of semantic light/dark colors. Today there is no way to bring such a palette into the site — every value must be hand-transcribed onto the Astroplate tokens. A one-click import that maps a colorwind `theme.json` onto the existing tokens lets a designer recolor the whole site in seconds, with no rebuild.

## What Changes

- Add an **Import** affordance to the customizer that accepts a colorwind.dev `theme.json` (file picker and/or paste), parses its `light` and `dark` objects, and applies the mapped colors at runtime.
- Define a **fixed mapping** from colorwind semantic keys to the existing Astroplate token registry (e.g. `background → body`, `foreground → text`, `foregroundMuted → text_light`, `primary → primary`, `border → border`, `card/backgroundSecondary → light`; the `dark` object maps to the `darkmode_*` tokens by the same rules).
- **Lossy by design**: colorwind roles with no Astroplate slot (`primaryForeground`, `secondary*`, `ring`, `input`, `backgroundMuted`, `success/warning/error/info`) are ignored, and Astroplate roles with no colorwind source (`text_dark`, `dark`) are left untouched. Import is additive over the current customizer state and remains fully revertible via the existing Reset.
- Imported values flow through the **existing customizer state** (sessionStorage draft, live `setProperty`, TOML export) — no new persistence or export path is introduced.
- **NOT in scope** (noted as the known next exploration — "Option B"): adopting the shadcn/Tailwind-v4 semantic token vocabulary natively (new `@theme` tokens, `@theme inline` indirection bridge, component restyle, CSS rebuild) so the *full* colorwind palette becomes meaningful. This change deliberately stays runtime-only with zero CSS rebuild and zero new tokens.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `runtime-customizer`: adds a palette-import requirement (colorwind `theme.json` → Astroplate token mapping, applied through existing live-preview/persistence/export state).

## Impact

- **Theme submodule only** (`themes/zola-astroplate`). No site-level (`worrydont-zola`) changes.
- Modified: `templates/partials/customizer.html` (import UI + parse/map logic in the existing Alpine component).
- Reads: `data/tokens.toml` (existing registry; the import mapping targets these keys — no new tokens added).
- No changes to `generated.css`, no CSS rebuild, no new dependencies (Alpine.js + browser File API only).
- Import format support is limited to colorwind.dev `theme.json`; other formats (shadcn `:root` blocks, tweakcn, `tailwind.config.js`) are out of scope.
