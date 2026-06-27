## ADDED Requirements

### Requirement: Token Registry Source of Truth
The system SHALL define the set of theme tokens in a single data file `data/tokens.toml`, loaded via Zola `load_data`, where each token declares its config `key`, CSS custom property `css_var`, and `group` (`light`, `dark`, or `font`). All token consumers (override emission, customizer inputs, configuration export) SHALL iterate this registry rather than hardcoding the token list.

#### Scenario: Add a new token in one place
- **WHEN** an engineer adds a single row to `data/tokens.toml` for a new token
- **THEN** the override partial, the customizer UI, and the TOML export all include that token without further edits to any template or script

#### Scenario: Registry is the only token list
- **WHEN** the codebase is inspected for the token list
- **THEN** the token keys appear only in `data/tokens.toml` and are consumed via loops
- **AND** no template or script contains a separately hand-maintained copy of the token list

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Fallback Defaults
**Reason**: Defaults are now owned solely by Tailwind `@theme` in `generated.css`. The partial no longer carries a hardcoded `{% else %}` default block, eliminating a duplicate source of truth.
**Migration**: Sites with no `[extra.theme]` render correctly from the Tailwind `@theme` defaults already present in the committed `generated.css`; no partial-level fallbacks are needed. Custom palettes continue to work by setting keys in `[extra.theme]`.
