import { inject, injectable } from 'inversify';
import { AccountEntity, AccountEntityType } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { AccountRepository } from '../ports/account.repository';

@injectable()
export class ListAccountsUsecase implements Usecase {
  public constructor(@inject(AccountRepository) private accountRepository: AccountRepository) {}

  public async perform(offset: number, limit: number, type?: AccountEntityType): Promise<UsecaseListResult<AccountEntity>> {
    return await this.accountRepository.list({ offset, limit, filter: type ? { type } : undefined });
  }
}