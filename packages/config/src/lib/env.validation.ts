import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  LOG_LEVEL: Joi.string().default('debug'),
  JWT_SECRET: Joi.string().min(1).required(),
  GOOGLE_CLIENT_ID: Joi.string().min(1).required(),
  CACHE_TTL_SECONDS: Joi.number().integer().min(1).default(300),
  CACHE_MAX_ITEMS: Joi.number().integer().min(1).default(1000),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(100),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1).default(60000),
  DD_ENV: Joi.string().default(Joi.ref('NODE_ENV')),
  DD_SERVICE: Joi.string().default('nx-arag-api'),
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
  DD_TRACE_ENABLED: Joi.boolean().default(false),
}).unknown(true);
