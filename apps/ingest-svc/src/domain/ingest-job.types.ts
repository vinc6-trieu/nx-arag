import type { IngestChunkSummaryDto } from '@lib/shared';

export type SerializedIngestSource =
  | {
      kind: 'inline';
      base64Data: string;
    }
  | {
      kind: 'uri';
      uri: string;
    };

export interface SerializedIngestJob {
  documentId: string;
  tenantId?: string;
  requestedBy?: string;
  title: string;
  contentType?: string;
  metadata?: Record<string, string>;
  visibility?: string;
  retentionPolicy?: string;
  source: SerializedIngestSource;
  queuedAt: string;
}

export interface ProcessedIngestJob {
  jobId: string;
  documentId: string;
  sourceLocation: string;
  chunkSummaries: IngestChunkSummaryDto[];
}

export interface JobStatusRecord {
  jobId: string;
  documentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'unspecified';
  errorMessage?: string;
  chunks?: IngestChunkSummaryDto[];
  updatedAt: string;
}

export interface ChunkCandidate {
  chunkId: string;
  text: string;
  tokenCount: number;
  preview: string;
}
