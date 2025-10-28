import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { PinoLogger } from 'nestjs-pino';
import { AADProfileDto } from '../../application/dtos/auth.dto';

@Injectable()
export class ExternalAuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async verifyGoogleToken(idToken: string): Promise<AADProfileDto> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload || payload.email === undefined) {
        throw new Error('Invalid Google token');
      }

      return new AADProfileDto(
        payload.sub,
        payload.email,
        payload.name,
        payload.given_name,
        payload.family_name,
        payload.picture,
      );
    } catch (error) {
      this.logger.error('Google token verification error:', error);
      throw new Error('Google token verification failed');
    }
  }

  async verifyAzureADToken(token: string): Promise<AADProfileDto> {
    // This would typically involve calling Microsoft Graph API
    // For now, we'll return a mock implementation
    // In a real implementation, you would:
    // 1. Validate the JWT token signature
    // 2. Check the token expiration
    // 3. Extract user information from the token claims

    try {
      // Mock implementation - replace with actual Azure AD validation
      const decoded = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      );

      return new AADProfileDto(
        decoded.sub || decoded.oid,
        decoded.email || decoded.preferred_username,
        decoded.name,
        decoded.given_name,
        decoded.family_name,
        decoded.picture,
      );
    } catch (error) {
      this.logger.error('Azure AD token verification error:', error);
      throw new Error('Azure AD token verification failed');
    }
  }
}
