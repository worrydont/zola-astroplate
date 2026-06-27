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

## New-Site Scaffolding Checklist

To spin up a new site from scratch using `zola-astroplate`:

1. **Create and enter a new directory**:
   ```bash
   mkdir my-new-site && cd my-new-site
   ```

2. **Initialize Git repository**:
   ```bash
   git init
   ```

3. **Add the theme as a submodule**:
   ```bash
   git submodule add https://github.com/worrydont/zola-astroplate themes/zola-astroplate
   ```

4. **Create the initial site structure**:
   ```bash
   mkdir -p content templates static i18n
   ```

5. **Copy recommended initial configuration**:
   Create a `zola.toml` in your site's root directory and paste the **Required / reference configuration** block shown above.

6. **Initialize the homepage content**:
   Create `content/_index.md` with homepage sections (you can copy the structure from the demo site's `content/_index.md` or start simple):
   ```markdown
   +++
   title = "Home"
   template = "index.html"
   
   [extra.banner]
   enable = true
   title = "Welcome to My New Site"
   content = "Built with Zola and zola-astroplate theme."
   +++
   ```

7. **Run the site locally**:
   With `zola` installed on your system:
   ```bash
   zola serve
   ```
   Open `http://127.0.0.1:1111` in your browser.

## Theme Customizer (Live White-labeling)

The theme ships with a live-preview customizer modal to rapidly prototype colors, typography, and UI sections directly in the browser.

To enable it during local development, add this to your `zola.toml`:

```toml
[extra.theme]
customizer_enabled = true
```

**Workflow:**
1. Run `zola serve` and open `http://127.0.0.1:1111` in your browser.
2. Click the floating circular button in the bottom-right corner to open the customizer.
3. Tweak your light/dark colors, fonts, and section visibility. 
4. Click **Export Config (TOML)** at the bottom of the panel and paste the snippet directly into your `[extra.theme]` and `[extra.sections]` blocks to save your changes.

> **⚠️ Production Warning:** Zola templates cannot natively detect if they are being built vs. served. You **must** manually set `customizer_enabled = false` before running your production `zola build`, otherwise the modal will ship to your live users.

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
