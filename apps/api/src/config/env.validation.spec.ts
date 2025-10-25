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
});
