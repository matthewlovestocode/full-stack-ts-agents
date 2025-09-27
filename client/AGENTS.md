> Extends: `/AGENTS.md`

# Client Agent Operating Notes

## Frontend Stack Defaults
- Vite-powered React + TypeScript; prefer functional components and hooks.
- Reach for Zustand when state grows beyond local component scope or multiple routes share data.
- Keep shared UI primitives in `/client/src/components/common` so they stay discoverable.
- Project structure expectations:
  - `/src/components/` — shared and domain components.
  - `/src/hooks/` — reusable custom hooks.
  - `/src/api/` — data-fetching clients encapsulating server calls.
  - `/src/stores/` — Zustand stores plus related selectors/actions.
  - `/src/views/` — top-level route views that compose components and state.

## Workflow Expectations
- Mirror root planning and documentation rules; call out `/docs/frontend` updates in the summary.
- Run `npm run test --workspace client` for component suites when touching shared UI.
- Update `/README.md` if new frontend scripts or npm commands are introduced.
- Keep client environment variables in `client/.env` using the `VITE_` prefix so Vite exposes them safely.
- When adding or renaming frontend env vars, update `client/.env.example` with placeholder values so onboarding stays smooth.
- CI enforces an 80% minimum for client coverage; run `npm run test:coverage --workspace client` before hand-off when changes could impact the gate.

## Templates & Patterns
- Start new components from `/docs/templates/component-pattern.md`; remove placeholder tokens before review.
- Co-locate component-specific tests under the same directory using `.test.tsx` naming.
- Prefer CSS Modules or existing styling convention; avoid introducing new global styles without team agreement.
