> Extends: `/AGENTS.md`

# Playwright Agent Operating Notes

## Mission
- Own cross-browser smoke checks, page rendering diagnostics, and scripted content analysis.
- Default to Chromium headless runs; expand to other browsers by extending `playwright.config.ts` when needed.

## Workflow Expectations
1. Run `npx playwright install` after dependency changes so browsers are available locally and in CI.
2. Use `npm run analyze:playwright -- --url <https://example.com>` to capture page structure, metadata, and accessibility snapshots. The script prints JSON suitable for attaching to issue threads or PR comments.
3. Keep automated tests in `playwright/tests`. Execute them with `npm run test --workspace playwright` before sharing findings.
4. Type-check the workspace with `npm run lint --workspace playwright`; resolve configuration or typing issues before hand-off.

## Directory Layout
- `playwright.config.ts` — Shared configuration (base URL, devices, retry rules).
- `tests/` — Playwright test suites covering core flows and smoke checks.
- `scripts/analyze-page.ts` — CLI helper for ad-hoc URL inspection.
- `tsconfig.json` — TypeScript settings for tests and helpers.

## Collaboration
- Coordinate with frontend/backend owners when tests highlight regressions; include analyze output for context.
- Capture follow-up tasks in `/docs/proposals` or relevant tickets if UI changes require schema or API updates.
- Update `/README.md` and relevant agent guides when introducing new Playwright scripts or conventions.
