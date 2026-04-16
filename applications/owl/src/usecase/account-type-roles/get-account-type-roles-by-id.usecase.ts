import { inject, injectable } from 'inversify';
import { AccountTypeRolesEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountTypeRolesRepository } from '../ports/account-type-roles.repository';

@injectable()
export class GetAccountTypeRolesByIdUsecase implements Usecase {
  public constructor(
    @inject(AccountTypeRolesRepository) private accountTypeRolesRepository: AccountTypeRolesRepository,
  ) {}

  public async perform(id: string): Promise<AccountTypeRolesEntity> {
    const accountTypeRoles = await this.accountTypeRolesRepository.find({ filter: { id } });

    if (!accountTypeRoles) {
      return null;
    }

    return accountTypeRoles;
  }
}
