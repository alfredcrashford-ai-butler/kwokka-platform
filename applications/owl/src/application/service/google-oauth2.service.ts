import { ConfigService, LoggerService } from '@kwokka/common-node';
import { GoogleCredentialData } from '@kwokka/entities';
import { OAuth2Client } from 'google-auth-library';
import { inject, injectable } from 'inversify';
import { EnvVarName } from '../env-var-name';

export interface GoogleOauth2UserInfo extends GoogleCredentialData {
  emailVerified: boolean;
}

@injectable()
export class GoogleOauth2Service {
  private client: OAuth2Client;
  private readonly clientId: string;

  public constructor(
    @inject(LoggerService) private logger: LoggerService,
    @inject(ConfigService) private configService: ConfigService,
  ) {
    this.client = new OAuth2Client();
    this.clientId = this.configService.get(EnvVarName.GoogleOauth2ClientId);
  }

  async getUserInfo(accessToken: string): Promise<GoogleOauth2UserInfo> {
    try {
      const payload: any = await this.client.getTokenInfo(accessToken);
      if (this.clientId !== payload.aud) {
        this.logger.error('Failed to retrieve user info by access token from google');
        return null;
      }

      return {
        email: payload.email,
        sub: payload.sub,
        scopes: payload.scopes,
        azp: payload.azp,
        aud: payload.aud,
        emailVerified: payload.email_verified,
      };
    } catch (e: unknown) {
      this.logger.error('Failed to retrieve user info by access token from google', e);
      return null;
    }
  }
}
