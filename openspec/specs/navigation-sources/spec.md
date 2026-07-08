# navigation-sources Specification

## Purpose
TBD - created by archiving change add-block-overrides-and-devx. Update Purpose after archive.

## Requirements
### Requirement: Navigation resolves from tiered sources with defined precedence
Navigation items SHALL be resolved from, in increasing precedence: (1) `config.extra.menu_pages`
as the built-in default, (2) an optional root `navigation.toml` loaded via
`load_data(required=false)` which OVERRIDES the config when present, and (3) a `{% block navigation %}`
template override which supersedes both.

#### Scenario: Config default only
- **WHEN** only `config.extra.menu_pages` is set and no `navigation.toml` exists
- **THEN** the nav renders from `config.extra.menu_pages`

#### Scenario: navigation.toml wins when present
- **WHEN** both `config.extra.menu_pages` and a root `navigation.toml` exist
- **THEN** the nav renders from `navigation.toml` and ignores `config.extra.menu_pages`

#### Scenario: Missing data file does not break the build
- **WHEN** no `navigation.toml` exists
- **THEN** `load_data(required=false)` returns falsy, the config default is used, and the build does not error

### Requirement: All navigation sources normalize to a single item schema
Regardless of source, each navigation item SHALL be normalized to `{ title, url }` before rendering,
so alternative field names (e.g. a `navigation.toml` using `name`/`path`) render correctly.

#### Scenario: Alternate field names are adapted
- **WHEN** a `navigation.toml` provides items using `name` and `path` fields
- **THEN** they render with the correct label and link via the normalized `{ title, url }` shape
