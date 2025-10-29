apps/api/src/
│
├─ application/        # Use cases, DTOs, and application services
├─ domain/             # Entities, value objects, repository contracts
├─ infrastructure/     # Prisma repositories, external service adapters
├─ interface/          # Controllers, guards, filters, interceptors
├─ instrumentation/    # Datadog tracer bootstrap & metrics emitters
├─ casl/               # Authorization policies and ability factory
├─ prisma/             # Prisma schema, migrations, and generated client
├─ assets/             # Seed/config artifacts bundled with the API
├─ app.module.clean.ts # Module wiring entrypoint for the clean architecture layout
└─ main.ts             # Nest application bootstrap

Environment configuration and shared validation schemas live in `packages/config`. Reusable tracing/logging utilities live in `packages/observability` and `packages/utils`.
