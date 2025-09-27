# Backend Operations

## Deployment Flow
1. Merge approved changes into `main`; confirm CI is green.
2. Tag releases using `git tag vX.Y.Z && git push origin vX.Y.Z`.
3. Trigger the deployment pipeline; monitor health checks and logs.

## Environments
- **Local**: `npm run dev:server`; loads `.env.local`.
- **Staging**: Mirrors production with limited data; use for integration tests.
- **Production**: Protected branch deploy; on-call engineer oversees.

## Observability
- Centralize logs with the configured logging provider; scrub sensitive data.
- Define alerts for latency, error rate, and queue backlogs.
- Document new dashboards or metrics here with direct links when available.

## Runbooks
- Capture rollback steps; default to automated rollback if deployment fails.
- Record database migration procedures, including backup expectations.
- Note third-party outages and escalation paths.
