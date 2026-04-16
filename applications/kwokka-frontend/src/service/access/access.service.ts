import { inject, injectable } from 'inversify';
import type { AccessTokenContent } from '@kwokka/entities';
import { FunctionUtil } from '@kwokka/utils';
import { PersistenceService } from '../persistence/persistence.service';
import { PersistenceKey } from '../persistence/persistence-key';
import { LoggerService } from '../logger/logger.service';

@injectable()
export class AccessService {
  public constructor(
    @inject(PersistenceService) private persistenceService: PersistenceService,
    @inject(LoggerService) private logger: LoggerService,
  ) {
    this.parseAccessToken = FunctionUtil.memoize(this.parseAccessToken.bind(this));
  }

  public get accountId(): string {
    try {
      const token = this.getAccessToken();
      if (!token) {
        return undefined;
      }
      const content = this.parseAccessToken(token);

      return content.accountId;
    } catch (e) {
      this.logger.error(`#AccessService: Failed to parse token in #get.accountId() method, returning undefined`, e);
      return undefined;
    }
  }

  public hasRight(right: string): boolean {
    try {
      const token = this.getAccessToken();
      if (!token) {
        return false;
      }
      const content = this.parseAccessToken(token);

      return (content.rights || []).includes(right);
    } catch (e) {
      this.logger.error(`#AccessService: Failed to parse token in hasRight() method, returning false`, e);
      return false;
    }
  }

  public getAccessToken(): string {
    return this.persistenceService.loadValue(PersistenceKey.AccessToken);
  }

  private parseAccessToken(token: string): AccessTokenContent {
    const parts = token.split('.');
    const content = parts[1];
    const decodedContent = atob(content);
    return JSON.parse(decodedContent);
  }
}
