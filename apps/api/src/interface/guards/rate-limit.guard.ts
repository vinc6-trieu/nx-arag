import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Cache } from 'cache-manager';
import type { FastifyReply, FastifyRequest } from 'fastify';

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.maxRequests = this.configService.get<number>('RATE_LIMIT_MAX', 100);
    this.windowMs = this.configService.get<number>(
      'RATE_LIMIT_WINDOW_MS',
      60000,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http' || this.maxRequests <= 0) {
      return true;
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<FastifyRequest>();
    const reply = httpContext.getResponse<FastifyReply>();

    const clientId = this.getClientIdentifier(request);
    const cacheKey = `rate-limit:${clientId}`;
    const now = Date.now();

    let entry = await this.cacheManager.get<RateLimitEntry>(cacheKey);

    if (!entry || entry.expiresAt <= now) {
      entry = { count: 0, expiresAt: now + this.windowMs };
    }

    entry.count += 1;

    const ttlSeconds = Math.max(1, Math.ceil((entry.expiresAt - now) / 1000));
    await this.cacheManager.set(cacheKey, entry, ttlSeconds);

    const remaining = Math.max(0, this.maxRequests - entry.count);

    this.setHeaders(reply, remaining, entry.expiresAt);

    if (entry.count > this.maxRequests) {
      reply.header(
        'Retry-After',
        Math.max(1, Math.ceil((entry.expiresAt - now) / 1000)),
      );
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getClientIdentifier(request: FastifyRequest): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
      return forwardedFor.split(',')[0].trim();
    }

    return request.ip || request.socket.remoteAddress || 'unknown';
  }

  private setHeaders(
    reply: FastifyReply,
    remaining: number,
    expiresAt: number,
  ) {
    reply.header('X-RateLimit-Limit', this.maxRequests);
    reply.header('X-RateLimit-Remaining', Math.max(0, remaining));
    reply.header('X-RateLimit-Reset', Math.ceil(expiresAt / 1000));
  }
}
