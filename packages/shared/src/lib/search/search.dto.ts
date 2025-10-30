export interface SearchQueryInput {
  query: string;
  filters?: Record<string, string>;
  bm25TopK?: number;
  vectorTopK?: number;
  finalTopK?: number;
  useGraphBoost?: boolean;
}

export interface SearchHitDto {
  docId: string;
  chunkId?: string;
  title?: string;
  snippet?: string;
  score: number;
  highlights?: string[];
}

export interface SearchQueryResponseDto {
  hits: SearchHitDto[];
  latencyMs?: number;
  traceId?: string;
}

export interface SearchHealthStatus {
  status: string;
}
