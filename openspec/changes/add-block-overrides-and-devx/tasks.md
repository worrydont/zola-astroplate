## 1. Block-override wrapping

- [x] 1.1 In `templates/index.html`, wrap each `section_macros::render(...)` call in a named block: `{% block section_banner %}`, `section_features`, `section_testimonials`, `section_cta`.
- [x] 1.2 Wrap the navigation region (in `partials/header.html` or `base.html`) in `{% block navigation %}`.
- [x] 1.3 Confirm the section/nav blocks are reachable via extension of `base.html` (no file moves needed).

## 2. Tiered navigation sources

- [x] 2.1 Add a nav-source resolver: default `config.extra.menu_pages`; if `load_data(path="navigation.toml", required=false)` is truthy, use it instead (external wins).
- [x] 2.2 Normalize items to `{ title, url }` (map `name`→`title`, `path`→`url`) so external files with alternate field names render.
- [x] 2.3 Render nav from the normalized list inside `{% block navigation %}`.

## 3. Customizer context-inspector tab

- [x] 3.1 Add a "Context" tab to `partials/customizer.html` (consistent with existing light/dark/fonts/sections tabs).
- [x] 3.2 Feed it pretty JSON of `page` / `section` / `config` via `json_encode(pretty=true)`, emitted safely into a scrollable `<pre>` / Alpine state.
- [x] 3.3 Confirm it stays under the existing `ZOLA_ENV=dev` gate; do NOT add `config.extra.debug`.

## 4. Upstream attribution

- [x] 4.1 Add an `[original]` block to `theme.toml` crediting Astroplate (author/homepage/repo).

## 5. Verify

- [x] 5.1 Standalone dev build (`ZOLA_ENV=dev zola build`): all sections still render by default; customizer shows the new Context tab with readable JSON; no double-escaping.
- [x] 5.2 Prod build (no `ZOLA_ENV`): output identical to pre-change defaults; no customizer/inspector emitted; `zola check` passes.
- [x] 5.3 Nav precedence: with only config → renders config; add a root `navigation.toml` (name/path fields) → it wins and renders correctly; remove it → no build error.
- [x] 5.4 Override smoke test: a template overriding `{% block section_features %}` replaces only that section.

## 6. Document

- [x] 6.1 README/AGENTS: list the override block names, the nav precedence (navigation.toml wins), where `navigation.toml` must live (site root), and the Context inspector tab.
