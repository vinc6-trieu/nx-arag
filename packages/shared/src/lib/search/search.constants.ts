import { join } from 'node:path';

export const SEARCH_PACKAGE_NAME = 'search.v1';
export const SEARCH_SERVICE_NAME = 'SearchService';
export const SEARCH_PROTO_PATH = join(
  process.cwd(),
  'packages/shared/src/lib/proto/search/v1/search.proto',
);
