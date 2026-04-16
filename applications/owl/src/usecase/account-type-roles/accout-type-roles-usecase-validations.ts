import { AccountTypeRolesEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { AccessRoleRepository } from '../ports/access-role.repository';
import { AccountTypeRolesRepository } from '../ports/account-type-roles.repository';

export class AccountTypeRolesUsecaseValidations {
  public static async validateUniqueType(
    repo: AccountTypeRolesRepository,
    accountTypeRoles: Partial<AccountTypeRolesEntity>,
  ): Promise<void> {
    const existing = await repo.find({ filter: { type: accountTypeRoles.type } });
    if (existing) {
      throw new UsecaseException(
        ExceptionCode.AccountTypeRolesAlreadyExist,
        `Account type roles already exist for type: ${accountTypeRoles.type}.`,
      );
    }
  }

  public static async validateExist(repo: AccountTypeRolesRepository, id: string): Promise<void> {
    const existing = await repo.find({ filter: { id } });
    if (!existing) {
      throw new UsecaseException(
        ExceptionCode.AccountTypeRolesDoNotExist,
        `Account type roles with id: ${id} don\'t exist.`,
      );
    }
  }

  public static async validateRolesExist(repo: AccessRoleRepository, ids: string[]): Promise<void> {
    const { payload: roles } = await repo.listByIds(ids);
    if (roles.length !== ids.length) {
      const nonExistingIds = ids.filter((id) => !roles.find((el) => el.id === id));
      throw new UsecaseException(
        ExceptionCode.AccessRolesDoNotExist,
        `Access roles with ids [${nonExistingIds}] do not exist.`,
      );
    }
  }

  public static validateNoType(accountTypeRoles: Partial<AccountTypeRolesEntity>): void {
    if (accountTypeRoles.type) {
      throw new UsecaseException(
        ExceptionCode.ChangeOfTypeIsNotAllowedOnAccountTypeRoles,
        'Change of type on account type roles is not allowed.',
      );
    }
  }
}
