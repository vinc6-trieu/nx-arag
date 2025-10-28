import { Injectable, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class DatadogTracerShutdown implements OnApplicationShutdown {
  async onApplicationShutdown() {
    // dd-trace has no public close/flush API in current versions.
    // If you want to give the tracer a moment to drain, keep a short delay:
    await new Promise((r) => setTimeout(r, 150)); // optional
  }
}
