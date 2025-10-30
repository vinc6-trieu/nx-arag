import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expectedApiKey =
      this.configService.get<string>('AI_SERVICE_API_KEY') ?? '';

    if (!expectedApiKey) {
      throw new UnauthorizedException('API key not configured');
    }

    if (context.getType<'http' | 'ws'>() === 'http') {
      const req = context.switchToHttp().getRequest();
      const key = req.headers['x-api-key'];

      if (typeof key !== 'string' || key !== expectedApiKey) {
        throw new UnauthorizedException('Invalid API key');
      }
      return true;
    }

    // WebSocket handling if needed in future
    throw new UnauthorizedException('Invalid API key');
  }
}
