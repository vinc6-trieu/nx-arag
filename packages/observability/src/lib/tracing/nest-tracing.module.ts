import { Global, Module } from '@nestjs/common';
import tracer from 'dd-trace';

@Global()
@Module({
  providers: [
    {
      provide: 'DD_TRACER',
      useValue: tracer,
    },
  ],
  exports: ['DD_TRACER'],
})
export class TracingModule {}
