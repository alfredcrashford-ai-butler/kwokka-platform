import { inject, injectable, injectFromBase } from 'inversify';
import { AccountTypeRolesEntity } from '@kwokka/entities';
import { CrudController } from '@kwokka/common-node';
import { CreateAccountTypeRolesUsecase } from '../../../../usecase/account-type-roles/create-account-type-roles.usecase';
import { DeleteAccountTypeRolesUsecase } from '../../../../usecase/account-type-roles/delete-account-type-roles.usecase';
import { GetAccountTypeRolesByIdUsecase } from '../../../../usecase/account-type-roles/get-account-type-roles-by-id.usecase';
import { ListAccountTypeRolesUsecase } from '../../../../usecase/account-type-roles/list-account-type-roles.usecase';
import { UpdateAccountTypeRolesUsecase } from '../../../../usecase/account-type-roles/update-account-type-roles.usecase';
import { AccountTypeRolesV1Adapter } from './account-type-roles-v1.adapter';

@injectable()
@injectFromBase()
export class AccountTypeRolesV1Controller extends CrudController<AccountTypeRolesEntity> {
  protected adapter: AccountTypeRolesV1Adapter = new AccountTypeRolesV1Adapter();

  public constructor(
    @inject(ListAccountTypeRolesUsecase) protected readonly listUsecase: ListAccountTypeRolesUsecase,
    @inject(CreateAccountTypeRolesUsecase) protected readonly createUsecase: CreateAccountTypeRolesUsecase,
    @inject(UpdateAccountTypeRolesUsecase) protected readonly updateUsecase: UpdateAccountTypeRolesUsecase,
    @inject(GetAccountTypeRolesByIdUsecase) protected readonly getByIdUsecase: GetAccountTypeRolesByIdUsecase,
    @inject(DeleteAccountTypeRolesUsecase) protected readonly deleteUsecase: DeleteAccountTypeRolesUsecase,
  ) {
    super();
  }
}
