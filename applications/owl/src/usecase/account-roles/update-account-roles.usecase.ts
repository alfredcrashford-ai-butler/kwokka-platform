import { inject, injectable } from 'inversify';
import { AccountRolesEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountRolesRepository } from '../ports/account-roles.repository';
import { AccountRolesUsecaseValidations } from './accout-roles-usecase-validations';

@injectable()
export class UpdateAccountRolesUsecase implements Usecase {
  public constructor(@inject(AccountRolesRepository) private accountRolesRepository: AccountRolesRepository) {}

  public async perform(id: string, accountRoles: Partial<AccountRolesEntity>): Promise<AccountRolesEntity> {
    await AccountRolesUsecaseValidations.validateAccountRolesExist(this.accountRolesRepository, id);
    AccountRolesUsecaseValidations.validateNoAccountId(accountRoles);

    return await this.accountRolesRepository.update({ filter: { id } }, accountRoles);
  }
}
