import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  healthCheck() {
    return {
      message: 'Services are running',
      timestamp: new Date().toISOString(),
      status: 'healthy',
    };
  }

  @Get('check')
  check() {
    return { message: 'Services are running' };
  }
}
