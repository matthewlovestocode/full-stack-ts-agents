# Full-Stack Template

Starter workspace for a TypeScript React + Express project. Follow the agent guides in `/AGENTS.md` and scoped sub-guides for area-specific workflows.

## Repo Layout
- `/client` — Vite-powered React frontend; see `client/AGENTS.md` for UI practices.
- `/server` — Express REST API; see `server/AGENTS.md` for backend conventions.
- `/docs` — Documentation hub with architecture notes, API catalog, release checklists, and templates.

## Getting Started
1. Install dependencies: `npm install` (run in root if using workspaces, otherwise per package).
2. Launch dev servers:
   - Frontend: `npm run dev --prefix client`
   - Backend: `npm run dev --prefix server`
3. Keep docs in sync with code changes; update release checklist before deployments.

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
