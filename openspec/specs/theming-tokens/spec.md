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
The system SHALL render CSS custom properties on `:root` and `.dark` selectors via the `theme-vars.html` partial, emitting an override **only for tokens explicitly set** in `config.extra.theme`. The partial SHALL place its `<style>` block in `<head>` **after** the main stylesheet link so overrides win by cascade order, and SHALL NOT use `!important`.

**Context**: Tailwind `@theme` in the committed `generated.css` already declares every token's default on `:root`. The partial only needs to override the subset the operator configured; equal specificity plus later source position makes the override win without `!important`.

#### Scenario: Only configured tokens are overridden
- **WHEN** `zola.toml` sets `primary = "#FF5733"` and leaves `body` unset
- **THEN** the head `<style>` block contains `--color-primary: #FF5733` (no `!important`)
- **AND** it contains no `--color-body` line, so `body` falls back to the Tailwind `@theme` default

#### Scenario: Override wins by cascade order, not !important
- **WHEN** a site is served and the page source `<head>` is inspected
- **THEN** the `theme-vars.html` `<style>` block appears after the `generated.css` `<link>`
- **AND** no CSS custom property in that block uses `!important`
- **AND** elements using `bg-primary` render with the configured value

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

### Requirement: Token Registry Source of Truth
The system SHALL define the set of theme tokens in a single data file `data/tokens.toml`, loaded via Zola `load_data`, where each token declares its config `key`, CSS custom property `css_var`, and `group` (`light`, `dark`, or `font`). All token consumers (override emission, customizer inputs, configuration export) SHALL iterate this registry rather than hardcoding the token list.

#### Scenario: Add a new token in one place
- **WHEN** an engineer adds a single row to `data/tokens.toml` for a new token
- **THEN** the override partial, the customizer UI, and the TOML export all include that token without further edits to any template or script

#### Scenario: Registry is the only token list
- **WHEN** the codebase is inspected for the token list
- **THEN** the token keys appear only in `data/tokens.toml` and are consumed via loops
- **AND** no template or script contains a separately hand-maintained copy of the token list

