nx-arag/
├─ apps/
│ ├─ api/              # NestJS BFF (auth, policy, RAG orchestration)
│ │  └─ src/…          # domain/application/interface/instrumentation
│ ├─ search-svc/       # gRPC retrieval service (BM25/vector stub)
│ │  └─ src/…          # core gRPC handlers, instrumentation
│ └─ ingest-svc/       # gRPC ingestion orchestrator (inline + remote URI support)
│    └─ src/…          # queue intake, worker, instrumentation
│
├─ packages/
│ ├─ shared/           # Cross-service contracts, CASL setup, DTOs
│ ├─ utils/            # Nest interceptors, logging helpers, common glue
│ ├─ observability/    # Datadog tracer bootstrap & metrics utilities
│ └─ config/           # Environment configuration helpers (Joi-backed)
│
├─ infra/
│ └─ docker/
│    ├─ docker-compose.yml   # Local API + services + Postgres/Meili/Redis/MinIO stack
│    └─ datadog/             # Agent log collection profiles
│
├─ Dockerfile.dev       # Dev image used by docker-compose
├─ docs/                # Architecture and layout references
├─ nx.json
├─ package.json
├─ tsconfig.base.json
└─ README.md
