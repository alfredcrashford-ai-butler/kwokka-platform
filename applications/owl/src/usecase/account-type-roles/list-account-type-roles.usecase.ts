import { inject, injectable } from 'inversify';
import { AccountTypeRolesEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { AccountTypeRolesRepository } from '../ports/account-type-roles.repository';

@injectable()
export class ListAccountTypeRolesUsecase implements Usecase {
  public constructor(
    @inject(AccountTypeRolesRepository) private accountTypeRolesRepository: AccountTypeRolesRepository,
  ) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<AccountTypeRolesEntity>> {
    return await this.accountTypeRolesRepository.list({ offset, limit });
  }
}
