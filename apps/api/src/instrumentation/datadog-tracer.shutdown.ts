import { Injectable, OnApplicationShutdown } from '@nestjs/common';

import tracer, { datadogTracerInitialized } from './datadog-tracer';

@Injectable()
export class DatadogTracerShutdown implements OnApplicationShutdown {
  async onApplicationShutdown() {
    if (!datadogTracerInitialized) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      tracer.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
