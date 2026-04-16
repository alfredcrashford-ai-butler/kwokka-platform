import { inject, injectable } from 'inversify';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { TokenRepository } from '../ports/token.repository';

@injectable()
export class RevokeAccessByAccountIdUsecase implements Usecase {
  public constructor(@inject(TokenRepository) private tokenRepository: TokenRepository) {}

  public async perform(accountId: string): Promise<UsecaseListResult<null>> {
    return await this.tokenRepository.updateMany({ filter: { accountId, revokedAt: null } }, { revokedAt: new Date() });
  }
}
