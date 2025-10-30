import { join } from 'node:path';

export const INGEST_PACKAGE_NAME = 'ingest.v1';
export const INGEST_SERVICE_NAME = 'IngestService';
export const INGEST_PROTO_PATH = join(
  process.cwd(),
  'packages/shared/src/lib/proto/ingest/v1/ingest.proto',
);
