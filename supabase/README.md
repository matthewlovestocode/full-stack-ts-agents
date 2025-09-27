# Supabase Workspace

This directory hosts Supabase-specific assets used by the application.

## Structure
- `clients/` — Factories and helpers for creating Supabase clients.
- `migrations/` — Approved migration files applied to the project database.
- `seeds/` — Optional seed scripts for local environments.

## Workflow
1. Draft proposed schema changes as `/docs/proposals/<name>.md` and request feedback.
2. Wait for explicit approval before implementing any migration or client change.
3. After approval, author the migration in `migrations/`, update affected docs, and reference the proposal in the PR summary.
4. Use `supabase/.env` (mirrored via `supabase/.env.example`) for local tooling credentials.
5. Run `npm run lint --workspace supabase` before committing Supabase changes.

Refer to `supabase/AGENTS.md` for detailed operating guidance.
