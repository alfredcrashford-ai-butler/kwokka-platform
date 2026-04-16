import { inject, injectable } from 'inversify';
import { AccountRolesEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountRolesRepository } from '../ports/account-roles.repository';

@injectable()
export class GetAccountRolesByAccountIdUsecase implements Usecase {
  public constructor(@inject(AccountRolesRepository) private accountRolesRepository: AccountRolesRepository) {}

  public async perform(accountId: string): Promise<AccountRolesEntity> {
    const accountRoles = await this.accountRolesRepository.find({ filter: { accountId } });

    if (!accountRoles) {
      return null;
    }

    return accountRoles;
  }
}
