import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  LOG_LEVEL: Joi.string().default('debug'),
  JWT_SECRET: Joi.string().min(1).required(),
  GOOGLE_CLIENT_ID: Joi.string().min(1).required(),
}).unknown(true);
