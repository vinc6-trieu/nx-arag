import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import {
  BearerStrategy,
  IBearerStrategyOptionWithRequest,
} from 'passport-azure-ad';
import { join } from 'path';

// Automatically load correct .env file
const envPath =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, '.env') // for dist
    : join(__dirname, '../.env'); // for development

config({ path: envPath });

const AZ_TENANT_ID = process.env.AZ_TENANT_ID || 'AZ_TENANT_ID';
const AZ_CLIENT_ID = process.env.AZ_CLIENT_ID || 'AZ_CLIENT_ID';

@Injectable()
export class AadBearerStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad-bearer',
) {
  constructor() {
    super({
      identityMetadata: `https://login.microsoftonline.com/${AZ_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: AZ_CLIENT_ID,
      audience: AZ_CLIENT_ID,
      validateIssuer: true,
      loggingLevel: 'info',
      passReqToCallback: false,
    } as IBearerStrategyOptionWithRequest);
  }

  async validate(token: any) {
    return {
      id: token.oid,
      name: token.name,
      email: token.preferred_username,
      roles: token.roles,
    };
  }
}
