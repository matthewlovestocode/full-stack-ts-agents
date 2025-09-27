# Full-Stack Template

Starter workspace for a TypeScript React + Express project. Follow the agent guides in `/AGENTS.md` and scoped sub-guides for area-specific workflows.

## Repo Layout
- `/client` — Vite-powered React frontend; see `client/AGENTS.md` for UI practices.
- `/server` — Express REST API; see `server/AGENTS.md` for backend conventions.
- `/docs` — Documentation hub with architecture notes, API catalog, release checklists, and templates.

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
- `npm run test:coverage` — Compose client and server coverage reports; mirrors the CI gate that fails if either side drops below 80%.
- `npm run dev:client` / `npm run dev:server` — Focus on a single stack during development.

## Environment Configuration
- Root `.env` / `.env.local` — Shared values consumed by scripts or tooling on both stacks. Start from `.env.example` and keep it updated with required keys.
- `client/.env` — Frontend-only variables; prefix with `VITE_` so Vite exposes them to the bundle. Mirror required entries in `client/.env.example` with instructional defaults.
- `server/.env` — Backend-only secrets and configuration read by Express via `process.env` (keep out of client scope). Document mandatory values in `server/.env.example`.
- Commit the `*.env.example` files so new contributors can bootstrap quickly without exposing secrets.

## Documentation
- [Docs Agent Guide](docs/AGENTS.md)
- [Documentation Hub](docs/README.md)
  - [Architecture Overview](docs/architecture.md)
  - [API Surface](docs/api-surface.md)
  - [Frontend Playbook](docs/frontend-playbook.md)
  - [Backend Operations](docs/backend-operations.md)
  - [Release Checklist](docs/release-checklist.md)
  - Templates
    - [Guide Pattern](docs/templates/guide-pattern.md)
    - [Component Pattern](docs/templates/component-pattern.md)
    - [Endpoint Handler Pattern](docs/templates/endpoint-handler.md)

Stay aligned with the agent operating guides and keep this README updated as new docs or scripts are introduced.
