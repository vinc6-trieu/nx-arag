import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  LOG_LEVEL: Joi.string().default('debug'),
  JWT_SECRET: Joi.string().min(1).required(),
  GOOGLE_CLIENT_ID: Joi.string().min(1).required(),
  CACHE_TTL_SECONDS: Joi.number().integer().min(1).default(300),
  CACHE_MAX_ITEMS: Joi.number().integer().min(1).default(1000),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(100),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1).default(60000),
}).unknown(true);
