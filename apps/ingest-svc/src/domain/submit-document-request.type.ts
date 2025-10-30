import type { Buffer } from 'node:buffer';

export type SubmitDocumentGrpcRequest = {
  tenantId?: string;
  requestedBy?: string;
  documentId?: string;
  title?: string;
  sourceUri?: string;
  inlineBytes?: Buffer | Uint8Array;
  contentType?: string;
  metadata?: Record<string, string>;
  visibility?: string;
  retentionPolicy?: string;
};
