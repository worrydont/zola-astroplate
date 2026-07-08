## ADDED Requirements

### Requirement: CI builds and publishes the demo to GitHub Pages
The repository SHALL include a GitHub Actions workflow that builds the demo site with Zola and
publishes the output to the `gh-pages` branch on every push to the default branch.

#### Scenario: Push to default branch deploys
- **WHEN** a commit is pushed to the default branch
- **THEN** the workflow runs, builds the demo site, and pushes the generated output to the
  `gh-pages` branch

#### Scenario: Manual trigger
- **WHEN** a maintainer triggers the workflow via `workflow_dispatch` from the Actions tab
- **THEN** the workflow runs the same build-and-deploy steps

### Requirement: Deploy uses a pinned Zola deploy action and pinned Zola version
The workflow SHALL use a version-pinned deploy action and build with the Zola version declared in
`mise.toml` (`0.22.1`), so demo builds match local and consuming-site builds.

#### Scenario: Version consistency
- **WHEN** the workflow builds the demo
- **THEN** it uses Zola `0.22.1` and a pinned action reference (not a floating tag)

### Requirement: Deploy authenticates with the repository token
The workflow SHALL authenticate to push the `gh-pages` branch using the built-in `GITHUB_TOKEN`
with contents write permission, requiring no external secret.

#### Scenario: Token-based publish
- **WHEN** the deploy step runs
- **THEN** it uses `secrets.GITHUB_TOKEN` and successfully updates the `gh-pages` branch
