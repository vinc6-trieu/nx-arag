import type {
  IngestDocumentInput,
  IngestHealthStatus,
  IngestJobStatusDto,
  SubmitDocumentResponseDto,
} from '@lib/shared';

export const INGEST_SERVICE = Symbol('INGEST_SERVICE');

export interface IngestServicePort {
  submitDocument(input: IngestDocumentInput): Promise<SubmitDocumentResponseDto>;
  getJobStatus(jobId: string): Promise<IngestJobStatusDto>;
  health(): Promise<IngestHealthStatus>;
}

