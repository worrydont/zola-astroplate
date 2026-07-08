# demo-site Specification

## Purpose
The theme repository is itself a buildable Zola site that uses `zola-astroplate` as its theme, so the
theme can be previewed and build-tested (locally and in CI) without a separate consuming project.

## Requirements

### Requirement: Repository is a buildable self-hosting Zola site
The theme repository SHALL contain a root `config.toml` and `content/` tree that make the repository
itself a valid Zola site using `zola-astroplate` as its theme, so the theme can be previewed and
build-tested without a separate consuming project.

#### Scenario: Demo site builds cleanly
- **WHEN** `zola build` is run at the repository root
- **THEN** the build completes with exit code 0 and produces a `public/` directory containing the
  rendered home page

#### Scenario: Theme is applied to the demo
- **WHEN** the demo site is built
- **THEN** the theme's templates and committed `static/css/generated.css` are used (no per-site Sass
  compilation), matching the consuming site's rendering

### Requirement: Demo content exercises the theme's core page types
The demo `content/` SHALL include, at minimum, a home page, a blog section with at least one post,
and one standalone page, so the published demo showcases the theme's primary layouts.

#### Scenario: Core pages are present in the build
- **WHEN** the demo site is built
- **THEN** the output includes the home page, the blog list page, at least one blog post page, and
  the standalone page

### Requirement: Demo base URL is configurable for GitHub Pages
The demo `config.toml` SHALL set `base_url` to the GitHub Pages project URL, and the deploy workflow
MAY override it, so internal links and assets resolve correctly under the Pages subpath.

#### Scenario: Links resolve under the Pages subpath
- **WHEN** the demo is built for the configured GitHub Pages `base_url`
- **THEN** navigation links and static asset references point at the Pages URL and are not broken
