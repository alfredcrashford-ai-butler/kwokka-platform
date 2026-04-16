import { inject, injectable } from 'inversify';
import {
  AccountEntity,
  AccessRightEntity,
  AccessRoleEntity,
  AccountTypeRolesEntity,
  AccountRolesEntity,
} from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRightRepository } from '../ports/access-right.repository';
import { AccessRoleRepository } from '../ports/access-role.repository';
import { AccountRolesRepository } from '../ports/account-roles.repository';
import { AccountTypeRolesRepository } from '../ports/account-type-roles.repository';

@injectable()
export class GetAccessRightsForAccountUsecase implements Usecase {
  public constructor(
    @inject(AccessRightRepository) private accessRightRepository: AccessRightRepository,
    @inject(AccountRolesRepository) private accountRolesRepository: AccountRolesRepository,
    @inject(AccountTypeRolesRepository) private accountTypeRolesRepository: AccountTypeRolesRepository,
    @inject(AccessRoleRepository) private accessRoleRepository: AccessRoleRepository,
  ) {}

  public async perform(account: AccountEntity): Promise<AccessRightEntity[]> {
    const accountRoles = await this.accountRolesRepository.find({ filter: { accountId: account.id } });
    const accountTypeRoles = await this.accountTypeRolesRepository.find({ filter: { type: account.type } });
    const roleIds = this.getAccountRolesIds(accountTypeRoles, accountRoles);
    const { payload: roles } = await this.accessRoleRepository.listByIds(roleIds);
    const rightIds = this.getAccountRightsIds(roles);
    const accessRightsListResult = await this.accessRightRepository.listByIds(rightIds);
    return accessRightsListResult.payload;
  }

  private getAccountRightsIds(roles: AccessRoleEntity[]): string[] {
    const allRightIds = roles.map((el) => el.accessRightsIds).flat();
    const uniqueRightIds = new Set(allRightIds);
    return Array.from(uniqueRightIds);
  }

  private getAccountRolesIds(accountTypeRoles: AccountTypeRolesEntity, accountRoles?: AccountRolesEntity): string[] {
    const accessRolesFromAccountMapping = accountRoles?.accessRoles || [];
    const enabledRoleIds = accessRolesFromAccountMapping.filter((el) => el.enabled).map((el) => el.id);
    const disabledRoleIds = accessRolesFromAccountMapping.filter((el) => !el.enabled).map((el) => el.id);
    const rolesFromAccountTypeMapping = accountTypeRoles?.accessRolesIds || [];

    const allRoleIds = [...rolesFromAccountTypeMapping, ...enabledRoleIds].filter(
      (id) => !disabledRoleIds.includes(id),
    );
    const uniqueRoleIds = new Set(allRoleIds);
    return Array.from(uniqueRoleIds);
  }
}
