import { inject, injectable } from 'inversify';
import { AccountTypeRolesEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRoleRepository } from '../ports/access-role.repository';
import { AccountTypeRolesRepository } from '../ports/account-type-roles.repository';
import { AccountTypeRolesUsecaseValidations } from './accout-type-roles-usecase-validations';

@injectable()
export class CreateAccountTypeRolesUsecase implements Usecase {
  public constructor(
    @inject(AccountTypeRolesRepository) private accountTypeRolesRepository: AccountTypeRolesRepository,
    @inject(AccessRoleRepository) private accessRoleRepository: AccessRoleRepository,
  ) {}

  public async perform(accountTypeRoles: AccountTypeRolesEntity): Promise<AccountTypeRolesEntity> {
    await AccountTypeRolesUsecaseValidations.validateUniqueType(this.accountTypeRolesRepository, accountTypeRoles);
    await AccountTypeRolesUsecaseValidations.validateRolesExist(
      this.accessRoleRepository,
      accountTypeRoles.accessRolesIds,
    );

    return await this.accountTypeRolesRepository.create(accountTypeRoles);
  }
}
