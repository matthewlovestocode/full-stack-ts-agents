# Frontend Playbook

## Tech Stack
- React + TypeScript bootstrapped with Vite.
- State management defaults to React hooks; use Zustand when data spans routes or requires optimistic updates.
- Testing via `vitest` and `@testing-library/react`.

## Project Structure
- Components live under `/client/src/components` with domain-specific folders.
- Shared primitives reside in `/client/src/components/common` and should stay framework-agnostic.
- Hooks are stored in `/client/src/hooks`; add JSDoc comments for complex effects.

## Workflow Checklist
1. Plan changes and note dependencies in standups.
2. Start from the `component-pattern` template for new UI units.
3. Run `npm run lint --workspace client` and `npm run test --workspace client -- --watch=false` before opening a PR.
4. Update docs or screenshots when UX flows change.

## Accessibility & Styling
- Follow WCAG AA color contrast; use design tokens where available.
- Prefer CSS Modules or the existing styling system; coordinate before adding a new approach.
- Verify keyboard navigation paths and include focus management for modals.
