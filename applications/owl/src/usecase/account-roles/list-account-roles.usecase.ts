import { inject, injectable } from 'inversify';
import { AccountRolesEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { AccountRolesRepository } from '../ports/account-roles.repository';

@injectable()
export class ListAccountRolesUsecase implements Usecase {
  public constructor(@inject(AccountRolesRepository) private accountRolesRepository: AccountRolesRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<AccountRolesEntity>> {
    return await this.accountRolesRepository.list({ offset, limit });
  }
}
