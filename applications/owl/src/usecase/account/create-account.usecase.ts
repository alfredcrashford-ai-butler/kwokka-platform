import { inject, injectable } from 'inversify';
import { AccountEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountRepository } from '../ports/account.repository';

@injectable()
export class CreateAccountUsecase implements Usecase {
  public constructor(@inject(AccountRepository) private accountRepository: AccountRepository) {}

  public async perform(account: AccountEntity): Promise<AccountEntity> {
    return await this.accountRepository.create(account);
  }
}
