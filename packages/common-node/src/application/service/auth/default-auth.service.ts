import { AccessTokenContent, AccountEntity, TokenContent, TokenEntity } from '@kwokka/entities';
import { injectable, injectFromBase } from 'inversify';
import { AuthService } from './auth.service';
import { JwtUtil } from '../../../util';

@injectable()
@injectFromBase()
export class DefaultAuthService extends AuthService {
  protected parseTokenString(tokenString: string): TokenContent {
    return JwtUtil.parse<TokenContent>(tokenString);
  }

  protected override async getToken(tokenContent: AccessTokenContent): Promise<TokenEntity> {
    return new TokenEntity({
      type: tokenContent.type,
      content: tokenContent,
      accountId: tokenContent.accountId,
      credentialId: null,
      expiresAt: new Date(tokenContent.exp),
      correlationId: tokenContent.correlationId,
    });
  }

  protected override async getAccount(tokenContent: AccessTokenContent): Promise<AccountEntity> {
    if (!tokenContent.accountId) {
      return null;
    }

    return new AccountEntity({
      id: tokenContent.accountId,
      type: tokenContent.accountType,
      isActive: true,
      isVerified: true,
    });
  }
}
