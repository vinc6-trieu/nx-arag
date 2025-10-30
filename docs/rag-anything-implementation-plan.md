# RAG-Anything Implementation Plan

This plan turns the current `nx-arag` monorepo into the multimodal, KG-aware RAG platform described in the RAG-Anything README. It assumes 4–5 focused sprints with incremental releases so the team can ship baseline retrieval quickly, then layer multimodal and graph capabilities.

---

## 1. Goals & Guiding Assumptions

- **Ground answers in owned data.** All responses must cite stored documents and respect policy filters.
- **Hybrid, multimodal retrieval.** Combine BM25, pgvector, and graph boosts; ingest text, tables, images, equations.
- **Composable services.** Keep Nx boundaries: `api` orchestrates; `search-svc` serves retrieval; new `ingest-svc` and `ground-svc` own indexing and graph logic.
- **Polyglot where warranted.** `ingest-svc` may run Python (`raganything`, `mineru`) behind a gRPC/queue interface; NodeJS services consume its outputs.
- **Observability-first.** Tracing, metrics, and audits span every pipeline stage.

---

## 2. Phased Roadmap

| Phase | Theme | Exit Criteria |
| ----- | ----- | -------------- |
| **P0 – Alignment** | Finalize tech stack, schemas, and contracts | Decision doc covering pgvector (Postgres), AWS S3 buckets, BM25 engine; updated proto drafts; backlog groomed |
| **P1 – Data Plane** | Provision storage + infra | Docker Compose (or Helm) starts Postgres+pgvector, Meilisearch, Redis, and local S3 emulator (MinIO); migrations, S3 bucket policies, and seed scripts land |
| **P2 – Ingestion MVP** | Text-only ingest → vector index | `ingest-svc` ingests PDF/text docs, builds chunks, stores embeddings, posts events; search sees indexed data |
| **P3 – Retrieval Fusion** | Real search results | `search-svc` executes BM25 + vector fusion with RRF, optional cache, metrics; API `/search` returns live hits |
| **P4 – Multimodal & KG** | Tables/images + graph boost | Ingestion handles tables/images/equations, VLM captions, KG nodes/edges, search applies graph weights |
| **P5 – Generation & Guardrails** | Answer orchestration | API streams grounded answers with citations, handles VLM-enhanced queries, enforces policy, evaluation suite active |

Each phase can be released to staging independently; later phases depend on artifacts from earlier ones but avoid long-lived feature branches.

---

## 3. Service Workstreams

### 3.1 `ingest-svc`

- **Structure:** New Nx app `apps/ingest-svc` (TypeScript orchestrator) + `services/ingest-worker` (Python package). TypeScript handles job intake, status API, queue publishing; Python worker calls `raganything`.
- **Inputs:** Upload or URL ingestion requests from API; optional metadata (visibility, retention, source tags).
- **Pipeline (MVP):**
  1. Persist document metadata (Postgres `documents` table).
  2. Store raw file to AWS S3 (`documents/<docId>/source`, MinIO for local dev).
  3. Invoke Python worker via task queue (BullMQ/Redis) or gRPC stream.
  4. Worker runs MinerU/Docling → content list (text blocks + optional tables/images/equations).
  5. Chunk text (500–800 tokens) with heading preservation.
  6. Embed text chunks using configured LLM embedding model (`OPENAI_EMBED_MODEL`).
  7. Write chunk rows to Postgres (pgvector column populated); push BM25 payloads to Meilisearch.
  8. Emit `content.ingested` event with summary + chunk ids.
- **Phase P4 additions:** Table serialization (markdown), table embeddings (text flattening + numeric features), image asset upload + captioning via VLM, equation latex storage, KG entity extraction (calls to `ground-svc`).
- **Deliverables:** Nx generators, env schema (`packages/config`), Dockerfile(s), integration tests (fixture doc → 3 chunks stored), S3 bucket configuration (encryption, lifecycle, IAM policies).

### 3.2 `search-svc`

- **Repositories:** Add adapters for Postgres (pgvector queries), Meilisearch (keyword search), optional Redis cache.
- **Fusion logic:** Implement Reciprocal Rank Fusion (RRF) w/ weights from config; support toggles to disable vector or BM25 for testing.
- **Response payload:** Extend DTOs to include modality metadata (e.g., `kind`, `assetUrl`, `tablePreview`, `equationLatex`, `caption`). Maintain backward compat by adding optional fields and version header.
- **Graph boost:** When `ground-svc` returns related nodes, add extra score with configurable lambda.
- **Tracing & metrics:** Emit timing, hit counts, backend latency (DogStatsD counters + histograms).
- **Health checks:** gRPC `Health` reports backend readiness (connections, index freshness timestamp).
- **Phase P5:** Optionally add cross-encoder re-rank (ONNX model via `onnxruntime-node`).

### 3.3 `ground-svc`

