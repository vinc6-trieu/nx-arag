nx-arag/
├─ apps/
│ └─ api/              # NestJS BFF (auth, policy, RAG orchestration)
│    └─ src/…          # domain/application/interface/instrumentation
│
├─ packages/
│ ├─ shared/           # Cross-service contracts, CASL setup, DTOs
│ ├─ utils/            # Nest interceptors, logging helpers, common glue
│ ├─ observability/    # Datadog tracer bootstrap & metrics utilities
│ └─ config/           # Environment configuration helpers (Joi-backed)
│
├─ infra/
│ └─ docker/
│    ├─ docker-compose.yml   # Local API + Postgres + Datadog stack
│    └─ datadog/             # Agent log collection profiles
│
├─ Dockerfile.dev       # Dev image used by docker-compose
├─ docs/                # Architecture and layout references
├─ nx.json
├─ package.json
├─ tsconfig.base.json
└─ README.md
