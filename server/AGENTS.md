> Extends: `/AGENTS.md`

# Server Agent Operating Notes

## Backend Stack Defaults
- TypeScript Express REST API; keep handlers thin and delegate business logic to `/server/src/services`.
- Enforce RESTful naming and HTTP semantics; document new routes in `/docs/api-surface.md`.
- Centralise configuration under `/server/src/config`; never hardcode secrets.

## Workflow Expectations
- Follow the root planning cadence; surface API contract changes in standups and summaries.
- Run `npm run test:server` (or the closest backend suite) before handing off changes.
- Ensure `/README.md` reflects new environment variables or scripts introduced for the backend.

## Templates & Patterns
- Use `/docs/templates/endpoint-handler.md` when scaffolding new controllers; replace placeholders before opening PRs.
- Group validation with `zod` or existing schema helpers; share reusable validators from `/server/src/validation`.
- Capture migration steps for database changes in `/docs/release-checklist.md`.
