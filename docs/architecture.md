# Architecture Overview

## System Context
- Full-stack TypeScript application with a Vite-powered React client and Express backend.
- Shared data contracts live in `/server/src/types` and should be imported by `/client` through generated SDKs when possible.
- Documentation and onboarding material resides in `/docs` to keep the root README lean.

## High-Level Diagram (Textual)
1. Browser requests frontend bundle from CDN.
2. React client issues REST calls to Express API under `/server`.
3. Express layer orchestrates services, data stores, and third-party integrations.
4. Responses flow back to the client; docs are updated to reflect contracts and flows.

## Key Responsibilities
- `/client`: Presentation, routing, and client-side state management.
- `/server`: REST endpoints, business logic orchestration, security and validation.
- `/docs`: Living knowledge base, templates, and release procedures.

## Conventions
- Keep network boundaries explicit; add new services under `/server/src/services` with tests.
- Use environment variables surfaced through `/server/src/config` and documented in `backend-operations.md`.
- Align component architecture with `frontend-playbook.md` to maintain consistency.
