import { ApiResult, CrudController, EntityNotFoundControllerException, HttpStatus } from '@kwokka/common-node';
import { AccountRolesEntity } from '@kwokka/entities';
import { PublicProps } from '@kwokka/utils';
import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { CreateAccountRolesUsecase } from '../../../../usecase/account-roles/create-account-roles.usecase';
import { DeleteAccountRolesUsecase } from '../../../../usecase/account-roles/delete-account-roles.usecase';
import { GetAccountRolesByAccountIdUsecase } from '../../../../usecase/account-roles/get-account-roles-by-account-id.usecase';
import { GetAccountRolesByIdUsecase } from '../../../../usecase/account-roles/get-account-roles-by-id.usecase';
import { ListAccountRolesUsecase } from '../../../../usecase/account-roles/list-account-roles.usecase';
import { UpdateAccountRolesUsecase } from '../../../../usecase/account-roles/update-account-roles.usecase';
import { AccountRolesV1Adapter } from './account-roles-v1.adapter';

@injectable()
@injectFromBase()
export class AccountRolesV1Controller extends CrudController<AccountRolesEntity> {
  protected adapter: AccountRolesV1Adapter = new AccountRolesV1Adapter();

  public constructor(
    @inject(ListAccountRolesUsecase) protected readonly listUsecase: ListAccountRolesUsecase,
    @inject(CreateAccountRolesUsecase) protected readonly createUsecase: CreateAccountRolesUsecase,
    @inject(UpdateAccountRolesUsecase) protected readonly updateUsecase: UpdateAccountRolesUsecase,
    @inject(GetAccountRolesByIdUsecase) protected readonly getByIdUsecase: GetAccountRolesByIdUsecase,
    @inject(GetAccountRolesByAccountIdUsecase)
    protected readonly getByAccountIdUsecase: GetAccountRolesByAccountIdUsecase,
    @inject(DeleteAccountRolesUsecase) protected readonly deleteUsecase: DeleteAccountRolesUsecase,
  ) {
    super();
  }

  public async getByAccountId(req: Request): Promise<ApiResult<PublicProps<AccountRolesEntity>>> {
    const accountRoles = await this.getByAccountIdUsecase.perform(req.params.accountId);
    if (!accountRoles) {
      throw new EntityNotFoundControllerException(`accountRoles for accountId: ${req.params.accountId}`);
    }

    return { status: HttpStatus.Ok, data: this.adapter.serialize(accountRoles) };
  }
}
