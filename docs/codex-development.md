# Codex Development Guide

## Overview
This guide explains how to collaborate with Codex while building features in the full-stack workspace. It complements the domain-specific agent manuals and keeps repo workflows predictable.

## Preparation Checklist
1. Skim `README.md` and the relevant `AGENTS.md` files (root plus stack-specific) before assigning tasks.
2. Confirm local tooling: `npm install`, `npx playwright install`, and any required environment files from the `*.env.example` templates.
3. Note sandbox limits, approval policy, and active branches so Codex can plan around them.
4. Capture context from the IDE (open files, active tests) when requesting help so the agent starts with the same view.

## Collaboration Workflow
- Frame each request with the desired outcome, affected stack(s), and any constraints (deadlines, testing scope).
- Allow Codex to draft a plan for non-trivial work and review it before execution; request adjustments if steps are missing.
- When work reveals structural debt, pause to log a refactor plan (`docs/templates/refactor-plan.md`) and align on the approach in the Refactor Playbook before coding.
- Share command results that agents cannot obtain (e.g., UI output) and re-run any commands blocked by local restrictions.
- When Codex proposes changes, inspect the diff locally before committing and provide feedback iteratively.

## Repository Operations
- Use the root npm scripts as the canonical entry points (`npm run dev`, `npm run lint`, `npm run test`, `npm run test:coverage`). Specify workspaces if only one stack is affected.
- Keep environment variables scoped: shared values in `.env`, frontend values with the `VITE_` prefix in `client/.env`, backend secrets in `server/.env`, and Supabase tooling keys in `supabase/.env`.
- Update the matching `*.env.example` files whenever new variables become mandatory so Codex and teammates can sync quickly.
- When automation is ready, run `npm run gh:workflow` with the required flags; skip it for exploratory or in-progress changes, and never bypass it with a direct push to `main`.

## Testing & Quality Gates
- Default to running `npm run lint` plus the relevant workspace tests before handing work back to Codex or teammates.
- Use `npm run test:coverage` when changes may affect the CI coverage gate (80% minimum for both client and server), and do not proceed until new or updated tests lift any side that falls under 80%.
- For Playwright tasks, execute `npm run test --workspace playwright` or `npm run analyze:playwright` as appropriate and attach findings to hand-off notes.

## Documentation & Handoff
- Reflect code changes in `/docs` and keep the README table of contents aligned with new or renamed guides.
- Summarize modifications, testing status, and follow-up steps when returning work to Codex or reviewers.
- Record database or schema proposals under `/docs/proposals` and pause implementation until approved.

## Agent Touchpoints
- Frontend specifics: `client/AGENTS.md`
- Backend practices: `server/AGENTS.md`
- Documentation standards: `docs/AGENTS.md`
- Supabase workflow: `supabase/AGENTS.md`
- Playwright automation: `playwright/AGENTS.md`
