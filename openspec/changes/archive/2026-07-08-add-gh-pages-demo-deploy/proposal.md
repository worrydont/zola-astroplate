## Why

The `zola-astroplate` theme has no live demo. Prospective users must clone it and wire up a
consuming site to see what it looks like, and every PR ships without a build-time smoke test that
the theme still compiles. Other Zola themes (e.g. `mattimustang/zola-grayscale`) publish a demo to
GitHub Pages straight from their repo, which doubles as continuous validation of the theme.

## What Changes

- Add a **minimal demo site** at the theme repo root so the repository is a buildable Zola site that
  uses itself as its own theme (`config.toml` + a small `content/` tree + `navigation`/`extra`
  wiring), reusing the theme's committed `static/css/generated.css`.
- Add a **GitHub Actions workflow** that builds the demo with Zola on every push to the default
  branch and publishes the output to the `gh-pages` branch, modeled on the grayscale theme's use of
  `shalzz/zola-deploy-action`.
- Document the demo/deploy setup in the theme `README.md` (Pages URL, how to build the demo locally).

## Capabilities

### New Capabilities
- `demo-site`: A self-hosted example site inside the theme repo that renders the theme's pages
  (home, blog list + post, a regular page) so the theme can be previewed and build-tested.
- `pages-deployment`: A CI workflow that builds the demo site with Zola and deploys it to GitHub
  Pages on pushes to the default branch, runnable manually via `workflow_dispatch`.

### Modified Capabilities
<!-- none: no existing spec's requirements change -->

## Impact

- **New files (theme repo)**: `config.toml`, `content/**`, `.github/workflows/deploy-gh-pages.yml`,
  README section. Possibly `navigation.toml`/`[extra]` demo values.
- **Dependencies**: `shalzz/zola-deploy-action` (pinned) running Zola `0.22.1` (matches
  `mise.toml`); no changes to the theme's own runtime deps.
- **Repo settings**: GitHub Pages must be set to serve from the `gh-pages` branch (one-time manual
  step, documented in tasks).
- **Consuming site** (`worrydont-zola`): unaffected — it continues to pull the theme as a submodule;
  the new root `config.toml`/`content/` only drive the demo build.
