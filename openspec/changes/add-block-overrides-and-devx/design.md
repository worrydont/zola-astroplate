## Context

The theme renders home sections via `templates/macros/sections.html` (`section_macros::render`)
called from `index.html`, driven by `content/_index.md [extra]` + `config.extra.sections` toggles.
Navigation comes from `config.extra.menu_pages` (rendered in `partials/header.html`). A dev-only
Alpine.js customizer (`partials/customizer.html`, gated in `base.html` by `ZOLA_ENV == "dev"`) edits
color/font/section tokens live. `base.html` is the shared base all page templates extend.

Reviewing `zola-grayscale` (in `other/zola-grayscale`) surfaced: block-granular overrides,
`load_data`-based navigation, a `config.extra.debug` context-dump macro, and `[original]` theme
attribution. This change adapts the good parts to our stack without regressing the content-driven model.

## Goals / Non-Goals

**Goals:**
- Let downstream sites override individual home sections and the nav without replacing whole templates.
- Support navigation from config OR an external `navigation.toml`, external winning.
- Add live template-context inspection to the existing dev customizer.
- Credit upstream Astroplate.

**Non-Goals:**
- No change to default rendered output or the content-driven section model.
- No second dev-gate flag — reuse `ZOLA_ENV=dev` (explicitly NOT `config.extra.debug`).
- No Bootstrap / new UI deps (grayscale's offcanvas is not portable to our Tailwind/Alpine stack).
- No forced migration of consuming sites; `menu_pages` stays first-class.

## Decisions

- **Block wrapping, not restructuring.** Wrap each `section_macros::render(...)` call in
  `{% block section_<id> %}` and the nav in `{% block navigation %}`. Since `index.html` already
  extends `base.html`, override reachability is satisfied without moving files.
- **Nav precedence: `navigation.toml` wins if present.** Resolution order is
  `config.extra.menu_pages` (default) → `load_data(path="navigation.toml", required=false)` (override)
  → `{% block navigation %}` (hard override). `required=false` (Zola ≥0.19, we run 0.22.1) avoids a
  hard error when the file is absent.
- **Canonical schema `{ title, url }`.** A small normalization step maps alternate fields
  (`name`→`title`, `path`→`url`) so grayscale-style data files work. Keep `menu_pages` as the
  canonical shape; adapt the external file to it.
- **Inspector as a customizer tab.** Add a "Context" tab to the existing Alpine customizer that
  renders `page`/`section`/`config` via Tera `{{ ... | json_encode(pretty=true) }}` embedded into the
  Alpine state (or a `<pre>`), reusing the `ZOLA_ENV=dev` gate. One unified dev surface.
- **Attribution.** Add `[original]` to `theme.toml` (author/homepage/repo of Astroplate).

## Risks / Trade-offs

- **Block-name churn.** Downstream override contracts depend on stable block names; renaming later is
  breaking. Mitigation: name blocks by section id (`section_banner`, …) and document them once.
- **`load_data` path is site-root relative.** `navigation.toml` must sit at the consuming site root,
  not in the theme. Document clearly to avoid "why isn't my nav file picked up".
- **Precedence surprise.** A leftover `navigation.toml` silently overriding config could confuse.
  Mitigation: document the precedence and mention it in the README nav section.
- **Context size in inspector.** `config`/`section` JSON can be large; render lazily/in a scrollable
  `<pre>` and accept it's a dev-only surface (never shipped to prod).
- **Escaping.** `json_encode(pretty=true)` output must be emitted safely (`| safe`) inside a `<pre>`
  or Alpine `x-text` to avoid double-escaping; verify in a dev build.
