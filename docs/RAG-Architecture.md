# Retrieval-Augmented Generation (RAG) Architecture — TypeScript / Nx Monorepo

---

## 1. System Overview

**Goal:** Trustworthy answers grounded in your controlled corpus (public + internal), supporting multimodal ingest (text/tables/images/formulas) with strict access control and citations by default.

**Core Services (all NestJS / Node):**

- `web`: Next.js UI (chat, search, publisher console)
- `api`: BFF / Orchestrator (authn/authz, policy filtering, answer pipeline)
- `ingest-svc`: document conversion, OCR, DLP, chunking, embedding, indexing
- `search-svc`: hybrid retrieval (BM25 + vector + KG boost) + re-rank
- `ground-svc`: lightweight knowledge graph build and graph query

**Data plane:** Postgres+pgvector, Meilisearch, S3/MinIO, Redis  
**Control plane:** OIDC SSO, Cedar/Oso policy engine, OpenTelemetry traces, metrics, and logs

---

## 2. Nx Monorepo Layout (Hexagonal / Clean Architecture)

```
apps/
  api/           # NestJS API orchestrator (auth, policy, answer pipeline)
packages/
  shared/        # Ports, interfaces, and cross-service DTOs
  config/        # Environment configuration helpers (Joi schemas)
  observability/ # Datadog tracer bootstrap and metrics helpers
  utils/         # Logging, interceptors, reusable Nest glue
infra/
  docker/
    docker-compose.yml
    datadog/     # Agent log collection config
Dockerfile.dev
docs/
```

_Future services (`web`, `ingest-svc`, `search-svc`, `ground-svc`) remain on the roadmap but are not present in the repository yet._

---

## 3. Domain & Ports

```ts
export interface SearchPort {
  query(input: {
    text: string;
    filters: {
      docIds?: string[];
      visibility?: string;
      dept?: string;
      effectiveBefore?: string;
      notExpiredBefore?: string;
    };
    bm25TopK: number;
    vectorTopK: number;
    finalTopK: number;
    useGraphBoost?: boolean;
  }): Promise<SearchHit[]>;
}

export interface EmbedPort {
  embedText(rows: string[]): Promise<number[][]>;
  embedImage?(uris: string[]): Promise<number[][]>;
  embedTable?(tables: string[][][]): Promise<number[][]>;
}

export interface StoragePort {
  putObject(key: string, data: Buffer, contentType?: string): Promise<void>;
  getObject(key: string): Promise<Buffer>;
}

export interface PolicyPort {
  filterForClaims(input: {
    userId?: string | null;
    roles: string[];
    attrs: Record<string, string | number | boolean | null>;
    candidateDocIds?: string[];
  }): Promise<{ allowedDocIds: string[] }>;
}
```

---

## 4. Data Model (Postgres + pgvector)

Includes `documents`, `chunks`, `kg_nodes`, `kg_edges`, `questions`, `question_citations`.  
Vector index via IVFFLAT cosine on `chunks(embedding)`.

---

## 5. Ingestion Pipeline (`ingest-svc`)

1. Register → draft document row
2. Convert/OCR → extract text, tables, images, formulas
3. DLP scan (Presidio) → redact or flag
4. Chunk (500–1,000 tokens)
5. Embed per kind (text, table, formula, image)
6. Index to pgvector + Meilisearch
7. Build KG nodes/edges
8. Publish (status=`live`)

Events:

- `ingest:jobs`
- `content:published`
- `reindex:requests`

---

## 6. Retrieval & Ranking (`search-svc`)

1. BM25 via Meili (top 20)
2. Vector via pgvector (top 50)
3. Graph boost via `ground-svc` (optional)
4. Reciprocal Rank Fusion
5. Cross-encoder re-rank (ONNX small model)
6. Return 8–12 final chunks with metadata

---

## 7. Orchestration (`api`)

**Flow:**  
Auth → Policy filter → Search → Optional VLM (images/tables) → LLM generation → SSE stream → Audit log

