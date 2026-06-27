# AGENTS.md — zola-astroplate

A [Zola](https://www.getzola.org/) theme: a port of **Astroplate** built on the **Zolarwind**
architecture. Features: Tailwind v4, i18n, client-side search (minisearch), dark/light mode,
taxonomies (tags, categories).

## Two-repo model (read first)
- This repo (`worrydont/zola-astroplate`, public) is the **theme** and is consumed as a **git
  submodule** at `themes/zola-astroplate` inside the site repo `worrydont/worrydont-zola` (private).
- The theme is **NOT servable on its own** — it has no `config.toml`/`content/`. Always preview it
  through a consuming site's `zola serve`.
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

## Develop (mise tasks — Zola + Node auto-provisioned from `mise.toml`)
```bash
mise run setup       # npm install (Tailwind v4 deps)
mise run css:build   # one-off minified build -> static/css/generated.css
mise run css:watch   # rebuild on change
mise run dev         # pitchfork start css  — background Tailwind watcher (pitchfork.toml)
mise run stop        # stop the background watcher
```
Then run `zola serve` from the consuming site to preview. Zola dev server uses port **1111**.

## Conventions / hard rules
- **OpenSpec**: This project uses OpenSpec for feature work. Do not write code immediately; use `/opsx-explore` to discuss ideas, or `/opsx-propose` to create a plan and artifacts before implementing.
- After changing Tailwind classes or `css/main.css`, **rebuild `generated.css`** and commit it.
- Commit messages: **Conventional Commits** (`feat:`, `fix:`, `chore:` …). **No `Co-Authored-By` trailer.**
- Don't add features, error handling, or abstractions that weren't requested.
- Code search: prefer `ast-grep` for structural queries, `rg` for plain text.
