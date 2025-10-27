import { envValidationSchema } from './env.validation';

describe('envValidationSchema', () => {
  const baseEnv = {
    NODE_ENV: 'development',
    PORT: 3000,
    LOG_LEVEL: 'debug',
    JWT_SECRET: 'test-secret',
    GOOGLE_CLIENT_ID: 'test-google-client',
  };

  it('accepts valid environment variables', () => {
    const { error, value } = envValidationSchema.validate(baseEnv);

    expect(error).toBeUndefined();
    expect(value.PORT).toBe(3000);
  });

  it('applies defaults for caching and rate limiting', () => {
    const { error, value } = envValidationSchema.validate(baseEnv);

    expect(error).toBeUndefined();
    expect(value.CACHE_TTL_SECONDS).toBe(300);
    expect(value.CACHE_MAX_ITEMS).toBe(1000);
    expect(value.RATE_LIMIT_MAX).toBe(100);
    expect(value.RATE_LIMIT_WINDOW_MS).toBe(60000);
  });

  it('fails when required secrets are missing', () => {
    const missingSecretEnv = { ...baseEnv };
    delete missingSecretEnv.JWT_SECRET;

    const { error } = envValidationSchema.validate(missingSecretEnv);

    expect(error).toBeDefined();
    expect(error?.details.some((detail) => detail.path.includes('JWT_SECRET')))
      .toBe(true);
  });

  it('fails fast for invalid port values', () => {
    const { error } = envValidationSchema.validate({
      ...baseEnv,
      PORT: 'invalid',
    });

    expect(error).toBeDefined();
    expect(error?.details.some((detail) => detail.path.includes('PORT'))).toBe(
      true,
    );
  });

  it('validates caching and rate limiting constraints', () => {
    const { error } = envValidationSchema.validate({
      ...baseEnv,
      CACHE_TTL_SECONDS: 0,
      RATE_LIMIT_MAX: 0,
    });

    expect(error).toBeDefined();
    expect(
      error?.details.some((detail) => detail.path.includes('CACHE_TTL_SECONDS')),
    ).toBe(true);
    expect(
      error?.details.some((detail) => detail.path.includes('RATE_LIMIT_MAX')),
    ).toBe(true);
  });
});
