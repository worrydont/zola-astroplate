# customizer-context-inspector Specification

## Purpose
TBD - created by archiving change add-block-overrides-and-devx. Update Purpose after archive.

## Requirements
### Requirement: Dev-only context inspector tab in the theme customizer
The theme customizer SHALL provide a tab that displays the current template context — `page`,
`section`, and `config` — as formatted (pretty-printed) JSON, to aid theme development.

#### Scenario: Inspector shows context
- **WHEN** the customizer is open in a dev build and the inspector tab is selected
- **THEN** it displays readable JSON of the available `page`/`section`/`config` context for the current page

### Requirement: Inspector reuses the existing dev gate
The inspector SHALL be gated by the existing `ZOLA_ENV == "dev"` condition that already gates the
customizer, and SHALL NOT introduce a separate `config.extra.debug` (or equivalent) flag.

#### Scenario: Hidden in production builds
- **WHEN** the site is built without `ZOLA_ENV=dev`
- **THEN** neither the customizer nor the inspector tab is emitted in the output

### Requirement: Inspector fits the existing Alpine/Tailwind implementation
The inspector SHALL be implemented within the existing Alpine.js customizer using Tailwind styling,
consistent with the other tabs, and SHALL NOT add Bootstrap or other new UI dependencies.

#### Scenario: No new dependencies
- **WHEN** the inspector tab is added
- **THEN** the theme's dependency set is unchanged (no Bootstrap/offcanvas or extra libraries)
