# zola-astroplate

A port of [Astroplate](https://github.com/zeon-studio/astroplate) to [Zola](https://www.getzola.org/),
built on the Zolarwind architecture. Tailwind v4, i18n, client-side search, dark/light mode, taxonomies.

- **License:** MIT
- **Min Zola version:** 0.19.0
- **Homepage:** https://github.com/worrydont/zola-astroplate

![zola-astroplate screenshot](screenshot.png)

## Install

As a git submodule (recommended — easy updates):

```bash
git submodule add https://github.com/worrydont/zola-astroplate themes/zola-astroplate
```

Or a plain clone into your site's `themes/` directory:

```bash
git clone https://github.com/worrydont/zola-astroplate themes/zola-astroplate
```

## Use

In your site's `config.toml` (or `zola.toml`), set the theme at the **top level** of the file:

```toml
theme = "zola-astroplate"
```

This theme loads its i18n strings via an `[extra]` variable — point it at the theme's `i18n/` dir:

```toml
[extra]
path_language_resources = "themes/zola-astroplate/i18n/"
```

### Required / reference configuration

The theme expects the following config. Copy this as a starting point and adjust:

```toml
compile_sass = false
build_search_index = true
generate_feeds = true

taxonomies = [
    { name = "tags", paginate_by = 6, feed = true },
    { name = "categories", paginate_by = 6, feed = true },
]

[extra]
title = "Your Site"
site_description = "Your description"
copyright = "Copyright {year} by You"
author = { name = "You", homepage = "https://example.com" }
path_language_resources = "themes/zola-astroplate/i18n/"
favicon_svg = "/img/yin-yang.svg"
logo = "/images/logo.png"
logo_darkmode = "/images/logo-darkmode.png"

menu_pages = [
    { title = "Home", url = "/" },
    { title = "Blog", url = "/blog/" },
]
footer_pages = [
    { title = "Privacy Policy", url = "/pages/privacy/" },
]
social_links = [
    # { name = "github", enabled = true, link = "...", svg = '...' },
]
```

Dark/light toggle icons are supplied via `[extra.displaymode.sun]` / `[extra.displaymode.moon]`
(inline SVG). See this theme's source/demo site for a complete working `[extra]` block.

## Customizing

Override any theme file by creating a file with the same path in your site's `templates/` or
`static/` directory. Override config values in your `[extra]` section. See the
[Zola theme docs](https://www.getzola.org/documentation/themes/installing-and-using-themes/).

## Development

This repo ships [mise](https://mise.jdx.dev/) tasks; with mise installed the required tools
(Zola, Node) are provisioned automatically. The compiled `static/css/generated.css` is
**committed**, so consumers never need to run Tailwind.

```bash
mise run setup       # install Tailwind v4 build deps (npm install)
mise run css:build   # one-off minified build -> static/css/generated.css
mise run css:watch   # rebuild on every change
```

Plain npm equivalents (`npm install`, `npm run css:build`, `npm run css:watch`) also work.

### Live preview with pitchfork

A theme is previewed through a site that uses it. Run the Tailwind watcher in the background with
[pitchfork](https://github.com/jdx/pitchfork) (config in `pitchfork.toml`) while the parent site's
`zola serve` live-reloads as the CSS rebuilds:

```bash
mise run dev    # pitchfork start css  — background Tailwind watcher
mise run logs   # tail the watcher
mise run stop   # stop the watcher
```

## Screenshot

`screenshot.png` (shown above) is committed for the theme gallery. To refresh it, capture the
running demo site at `http://127.0.0.1:1111`.
