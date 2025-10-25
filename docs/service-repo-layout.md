apps/<service>/src/
│
├─ domain/ # entities, value objects
├─ application/ # use cases (pure logic)
├─ infrastructure/ # adapters (DB, vector, Meili, OCR…)
├─ interfaces/ # delivery (HTTP, gRPC, SSE)
└─ main.ts # bootstrap / NestFactory