**Semantic Cache:** Redis key  
`qa:{hash(query)}:{hash(claims)}`

---

## 8. APIs

### REST

- `POST /v1/ask` (SSE)
- `POST /v1/documents`
- `POST /v1/documents/:id/actions`
- `GET /v1/documents`

### gRPC

`search.proto`, `ingest.proto`, `ground.proto` (contracts in repo)

---

## 9. Security

- OIDC authN
- Cedar/Oso authZ
- PII/FERPA gating
- Presigned S3 URLs
- Policy-based retrieval prefilter
- Rate limits & daily caps
- Prompt-injection defense

---

## 10. Observability & SLOs

- Datadog APM via `dd-trace` (bootstrap in `packages/observability`, wired in `apps/api/src/instrumentation`)
- DogStatsD metrics emitted from HTTP interceptors (`packages/utils`) and domain events
- Structured JSON logs via `pino` with Datadog log injection enabled
- Datadog Agent (see `infra/docker/docker-compose.yml`) collects traces, metrics, and container logs locally
- p95 latency ≤ 2.5s, ≥95% answers with ≥1 citation, refusal rate and cost tracked as core KPIs

---

## 11. Deployment

**Local development (single machine):**

- `infra/docker/docker-compose.yml` spins up the API (dev image), Postgres, and a Datadog agent
- `Dockerfile.dev` installs dependencies, generates Prisma client, then bind-mounts the workspace for hot reloads
- DogStatsD and trace ports (`8125/udp`, `8126/tcp`) are exposed for host-side inspection

**Eco tier (2 VMs):**

- vm-1: API, web, gateway
- vm-2: DBs + Meili + Redis + MinIO + microservices

Scale path:

1. Split `search-svc` to dedicated node
2. Move streams to Kafka/NATS
3. Add LLM broker
4. Add OLAP for analytics
5. K8s only if HA needed

---

## 12. Retrieval Quality Knobs

| Parameter     | Default         | Notes               |
| ------------- | --------------- | ------------------- |
| Chunk size    | 500–1000 tokens | preserve headings   |
| BM25 topK     | 20              | keyword recall      |
| Vector topK   | 50              | semantic            |
| Final topK    | 8–12            | answer context      |
| Graph λ       | 0.2–0.4         | weight for KG boost |
| Context limit | 2k tokens       | per prompt          |

---

## 13. Evaluation

- Golden sets per dept
- Offline: exactness, citations, latency
- Online: success, abstain, cost
- Retrieval telemetry (hit rate, stale-docs)

---

## 14. CI/CD & Config

- Lint, typecheck, test → Docker builds
- Blue/green or canary deploys
- zod-validated env config
- Secrets via SSM/Vault

---

## 15. Sample Adapters (TypeScript)

### `api` → `search-svc`

```ts
@Injectable()
export class SearchGrpcAdapter implements SearchPort {
  constructor(private readonly client: SearchClient) {}
  async query(i: Parameters<SearchPort['query']>[0]) {
    const res = await this.client.query({
      query: i.text,
      filter: {
        doc_ids: i.filters.docIds ?? [],
        visibility: i.filters.visibility ?? '',
        dept: i.filters.dept ?? '',
        effective_before: i.filters.effectiveBefore ?? '',
        not_expired_before: i.filters.notExpiredBefore ?? '',
      },
      bm25_top_k: i.bm25TopK,
      vector_top_k: i.vectorTopK,
      final_top_k: i.finalTopK,
      use_graph_boost: !!i.useGraphBoost,
    });
    return res.hits.map((h) => ({
      chunkId: h.chunk_id,
      docId: h.doc_id,
      title: h.title,
      snippet: h.snippet,
      kind: (h.kind as any) ?? 'text',
      score: h.score,
    }));
  }
}
```

---

## 16. Rollout Plan

1. **Sprint 1:** baseline text RAG
2. **Sprint 2:** tables + content list
3. **Sprint 3:** images + VLM assist
4. **Sprint 4:** KG assist + retrieval boost

---

### End of Document
