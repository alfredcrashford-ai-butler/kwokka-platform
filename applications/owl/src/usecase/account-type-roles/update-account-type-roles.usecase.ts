import { inject, injectable } from 'inversify';
import { AccountTypeRolesEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRoleRepository } from '../ports/access-role.repository';
import { AccountTypeRolesRepository } from '../ports/account-type-roles.repository';
import { AccountTypeRolesUsecaseValidations } from './accout-type-roles-usecase-validations';

@injectable()
export class UpdateAccountTypeRolesUsecase implements Usecase {
  public constructor(
    @inject(AccountTypeRolesRepository) private accountTypeRolesRepository: AccountTypeRolesRepository,
    @inject(AccessRoleRepository) private accessRoleRepository: AccessRoleRepository,
  ) {}

  public async perform(id: string, accountTypeRoles: Partial<AccountTypeRolesEntity>): Promise<AccountTypeRolesEntity> {
    await AccountTypeRolesUsecaseValidations.validateExist(this.accountTypeRolesRepository, id);
    AccountTypeRolesUsecaseValidations.validateNoType(accountTypeRoles);
    if (accountTypeRoles.accessRolesIds) {
      await AccountTypeRolesUsecaseValidations.validateRolesExist(
        this.accessRoleRepository,
        accountTypeRoles.accessRolesIds,
      );
    }

    return await this.accountTypeRolesRepository.update({ filter: { id } }, accountTypeRoles);
  }
}
