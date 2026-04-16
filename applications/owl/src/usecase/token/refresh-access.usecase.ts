import { inject, injectable } from 'inversify';
import { RefreshTokenEntity, TokenEntityType } from '@kwokka/entities';
import { Usecase, UsecaseException } from '@kwokka/common-node';
import { GetAccountByIdUsecase } from '../account/get-account-by-id.usecase';
import { ExceptionCode } from '../exception-code';
import { TokenRepository } from '../ports/token.repository';
import { IssueTokenPairUsecase } from './issue-token-pair.usecase';
import { RevokeAccessByCorrelationIdUsecase } from './revoke-access-by-correlation-id.usecase';
import { TokenPair } from '../../entity';

@injectable()
export class RefreshAccessUsecase implements Usecase {
  public constructor(
    @inject(TokenRepository) private tokenRepository: TokenRepository,
    @inject(RevokeAccessByCorrelationIdUsecase)
    private revokeAccessByCorrelationIdUsecase: RevokeAccessByCorrelationIdUsecase,
    @inject(IssueTokenPairUsecase)
    private issueTokenPairUsecase: IssueTokenPairUsecase,
    @inject(GetAccountByIdUsecase)
    private getAccountByIdUsecase: GetAccountByIdUsecase,
  ) {}

  public async perform(refreshToken: RefreshTokenEntity): Promise<TokenPair> {
    // Step 1: verify token is not revoked or expired
    if (refreshToken.revokedAt || (refreshToken.expiresAt && refreshToken.expiresAt.getTime() < Date.now())) {
      throw new UsecaseException(ExceptionCode.RefreshTokenInvalid, 'Refresh token is invalid.');
    }

    // Step 2: revoke all tokens in correlation
    await this.revokeAccessByCorrelationIdUsecase.perform(refreshToken.correlationId);

    // Step 3: verify this is the last token
    const lastRefreshToken = await this.tokenRepository.findLastTokenInCorrelation(
      refreshToken.correlationId,
      TokenEntityType.Refresh,
    );
    if (lastRefreshToken.id !== refreshToken.id) {
      throw new UsecaseException(ExceptionCode.RefreshTokenInvalid, 'Refresh token is invalid.');
    }

    // Step 4: verify the account is active
    const account = await this.getAccountByIdUsecase.perform(refreshToken.accountId);
    if (!account || !account.isActive) {
      throw new UsecaseException(ExceptionCode.RefreshTokenInvalid, 'Refresh token is invalid.');
    }

    // Step 5: issue new pair of access and refresh tokens
    return await this.issueTokenPairUsecase.perform(account, refreshToken.credentialId, refreshToken.correlationId);
  }
}
