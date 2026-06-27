# White-Label Theming for Zola-Astroplate

## Goal

Transform `zola-astroplate` into a **white-label theme** that engineers can drop onto any site and re-brand with minimal edits. The complete scope includes:
- Design tokens (colors, fonts, sizes) configured via `zola.toml`
- Content and site configuration
- Section and layout toggles for on/off rendering
- Scaffolding tooling for spinning up a new site

## Why This Matters

### For Site Operators
- **Zero CSS knowledge required**: Change colors, fonts, and branding by editing a single `[extra.theme]` section in `zola.toml`—no touching `main.css`, no rebuilds
- **Live preview during development**: A development-only customizer panel lets teams experiment with color/font changes instantly and export the exact config to paste
- **Reusable across projects**: Once branded, the same theme setup works on any Zola site by copying the theme submodule and starter config

### For Theme Maintainers
- **Single source of truth**: Tokens live in site config, not scattered across CSS files
- **Build-time defaults + runtime overrides**: Supports both static defaults and dynamic live-preview experimentation
- **No external build pipeline**: Theme ships with committed CSS; changes to `zola.toml` take effect on `zola serve` with zero build steps

## User Decisions (Already Settled)

The following decisions were made and are **not open for re-discussion**:

1. **White-label scope** — Includes tokens, content config, section toggles, and new-site scaffolding (all or nothing, not piecemeal)
2. **Theming mechanism** — **BOTH** build-time defaults **and** runtime override (live preview). Not one or the other; this enables both static sites and dev experimentation
3. **Architecture strategy** — Tokens stored in `[extra.theme]` in `zola.toml`; build-time defaults emitted by CSS, runtime overrides via a `theme-vars.html` partial that prints `:root` CSS variables
4. **Runtime layer scope** — Development-only (enabled when `config.mode == "serve"`); production builds stay lightweight
5. **Scaffolding approach** — Lightweight documentation (manual checklist or simple `mise` task), not a heavy CLI or complex generator

## What Gets Built

- Token configuration structure in `zola.toml`
- A runtime override partial (`theme-vars.html`) that emits CSS variables from config
- A development-only customizer UI (Alpine.js floating panel) for live experimentation
- Section toggles for conditional rendering of page sections
- Scaffolding instructions/tasks for new-site setup
