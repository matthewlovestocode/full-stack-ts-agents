> Extends: `/AGENTS.md`

# Docs Agent Operating Notes

## Documentation Structure
- Keep guides grouped by topic; follow existing naming like `architecture.md` and `api-surface.md`.
- Link new pages from `/README.md` and update any local index (e.g., `/docs/README.md`) to keep navigation coherent.
- Use level-two headings for major sections; reserve level-one headings for page titles only.

## Workflow Expectations
- Mirror root planning rhythm; call out documentation impacts when code changes land.
- Run prose lint or spellcheck scripts if available before merging doc updates.
- Confirm doc examples match TypeScript/Express/Vite conventions used in `/client` and `/server`.

## Templates & Patterns
- Start new guides from `/docs/templates/guide-pattern.md`; replace placeholders prior to review.
- Keep code blocks annotated with language hints (e.g., ```ts) to enable syntax highlighting.
- Capture recurring release notes in `/docs/release-checklist.md` so the chain stays consistent.
