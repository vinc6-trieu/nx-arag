apps/<service>/src/
│
├─ domain/ # entities, value objects
├─ application/ # use cases (pure logic)
├─ infrastructure/ # adapters (DB, vector, Meili, OCR…)
├─ interfaces/ # delivery (HTTP, gRPC, SSE)
├─ config/
│  ├─ env.validation.ts # Joi schema for process.env (incl. Datadog defaults)
│  └─ datadog.config.ts # ConfigService namespace for instrumentation/logging
└─ main.ts # bootstrap / NestFactory
