nx-arag/
├─ apps/
│ ├─ web/ # Next.js app (user chat/UI)
│ ├─ api/ # NestJS BFF (QA orchestrator, auth/policy)
│ ├─ search-svc/ # Node service: hybrid BM25 + vector retrieval
│ ├─ ingest-svc/ # Node service: convert/OCR/DLP/chunk/embed
│ └─ ground-svc/ # Node service: graph build/search (KG)
│
├─ packages/
│ ├─ shared/ # Domain types + ports/interfaces
│ ├─ config/ # Config provider (envs)
│ ├─ proto/ # gRPC/protobuf contracts (Buf layout)
│ └─ utils/ # Common helpers (logging, tracing)
│
├─ infra/
│ └─ docker
│
├─ nx.json
├─ package.json
├─ tsconfig.base.json
└─ README.md
