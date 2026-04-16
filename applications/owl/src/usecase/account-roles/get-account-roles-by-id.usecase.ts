import { inject, injectable } from 'inversify';
import { AccountRolesEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountRolesRepository } from '../ports/account-roles.repository';

@injectable()
export class GetAccountRolesByIdUsecase implements Usecase {
  public constructor(@inject(AccountRolesRepository) private accountRolesRepository: AccountRolesRepository) {}

  public async perform(id: string): Promise<AccountRolesEntity> {
    const accountRoles = await this.accountRolesRepository.find({ filter: { id } });

    if (!accountRoles) {
      return null;
    }

    return accountRoles;
  }
}
