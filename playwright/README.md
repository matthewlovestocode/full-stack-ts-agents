# Playwright Workspace

This workspace centralises browser automation utilities and smoke tests.

## Setup
1. Install dependencies from the repo root: `npm install`.
2. Install the Chromium browser bundle once per environment: `npx playwright install chromium` (or simply `npx playwright install` for all browsers).
3. Optional: define `PLAYWRIGHT_BASE_URL` in `.env` to set a default target for tests.

## Commands
- `npm run test --workspace playwright` — execute the Playwright test suite.
- `npm run lint --workspace playwright` — type-check tests and scripts.
- `npm run analyze:playwright -- --url https://example.com` — launch Chromium, render the provided URL, and output page metrics, layout, and accessibility summaries.

Outputs from the analyse command are JSON-formatted so they can be attached to pull requests or pasted into bug reports.

Refer to `playwright/AGENTS.md` for collaboration norms.
