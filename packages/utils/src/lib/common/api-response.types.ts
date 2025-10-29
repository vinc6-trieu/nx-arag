export interface ApiResponseEnvelope<T> {
  code: string;
  data: T;
  duration?: string;
  error: boolean;
  message: string;
  meta?: Record<string, unknown>;
  'error_code'?: string;
  'error_key'?: string;
  details?: Record<string, unknown>;
  path: string;
  timestamp: string;
}

export type ApiErrorResponse = ApiResponseEnvelope<null>;
