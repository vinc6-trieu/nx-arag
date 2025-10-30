import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { AuthController } from './controllers/auth.controller';
import { HealthController } from './controllers/health.controller';
import { SearchController } from './controllers/search.controller';
import { IngestController } from './controllers/ingest.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AuthController, HealthController, SearchController, IngestController],
})
export class InterfaceModule {}
