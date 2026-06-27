# site-scaffolding Specification

## Purpose
TBD - created by archiving change add-white-label-theming. Update Purpose after archive.
## Requirements
### Requirement: Scaffolding Task Provision
The system SHALL provide a `mise run scaffold <target_dir>` task to initialize a new site.

**Context**: Engineers should bootstrap new projects via a single command without manual steps.

#### Scenario: Bootstrap a new site with scaffold task
**GIVEN** the theme maintainer has published `mise run scaffold` as a documented task  
**WHEN** a new site operator runs:  
```bash
mise run scaffold /path/to/my-new-site
```
**THEN** the following are created:  
- `/path/to/my-new-site/` as a new directory  
- `/path/to/my-new-site/content/`, `static/`, `i18n/`, `themes/` directories  
- `themes/zola-astroplate/` as a Git submodule  
- `zola.toml` with starter config including `[extra.theme]` with default colors  
- `content/_index.md` with basic homepage structure  
- `.gitignore` file  
- Initial Git commit  
**AND** the site can immediately run `zola serve`

### Requirement: Directory Initialization
The system SHALL create the target directory structure including `content/`, `static/`, `i18n/`, and `themes/` folders.

**Context**: New sites need a valid Zola project layout to function.

#### Scenario: Verify directory structure is created by scaffold task
**WHEN** `mise run scaffold /path/to/target_dir` completes  
**THEN** the following directories exist:
- `/path/to/target_dir/content/`
- `/path/to/target_dir/static/`
- `/path/to/target_dir/i18n/`
- `/path/to/target_dir/themes/`  
**AND** the directory structure is ready for immediate Zola project use

### Requirement: Theme Submodule Setup
The system SHALL initialize `zola-astroplate` as a Git submodule at `themes/zola-astroplate` in the new site.

**Context**: Theme updates should be managed via submodule versioning for maintainability.

#### Scenario: Verify theme submodule is initialized after scaffold
**WHEN** `mise run scaffold /path/to/target_dir` completes  
**THEN** `themes/zola-astroplate/` exists as a Git submodule  
**AND** the `.gitmodules` file contains an entry pointing to the public zola-astroplate repository  
**AND** running `git config --file .gitmodules --get-regexp path` shows the submodule is registered

### Requirement: Starter Configuration Copy
The system SHALL copy or generate a starter `zola.toml` with minimal required fields and `[extra.theme]` section.

**Context**: New sites need valid configuration; copy-paste from template is faster than manual creation.

#### Scenario: Start with ready-to-customize defaults
**GIVEN** a newly scaffolded site  
**WHEN** an engineer opens `zola.toml`  
**THEN** `[extra.theme]` contains default light and dark mode colors, font settings, and comments explaining each token  
**AND** changing a color value immediately affects the homepage on `zola serve`  
**AND** no additional configuration steps are required

### Requirement: Content Skeleton
The system SHALL initialize basic content structure: `content/_index.md` (homepage), `content/blog/`, and example pages in `content/pages/`.

**Context**: Sites should have a working structure immediately; engineers can edit or delete pages as needed.

#### Scenario: Inspect generated content structure
**GIVEN** a newly scaffolded site at `/path/to/my-site`  
**WHEN** listing the directory tree  
**THEN** the structure is:  
```
my-site/
├── content/
│   ├── _index.md
│   ├── blog/
│   └── pages/
│       ├── about.md
│       ├── contact.md
│       └── privacy.md
├── static/
│   └── images/
├── i18n/
├── themes/
│   └── zola-astroplate/ (submodule)
├── zola.toml
├── .gitignore
└── .git/
```

### Requirement: Git Repository Initialization
The system SHALL initialize a new Git repository in the target directory and commit initial scaffolding.

**Context**: Version control should be enabled from the start; initial commit captures scaffolding state.

#### Scenario: Verify git repo is initialized with initial commit
**WHEN** `mise run scaffold /path/to/target_dir` completes  
**THEN** `.git/` directory exists in the target directory  
**AND** `git log` shows an initial commit (with message indicating scaffolding)  
**AND** `git status` shows no uncommitted changes

### Requirement: Zero External Dependencies
The system SHALL use only shell (bash/sh) and standard Unix tools; no Node.js, Python, or external CLI dependencies required.

**Context**: Scaffolding must work on any system running Zola without requiring additional tool installation.

#### Scenario: Existing project adds the theme via scaffolding reference
**GIVEN** a team member needs to set up a local fork of an existing scaffolded site  
**WHEN** they clone the repository and run `git submodule update --init`  
**THEN** the theme is automatically fetched  
**AND** running `zola serve` immediately works without additional setup

