import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { config } from 'dotenv';
import { join } from 'path';

// Automatically load correct .env file
const envPath =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, '.env') // for dist
    : join(__dirname, '../.env'); // for development

config({ path: envPath });

const SERVICE_API_KEY = process.env.AI_SERVICE_API_KEY;

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType<'http' | 'ws'>() === 'http') {
      const req = context.switchToHttp().getRequest();
      const key = req.headers['x-api-key'];
      console.log('API Key Guard:', key, SERVICE_API_KEY);
      if (typeof key !== 'string' || key !== SERVICE_API_KEY) {
        throw new UnauthorizedException('Invalid API key');
      }
      return true;
    }

    // WebSocket handling if needed in future
    throw new UnauthorizedException('Invalid API key');
  }
}
