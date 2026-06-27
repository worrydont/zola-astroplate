# White-Label Theming: Design & Architecture

## Research & Findings

We surveyed lightweight, community-grade solutions to design tokens, dynamic runtime adjustments, Zola customization patterns, and scaffolding.

### Astroplate's `theme.json` Approach
- **How it works**: Astroplate uses a JSON config file (`src/config/theme.json`) containing color palettes (default, darkmode) and font family selections. A build script reads the JSON and injects values into Tailwind.
- **Pros**: Clear, structured separation of concern. Easy to read and parse.
- **Cons for Zola**: Zola is a compiled Rust binary with no built-in dynamic JSON/CSS pre-processing pipeline for stylesheet files when `compile_sass` is false.

### Tailwind v4 `@theme` & CSS Variables
- **How it works**: `@theme` defines design tokens as custom properties on `:root`.
- **Validation**: We confirmed that:
  1. Tailwind v4 compiles classes like `bg-primary` to reference `var(--color-primary)`.
  2. Tailwind declares default custom properties (e.g. `--color-primary: #121212`) inside `:root` in the generated stylesheet.
  3. Custom properties are **not inlined or replaced with absolute values during minification** (`--minify`). They remain fully overridable at runtime or in subsequent stylesheets via standard CSS cascade rules.
- **Pros**: Permits both build-time defaults (within the CSS) and instant runtime adjustments (via a style block or JavaScript editing `:root`).

### DaisyUI `data-theme` Pattern
- **How it works**: Presets are declared under selectors like `[data-theme="forest"]` containing groups of CSS custom properties. Toggling themes is as simple as switching the `data-theme` attribute on the `<html>` element.
- **Pros**: Clean multi-theme capability.
- **Cons**: Overkill for a custom user-branded site where the goal is custom developer-defined branding rather than picking from a set of pre-baked themes.

### Zola Configuration Conventions
- **How it works**: Zola themes read custom variables from `zola.toml`'s `[extra]` table and render them in HTML headers via templates.
- **Pros**: Integrated natively with Zola. Changing site configuration immediately affects the output without running any additional tooling or node-based compile steps.

### Lightweight In-Browser Customizers
- **How it works**: An interactive floating Alpine.js configuration panel rendered only in development mode. Clicking color pickers updates variables on `document.documentElement.style.setProperty('--color-X', value)` in real time, and an "Export TOML" button lets the developer copy the exact theme configuration block for `zola.toml`.
- **Pros**: Zero dependencies beyond Alpine.js (already in the project), instant live preview, simple copy-paste export.

### Scaffolding Patterns
- **How it works**: A script or a Git-based checklist. A simple script is preferable because it can automate directory creation and config copying.

---

## Recommended Architecture

We recommend a hybrid model that maximizes both convenience (no CSS builds needed for site branding changes) and efficiency.

### A. Design Tokens (`zola.toml`)
All theme tokens live directly in `zola.toml` under a structured `[extra.theme]` section.

**Colors**:
```toml
[extra.theme]
primary = "#121212"
body = "#ffffff"
border = "#eaeaea"
light = "#f6f6f6"
dark = "#040404"
text = "#444444"
text_dark = "#040404"
text_light = "#717171"

darkmode_primary = "#ffffff"
darkmode_body = "#1c1c1c"
darkmode_border = "#3E3E3E"
darkmode_light = "#222222"
darkmode_dark = "#ffffff"
darkmode_text = "#B4AFB6"
darkmode_text_dark = "#ffffff"
darkmode_text_light = "#B4AFB6"

font_primary = "Heebo, sans-serif"
font_secondary = "Signika, sans-serif"
font_primary_link = "https://fonts.googleapis.com/css2?family=Heebo:wght@400;600&display=swap"
font_secondary_link = "https://fonts.googleapis.com/css2?family=Signika:wght@500;700&display=swap"
```

### B. Dynamic Rendering (`theme-vars.html`)
A new partial renders `<link>` tags for Google Fonts and a `<style>` block that overrides CSS variables on `:root`:

```html
<style>
  :root {
    --color-primary: {{ config.extra.theme.primary | default(value="#121212") }};
    --color-body: {{ config.extra.theme.body | default(value="#ffffff") }};
    /* ... and so on ... */
  }
  .dark {
    --color-darkmode-primary: {{ config.extra.theme.darkmode_primary | default(value="#ffffff") }};
    /* ... dark overrides ... */
  }
</style>
```

This allows immediate branding changes with **zero Tailwind compiles** at build time.

### C. Live Customizer UI
A floating config modal powered by Alpine.js, enabled when `config.mode == "serve"` (development environment only).

**Features**:
- Live color pickers
- Interactive font dropdowns
- Toggles for sections/features
- Instant live rendering updates via `document.documentElement.style`
- An "Export Configuration" text area producing copy-pasteable TOML

### D. Homepage Section Toggles
Section rendering is managed by templates using flags defined in `content/_index.md` front matter or `zola.toml` `[extra]`:

```html
{% if extra.banner.enabled | default(value=true) %}
  {% include "partials/banner.html" %}
{% endif %}
```

### E. New-Site Scaffolding
A simple `mise` task in the parent site:

```bash
mise run scaffold <target_dir>
```

Which runs a lightweight script to:
1. Create target directory
2. Initialize Git and add `zola-astroplate` as a submodule
3. Copy starter files (`zola.toml`, `content/`, `static/`, `i18n/`)

---

## Key Architectural Decisions

1. **Token Configuration Format**: Stored nested under `[extra.theme]` in `zola.toml` for a single, unified site configuration.
2. **Runtime Customizer Scope**: Enabled as a development-only helper using the `config.mode == "serve"` check to keep production builds lightweight.
3. **Scaffolding Tooling**: Implemented as a documented step-by-step manual checklist in the theme's `README.md` to ensure zero external build-time dependencies.
