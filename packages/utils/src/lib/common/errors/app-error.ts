import { HttpException } from '@nestjs/common';
import { ErrorKey, getErrorCatalogEntry } from './error-catalog';

export interface AppErrorOptions {
  code?: string;
  details?: Record<string, unknown>;
  message?: string;
  status?: number;
}

export interface AppErrorPayload {
  errorKey: ErrorKey;
  errorCode: string;
  message: string;
  details?: Record<string, unknown>;
}

export class AppError extends HttpException {
  readonly key: ErrorKey;
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(key: ErrorKey, options: AppErrorOptions = {}) {
    const catalogEntry = getErrorCatalogEntry(key);
    const status = options.status ?? catalogEntry.status;
    const errorCode = options.code ?? catalogEntry.code;
    const message = options.message ?? catalogEntry.message;
    const payload: AppErrorPayload = {
      errorKey: key,
      errorCode,
      message,
      details: options.details,
    };

    super(payload, status);

    this.key = key;
    this.code = errorCode;
    this.details = options.details;
    this.name = 'AppError';
  }

  override getResponse(): AppErrorPayload {
    const response = super.getResponse();
    if (typeof response === 'string') {
      return {
        errorKey: this.key,
        errorCode: this.code,
        message: response,
        details: this.details,
      };
    }

    return response as AppErrorPayload;
  }
}
