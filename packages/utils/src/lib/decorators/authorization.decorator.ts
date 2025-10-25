import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type RequestAuth = {
  token: string;
  user: any;
};

export const RequestAuth = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest<Request>();

    const token = extractTokenFromHeader(request);

    return {
      token,
      user: request.user,
    } as RequestAuth;
  },
);

export function extractTokenFromHeader(request: any): string | undefined {
  const [type, token] = request.headers?.authorization?.split(' ') ?? [];

  return type === 'Bearer' ? token : undefined;
}
