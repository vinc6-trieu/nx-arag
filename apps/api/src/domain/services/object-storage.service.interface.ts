import type { Buffer } from 'node:buffer';

export const OBJECT_STORAGE_SERVICE = Symbol('OBJECT_STORAGE_SERVICE');

export interface UploadDocumentSourceInput {
  documentId?: string;
  tenantId?: string;
  requestedBy?: string;
  originalName: string;
  contentType?: string;
  data: Buffer;
  metadata?: Record<string, string | undefined>;
}

export interface UploadDocumentSourceResult {
  documentId: string;
  bucket: string;
  key: string;
  uri: string;
  size: number;
  contentType: string;
}

export interface ObjectStorageServicePort {
  uploadDocumentSource(
    input: UploadDocumentSourceInput,
  ): Promise<UploadDocumentSourceResult>;
}
