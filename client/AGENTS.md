> Extends: `/AGENTS.md`

# Client Agent Operating Notes

## Frontend Stack Defaults
- Vite-powered React + TypeScript; prefer functional components and hooks.
- Reach for Zustand when state grows beyond local component scope or multiple routes share data.
- Keep shared UI primitives in `/client/src/components/common` so they stay discoverable.

## Workflow Expectations
- Mirror root planning and documentation rules; call out `/docs/frontend` updates in the summary.
- Run `npm run test -- --watch=false` for component suites when touching shared UI.
- Update `/README.md` if new frontend scripts or npm commands are introduced.

## Templates & Patterns
- Start new components from `/docs/templates/component-pattern.md`; remove placeholder tokens before review.
- Co-locate component-specific tests under the same directory using `.test.tsx` naming.
- Prefer CSS Modules or existing styling convention; avoid introducing new global styles without team agreement.
