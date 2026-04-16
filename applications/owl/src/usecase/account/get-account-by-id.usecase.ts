import { inject, injectable } from 'inversify';
import { AccountEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountRepository } from '../ports/account.repository';

@injectable()
export class GetAccountByIdUsecase implements Usecase {
  public constructor(@inject(AccountRepository) private accountRepository: AccountRepository) {}

  public async perform(id: string): Promise<AccountEntity> {
    const account = await this.accountRepository.find({ filter: { id } });

    if (!account) {
      return null;
    }

    return account;
  }
}
