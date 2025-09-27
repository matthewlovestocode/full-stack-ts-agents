# API Surface

## Overview
Capture every REST endpoint exposed by `/server`. Keep this document updated whenever routes change so consumers have a single source of truth.

## Versioning
- Follow semantic versioning; bump the major version when breaking changes land.
- Note changes in `release-checklist.md` and communicate via changelog announcements.

## Endpoint Catalog
| Method | Path | Description | Auth | Notes |
| ------ | ---- | ----------- | ---- | ----- |
| GET | `/health` | Liveness check | None | Used by deployment pipeline.
| GET | `/api/example` | Example placeholder endpoint | Bearer | Replace with real endpoints as they are added.

## Conventions
- Use nouns for resource names; pluralize collections (`/api/users`).
- Validate input with shared schema utilities; document validation rules here.
- Describe response shapes and include sample payloads for complex types.
