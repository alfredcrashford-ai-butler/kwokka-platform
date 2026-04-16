import { inject, injectable } from 'inversify';
import { AccountEntity, CredentialEntity, RestoreTokenEntity, TokenEntity, TokenEntityType } from '@kwokka/entities';
import { UuidUtil } from '@kwokka/utils';
import { Usecase } from '@kwokka/common-node';
import { TokenRepository } from '../ports/token.repository';

@injectable()
export class IssueRestoreTokenUsecase implements Usecase {
  public constructor(@inject(TokenRepository) private tokenRepository: TokenRepository) {}

  public async perform(account: AccountEntity, credential: CredentialEntity, data: any): Promise<RestoreTokenEntity> {
    const issueDateMs = Date.now();
    const expiryDateMs = issueDateMs + TokenEntity.RestoreTokenExpiryInterval;
    const correlationId = UuidUtil.generateNoSpecialSymbols();
    const token = new RestoreTokenEntity({
      correlationId,
      expiresAt: new Date(expiryDateMs),
      accountId: account.id,
      credentialId: credential.id,
      content: {
        type: TokenEntityType.Restore,
        correlationId,
        accountId: account.id,
        exp: expiryDateMs,
        iat: issueDateMs,
        jti: null,
        data,
      },
    });

    return (await this.tokenRepository.create(token)) as RestoreTokenEntity;
  }
}
