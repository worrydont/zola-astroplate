# theming-tokens Specification

## Purpose
TBD - created by archiving change add-white-label-theming. Update Purpose after archive.
## Requirements
### Requirement: Token Storage
The system SHALL store all design tokens (colors, typography, spacing) in the `[extra.theme]` section of `zola.toml` as key-value pairs.

**Context**: Site operators should edit configuration through a single unified config file following Zola conventions.

#### Scenario: Edit tokens and verify changes on next serve
**GIVEN** a Zola site using zola-astroplate as the theme  
**WHEN** an engineer edits `zola.toml` and changes `primary = "#FF5733"`  
**AND** runs `zola serve`  
**THEN** the homepage renders with the new primary color applied to all elements using `bg-primary` or `text-primary` classes  
**AND** no CSS recompilation or rebuild is required

### Requirement: Runtime CSS Variable Injection
The system SHALL render all configured theme tokens as CSS custom properties on `:root` and `.dark` selectors during site build via the `theme-vars.html` partial.

**Context**: CSS classes that reference `var(--color-primary)` must receive their values from configuration, enabling dynamic swaps without stylesheet compilation.

#### Scenario: Verify CSS custom properties are rendered with configured values
**WHEN** a site is served via `zola serve`  
**THEN** inspecting the page source `<head>` shows a `<style>` block with `:root` containing all configured theme tokens (e.g., `--color-primary: #FF5733; --color-body: #ffffff;`)  
**AND** the CSS custom properties match the values set in `[extra.theme]` from `zola.toml`

### Requirement: Color Palette Support
The system SHALL support distinct light-mode and dark-mode color palettes within `[extra.theme]` using `primary`, `body`, `border`, `light`, `dark`, `text`, `text_dark`, `text_light` and their `darkmode_*` equivalents.

**Context**: Modern sites require mode-aware color schemes that toggle based on user preference without requiring separate CSS files.

#### Scenario: Switch to dark mode and verify dark palette
**GIVEN** a site with both light and dark color tokens configured  
**WHEN** the browser switches to dark mode preference (`prefers-color-scheme: dark`)  
**AND** the `.dark` class is applied to `<html>`  
**THEN** CSS custom properties on `.dark` selector override those on `:root` with `darkmode_*` values  
**AND** the site appears with the dark palette without page reload

### Requirement: Typography Configuration
The system SHALL support font family and font URL configuration for primary and secondary typefaces within `[extra.theme]`.

**Context**: Web fonts must be declaratively loaded and swappable to enable re-branding without touching the HTML template layer.

#### Scenario: Use Google Fonts via config
**GIVEN** `[extra.theme.font_primary_link]` set to a Google Fonts URL  
**WHEN** the site is served  
**THEN** the theme-vars partial renders `<link>` tags for the specified fonts in the page head  
**AND** the `--font-primary` CSS custom property references the font name from `font_primary` config

### Requirement: Fallback Defaults
The system SHALL provide sensible fallback values for all theme tokens when not explicitly configured.

**Context**: New sites should render correctly even if `[extra.theme]` is minimal or missing, using safe defaults.

#### Scenario: Override defaults with custom palette
**GIVEN** a site with default theme tokens  
**WHEN** an engineer provides a complete custom `[extra.theme]` block in `zola.toml`  
**THEN** all rendered CSS variables use custom values instead of fallbacks  
**AND** no theme defaults from the partial are used

