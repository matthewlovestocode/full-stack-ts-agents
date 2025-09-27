# Refactor Playbook

## Purpose
Refactors keep the template healthy by paying down debt before it blocks feature delivery. Use this guide to decide when a refactor is warranted, design the work, and move safely from proposal to merged change.

## Refactor Signals
- Repeated code paths in `/client/src` or `/server/src` that make new features slower to ship.
- Tests or lint rules that require frequent temporary suppressions.
- Architectural shifts (e.g., new routing layout, shared data model) that merit coordinated updates across client, server, docs, and automation.
- Performance or accessibility regressions that cannot be fixed with a small patch.
- Feedback from reviews that a module is hard to extend, reason about, or verify.

When in doubt, raise the concern during planning and capture the decision in the refactor plan template.

## Prerequisites
- Confirm the live branch status, sandbox limits, and environment variables per `/AGENTS.md`.
- Install dependencies (`npm install`) and browser tooling (`npx playwright install`) if you have not already.
- Load `README.md`, the relevant stack `AGENTS.md`, and this playbook to keep expectations in view.

## Planning Checklist
1. Define the goal: explain what the refactor will enable that the current code blocks.
2. Identify the scope: enumerate directories, services, routes, or components that will change. Call out areas explicitly out of scope.
3. Map risks and mitigations: note migrations, data concerns, or backwards compatibility issues.
4. Align on testing: list the suites (lint, unit, integration, Playwright, coverage) required before merge.
5. Communicate timing: share the plan with stakeholders and capture approval before touching code.

Use `docs/templates/refactor-plan.md` to record these answers and share the document link in your task summary.

## Execution Workflow
1. **Set up a feature branch** using `npm run gh:workflow` only after the refactor is complete and verified locally.
2. **Work in slices**: land mechanical moves (renames, file moves) separately from behavioural changes so reviews stay focused.
3. **Keep docs in sync**: update `/docs` and `README.md` alongside code so navigation links and instructions remain accurate.
4. **Run validation continuously**: execute the verification script after each major slice and before opening a PR.
5. **Capture decisions**: document trade-offs or follow-up tasks in the refactor plan and link them in commit messages or PR notes.

## Validation & Quality Gates
- Run `npm run refactor:verify` to execute lint, unit tests, and coverage gates in one pass.
- Re-run targeted workspace commands if the refactor touches optional tooling (e.g., `npm run analyze:playwright -- --url ...`).
- Ensure coverage stays above the 80% threshold on both client and server; expand tests if the gate slips.
- Snapshot user-facing workflows (manual or scripted) when UI or API signatures change.

## Documentation & Communication
- Update `/docs/README.md` and the root `README.md` with new or renamed guides.
- Note refactor highlights, risk mitigations, and follow-up actions in the hand-off message or PR summary.
- Close the loop with stakeholders by sharing the updated refactor plan template and any new documentation links.

## Support Assets
- Template: `docs/templates/refactor-plan.md`
- Validation script: `npm run refactor:verify`

Keep this playbook nearby during planning sessions so the team can decide quickly whether to defer, split, or execute a refactor.
