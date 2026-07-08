## Why

The theme is easy to configure through content/config but hard to *extend*: a downstream site
cannot override a single home section or the navigation markup without replacing whole templates.
Reviewing the `zola-grayscale` theme surfaced three idiomatic Zola practices worth adopting — block
granular overrides, data-file navigation, and upstream attribution — plus a live template-context
inspector that fills a real dev gap. This change adds those capabilities without regressing the
current content-driven model.

## What Changes

- Wrap each home section render and the navigation in **named Tera `{% block %}`s** so a consuming
  site can override just one piece by extending the theme's templates. Default output is unchanged
  and stays content-driven (`content/_index.md [extra]`).
- Add a **tiered navigation source**: `config.extra.menu_pages` remains the built-in default; an
  optional root `navigation.toml` (via `load_data(required=false)`) **wins when present**; a
  `{% block navigation %}` override wins over both. All sources normalize to one `{title, url}` shape.
- Add a **context-inspector tab to the existing customizer** (`ZOLA_ENV=dev`-gated, Alpine/Tailwind)
  that pretty-prints `page` / `section` / `config` context. Reuses the current dev gate — does NOT
  introduce a separate `config.extra.debug` flag.
- Add an **`[original]` attribution block** to `theme.toml` crediting the upstream Astroplate theme.

## Capabilities

### New Capabilities
- `template-block-overrides`: Home sections and navigation are wrapped in named blocks so downstream
  sites can override individual pieces via template extension.
- `navigation-sources`: Navigation resolves from config default → optional `navigation.toml`
  (wins if present) → block override, normalized to a single `{title, url}` schema.
- `customizer-context-inspector`: A dev-only tab in the existing theme customizer that displays the
  current template context (`page`/`section`/`config`) as formatted JSON.
- `upstream-attribution`: `theme.toml` credits the upstream Astroplate theme via an `[original]` block.

### Modified Capabilities
<!-- none: existing spec requirements (sections, customizer behavior) are not changed, only extended -->

## Impact

- **Templates**: `templates/index.html` (wrap section renders + nav in blocks), `templates/base.html`
  and/or `partials/header.html` (navigation block + source resolution),
  `partials/customizer.html` (new inspector tab). No change to default rendered output.
- **Config/data**: optional new root `navigation.toml` (demo may add one to exercise it); no required
  config changes; `menu_pages` stays supported.
- **theme.toml**: add `[original]` block.
- **Dev gate**: reuses existing `ZOLA_ENV=dev`; no new flags.
- **Consuming site** (`worrydont-zola`): unaffected unless it opts into an override or `navigation.toml`.
- **Docs**: README/AGENTS note the override blocks, nav precedence, and inspector tab.
