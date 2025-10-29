import { HttpStatus } from '@nestjs/common';

export enum ErrorKey {
  AUTH_USER_ALREADY_EXISTS = 'auth.user_already_exists',
  AUTH_INVALID_CREDENTIALS = 'auth.invalid_credentials',
  AUTH_PASSWORD_NOT_SET = 'auth.password_not_set',
  AUTH_USER_NOT_FOUND = 'auth.user_not_found',
  AUTH_INVALID_ROLE_TRANSITION = 'auth.invalid_role_transition',
  COMMON_INTERNAL_SERVER_ERROR = 'common.internal_server_error',
  COMMON_UNEXPECTED = 'common.unexpected',
}

export interface ErrorCatalogEntry {
  code: string;
  message: string;
  status: HttpStatus;
}

export const ERROR_CATALOG: Record<ErrorKey, ErrorCatalogEntry> = {
  [ErrorKey.AUTH_USER_ALREADY_EXISTS]: {
    code: 'AUTH_USER_ALREADY_EXISTS',
    message: 'A user with this email already exists.',
    status: HttpStatus.CONFLICT,
  },
  [ErrorKey.AUTH_INVALID_CREDENTIALS]: {
    code: 'AUTH_INVALID_CREDENTIALS',
    message: 'The provided credentials are invalid.',
    status: HttpStatus.UNAUTHORIZED,
  },
  [ErrorKey.AUTH_PASSWORD_NOT_SET]: {
    code: 'AUTH_PASSWORD_NOT_SET',
    message: 'Password authentication is not available for this account.',
    status: HttpStatus.BAD_REQUEST,
  },
  [ErrorKey.AUTH_USER_NOT_FOUND]: {
    code: 'AUTH_USER_NOT_FOUND',
    message: 'The requested user could not be found.',
    status: HttpStatus.NOT_FOUND,
  },
  [ErrorKey.AUTH_INVALID_ROLE_TRANSITION]: {
    code: 'AUTH_INVALID_ROLE_TRANSITION',
    message: 'The requested role change is not permitted.',
    status: HttpStatus.BAD_REQUEST,
  },
  [ErrorKey.COMMON_INTERNAL_SERVER_ERROR]: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred. Please try again later.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorKey.COMMON_UNEXPECTED]: {
    code: 'UNEXPECTED_ERROR',
    message: 'Something went wrong. Please contact support if the issue persists.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};

export const getErrorCatalogEntry = (key: ErrorKey): ErrorCatalogEntry => {
  const entry = ERROR_CATALOG[key];
  if (!entry) {
    return ERROR_CATALOG[ErrorKey.COMMON_UNEXPECTED];
  }

  return entry;
};
