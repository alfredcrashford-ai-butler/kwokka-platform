import { inject, injectable } from 'inversify';
import { AccountEntity, AccessTokenEntity, TokenEntity, TokenEntityType, RefreshTokenEntity } from '@kwokka/entities';
import { UuidUtil } from '@kwokka/utils';
import { Usecase } from '@kwokka/common-node';
import { GetAccessRightsForAccountUsecase } from '../access-right/get-access-rights-for-account.usecase';
import { TokenRepository } from '../ports/token.repository';
import { TokenPair } from '../../entity';

@injectable()
export class IssueTokenPairUsecase implements Usecase {
  public constructor(
    @inject(TokenRepository) private tokenRepository: TokenRepository,
    @inject(GetAccessRightsForAccountUsecase)
    private getAccessRightsForAccountUsecase: GetAccessRightsForAccountUsecase,
  ) {}

  public async perform(account: AccountEntity, credentialId: string, correlationId?: string): Promise<TokenPair> {
    correlationId ||= UuidUtil.generateNoSpecialSymbols();
    const access = await this.createAccessToken(account, credentialId, correlationId);
    const refresh = await this.createRefreshToken(account, credentialId, correlationId);

    return { access, refresh };
  }

  private async createAccessToken(
    account: AccountEntity,
    credentialId: string,
    correlationId: string,
  ): Promise<AccessTokenEntity> {
    const accessRights = await this.getAccessRightsForAccountUsecase.perform(account);
    const accessRightNames = accessRights.map((el) => el.name);
    const issueDateMs = Date.now();
    const accessTokenExpiryDateMs = issueDateMs + TokenEntity.AccessTokenExpiryInterval;
    let token = new AccessTokenEntity({
      expiresAt: new Date(accessTokenExpiryDateMs),
      content: {
        rights: accessRightNames,
        type: TokenEntityType.Access,
        accountType: account.type,
        accountId: account.id,
        correlationId,
        exp: accessTokenExpiryDateMs,
        iat: issueDateMs,
        jti: null,
      },
      accountId: account.id,
      credentialId: credentialId,
      correlationId,
    });

    return (await this.tokenRepository.create(token)) as AccessTokenEntity;
  }

  private async createRefreshToken(
    account: AccountEntity,
    credentialId: string,
    correlationId: string,
  ): Promise<RefreshTokenEntity> {
    const issueDateMs = Date.now();
    const refreshTokenExpiryDateMs = issueDateMs + TokenEntity.RefreshTokenExpiryInterval;
    let token = new RefreshTokenEntity({
      expiresAt: new Date(refreshTokenExpiryDateMs),
      content: {
        type: TokenEntityType.Refresh,
        accountId: account.id,
        correlationId,
        exp: refreshTokenExpiryDateMs,
        iat: issueDateMs,
        jti: null,
      },
      accountId: account.id,
      credentialId: credentialId,
      correlationId,
    });
    return (await this.tokenRepository.create(token)) as RefreshTokenEntity;
  }
}
