import type { Buffer } from 'node:buffer';

export type IngestJobStatus =
  | 'unspecified'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export type IngestDocumentSource =
  | {
      kind: 'uri';
      uri: string;
    }
  | {
      kind: 'inline';
      data: Buffer;
    };

export interface IngestDocumentInput {
  title: string;
  tenantId?: string;
  requestedBy?: string;
  documentId?: string;
  source: IngestDocumentSource;
  contentType?: string;
  metadata?: Record<string, string>;
  visibility?: string;
  retentionPolicy?: string;
}

export interface SubmitDocumentResponseDto {
  jobId: string;
  documentId?: string;
  status: IngestJobStatus;
}

export interface IngestChunkSummaryDto {
  chunkId: string;
  tokenCount?: number;
  preview?: string;
  embedding?: number[];
}

export interface IngestJobStatusDto {
  jobId: string;
  documentId?: string;
  status: IngestJobStatus;
  errorMessage?: string;
  chunks?: IngestChunkSummaryDto[];
}

export interface IngestHealthStatus {
  status: string;
}
