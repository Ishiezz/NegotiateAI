# RawMart Structure

- `package.json`: workspace config for dev, test, and lint scripts.
- `docker-compose.yml`: local MongoDB and mongo-express services.
- `.github/dependabot.yml`: weekly dependency and GitHub Actions updates.
- `.github/workflows/ci.yml`: install, lint, typecheck, test, and build checks.
- `.github/workflows/deploy.yml`: deployment automation placeholder.
- `.github/workflows/pr-check.yml`: pull request quality gate.
- `shared/types/*.ts`: shared contracts for auth, products, orders, and RFQs.
- `backend/`: TypeScript Express API scaffold with tests.
- `frontend/`: React marketplace scaffold with reusable UI pieces.
- `cypress/e2e/*.js`: end-to-end buyer journey coverage.
- `scripts/*.sh`: local setup and deployment scripts.
- `docs/MY_REVISION_NOTES.md`: private architecture and interview notes.
