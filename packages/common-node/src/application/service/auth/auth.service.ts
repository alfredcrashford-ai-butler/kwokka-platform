import {
  AccessTokenContent,
  AccessTokenEntity,
  AccountEntity,
  TokenContent,
  TokenEntity,
  TokenEntityType,
} from '@kwokka/entities';
import { inject, injectable } from 'inversify';
import { LoggerService } from '../logger';

export interface AuthInfo {
  isAuthenticated: boolean;
  token: AccessTokenEntity;
  account: AccountEntity;
}

export interface AuthInfoOptions {
  skipExpiryCheck: boolean;
  skipRevokeCheck: boolean;
}

@injectable()
export abstract class AuthService {
  public constructor(@inject(LoggerService) protected logger: LoggerService) {}

  public async getAuthInfo(tokenOrAuthHeader: string, options?: AuthInfoOptions): Promise<AuthInfo> {
    if (!tokenOrAuthHeader || typeof tokenOrAuthHeader !== 'string') {
      return this.getUnauthenticatedInfo();
    }

    const tokenString = this.parseTokenFromAuthHeader(tokenOrAuthHeader);
    if (!tokenString) {
      return this.getUnauthenticatedInfo();
    }

    try {
      const tokenContent = this.parseTokenString(tokenString);
      if (!tokenContent || !tokenContent.jti) {
        return this.getUnauthenticatedInfo();
      }

      if (!options?.skipExpiryCheck && tokenContent.exp && tokenContent.exp < Date.now()) {
        return this.getUnauthenticatedInfo();
      }

      const token = (await this.getToken(tokenContent as AccessTokenContent)) as AccessTokenEntity;
      if (!token || token.type !== TokenEntityType.Access) {
        return this.getUnauthenticatedInfo();
      }

      if (!options?.skipRevokeCheck && token.revokedAt) {
        return this.getUnauthenticatedInfo();
      }

      const account = await this.getAccount(tokenContent as AccessTokenContent);
      if (!account || account.deletedAt || !account.isActive) {
        return this.getUnauthenticatedInfo();
      }

      return { isAuthenticated: true, account, token };
    } catch (error) {
      this.logger.error(error.stack);
      return this.getUnauthenticatedInfo();
    }
  }

  private parseTokenFromAuthHeader(tokenOrAuthHeader: string): string {
    if (tokenOrAuthHeader.startsWith('Bearer ')) {
      return tokenOrAuthHeader.substring(7, tokenOrAuthHeader.length);
    }

    return tokenOrAuthHeader;
  }

  private getUnauthenticatedInfo(): AuthInfo {
    return { isAuthenticated: false, account: null, token: null };
  }

  protected abstract getToken(tokenContent: AccessTokenContent): Promise<TokenEntity>;

  protected abstract getAccount(tokenContent: AccessTokenContent): Promise<AccountEntity>;

  protected abstract parseTokenString(tokenString: string): TokenContent;
}
