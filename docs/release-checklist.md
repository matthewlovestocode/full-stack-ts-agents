# Release Checklist

Use this checklist for every production deployment to ensure client, server, and docs remain in sync.

## Pre-Release
- [ ] Confirm all feature branches merged into `main`.
- [ ] Verify CI workflows passed on the release commit.
- [ ] Update `api-surface.md` and other relevant docs with any contract changes.

## Tag & Deploy
- [ ] Tag release (`git tag vX.Y.Z && git push origin vX.Y.Z`).
- [ ] Deploy backend; monitor health checks and logs.
- [ ] Deploy frontend via CDN pipeline; validate cache busting.

## Post-Release
- [ ] Publish release notes (link to docs/README index).
- [ ] Announce completion in team channels with deployment links.
- [ ] Capture follow-up actions or incidents for retro.
