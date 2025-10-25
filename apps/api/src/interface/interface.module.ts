import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { AuthController } from './controllers/auth.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AuthController, HealthController],
})
export class InterfaceModule {}
