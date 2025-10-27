import { ExecutionContext, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { RateLimitGuard } from './rate-limit.guard';

describe('RateLimitGuard', () => {
  let cacheStore: Record<string, unknown>;
  let cacheManager: Cache;
  let configService: ConfigService;
  let guard: RateLimitGuard;
  let context: ExecutionContext;
  let request: FastifyRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    cacheStore = {};
    const cacheMock: Partial<Cache> = {
      get: jest.fn(async (key: string) => cacheStore[key]) as any,
      set: jest.fn(async (key: string, value: unknown) => {
        cacheStore[key] = value;
      }) as any,
    };
    cacheManager = cacheMock as Cache;

    configService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        if (key === 'RATE_LIMIT_MAX') {
          return 2;
        }
        if (key === 'RATE_LIMIT_WINDOW_MS') {
          return 1000;
        }
        return defaultValue;
      }),
    } as unknown as ConfigService;

    guard = new RateLimitGuard(cacheManager, configService);

    request = {
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' } as any,
    } as FastifyRequest;

    reply = {
      header: jest.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    context = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => reply,
      }),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('allows requests within the configured limit', async () => {
    await expect(guard.canActivate(context)).resolves.toBe(true);
    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect((reply.header as jest.Mock).mock.calls).toEqual(
      expect.arrayContaining([
        expect.arrayContaining(['X-RateLimit-Limit', 2]),
        expect.arrayContaining(['X-RateLimit-Remaining', expect.any(Number)]),
      ]),
    );
  });

  it('throws when the limit is exceeded', async () => {
    await guard.canActivate(context);
    await guard.canActivate(context);

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      HttpException,
    );
    expect(reply.header).toHaveBeenCalledWith(
      'Retry-After',
      expect.any(Number),
    );
  });
});
