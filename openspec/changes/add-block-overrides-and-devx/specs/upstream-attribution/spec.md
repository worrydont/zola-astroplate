## ADDED Requirements

### Requirement: theme.toml credits the upstream Astroplate theme
`theme.toml` SHALL include an `[original]` block attributing the upstream Astroplate theme this port
derives from, following the Zola-theme convention for ported themes.

#### Scenario: Attribution present and valid
- **WHEN** `theme.toml` is parsed
- **THEN** it contains an `[original]` block with author/homepage (and repo where known) referencing
  Astroplate, and the file remains valid TOML that Zola accepts
