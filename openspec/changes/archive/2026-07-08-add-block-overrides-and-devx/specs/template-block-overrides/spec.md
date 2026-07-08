## ADDED Requirements

### Requirement: Home sections are individually overridable via named blocks
Each home-page section render SHALL be wrapped in a uniquely named Tera `{% block %}` so a consuming
site can override a single section by extending the theme template, without replacing the whole page.

#### Scenario: Default output unchanged
- **WHEN** no site-level override is provided and the demo home page is built
- **THEN** the rendered sections are byte-for-byte equivalent to the pre-change content-driven output

#### Scenario: Downstream overrides one section
- **WHEN** a consuming site extends the theme's index template and redefines only `{% block section_features %}`
- **THEN** its custom features markup is rendered while banner, testimonials, and cta remain the theme defaults

### Requirement: Navigation markup is overridable via a named block
The navigation region SHALL be wrapped in a `{% block navigation %}` so a consuming site can replace
the entire nav markup while leaving the rest of the layout intact.

#### Scenario: Nav block override
- **WHEN** a consuming site redefines `{% block navigation %}`
- **THEN** its nav markup replaces the theme's default nav and no other blocks are affected

### Requirement: Overrides use template extension over the theme base
Block overrides SHALL work through Zola/Tera template extension against the theme's `base.html`, so
the section and navigation blocks MUST be reachable from a template a consuming site can extend.

#### Scenario: Extension resolves theme base
- **WHEN** a consuming site provides its own template that extends the theme base and overrides a block
- **THEN** the build resolves the theme base, applies the override, and completes with exit code 0
