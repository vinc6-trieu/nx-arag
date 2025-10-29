# nx-arag

Nx monorepo for a Retrieval-Augmented Generation (RAG) reference stack built around a NestJS API, shared packages, and reusable observability helpers.

## Prerequisites

- Node.js 20 (Corepack is enabled inside the repo; run `corepack enable` once if needed)
- Yarn 4 (handled via Corepack)
- Docker with Compose v2 for the optional local stack

## Local Development

### API with local tooling

1. `cp apps/api/.env.example apps/api/.env`
2. `yarn install`
3. `yarn dev:api`

### Docker Compose stack (API + Postgres + Datadog)

1. Create/update `infra/docker/.env` with Datadog credentials or placeholders.
2. Ensure `apps/api/.env` points at the `postgres` service host and contains expected secrets.
3. From the repo root run `docker compose -f infra/docker/docker-compose.yml up --build`.

The compose stack uses `Dockerfile.dev`, which pre-installs dependencies, generates the Prisma client, and then bind-mounts the workspace so the Nx dev server runs in watch mode. The Datadog agent container is configured for traces, metrics (DogStatsD), and container log collection.

### Useful scripts

- `yarn db:generate:api` – regenerate the Prisma client
- `yarn lint` / `yarn test` – workspace linting and tests via Nx
- `yarn affected:<target>` – target-specific Nx runs between `origin/main` and the current branch

## Documentation

- High-level architecture: `docs/RAG-Architecture.md`
- Monorepo layout: `docs/nx-layout.md`
- API architecture notes: `apps/api/ARCHITECTURE.md`
- API error handling: `docs/api-error-handling.md`
