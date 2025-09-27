# Full-Stack Template

Starter workspace for a TypeScript React + Express project. Follow the agent guides in `/AGENTS.md` and scoped sub-guides for area-specific workflows.

## Why Use as a Developer
- **Ship PRs in minutes** — Trigger the `PR and merge` prompt from the Codex VS Code extension to stage changes, draft a rich summary, and even attach an optional Mermaid diagram before the workflow script opens and merges the pull request.
- **See the UI at a glance** — Run the `Crawl app` command to capture phone, tablet, and desktop screenshots of each route and regenerate a stakeholder-ready markdown report in `/docs/crawl.md`.
- **Stay green automatically** — Let Codex compose client and server tests (including coverage) so statements, branches, functions, and lines all clear the 80% bar; if coverage dips, the assistant guides you to add the missing tests before continuing.
- **Work from shared context** — Every task starts with synchronized AGENTS guides, workspace scripts, and documentation links so you and Codex reason about the same project map.
- **Harness focused agents** — Client and server guides encode stack-specific conventions so Codex can suggest idiomatic React patterns, Express routing layouts, and shared validation strategies without reinventing the codebase each sprint.
- **Refactor with confidence** — Reach for the Refactor Playbook and plan template to split risky rewrites into reviewable slices, then run `npm run refactor:verify` to gate delivery on passing lint and coverage.
- **Explore quickly** — Use the Playwright `analyze` and `crawl` commands to inspect layouts, accessibility, and responsive screenshots without leaving VS Code.
- **Document as you go** — The Docs hub keeps architecture, API surfaces, and release checklists in sync, while Codex updates indexes so newcomers discover fresh guides automatically.
- **Govern database evolution** — Supabase agents scaffold schema design proposals, capture approvals in `/docs/proposals`, and keep migrations paused until reviewers sign off, preventing drift between the API and the data layer.
- **Avoid AI slop** — The coordinated prompts, workspace scripts, and coverage gates keep Codex accountable to the repo’s standards, delivering reliable refactors and docs instead of the one-shot guesses common with generic AI helpers.

## Repo Layout
- `/client` — Vite-powered React frontend; see `client/AGENTS.md` for UI practices.
- `/server` — Express REST API; see `server/AGENTS.md` for backend conventions.
- Server routes live in Express `Router` modules (e.g., `server/src/routes/*`) that group handlers by resource and are mounted in the main app for RESTful organization.
- Server request handlers belong in `server/src/handlers/*` so routing layers stay thin and logic is easy to share.
- `/docs` — Documentation hub with architecture notes, API catalog, release checklists, and templates.
- `/supabase` — Database workspace for Supabase client code, schema snapshots, and migration artifacts (see `supabase/AGENTS.md`).
- `/playwright` — Browser automation workspace for rendering pages, running Chromium-based smoke checks, and scripted page analysis (see `playwright/AGENTS.md`).
- Client structure highlights:
  - `/src/components/` — reusable React components.
  - `/src/hooks/` — shared custom hooks.
  - `/src/api/` — modules that fetch data from the backend.
  - `/src/stores/` — Zustand stores for shared state.
  - `/src/views/` — top-level routed view components.

## Getting Started
1. Install dependencies: `npm install` (the root `package.json` wires up workspaces for client and server).
2. Launch dev servers:
   - Run both: `npm run dev`
   - Frontend only: `npm run dev:client`
   - Backend only: `npm run dev:server`
3. Keep docs in sync with code changes; update release checklist before deployments.

## Scripts
- `npm run build` — Run frontend and backend builds.
- `npm run lint` — Type-check both projects.
- `npm run test` — Execute workspace-level test commands.
- `npm run test:coverage` — Compose client and server coverage reports; mirrors the CI gate that fails if either side drops below 80%. When coverage falls under 80%, write or update tests before moving forward.
- `npm run dev:client` / `npm run dev:server` — Focus on a single stack during development.
- `npm run gh:workflow -- --branch feature/example --commit "feat: add example" --title "feat: add example" --summary "Sentence one. Sentence two."` — Automate the GitHub workflow (branch switch/create, commit, PR creation with summary and optional Mermaid block, approval (best-effort), merge into `main`, and branch cleanup). Requires `gh` CLI plus `GITHUB_TOKEN` and `GITHUB_REPOSITORY` env vars.
- `npm run analyze:playwright -- --url https://example.com` — Launch Chromium via Playwright to render a URL and emit an accessibility/layout summary (after `npx playwright install`).
- `npm run crawl:playwright -- --base http://127.0.0.1:5173 --routes /,/docs` — Generate responsive screenshots for each route and rebuild `docs/crawl.md`.
- `npm run refactor:verify` — Run linting plus the combined coverage gate to validate refactor branches before opening a PR.

### Automated PR Workflow
- Run `npm run gh:workflow` only after local tests, linting, and docs are complete; the helper squash-merges directly into `main` and deletes the feature branch.
- Never push commits directly to `main`; always land changes through a PR created by the workflow script so stakeholders can review the history.
- Make sure `npm run lint` succeeds (calls both client and server lint scripts) before committing or opening a PR.
- Required flags: `--branch`, `--commit`, `--title`, and `--summary` (must include 2-6 sentences). Optional `--mermaid "graph TD; ..."` appends a diagram to the PR body. Use `--base` to merge into a different branch when needed.
- Environment: provide `GITHUB_TOKEN` (with `repo` scope) and `GITHUB_REPOSITORY=owner/name` via `.env` or the shell so the GitHub CLI can authenticate without prompts.
- The script attempts to approve the PR; GitHub ignores the approval if you are the author, but the merge still succeeds.

## Environment Configuration
- Root `.env` / `.env.local` — Shared values consumed by scripts or tooling on both stacks. Start from `.env.example` and keep it updated with required keys.
- `client/.env` — Frontend-only variables; prefix with `VITE_` so Vite exposes them to the bundle. Mirror required entries in `client/.env.example` with instructional defaults.
- `server/.env` — Backend-only secrets and configuration read by Express via `process.env` (keep out of client scope). Document mandatory values in `server/.env.example` (e.g., set `IPINFO_TOKEN` for ipinfo geolocation lookups).
- `supabase/.env` — Supabase tooling credentials scoped to database automation. Mirror required values in `supabase/.env.example` and keep secrets out of client-visible code.
- Commit the `*.env.example` files so new contributors can bootstrap quickly without exposing secrets.

## Documentation
- [Docs Agent Guide](docs/AGENTS.md)
- [Codex Development Guide](docs/codex-development.md)
- [Documentation Hub](docs/README.md)
  - [Architecture Overview](docs/architecture.md)
  - [API Surface](docs/api-surface.md)
  - [Frontend Playbook](docs/frontend-playbook.md)
  - [Backend Operations](docs/backend-operations.md)
  - [Release Checklist](docs/release-checklist.md)
  - [Refactor Playbook](docs/refactor-playbook.md)
  - [Crawl Report](docs/crawl.md)
  - Templates
    - [Guide Pattern](docs/templates/guide-pattern.md)
    - [Component Pattern](docs/templates/component-pattern.md)
    - [Endpoint Handler Pattern](docs/templates/endpoint-handler.md)
    - [Refactor Plan Template](docs/templates/refactor-plan.md)
- Migration proposals live in `/docs/proposals/*.md`; review and approval must happen before any Supabase schema change is implemented.

Stay aligned with the agent operating guides and keep this README updated as new docs or scripts are introduced.
