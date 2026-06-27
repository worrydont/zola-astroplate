# runtime-customizer Specification

## Purpose
TBD - created by archiving change add-white-label-theming. Update Purpose after archive.
## Requirements
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

### Requirement: Live Color Adjustment
The system SHALL provide color picker inputs that update theme colors on the page in real time by setting CSS custom properties on `document.documentElement`.

**Context**: Engineers should see color changes instantly as they adjust values without page reload or rebuild.

#### Scenario: Toggle color picker and see live preview
**GIVEN** the development server is running with customizer enabled  
**WHEN** an engineer clicks a color picker for primary color  
**AND** selects a new hex value (e.g., `#3498db`)  
**THEN** the CSS custom property `--color-primary` is updated via `document.documentElement.style.setProperty()`  
**AND** all elements using `text-primary` or `bg-primary` classes reflect the new color immediately  
**AND** no page reload occurs

### Requirement: Font Selection
The system SHALL provide dropdown or text inputs to select and preview primary and secondary font families in real time.

**Context**: Typography changes should be visible immediately to support design iteration.

#### Scenario: Switch fonts and see them applied instantly
**GIVEN** the customizer is open  
**WHEN** an engineer changes `font_primary` via a dropdown (e.g., to "Poppins, sans-serif")  
**THEN** the page body font updates immediately without page reload  
**AND** the export block reflects the new font name

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

### Requirement: Alpine.js Implementation
The system SHALL use Alpine.js (already a project dependency) for interactivity; no additional JavaScript frameworks required.

**Context**: Minimize bundle size and external dependencies; Alpine.js is already loaded.

#### Scenario: Verify Alpine.js directives are used in customizer
**WHEN** the page is served in dev environment (`zola serve`)  
**AND** the customizer partial is rendered  
**THEN** inspecting the page source shows Alpine.js directives on the customizer modal (e.g., `x-data`, `@click`, `x-show`, `@change`)  
**AND** no other JavaScript frameworks (React, Vue, etc.) are present in the customizer code

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

### Requirement: Colorwind theme.json Import
The system SHALL provide an import control in the customizer that accepts a [colorwind.dev](https://colorwind.dev/) `theme.json` file, parses its `light` and `dark` color objects, and applies the mapped colors to the page through the existing customizer state (live `document.documentElement` inline styles, `sessionStorage` draft, and TOML export). The system SHALL accept the file via a browser file picker; no network request SHALL be made.

The import SHALL apply a fixed mapping from colorwind semantic keys to the Astroplate token registry keys (`data/tokens.toml`):

| colorwind key (light & dark) | Astroplate token (light) | Astroplate token (dark) |
|---|---|---|
| `background` | `body` | `darkmode_body` |
| `backgroundSecondary` / `card` | `light` | `darkmode_light` |
| `foreground` | `text` | `darkmode_text` |
| `foregroundMuted` | `text_light` | `darkmode_text_light` |
| `primary` | `primary` | `darkmode_primary` |
| `border` | `border` | `darkmode_border` |

Colorwind keys with no Astroplate slot (`backgroundMuted`, `cardForeground`, `input`, `ring`, `primaryForeground`, `secondary`, `secondaryForeground`, `success`, `warning`, `error`, `info`) SHALL be ignored. Astroplate tokens with no colorwind source (`text_dark`, `dark`, `darkmode_text_dark`, `darkmode_dark`, and the font tokens) SHALL be left unchanged by the import. When both `card` and `backgroundSecondary` are present, `card` takes precedence for the `light`/`darkmode_light` slot.

**Context**: Designers build palettes in colorwind.dev and export `theme.json`. A direct import removes hand-transcription. The mapping is intentionally lossy because the theme's runtime customizer can only recolor tokens whose Tailwind utilities already exist in the committed `generated.css`; introducing the unmapped semantic roles requires a CSS rebuild and is tracked as a future "Astroplate & Tailwind v4 full theme support" exploration.

#### Scenario: Import maps colorwind colors onto Astroplate tokens
- **WHEN** an engineer imports a colorwind `theme.json` whose `light.background` is `#FAFEFF` and `light.primary` is `#0891B2`
- **THEN** `--color-body` is set to `#FAFEFF` and `--color-primary` is set to `#0891B2` on `document.documentElement`
- **AND** the corresponding `dark.*` values are applied to the `darkmode_*` tokens
- **AND** the page reflects the new colors immediately without reload

#### Scenario: Unmapped colorwind keys are ignored
- **WHEN** the imported `theme.json` contains `success`, `ring`, and `primaryForeground` keys
- **THEN** those keys are silently ignored
- **AND** no CSS custom property is created for them
- **AND** no error is shown to the user

#### Scenario: Unsourced Astroplate tokens are preserved
- **WHEN** a colorwind `theme.json` (which has no `text_dark` or `dark` equivalent) is imported
- **THEN** the existing `--color-text-dark` and `--color-dark` values remain unchanged
- **AND** the font tokens remain unchanged

#### Scenario: Imported values participate in export and persistence
- **WHEN** an engineer imports a `theme.json` and then clicks "Export TOML"
- **THEN** the exported `[extra.theme]` block contains the imported values under their Astroplate keys
- **AND** the imported values are written to the `sessionStorage` draft so they survive a page refresh

#### Scenario: Reset reverts an import
- **WHEN** an engineer imports a `theme.json` and then clicks Reset
- **THEN** the `sessionStorage` draft is cleared
- **AND** all tokens revert to the configured/default cascade, discarding the imported colors

#### Scenario: Invalid file is rejected gracefully
- **WHEN** the selected file is not valid JSON or lacks both `light` and `dark` objects
- **THEN** the import is aborted with a non-blocking message
- **AND** the current customizer state is left unchanged
- **AND** no network request is made

