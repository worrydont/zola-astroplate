## ADDED Requirements

### Requirement: Development-Only Visibility
The system SHALL render the customizer UI only when `config.mode == "serve"` (development environment).

**Context**: Production builds must not include unnecessary JavaScript or UI overhead; customizer is a development tool only.

#### Scenario: Customizer unavailable in production build
**GIVEN** a production build via `zola build`  
**WHEN** the HTML is generated  
**THEN** the customizer partial is completely omitted  
**AND** no JavaScript customizer code is included in the output

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
The system SHALL generate a TOML-formatted configuration block that represents the current customizer state and allow copy-paste export.

**Context**: Once satisfied with customizations, engineers must be able to export exact config back to `zola.toml` without manual transcription.

#### Scenario: Export customizer state to TOML
**GIVEN** the customizer has multiple color and font values set  
**WHEN** the engineer clicks an "Export Configuration" button  
**THEN** a text area appears containing a valid TOML block:  
```toml
[extra.theme]
primary = "#3498db"
body = "#ffffff"
font_primary = "Roboto, sans-serif"
# ... other set values
```
**AND** the text is easily selectable and copy-pasteable

### Requirement: State Persistence in DOM
The system SHALL update only the in-memory DOM via JavaScript; no network requests or file writes to `zola.toml` shall be made.

**Context**: Changes are experimental and temporary; export requires manual copy-paste to persist.

#### Scenario: Verify DOM style property persists until page reload
**WHEN** the customizer updates a color (e.g., sets primary to `#3498db`)  
**THEN** `document.documentElement.style.getPropertyValue('--color-primary')` returns the new value  
**AND** the DOM style property persists across all subsequent interactions until the page is reloaded

### Requirement: Alpine.js Implementation
The system SHALL use Alpine.js (already a project dependency) for interactivity; no additional JavaScript frameworks required.

**Context**: Minimize bundle size and external dependencies; Alpine.js is already loaded.

#### Scenario: Verify Alpine.js directives are used in customizer
**WHEN** the page is served in dev environment (`zola serve`)  
**AND** the customizer partial is rendered  
**THEN** inspecting the page source shows Alpine.js directives on the customizer modal (e.g., `x-data`, `@click`, `x-show`, `@change`)  
**AND** no other JavaScript frameworks (React, Vue, etc.) are present in the customizer code
