import { inject, injectable } from 'inversify';
import { TokenEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { TokenRepository } from '../ports/token.repository';

@injectable()
export class ListTokensByAccountIdUsecase implements Usecase {
  public constructor(@inject(TokenRepository) private tokenRepository: TokenRepository) {}

  public async perform(accountId: string, offset: number, limit: number): Promise<UsecaseListResult<TokenEntity>> {
    return await this.tokenRepository.list({ filter: { accountId }, offset, limit });
  }
}
