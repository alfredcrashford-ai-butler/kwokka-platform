import { inject, injectable } from 'inversify';
import { AccountRolesEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountRolesRepository } from '../ports/account-roles.repository';
import { AccountRolesUsecaseValidations } from './accout-roles-usecase-validations';

@injectable()
export class DeleteAccountRolesUsecase implements Usecase {
  public constructor(@inject(AccountRolesRepository) private accountRolesRepository: AccountRolesRepository) {}

  public async perform(id: string): Promise<AccountRolesEntity> {
    await AccountRolesUsecaseValidations.validateAccountRolesExist(this.accountRolesRepository, id);
    return await this.accountRolesRepository.delete({ filter: { id } });
  }
}