- **Role:** Manage knowledge graph derived from ingestion outputs.
- **MVP:** Postgres tables `kg_nodes`, `kg_edges`; ingestion posts candidate entities (title, type, attributes); service deduplicates, scores, and exposes `FindBoosts(docIds[], queryEmbedding)` gRPC method.
- **Later:** Introduce graph algorithms (Personalized PageRank), caching, and eventual move to specialized graph DB if needed.

### 3.4 `api`

- **Search orchestration:** Current use-cases remain but add support for modality flags, user filters, streaming SSE endpoint for `/ask`.
- **Answer generation (P5):** Compose prompts using retrieved contexts; call LLM (OpenAI/Azure) with structured output constraints; ensure citations map to chunk IDs; apply refusal policies when retrieval confidence is low.
- **Multimodal query input:** Accept optional `attachments` array referencing images/tables/equations; forward to `search-svc` or `ingest-svc` accordingly.
- **Policy enforcement:** Enforce document visibility via `PolicyPort` before query dispatch; align with ingestion metadata.
- **Telemetry:** Correlate request IDs across API → search → ingestion.

---

## 4. Data & Schema Tasks

- Create Prisma (or SQL) migrations for:
  - `documents` (status, visibility, source, tenant fields).
  - `document_chunks` (embedding `vector(1536)`, content, metadata).
  - `chunk_citations`, `chunk_assets` (store S3 object keys for tables/images/equations).
  - `kg_nodes`, `kg_edges`, `kg_node_embeddings`.
- Seed scripts:
  - Synthetic policy-aware documents for dev.
  - Sample table/image assets stored in S3 to validate multimodal flow.
- Index maintenance jobs: nightly reindex, orphan cleanup, vacuum/ANALYZE tasks.

---

## 5. Infrastructure & DevOps

- **Docker Compose:** Add services for Meilisearch, Redis, MinIO (S3 emulator), optional orchestrated Python worker. Mount volumes for persistent indexes and mirror S3 bucket layout.
- **AWS Integration:** Define Terraform/CDK modules for S3 buckets (`rag-documents`, `rag-derivatives`), IAM roles/policies for ingestion/search/API services, and KMS key references. Document bucket naming + region conventions.
- **CI/CD:** Extend pipelines to run ingestion unit tests (Python) and integration suites (ingest → retrieve). Cache large model downloads if possible.
- **Secrets management:** Document env vars in `.env.example`; integrate with AWS Secrets Manager or SSM Parameter Store for production S3 credentials.
- **Scaling path:** Outline autoscaling triggers (queue depth, response latency); provide Helm overlays if moving beyond Compose.

---

## 6. Testing & Evaluation

- **Unit tests:** Chunker, embedding adapter stubs, fusion algorithm.
- **Integration tests:** End-to-end sample (upload doc → ingestion job → search returns chunk). Use fixtures stored under `apps/ingest-svc/test-fixtures`.
- **Offline evaluation harness:** Python notebook or script using `raganything` to compute retrieval accuracy vs golden set.
- **Monitoring dashboards:** Latency (P95), error rate, ingestion lag, doc freshness, LLM cost, refusal rate.
- **Guardrails:** Prompt injection detection, PII leakage checks, citation validation before responding (include S3 object ACL audit).

---

## 7. Risks & Mitigations

- **LLM / VLM provider dependency:** Abstract via config and provider interfaces; add retries + fallbacks.
- **Ingestion latency:** Use asynchronous queue, allow incremental publishing (chunks streamed as ready).
- **Schema evolution:** Version chunk/asset formats; provide migration scripts and backward-compatible views.
- **Cost management:** Track embedding + completion spend per tenant; add rate limits in API.
- **Ops complexity:** Keep local dev simple with Docker Compose; push advanced dependencies (VLM) behind feature flags.

---

## 8. Suggested Sprint Breakdown

1. **Sprint 1:** Finish P0–P1 deliverables. Migrations, infra, proto drafts, service skeletons.  
2. **Sprint 2:** P2 ingestion MVP (text), simple search fusion, dev QA doc search works.  
3. **Sprint 3:** Harden retrieval (metrics, caching), API integration, staging rollout (P3).  
4. **Sprint 4:** Multimodal ingestion + KG service (P4).  
5. **Sprint 5:** Answer generation, guardrails, evaluation automation (P5).

Reassess scope each sprint; earlier release to stakeholders once P3 is stable.

---

## 9. Open Questions

- Preferred queue/backplane (Redis Streams, NATS JetStream, SQS)?  
- Embedding model selection (OpenAI, Azure, or self-hosted) and token budget?  
- Target VLM provider for image/table captioning (gpt-4o, Claude, internal)?  
- Data residency constraints affecting embedding calls or S3 region choices?  
- Required latency/SLO targets beyond current observability spec?

Capture answers before entering Sprint 2 to avoid rework in ingestion and retrieval contracts.
