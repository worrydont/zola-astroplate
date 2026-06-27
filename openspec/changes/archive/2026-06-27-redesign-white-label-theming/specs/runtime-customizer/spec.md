## ADDED Requirements

### Requirement: Session-Persisted Customizer State
The system SHALL persist the customizer's working state (colors, fonts, section toggles) in `sessionStorage` so that adjustments survive a page refresh within the same browser tab. On `init()`, the customizer SHALL apply any stored draft to `document.documentElement` inline styles and populate its inputs from that draft; when no draft exists, it SHALL seed inputs from `getComputedStyle(document.documentElement)`. The system SHALL provide a Reset action that clears the stored draft and reverts to the configured/default cascade.

#### Scenario: State survives a page refresh
- **WHEN** an engineer changes the primary color in the customizer and reloads the page
- **THEN** the customizer reopens with the changed primary color still applied
- **AND** `sessionStorage` contains the draft used to reapply it

#### Scenario: Reset reverts to configured values
- **WHEN** the engineer clicks Reset
- **THEN** the `sessionStorage` draft is cleared
- **AND** colors fall back to the `zola.toml` overrides (or Tailwind defaults if unset) on the next render

### Requirement: Initial Values From Computed Styles
The system SHALL derive the customizer's initial input values from `getComputedStyle(document.documentElement)` for each registry token (when no `sessionStorage` draft exists), rather than from hardcoded literal defaults embedded in the template.

#### Scenario: Inputs reflect the live cascade
- **WHEN** the customizer opens on a fresh tab with no draft and `zola.toml` sets `primary = "#FF5733"`
- **THEN** the primary color input shows `#FF5733`
- **AND** no hardcoded hex literal for the default appears in the customizer source

## MODIFIED Requirements

### Requirement: Development-Only Visibility
The system SHALL render the customizer UI only when the build-time environment variable signals development, evaluated as `get_env(name="ZOLA_ENV", default="") == "dev"`. The `mise run serve` task SHALL export `ZOLA_ENV=dev`; `mise run build` SHALL NOT set it, so production output omits the customizer entirely. The system SHALL NOT rely on a checked-in configuration flag for this gating.

**Context**: A committed boolean (`customizer_enabled`) ships enabled to production if forgotten. An environment variable set only by the dev task cannot leak into a production build.

#### Scenario: Customizer absent from production build
- **GIVEN** a production build via `mise run build` (no `ZOLA_ENV=dev`)
- **WHEN** the HTML is generated
- **THEN** the customizer partial is completely omitted
- **AND** no customizer JavaScript appears in the output

#### Scenario: Customizer present under the dev server
- **GIVEN** `mise run serve` exports `ZOLA_ENV=dev`
- **WHEN** the site is served
- **THEN** the customizer modal is rendered
- **AND** no `customizer_enabled` config key is consulted

### Requirement: Configuration Export
The system SHALL generate a TOML-formatted configuration block representing the current customizer state and allow copy-paste export. The export SHALL be produced by iterating the token registry (and section list), not by hand-written string concatenation, so it stays in sync with the registry automatically.

**Context**: Engineers must export exact config back to `zola.toml` without manual transcription, and the exporter must not drift from the token set.

#### Scenario: Export covers all registry tokens
- **WHEN** the engineer clicks "Export Config (TOML)"
- **THEN** the produced TOML contains an `[extra.theme]` block with one line per registry token and an `[extra.sections]` block for the toggles
- **AND** the values match the current customizer state

### Requirement: State Persistence in DOM
The system SHALL apply customizer changes to the in-browser DOM (inline styles on `document.documentElement`) and MAY persist the working draft to `sessionStorage`; it SHALL NOT make network requests or write to `zola.toml`.

**Context**: Changes remain experimental and client-side; persisting to `sessionStorage` is a browser-local convenience, and committing changes still requires manual copy-paste of the exported TOML.

#### Scenario: No server writes occur
- **WHEN** the customizer updates a color
- **THEN** `document.documentElement.style.getPropertyValue('--color-primary')` returns the new value
- **AND** no network request is issued and `zola.toml` is unchanged on disk
