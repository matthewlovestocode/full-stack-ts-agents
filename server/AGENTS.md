> Extends: `/AGENTS.md`

# Server Agent Operating Notes

## Backend Stack Defaults
- TypeScript Express REST API; keep handlers thin and delegate business logic to `/server/src/services`.
- Enforce RESTful naming and HTTP semantics; document new routes in `/docs/api-surface.md`.
- Centralise configuration under `/server/src/config`; never hardcode secrets.
- Define routes inside Express `Router` modules grouped by resource (e.g., `/server/src/routes/users.ts`) and mount them in the main app entrypoint to keep RESTful boundaries clear.
- Store request handlers in `/server/src/handlers` so routers remain declarative and reusable logic stays isolated from wiring.

## Workflow Expectations
- Follow the root planning cadence; surface API contract changes in standups and summaries.
- Run `npm run lint --workspace server` and `npm run test:server` before handing off changes.
- Ensure `/README.md` reflects new environment variables or scripts introduced for the backend.
- Store backend environment variables in `server/.env`; keep secrets out of client-visible locations.
- Maintain `server/.env.example` with the required keys and safe placeholder values whenever contracts change.
- Coverage automation fails if backend coverage slips under 80%; run `npm run test:coverage --workspace server` ahead of review and create or update tests right away if the threshold is not met.

## Templates & Patterns
- Use `/docs/templates/endpoint-handler.md` when scaffolding new controllers; replace placeholders before opening PRs.
- Group validation with `zod` or existing schema helpers; share reusable validators from `/server/src/validation`.
- Capture migration steps for database changes in `/docs/release-checklist.md`.
