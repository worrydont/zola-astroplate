## Context

`zola-astroplate` is currently a **theme-only** repo: it ships `templates/`, `static/`, `i18n/`,
`data/`, and `css/`, but has no `config.toml` or `content/`, so it cannot build on its own. The
consuming site (`worrydont-zola`) pulls it as a submodule and supplies `zola.toml` + `content/`.

By contrast, `mattimustang/zola-grayscale` is a full self-hosting site (root `config.toml` +
`content/`) and deploys via `shalzz/zola-deploy-action`, which builds and pushes to `gh-pages` in one
step. We want the same "repo is its own demo + CI preview" pattern here.

Key constraints from the theme's `AGENTS.md`/`mise.toml`:
- Zola version is `0.22.1`; `compile_sass = false` — the theme ships a committed
  `static/css/generated.css`, so the demo must NOT rebuild Sass.
- Theme code changes happen in this submodule and are committed/pushed here.

## Goals / Non-Goals

**Goals:**
- Make the repo root a buildable Zola site that uses itself as its theme.
- Publish a live demo to GitHub Pages on every default-branch push, with manual dispatch.
- Keep the change additive and non-breaking for the consuming site.

**Non-Goals:**
- No switch to the official `actions/deploy-pages` Pages-artifact flow (grayscale-style
  branch-publish is simpler and matches the reference).
- No Tailwind/CSS build in CI — the committed `generated.css` is authoritative.
- No changes to the consuming `worrydont-zola` site.

## Decisions

- **Self-as-theme layout.** Add root `config.toml` with `theme = "zola-astroplate"` and create a
  symlink `themes/zola-astroplate -> ..` so Zola resolves the theme to the repo itself. This is the
  established Zola theme-demo idiom and avoids duplicating template files.
- **Deploy tool: `shalzz/zola-deploy-action`, pinned** (matches grayscale, `@v0.19.x`+, bundles Zola
  and pushes to `gh-pages`). It reads `BUILD_ONLY=false` and `TOKEN=GITHUB_TOKEN`. If its bundled
  Zola lags `0.22.1`, fall back to a manual build: `mise`-installed Zola `0.22.1` +
  `peaceiris/actions-gh-pages` to publish `public/`. Decide at apply time by checking the action's
  Zola version.
- **`base_url`.** Set to `https://worrydont.github.io/zola-astroplate/` in `config.toml`; the
  workflow can override via the action's config if the repo/org name differs.
- **Trigger.** `on: push: branches: [main]` plus `workflow_dispatch`, mirroring the local
  `other/astroplate` reference. `permissions: contents: write` for the token.
- **Pages source.** Serve from the `gh-pages` branch (one-time repo setting).

## Risks / Trade-offs

- **Bundled Zola drift.** `zola-deploy-action`'s Zola may not equal `0.22.1`; templates using newer
  syntax could fail. Mitigation: the manual-build fallback above pins `0.22.1` exactly.
- **Symlink theme resolution.** A `themes/self -> ..` symlink must be committed and honored by the CI
  checkout (it is, with default git symlink handling on Linux runners).
- **Demo content maintenance.** The demo adds content that must not drift from theme capabilities;
  keep it minimal (home + one blog post + one page) to limit upkeep.
- **base_url mismatch.** If Pages serves at a different path, links break; documented as a checked
  apply-time step.
