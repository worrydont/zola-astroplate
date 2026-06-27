## ADDED Requirements

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
The system SHALL check section toggle flags in Zola templates and render sections only if enabled.

**Context**: Disabled sections must be completely omitted from HTML output, reducing file size and layout complexity.

#### Scenario: Enable features section by default
**GIVEN** a site with no `[extra.sections]` configuration  
**WHEN** the features section template checks:  
```html
{% if extra.sections.features.enabled | default(value=true) %}
  {% include "partials/features.html" %}
{% endif %}
```
**AND** the site is served  
**THEN** the features section renders because the default is true  
**AND** no `zola.toml` entry is required

### Requirement: Default Enable Behavior
The system SHALL treat missing or unset toggle flags as `enabled = true` (opt-out pattern).

**Context**: Existing sites should continue working without modification; sections render by default.

#### Scenario: Verify sections render by default without toggle flags
**GIVEN** a site with no `[extra.sections]` configuration in `zola.toml`  
**WHEN** the site is served via `zola serve`  
**THEN** all section partials (banner, hero, features, blog, testimonials, cta, footer, navigation) render with enabled behavior  
**AND** the homepage displays all default sections without requiring explicit toggle configuration

### Requirement: Support Common Sections
The system SHALL provide toggle support for commonly customized sections: `banner`, `hero`, `features`, `blog`, `testimonials`, `cta`, `footer`, and `navigation`.

**Context**: These are typical sections in marketing and informational sites.

#### Scenario: Toggle multiple sections for minimal landing page
**GIVEN** a site that should render only hero and CTA sections  
**WHEN** `zola.toml` contains:  
```toml
[extra.sections]
banner.enabled = false
features.enabled = false
blog.enabled = false
testimonials.enabled = false
navigation.enabled = false
```
**THEN** only hero and CTA sections are rendered on the homepage  
**AND** the generated HTML is minimal and focused

#### Scenario: Enable/disable sections per page via front matter
**GIVEN** a custom page content file  
**WHEN** the page front matter includes:  
```yaml
+++
sections = { testimonials.enabled = false }
+++
```
**AND** the template merges page-level and global settings  
**THEN** the testimonials section is hidden on this page only  
**AND** other pages retain global configuration
