# RAG-Anything Capability Gap Analysis

This note compares the current `nx-arag` platform with the target “RAG-Anything” vision you sketched (multimodal ingestion, hybrid retrieval, KG-aware reasoning, VLM-augmented answers). It highlights what already exists, what is missing, and which areas must be prioritized before feature work can start.

---

## 1. Current State Snapshot (2025-03)

- **Repo layout:** Nx monorepo with NestJS API (`apps/api`) and gRPC search microservice (`apps/search-svc`), shared packages for DTOs / config / observability glue, Docker-based local stack.
- **Retrieval pipeline:** `search-svc` returns stubbed BM25/vector hits; no vector store, BM25 engine, or re-ranker is implemented yet.
- **Ingestion:** No ingestion service exists. Content, embeddings, and chunk metadata are absent.
- **Knowledge graph:** Not implemented; there is no schema, storage, or builder routine.
- **Multimodal support:** API and search contracts are text-only today (filters + text query). No image/table/equation ingestion or VLM integration exists.
- **LLM orchestration:** The API does not yet assemble answers from retrieved contexts; there is no generation pipeline, prompt management, or guardrails beyond the existing architecture sketch in `docs/RAG-Architecture.md`.
- **Observability & ops:** Datadog tracing/metrics/logging bootstrapped. Docker Compose provisions Postgres only for the API; no search-specific stores (pgvector, Meilisearch, Redis, MinIO) are stood up.

---

## 2. Target Capabilities (RAG-Anything Baseline)

| Area | RAG-Anything Expectation |
| ---- | ------------------------ |
| **Document ingestion** | MinerU/Docling parsing, adaptive chunking, multimodal extraction (text, tables, images, equations). |
| **Embeddings** | Configurable LLM + VLM embedding functions (OpenAI, Azure OpenAI, custom). |
| **Storage** | Hybrid indexes: pgvector (semantic), BM25 (text), knowledge graph edges. |
| **Retrieval** | Vector/keyword fusion, graph-aware re-ranking, optional cross-encoder. |
| **Multimodal queries** | Ability to enrich queries with tables, images, equations (content lists, VLM-enhanced search). |
| **Knowledge graph** | Automatic entity extraction and KG maintenance for graph boosts. |
| **Orchestration** | Async ingestion, health monitoring, configuration via `.env`, unit/integration test coverage. |
| **Runtime** | Async tasks, streaming responses, policy-aware filtering, citation-first answers. |

---

## 3. Gap Overview

| Capability | Current Status | Gap | Prerequisites / Notes |
| ---------- | -------------- | --- | --------------------- |
| **Ingestion service (`ingest-svc`)** | Not present | Build new service (likely Python + `raganything`) to parse, chunk, embed, emit events | Requires storage targets (S3/MinIO, Postgres+pgvector, Meilisearch), queue for job coordination |
| **Multimodal asset storage** | Not present | Provision object store and conventions for asset URIs | MinIO/S3, signed URL policy, storage package updates |
| **Vector store** | Not present | Add pgvector extension, schema, NestJS data access layer | Migrate Postgres, update Prisma/TypeORM client or microservice repository layer |
| **BM25 engine** | Not present | Add Meilisearch or Elasticsearch, build ingest + search adapters | Docker Compose updates, search service connectors |
| **Knowledge graph (`ground-svc`)** | Not present | Define schema + builder jobs, expose graph boosting API | Requires ingestion outputs, graph DB (Postgres tables acceptable initially) |
| **Search fusion logic** | Stub responses only | Implement BM25 + vector retrieval fusion, KG boost, re-rank | Needs vector/BM25 backends ready, rrf/rank code |
| **Multimodal query support** | gRPC DTOs are text-only | Extend contracts (proto + DTOs), update API/clients, ensure VLM pipeline | Contract changes require coordinated deployment |
| **LLM/VLM orchestration** | Missing | Build answer generation workers, integrate telemetry and cost tracking | Choose provider, design prompts, implement guardrails |
| **Evaluation harness** | Missing | Create golden set tests, offline evaluation scripts, quality dashboards | Dependent on ingestion outputs |
| **Ops automation** | Partial (Docker Compose) | Add infra for new stores/services, seeding scripts, local dev tooling | Compose/Helm stacks, GitHub Actions updates |

---

## 4. Priority Themes

1. **Data plane first:** Provision pgvector + Meilisearch + MinIO plus schemas so ingestion has targets.  
2. **Bootstrap ingestion:** Deliver an MVP `ingest-svc` that processes PDFs and writes text embeddings; tables/images can follow once storage + VLM pathways are proven.  
3. **Real retrieval:** Replace `SearchService.query` stub with actual fusion against the new indexes.  
4. **Contract evolution:** Extend DTOs/protos to carry modality metadata and highlights while keeping backward compatibility (versioned messages).  
5. **Graph + VLM add-ons:** After baseline retrieval works, implement KG extraction and VLM-enhanced responses in separate milestones.  
6. **Guardrails & evaluation:** Wire policy filtering, monitoring, and offline evaluation suites before widening access.

---

## 5. Recommended Next Steps (0–2 weeks)

- Finalize storage decisions (pgvector schema, BM25 engine, object store) and update `infra/docker/docker-compose.yml`.  
- Author detailed implementation roadmap (see `docs/rag-anything-implementation-plan.md`).  
- Define ingestion job contracts (input payload, event topics, storage layout).  
- Draft updated gRPC proto to support multimodal metadata (behind feature toggle).  
- Prepare developer enablement: local seeds, sample documents, minimal tests validating ingestion → retrieval loop.

Once these gaps are closed the repo can begin layering the richer RAG-Anything capabilities (multimodal fusion, KG boosts, VLM-enhanced answers) with confidence.

