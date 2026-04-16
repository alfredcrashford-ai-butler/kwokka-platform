import { inject, injectable } from 'inversify';
import { AccountEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountRepository } from '../ports/account.repository';
import { AccountUsecaseValidations } from './accout-usecase-validations';

@injectable()
export class SetAccountActiveUsecase implements Usecase {
  public constructor(@inject(AccountRepository) private accountRepository: AccountRepository) {}

  public async perform(accountId: string, isActive: boolean): Promise<AccountEntity> {
    await AccountUsecaseValidations.validateAccountExists(this.accountRepository, accountId);
    return await this.accountRepository.update({ filter: { id: accountId } }, { isActive });
  }
}
