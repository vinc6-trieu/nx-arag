import { FastifyPluginCallback, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { randomUUID } from 'node:crypto';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
  }
}

export interface RequestIdPluginOptions {
  /** Header name to read/write. Defaults to 'x-request-id'. */
  headerName?: string;
  /** Accept an incoming header if present. Defaults to true. */
  trustIncoming?: boolean;
  /** Custom generator. Defaults to req.id or a UUID. */
  generator?: (req: FastifyRequest) => string;
}

const requestIdPlugin: FastifyPluginCallback<RequestIdPluginOptions> = (
  fastify,
  opts,
  done,
) => {
  const headerName = opts.headerName ?? 'x-request-id';
  const lookupName = headerName.toLowerCase(); // Node lowercases incoming header keys
  const trustIncoming = opts.trustIncoming ?? true;
  const generator =
    opts.generator ?? ((req) => String((req as any).id ?? randomUUID()));

  fastify.decorateRequest('requestId', '');

  fastify.addHook('onRequest', (req, reply, next) => {
    const incoming: unknown = trustIncoming
      ? (req.headers as any)[lookupName]
      : undefined;

    let candidate: string | undefined;
    if (Array.isArray(incoming)) {
      candidate = incoming.find(
        (v): v is string => typeof v === 'string' && v.length > 0,
      );
    } else if (typeof incoming === 'string' && incoming.length > 0) {
      candidate = incoming;
    }

    const requestId = candidate ?? generator(req);

    // expose on request for handlers
    req.requestId = requestId;

    // mirror onto request headers for downstream consumers
    (req.headers as any)[lookupName] = requestId;

    // set on response for clients
    reply.header(headerName, requestId);

    // enrich loggers if present (Fastify/Pino style)
    if (req.log?.child) (req as any).log = req.log.child({ requestId });
    if (reply.log?.child) (reply as any).log = reply.log.child({ requestId });

    next();
  });

  done();
};

export default fp(requestIdPlugin, { name: 'request-id-plugin' });
