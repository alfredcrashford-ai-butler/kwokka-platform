import { HttpService, LoggerService } from '@kwokka/common-node';
import { DiscordCredentialData } from '@kwokka/entities';
import { ObjectUtil } from '@kwokka/utils';
import { inject, injectable } from 'inversify';

const GET_USERS_DISCORD_URL = 'https://discord.com/api/v10/users/@me';

@injectable()
export class DiscordOauth2Service {
  public constructor(
    @inject(LoggerService) private logger: LoggerService,
    @inject(HttpService) private http: HttpService,
  ) {}

  async getUserInfo(accessToken: string): Promise<DiscordCredentialData> {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await this.http.get(GET_USERS_DISCORD_URL, { headers });
      return ObjectUtil.take(response, ['username', 'verified', 'email', 'id', 'discriminator', 'global_name']);
    } catch (e: unknown) {
      this.logger.error('Failed to retrieve user info by access token from discord', e);
      return null;
    }
  }
}
