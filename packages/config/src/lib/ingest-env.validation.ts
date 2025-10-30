import * as Joi from 'joi';

export const ingestEnvValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  LOG_LEVEL: Joi.string().default('debug'),
  INGEST_GRPC_BIND_ADDR: Joi.string().default('0.0.0.0:50052'),
  INGEST_REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .default('redis://redis:6379'),
  INGEST_QUEUE_NAME: Joi.string().default('ingest:jobs'),
  INGEST_DATABASE_URL: Joi.string().uri().optional(),
  INGEST_S3_ENDPOINT: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .default('http://minio:9000'),
  INGEST_S3_REGION: Joi.string().default('us-east-1'),
  INGEST_S3_BUCKET_SOURCE: Joi.string().default('documents'),
  INGEST_S3_BUCKET_DERIVATIVES: Joi.string().default('document-derivatives'),
  INGEST_S3_ACCESS_KEY_ID: Joi.string().allow('').optional(),
  INGEST_S3_SECRET_ACCESS_KEY: Joi.string().allow('').optional(),
  INGEST_EMBED_MODEL: Joi.string().default('text-embedding-3-small'),
  INGEST_CHUNK_TOKEN_LIMIT: Joi.number().integer().min(50).max(2000).default(500),
  DD_ENV: Joi.string().default(Joi.ref('NODE_ENV')),
  DD_SERVICE: Joi.string().default('nx-arag-ingest'),
  DD_VERSION: Joi.string().default('local'),
  DD_TRACE_AGENT_URL: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .default('http://127.0.0.1:8126'),
  DD_AGENT_HOST: Joi.alternatives()
    .try(
      Joi.string().hostname(),
      Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' }),
    )
    .default('127.0.0.1'),
  DD_DOGSTATSD_PORT: Joi.number().port().default(8125),
  DD_TRACE_ENABLED: Joi.boolean().default(false),
}).unknown(true);
