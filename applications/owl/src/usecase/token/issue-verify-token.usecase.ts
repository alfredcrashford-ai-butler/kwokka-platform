import { inject, injectable } from 'inversify';
import { CredentialEntity, TokenEntity, TokenEntityType, VerifyTokenEntity } from '@kwokka/entities';
import { UuidUtil } from '@kwokka/utils';
import { Usecase } from '@kwokka/common-node';
import { TokenRepository } from '../ports/token.repository';

@injectable()
export class IssueVerifyTokenUsecase implements Usecase {
  public constructor(@inject(TokenRepository) private tokenRepository: TokenRepository) {}

  public async perform(credential: CredentialEntity): Promise<VerifyTokenEntity> {
    const issueDateMs = Date.now();
    const expiryDateMs = issueDateMs + TokenEntity.VerifyTokenExpiryInterval;
    const correlationId = UuidUtil.generateNoSpecialSymbols();
    const token = new VerifyTokenEntity({
      correlationId,
      expiresAt: new Date(expiryDateMs),
      accountId: credential.accountId,
      credentialId: credential.id,
      content: {
        type: TokenEntityType.Verify,
        credentialId: credential.id,
        correlationId,
        accountId: credential.accountId,
        exp: expiryDateMs,
        iat: issueDateMs,
        jti: null,
      },
    });

    await this.tokenRepository.updateMany(
      { filter: { credentialId: credential.id, type: TokenEntityType.Verify } },
      { revokedAt: new Date() },
    );

    return (await this.tokenRepository.create(token)) as VerifyTokenEntity;
  }
}
