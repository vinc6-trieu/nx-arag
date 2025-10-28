import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { config } from 'dotenv';
import { verify } from 'jsonwebtoken';
import { join } from 'path';
import { JWTRequestWSBody } from '../jwt.type';

// Automatically load correct .env file
const envPath =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, '.env') // for dist
    : join(__dirname, '../.env'); // for development

config({ path: envPath });

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_ACCESS_KEY';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    /* ——— HTTP ——— */
    if (ctx.getType<'http' | 'ws'>() === 'http') {
      const req = ctx.switchToHttp().getRequest();
      req.user = this.validateToken(
        this.extractBearer(req.headers.authorization),
      );

      return true;
    }

    /* ——— WebSocket (raw ws) ——— */
    const client = ctx.switchToWs().getClient();

    const reqData = ctx.switchToWs().getData<JWTRequestWSBody>();

    const token = reqData.token;

    client.user = this.validateToken(token);
    return true;
  }

  private extractBearer(header?: string): string | null {
    return header?.startsWith('Bearer ') ? header.slice(7) : null;
  }

  private validateToken(token: string | null) {
    try {
      if (!token) throw new Error('Missing token');
      const payload = verify(token, JWT_SECRET) as any;
      if (payload && typeof payload === 'object' && !payload.id) {
        payload.id = payload.sub ?? payload.userId;
      }
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
