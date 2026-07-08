# AGENTS.md — zola-astroplate

A [Zola](https://www.getzola.org/) theme: a port of **Astroplate** built on the **Zolarwind**
architecture. Features: Tailwind v4, i18n, client-side search (minisearch), dark/light mode,
taxonomies (tags, categories).

## Two-repo model (read first)
- This repo (`worrydont/zola-astroplate`, public) is the **theme** and is consumed as a **git
  submodule** at `themes/zola-astroplate` inside the site repo `worrydont/worrydont-zola` (private).
- The repo root **also doubles as a self-hosted demo site** (root `config.toml` + `content/` + a
  `themes/zola-astroplate -> ..` self-theme symlink) that publishes to GitHub Pages via
  `.github/workflows/deploy-gh-pages.yml`. The demo is intentionally minimal — do NOT confuse it
  with the consuming site (`worrydont-zola`).
- Build/preview the demo from a **standalone checkout** (`zola build` / `zola serve`). Caveat: when
  this repo sits as a submodule inside the consuming site, the `themes/zola-astroplate -> ..`
  self-theme symlink makes Zola resolve the root to the *parent* site, so a build from the nested
  path builds the parent, not the demo. CI checks out standalone, so deploys are unaffected. The
  workflow uses `zola build -o public` and does **not** rebuild CSS (`compile_sass = false`;
  committed `static/css/generated.css`).
- Workflow when developing the theme: edit here → Tailwind rebuilds `static/css/generated.css` →
  the site's `zola serve` live-reloads. Commit + push here, then bump the submodule pointer in the site.

## Where things live
- `templates/` — `base.html`, `index.html`, `blog.html`, `blog-post.html`, `404.html`,
  `categories/`, `tags/`, `partials/`, `shortcodes/`. Templates reference each other by bare name.
- `css/main.css` — Tailwind **source**. `static/css/generated.css` — **built, committed** output
  (consumers never run Tailwind). Never hand-edit `generated.css`.
- `i18n/en.toml` — translation strings, loaded at runtime via the site's
  `[extra] path_language_resources = "themes/zola-astroplate/i18n/"`.
- `static/js/zola-astroplate/logic.js` — theme JS (e.g. dark-mode toggle), loaded in `base.html`.
  `static/js/search.js` + `minisearch.min.js` — search.
- `theme.toml` — theme metadata (`name = "zola-astroplate"`, `min_version = "0.19.0"`).
- `screenshot.png` — gallery image (committed). No screenshot script lives here.

## Config the templates expect (set in the consuming site's `zola.toml` `[extra]`)
`title`, `site_description`, `copyright`, `author`, `path_language_resources`, `favicon_svg`,
`logo`, `logo_darkmode`, `menu_pages`, `footer_pages`, `social_links`, and dark/light toggle SVGs
under `[extra.displaymode.sun]` / `[extra.displaymode.moon]`. Taxonomies: `tags`, `categories`.
See `README.md` for a complete reference block.

**TOML gotcha:** keys under `[extra]` (e.g. `menu_pages`) must appear **before** any `[extra.xxx]`
sub-table header in the same file, or TOML silently nests them under that sub-table instead. The
demo's own root `config.toml` has this exact bug today (`menu_pages`/`footer_pages`/`social_links`
/`logo*` end up under `[extra.theme]`) — pre-existing, unrelated to block-overrides/navigation-sources
work; fix by moving those keys above `[extra.theme]`.

## Template Block Overrides, Navigation Sources, Context Inspector
- Home sections (`section_banner`, `section_features`, `section_testimonials`, `section_cta` in
  `templates/index.html`) and navigation (`navigation`, `navigation_mobile` in
  `templates/partials/header.html`) are wrapped in named Tera blocks. A consuming site extends the
  theme template and redefines only the block it wants to change — see `README.md` →
  "Template Block Overrides".
- Navigation resolves `config.extra.menu_pages` (default) → root `navigation.toml`
  (`load_data(required=false)`, wins if present) → block override (wins over both). Items
  normalize to `{ title, url }` (`name`/`path` also accepted). `navigation.toml` must live at the
  **consuming site's root**, not inside the theme.
- The dev customizer (`partials/customizer.html`, `ZOLA_ENV=dev`-gated) has a **Context** tab that
  pretty-prints `page`/`section`/`config` as JSON. No new dev-gate flag was added.

## Develop (mise tasks — Zola + Node auto-provisioned from `mise.toml`)
```bash
mise run setup       # npm install (Tailwind v4 deps)
mise run css:build   # one-off minified build -> static/css/generated.css
mise run css:watch   # rebuild on change
mise run dev         # pitchfork start css  — background Tailwind watcher (pitchfork.toml)
mise run stop        # stop the background watcher
```
Then run `mise run serve` from the consuming site (`worrydont-zola/`) to preview — starts the pitchfork background daemon on port **1111**. Use `mise run stop` to stop it.

## Browser testing with playwright-cli

Use the `/playwright-cli` skill (`~/.claude/skills/playwright-cli/scripts/pw`).

**Setup gotcha:** `playwright-cli` defaults to Google Chrome at `/opt/google/chrome` which is not installed. Always pass `--browser chromium`:
```bash
~/.claude/skills/playwright-cli/scripts/pw open --browser chromium http://127.0.0.1:1111/
```

The theme is not self-servable — always test via the consuming site's dev server (`mise run serve` from `worrydont-zola/`, port 1111).

**Efficient pattern:**
1. Start server: `mise run serve` (pitchfork waits until port 1111 is ready — no manual sleep needed).
2. `scripts/pw open --browser chromium URL` — inline snapshot, no extra Read needed.
4. Read refs from snapshot (`e160`, `e178` …) and interact: `scripts/pw click e160`, `scripts/pw fill e178 "#ff0000"`, `scripts/pw reload`.
5. For JS assertions, use `playwright-cli run-code` directly (return value appears as `### Result`):
   ```bash
   playwright-cli run-code "async page => page.evaluate(() => document.documentElement.style.getPropertyValue('--color-primary'))"
   ```
6. Stop server when done: `mise run stop`.

**`run-code` rule:** anything touching the DOM (`getComputedStyle`, `sessionStorage`, etc.) must go inside `page.evaluate(() => ...)` — those globals are not available in the outer `run-code` scope.

## Conventions / hard rules
- **OpenSpec**: This project uses OpenSpec for feature work. Do not write code immediately; use `/opsx-explore` to discuss ideas, or `/opsx-propose` to create a plan and artifacts before implementing.
- After changing Tailwind classes or `css/main.css`, **rebuild `generated.css`** and commit it.
- Commit messages: **Conventional Commits** (`feat:`, `fix:`, `chore:` …). **No `Co-Authored-By` trailer.**
- Don't add features, error handling, or abstractions that weren't requested.
- Code search: prefer `ast-grep` for structural queries, `rg` for plain text.
