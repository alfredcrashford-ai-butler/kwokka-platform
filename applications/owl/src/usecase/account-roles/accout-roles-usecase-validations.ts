import { AccountRolesEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { AccountRolesRepository } from '../ports/account-roles.repository';
import { AccountRepository } from '../ports/account.repository';

export class AccountRolesUsecaseValidations {
  public static async validateAccountExists(repo: AccountRepository, accountId: string): Promise<void> {
    const account = await repo.find({ filter: { id: accountId } });
    if (!account) {
      throw new UsecaseException(ExceptionCode.AccountDoesNotExist, `Account with id: ${accountId} does not exist.`);
    }
  }

  public static async validateAccountRolesExist(repo: AccountRolesRepository, id: string): Promise<void> {
    const accountRoles = await repo.find({ filter: { id } });
    if (!accountRoles) {
      throw new UsecaseException(ExceptionCode.AccountRolesDoNotExist, `Account roles with id: ${id} don\'t exist.`);
    }
  }

  public static async validateUniqueAccountId(repo: AccountRolesRepository, accountId: string): Promise<void> {
    const accountRoles = await repo.find({ filter: { accountId } });
    if (accountRoles) {
      throw new UsecaseException(
        ExceptionCode.AccountRolesAlreadyExist,
        `Account roles for account with id: ${accountId} already exist.`,
      );
    }
  }

  public static validateNoAccountId(accountRoles: Partial<AccountRolesEntity>): void {
    if (accountRoles.accountId) {
      throw new UsecaseException(
        ExceptionCode.ChangeOfAccountIdIsNotAllowedOnAccountRoles,
        'Change of accountId on account roles is not allowed.',
      );
    }
  }
}
