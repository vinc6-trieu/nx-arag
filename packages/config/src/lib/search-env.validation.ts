import * as Joi from 'joi';

export const searchEnvValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  LOG_LEVEL: Joi.string().default('debug'),
  SEARCH_GRPC_BIND_ADDR: Joi.string().default('0.0.0.0:50051'),
  SEARCH_DEFAULT_BM25_TOPK: Joi.number().integer().min(1).default(20),
  SEARCH_DEFAULT_VECTOR_TOPK: Joi.number().integer().min(1).default(50),
  SEARCH_DEFAULT_FINAL_TOPK: Joi.number().integer().min(1).default(8),
  DD_ENV: Joi.string().default(Joi.ref('NODE_ENV')),
  DD_SERVICE: Joi.string().default('nx-arag-search'),
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
