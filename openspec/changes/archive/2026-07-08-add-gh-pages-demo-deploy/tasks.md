## 1. Scaffold the demo site

- [x] 1.1 Add root `config.toml` with `theme = "zola-astroplate"`, `base_url = "https://worrydont.github.io/zola-astroplate/"`, `compile_sass = false`, `build_search_index = true`, and required `[extra]` values the theme templates read (mirror the consuming `zola.toml`).
- [x] 1.2 Create the self-as-theme symlink `themes/zola-astroplate -> ..` and commit it.
- [x] 1.3 Add minimal `content/`: `_index.md` (home), `blog/_index.md` + one `blog/<post>.md`, and one standalone page (`about.md`), plus `[extra]` menu entries.
- [x] 1.4 Confirm the demo reuses the committed `static/css/generated.css` (no Sass/Tailwind build; `compile_sass = false`).

## 2. Verify local build

- [x] 2.1 Run `zola build` at the repo root; confirm exit 0 and `public/` contains home, blog list, blog post, and standalone page. Verified in a standalone checkout: exit 0, `Creating 2 pages (0 orphan) and 1 sections`, output includes `index.html` (home banner), `about/`, `blog/`, `blog/hello-world/`, `tags/demo/`, `categories/announcements/`. NOTE: when the repo is nested as a submodule inside the consuming site, the self-theme symlink makes Zola resolve the root to the parent site — build/preview the demo from a standalone checkout (CI does this).
- [x] 2.2 Run `zola check` and fix any broken internal links / missing `[extra]` keys. (Standalone `zola check` passes clean: exit 0, 2 pages, 0 orphan. Also fixed an invalid `[markdown] highlight_code` config key found during verification.)
- [ ] 2.3 Spot-check rendering with `zola serve` (theme CSS + templates applied). — deferred to manual `zola serve` / the live Pages URL; `zola build` + `zola check` both pass clean.

## 3. Add the deploy workflow

- [x] 3.1 Create `.github/workflows/deploy-gh-pages.yml` triggered `on: push: branches: [main]` and `workflow_dispatch`, with `permissions: contents: write`.
- [x] 3.2 Check `shalzz/zola-deploy-action`'s bundled Zola version; if it matches/exceeds `0.22.1`, use it (pinned) with `GITHUB_TOKEN`. Otherwise use the fallback. — `shalzz/zola-deploy-action@v0.22.1` bundles Zola 0.22.1 exactly (confirmed via its Dockerfile). Chose the fallback anyway for explicitness/control: pinned Zola 0.22.1 install + `zola build -o public` + `peaceiris/actions-gh-pages@v4` with `GITHUB_TOKEN`.
- [x] 3.3 Ensure the workflow does not rebuild CSS and handles the `themes/zola-astroplate` symlink correctly on the runner. (`-o public` writes output to the repo root; no Tailwind/Sass step; runner checkout is standalone so the self-theme symlink resolves to the checkout root.)

## 4. Enable Pages and validate

- [ ] 4.1 Push the branch; confirm the workflow runs green and creates/updates the `gh-pages` branch. — MANUAL follow-up (no commit/push in this change).
- [ ] 4.2 In repo settings, set GitHub Pages source to the `gh-pages` branch (one-time manual step). — MANUAL follow-up.
- [ ] 4.3 Load the published Pages URL; verify pages render, links resolve under the subpath, and CSS/assets load. — MANUAL follow-up.

## 5. Document

- [x] 5.1 Add a README section: demo Pages URL, how the self-hosting demo works, and how to build it locally (`zola build`/`serve`).
- [x] 5.2 Note in `AGENTS.md` (theme) that the repo root now doubles as a demo site so contributors don't confuse it with the consuming site.
