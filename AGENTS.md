# Codex Agent Operating Guide

## Project Context Anchors
- Keep the AGENTS.md framing in mind: full-stack TypeScript app split across `/client`, `/server`, `/docs`, and root `/README.md`.
- `/client`: Frontend workbench; defer to `/client/AGENTS.md` for React and state-management specifics.
- `/server`: Backend playbook; see `/server/AGENTS.md` for Express and API lifecycle specifics.
- `/docs`: Documentation hub; check `/docs/AGENTS.md` for structuring and navigation rules.
- `/README.md`: Maintain a table of contents that links into `/docs` so docs stay discoverable.
- Identify which area the task touches before editing so changes stay scoped and accurate.

## Mission Snapshot
- Capture repo constraints, sandbox limits, and any live workspace context before acting.

## Context Bootstrap
- On session init, load `/README.md` for repo layout, scripts, and current documentation index.
- Bring `/docs/AGENTS.md` and `/docs/README.md` into context so nested doc guidance and links stay visible.
- Open additional `/docs/*.md` files referenced by the task (architecture, API, release checklists) to keep guidance aligned while editing.

## Planning Discipline
- Draft multi-step plans for non-trivial work and update them after each completed step.

## Tool & Search Defaults
- Prefer `rg`/`rg --files` for code and file discovery; fall back only when unavailable.
- Provide `workdir` on every shell call and favor direct paths over shell navigation.

## Editing Guardrails
- Preserve existing work, follow the ASCII-first policy, and add clarifying comments only when they reduce future parsing effort.
- Never revert user changes; pause and ask if unexpected edits appear.

## Documentation Stewardship
- When modifying `/client` or `/server`, update `/README.md` and any impacted `/docs` pages so they stay accurate and complete.
- Confirm new docs keep the README table of contents in sync with the `/docs` directory.

## Sandbox & Approvals
- Stay within workspace-write boundaries; request elevation with a clear justification when needed.
- Avoid destructive commands unless the user explicitly requests them.

## Communication Style
- Keep responses concise, adhere to the required formatting, and reference files with `path:line` cues.

## Delivery Checklist
- Explain modifications, note testing status (or why tests were skipped), and suggest natural next steps for the user.
- Call out documentation updates or confirm that docs remain accurate after code changes.
