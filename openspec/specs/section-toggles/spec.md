# section-toggles Specification

## Purpose
TBD - created by archiving change add-white-label-theming. Update Purpose after archive.
## Requirements
### Requirement: Section Toggle Configuration
The system SHALL support section visibility flags under `[extra.sections]` in `zola.toml` as boolean values.

**Context**: Non-technical site operators should control which page sections render via config, not template edits.

#### Scenario: Disable banner section via config
**GIVEN** a site with a homepage banner section  
**WHEN** `zola.toml` contains:  
```toml
[extra.sections]
banner.enabled = false
```
**AND** the template wraps the banner in `{% if extra.sections.banner.enabled %}`  
**AND** the site is served  
**THEN** the banner HTML is completely absent from the generated homepage  
**AND** layout and styling for other sections are unaffected

### Requirement: Conditional Template Rendering
The system SHALL check section toggle flags via the shared macro and apply hybrid behavior: in production (no `ZOLA_ENV=dev`) a disabled section's wrapper and content SHALL be **completely omitted** from output; in development (`ZOLA_ENV=dev`) the wrapper SHALL always be emitted with `display:none` when disabled, so the customizer can toggle it live via `getElementById`.

**Context**: Production output must stay minimal, while the dev customizer needs a present element to show/hide without a reload.

#### Scenario: Disabled section omitted in production
- **WHEN** `zola.toml` sets `[extra.sections] banner = false` and the site is built via `mise run build`
- **THEN** the generated homepage contains no `#section-banner` wrapper and no banner content

#### Scenario: Disabled section hidden but present in dev
- **GIVEN** `mise run serve` exports `ZOLA_ENV=dev`
- **WHEN** `[extra.sections] banner = false`
- **THEN** the served homepage contains a `#section-banner` wrapper with `display:none`
- **AND** toggling the banner in the customizer reveals it without a page reload

### Requirement: Default Enable Behavior
The system SHALL treat a missing or unset toggle flag as enabled (opt-out pattern), so existing sites render all supported sections without any `[extra.sections]` configuration.

**Context**: Sites should continue working unchanged; sections render by default.

#### Scenario: Sections render by default without flags
- **GIVEN** a site with no `[extra.sections]` configuration
- **WHEN** the site is served
- **THEN** `banner`, `features`, `testimonials`, and `cta` all render with enabled behavior

### Requirement: Support Common Sections
The system SHALL provide toggle support for the sections present on the current homepage: `banner`, `features`, `testimonials`, and `cta`. Additional sections MAY be registered later via the same macro without structural change.

**Context**: Scope is limited to sections that actually exist on today's homepage; broader coverage is deferred.

#### Scenario: Toggle the supported sections
- **WHEN** `zola.toml` sets `[extra.sections]` with `features = false` and `testimonials = false`
- **THEN** the homepage renders `banner` and `cta` but omits `features` and `testimonials` (production) or hides them (dev)

### Requirement: Single Reusable Section Macro
The system SHALL render homepage sections through a single reusable Tera `{% macro %}` parameterized by section id, enabled state, and dev flag, replacing per-section copy-pasted conditional blocks. Adding or removing a section's toggle SHALL be a single macro invocation.

#### Scenario: One macro drives all sections
- **WHEN** the homepage template is inspected
- **THEN** each toggled section is rendered via a call to the shared section macro
- **AND** no section repeats the visibility-resolution logic inline

