> Extends: `/AGENTS.md`

# Supabase Agent Operating Notes

## Workspace Overview
- Manage database integrations, SQL migrations, and Supabase client utilities in `/supabase`.
- Keep environment-specific credentials in `supabase/.env`; document required keys in `supabase/.env.example` and never commit real secrets.
- Co-locate client helpers in `/supabase/clients` so the server layer can import a single, well-typed entry point.

## Change Management
1. **Design** — Draft every schema or data change as `/docs/proposals/<short-name>.md`. Capture goals, impact, and rollout/rollback steps. Use existing doc templates when possible.
2. **Review** — Pause for explicit approval from the stakeholder/maintainer before touching code. Implementation work MUST wait until the proposal is accepted.
3. **Implement** — After approval, add migration SQL or Supabase migration scripts under `/supabase/migrations/<timestamp>_<name>.sql` (or equivalent tooling directory). Update `/docs/api-surface.md` and other references impacted by the change.
4. **Verify** — Run automated checks (e.g., `npm run lint --workspace supabase`, backend tests, migration dry-runs) before opening a PR. Document manual verification steps in the proposal thread or PR description.

## Directory Expectations
- `/supabase/clients/` — Typed Supabase client factories or service utilities.
- `/supabase/migrations/` — Checked-in SQL/TypeScript migration files generated after proposal approval.
- `/supabase/seeds/` — Optional seed scripts for local development.
- `/supabase/.env.example` — Placeholder credentials required for local tooling (never real secrets).

## Collaboration Rituals
- Surface upcoming database work during planning updates; link to the active proposal doc for context.
- When proposals close (either accepted or rejected), note the outcome in the document and link the associated PR if implemented.
- Keep `/README.md` and `/docs/api-surface.md` accurate after migrations ship.
