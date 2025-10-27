import { Injectable, OnApplicationShutdown } from '@nestjs/common';

import {
  closeDatadogTracer,
  datadogTracerInitialized,
} from './datadog-tracer';

@Injectable()
export class DatadogTracerShutdown implements OnApplicationShutdown {
  async onApplicationShutdown() {
    if (!datadogTracerInitialized()) {
      return;
    }

    await closeDatadogTracer();
  }
}
