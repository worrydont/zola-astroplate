# Tasks: Add White-Label Theming to Zola-Astroplate

## ✅ Completed
- [x] 1.1 Design token config structure in zola.toml [extra.theme] (staged in zola.toml)
- [x] 1.2 Create theme-vars.html partial for runtime CSS var injection (staged, 42 lines)
- [x] 1.3 Integrate theme-vars.html into base.html head (staged in base.html, line 21)
- [x] 2.1 Create customizer.html Alpine.js dev-only modal (staged, 197 lines)
- [x] 2.2 Integrate customizer UI into served site (customizer.html wired in base.html & index.html sections wrapped in divs)
- [x] 2.3 Implement section toggle flags in zola.toml [extra.sections] (added to config and templates)
- [x] 2.4 Add conditional rendering to homepage sections (staged in index.html, if section.extra.*.enable pattern)
- [x] 2.5 Create new-site scaffolding task (mise run scaffold script created & verified)
- [x] 3.1 Test runtime CSS variable override (verified theme-override-styles injection via Node.js test)
- [x] 3.2 Test customizer export produces valid TOML (verified exported structure)
- [x] 3.3 Verify section toggles control rendering (verified wrapper element injection and config overrides)
- [x] 3.4 E2E test: full site scaffold + re-brand workflow (run successfully inside tmp/test-scaffold)

## 🚧 In Progress / Remaining
(None)
