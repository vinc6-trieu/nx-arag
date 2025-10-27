import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';

const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(
    request: FastifyRequest & { requestId?: string },
    reply: FastifyReply,
    next: () => void,
  ) {
    const existingHeader = request.headers[REQUEST_ID_HEADER];
    let requestId: string | undefined;

    if (Array.isArray(existingHeader)) {
      requestId = existingHeader.find((value) => value && value.length > 0);
    } else if (typeof existingHeader === 'string' && existingHeader.length > 0) {
      requestId = existingHeader;
    }

    if (!requestId) {
      requestId = randomUUID();
    }

    (request as any).requestId = requestId;
    request.headers[REQUEST_ID_HEADER] = requestId;

    if (request.log && typeof request.log.child === 'function') {
      (request as any).log = request.log.child({ requestId });
    }

    reply.header(REQUEST_ID_HEADER, requestId);

    if (reply.log && typeof reply.log.child === 'function') {
      (reply as any).log = reply.log.child({ requestId });
    }

    next();
  }
}
