## ADDED Requirements

### Requirement: Colorwind theme.json Import
The system SHALL provide an import control in the customizer that accepts a [colorwind.dev](https://colorwind.dev/) `theme.json` file, parses its `light` and `dark` color objects, and applies the mapped colors to the page through the existing customizer state (live `document.documentElement` inline styles, `sessionStorage` draft, and TOML export). The system SHALL accept the file via a browser file picker and/or a paste-JSON input; no network request SHALL be made.

The import SHALL apply a fixed mapping from colorwind semantic keys to the Astroplate token registry keys (`data/tokens.toml`):

| colorwind key (light & dark) | Astroplate token (light) | Astroplate token (dark) |
|---|---|---|
| `background` | `body` | `darkmode_body` |
| `backgroundSecondary` / `card` | `light` | `darkmode_light` |
| `foreground` | `text` | `darkmode_text` |
| `foregroundMuted` | `text_light` | `darkmode_text_light` |
| `primary` | `primary` | `darkmode_primary` |
| `border` | `border` | `darkmode_border` |

Colorwind keys with no Astroplate slot (`backgroundMuted`, `cardForeground`, `input`, `ring`, `primaryForeground`, `secondary`, `secondaryForeground`, `success`, `warning`, `error`, `info`) SHALL be ignored. Astroplate tokens with no colorwind source (`text_dark`, `dark`, `darkmode_text_dark`, `darkmode_dark`, and the font tokens) SHALL be left unchanged by the import.

**Context**: Designers build palettes in colorwind.dev and export `theme.json`. A direct import removes hand-transcription. The mapping is intentionally lossy because the theme's runtime customizer can only recolor tokens whose Tailwind utilities already exist in the committed `generated.css`; introducing the unmapped semantic roles requires a CSS rebuild and is out of scope (tracked as a future "full Tailwind v4 / shadcn vocabulary" exploration).

#### Scenario: Import maps colorwind colors onto Astroplate tokens
- **WHEN** an engineer imports a colorwind `theme.json` whose `light.background` is `#FAFEFF` and `light.primary` is `#0891B2`
- **THEN** `--color-body` is set to `#FAFEFF` and `--color-primary` is set to `#0891B2` on `document.documentElement`
- **AND** the corresponding `dark.*` values are applied to the `darkmode_*` tokens
- **AND** the page reflects the new colors immediately without reload

#### Scenario: Unmapped colorwind keys are ignored
- **WHEN** the imported `theme.json` contains `success`, `ring`, and `primaryForeground` keys
- **THEN** those keys are silently ignored
- **AND** no CSS custom property is created for them
- **AND** no error is shown to the user

#### Scenario: Unsourced Astroplate tokens are preserved
- **WHEN** a colorwind `theme.json` (which has no `text_dark` or `dark` equivalent) is imported
- **THEN** the existing `--color-text-dark` and `--color-dark` values remain unchanged
- **AND** the font tokens remain unchanged

#### Scenario: Imported values participate in export and persistence
- **WHEN** an engineer imports a `theme.json` and then clicks "Export TOML"
- **THEN** the exported `[extra.theme]` block contains the imported values under their Astroplate keys
- **AND** the imported values are written to the `sessionStorage` draft so they survive a page refresh

#### Scenario: Reset reverts an import
- **WHEN** an engineer imports a `theme.json` and then clicks Reset
- **THEN** the `sessionStorage` draft is cleared
- **AND** all tokens revert to the configured/default cascade, discarding the imported colors

#### Scenario: Invalid file is rejected gracefully
- **WHEN** the selected file is not valid JSON or lacks both `light` and `dark` objects
- **THEN** the import is aborted with a non-blocking message
- **AND** the current customizer state is left unchanged
- **AND** no network request is made
