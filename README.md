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

### Search service (gRPC)

1. `cp apps/search-svc/.env.example apps/search-svc/.env`
2. `yarn tsc -p apps/search-svc/tsconfig.app.json`
3. `node dist/apps/search-svc/apps/search-svc/src/main.js`

### Ingestion service (gRPC)

1. `cp apps/ingest-svc/.env.example apps/ingest-svc/.env`
2. `yarn tsc -p apps/ingest-svc/tsconfig.app.json`
3. `node dist/apps/ingest-svc/apps/ingest-svc/src/main.js`

### Docker Compose stack (API + ingest/search services + data stores)

1. Create/update `infra/docker/.env` with Datadog credentials or placeholders.
2. Ensure `apps/api/.env` points at the `postgres` service host and contains expected secrets.
3. Ensure `apps/search-svc/.env` and `apps/ingest-svc/.env` exist (steps above) or rely on the provided defaults.
4. From the repo root run `docker compose -f infra/docker/docker-compose.yml up --build`.
5. The stack now provisions Postgres (pgvector), Meilisearch, Redis, and MinIO for local ingestion + retrieval pipelines.

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
