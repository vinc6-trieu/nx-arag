# API Error Handling

The API consistently wraps responses using the shared `ApiResponseEnvelope<T>` shape. Successful calls include the resolved payload in `data`. Errors still use the same envelope but include metadata that points to a catalogued error with a stable identifier.

```json
{
  "code": "409",
  "data": null,
  "error": true,
  "message": "A user with this email already exists.",
  "error_code": "AUTH_USER_ALREADY_EXISTS",
  "error_key": "auth.user_already_exists",
  "path": "/auth/register",
  "timestamp": "2025-01-13T12:15:11.383Z"
}
```

## Error Codes & Keys

- `error_key` is a dot-delimited identifier scoped by domain (e.g. `auth.user_not_found`).
- Each key maps to a catalog entry that defines the HTTP status, `error_code`, and default message.
- `error_code` is an upper-snake identifier that frontends or other services can branch on.
- The mapped message is returned by default but can be overridden when constructing an `AppError`.

## Throwing Typed Errors

Use the shared `AppError` class exported from `@lib/utils` when propagating an application error:

```ts
import { AppError, ErrorKey } from '@lib/utils';

throw new AppError(ErrorKey.AUTH_INVALID_CREDENTIALS);
```

`AppError` automatically pulls the catalog entry and shapes the error so the `GlobalExceptionFilter` can emit the response envelope shown above. Unknown errors fall back to the `common.internal_server_error` mapping.
