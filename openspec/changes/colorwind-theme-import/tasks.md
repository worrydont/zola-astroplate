## 1. Mapping & parse logic

- [x] 1.1 Add a fixed `COLORWIND_MAP` to the customizer Alpine component: colorwind key → `{ light: <registry key>, dark: <darkmode_ key> }`, covering `background`, `backgroundSecondary`/`card`, `foreground`, `foregroundMuted`, `primary`, `border` (with `card` taking precedence over `backgroundSecondary` for the `light` slot).
- [x] 1.2 Add a `parseColorwind(jsonText)` method: `JSON.parse`, validate presence of a `light` and/or `dark` object, return the parsed object or throw a friendly error.
- [x] 1.3 Add an `applyColorwind(theme)` method that, for each mapped colorwind key present in `theme.light`/`theme.dark`, resolves the target `cssVar` from the registry and sets `this.values[cssVar]`, then calls the existing apply+save path (`onValueChange` / `_saveDraft`) so live preview, sessionStorage, and export all update.
- [x] 1.4 Track and surface a post-import summary count (applied vs ignored keys).

## 2. Import UI

- [x] 2.1 Add an "Import" affordance to the customizer panel footer (near Reset/Export): a file `<input type="file" accept="application/json">` and/or a paste-JSON textarea, wired with Alpine directives only.
- [x] 2.2 On file select, read via the File API (`FileReader`/`text()`), pass to `parseColorwind` → `applyColorwind`; on paste, do the same from the textarea value.
- [x] 2.3 Show a non-blocking inline message for success (e.g. "Applied N colors, ignored M unsupported") and for failure (invalid JSON / missing light&dark), leaving state unchanged on failure.

## 3. Verify

- [x] 3.1 Serve with `mise run serve`; import `tmp/theme.json` (colorwind sample) and confirm `--color-body` and `--color-primary` update live (use playwright-cli `run-code` with `page.evaluate` on `document.documentElement.style`).
- [x] 3.2 Confirm unmapped keys (`success`, `ring`, `primaryForeground`) create no custom properties, and `--color-text-dark` / `--color-dark` are unchanged.
- [x] 3.3 Confirm Export TOML includes imported values and that they survive a page refresh (sessionStorage); confirm Reset reverts the import.
- [x] 3.4 Confirm an invalid file aborts gracefully with no state change and no network request.

## 4. Wrap-up

- [x] 4.1 Rebuild theme CSS only if needed (it is not for this change) and run `mise run check`.
- [ ] 4.2 Commit in the theme submodule, then bump the submodule pointer in the site repo.
