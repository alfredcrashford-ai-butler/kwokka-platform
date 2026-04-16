import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { AccountRolesRepository } from '../ports/account-roles.repository';
import { AccountRepository } from '../ports/account.repository';
import { AccountRolesUsecaseValidations } from './accout-roles-usecase-validations';
import { AccountRolesEntity } from '@kwokka/entities';

@injectable()
export class CreateAccountRolesUsecase implements Usecase {
  public constructor(
    @inject(AccountRepository) private accountRepository: AccountRepository,
    @inject(AccountRolesRepository) private accountRolesRepository: AccountRolesRepository,
  ) {}

  public async perform(accountRoles: AccountRolesEntity): Promise<AccountRolesEntity> {
    await AccountRolesUsecaseValidations.validateAccountExists(this.accountRepository, accountRoles.accountId);
    await AccountRolesUsecaseValidations.validateUniqueAccountId(this.accountRolesRepository, accountRoles.accountId);

    return await this.accountRolesRepository.create(accountRoles);
  }
}
