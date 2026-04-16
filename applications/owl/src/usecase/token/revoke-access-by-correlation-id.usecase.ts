import { inject, injectable } from 'inversify';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { TokenRepository } from '../ports';

@injectable()
export class RevokeAccessByCorrelationIdUsecase implements Usecase {
  public constructor(@inject(TokenRepository) private tokenRepository: TokenRepository) {}

  public async perform(correlationId: string): Promise<UsecaseListResult<null>> {
    return await this.tokenRepository.updateMany(
      { filter: { correlationId, revokedAt: null } },
      { revokedAt: new Date() },
    );
  }
}
