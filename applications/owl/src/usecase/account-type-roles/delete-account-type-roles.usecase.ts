import { inject, injectable } from 'inversify';
import { AccountTypeRolesEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountTypeRolesRepository } from '../ports/account-type-roles.repository';
import { AccountTypeRolesUsecaseValidations } from './accout-type-roles-usecase-validations';

@injectable()
export class DeleteAccountTypeRolesUsecase implements Usecase {
  public constructor(
    @inject(AccountTypeRolesRepository) private accountTypeRolesRepository: AccountTypeRolesRepository,
  ) {}

  public async perform(id: string): Promise<AccountTypeRolesEntity> {
    await AccountTypeRolesUsecaseValidations.validateExist(this.accountTypeRolesRepository, id);
    return await this.accountTypeRolesRepository.delete({ filter: { id } });
  }
}
