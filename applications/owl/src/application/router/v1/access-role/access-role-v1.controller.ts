import { inject, injectable, injectFromBase } from 'inversify';
import { AccessRoleEntity } from '@kwokka/entities';
import { CrudController } from '@kwokka/common-node';
import { CreateAccessRoleUsecase } from '../../../../usecase/access-role/create-access-role.usecase';
import { DeleteAccessRoleUsecase } from '../../../../usecase/access-role/delete-access-role.usecase';
import { GetAccessRoleByIdUsecase } from '../../../../usecase/access-role/get-access-role-by-id.usecase';
import { ListAccessRolesUsecase } from '../../../../usecase/access-role/list-access-roles.usecase';
import { UpdateAccessRoleUsecase } from '../../../../usecase/access-role/update-access-role.usecase';
import { AccessRoleV1Adapter } from './access-role-v1.adapter';

@injectable()
@injectFromBase()
export class AccessRoleV1Controller extends CrudController<AccessRoleEntity> {
  protected adapter: AccessRoleV1Adapter = new AccessRoleV1Adapter();

  public constructor(
    @inject(ListAccessRolesUsecase) protected readonly listUsecase: ListAccessRolesUsecase,
    @inject(CreateAccessRoleUsecase) protected readonly createUsecase: CreateAccessRoleUsecase,
    @inject(UpdateAccessRoleUsecase) protected readonly updateUsecase: UpdateAccessRoleUsecase,
    @inject(GetAccessRoleByIdUsecase) protected readonly getByIdUsecase: GetAccessRoleByIdUsecase,
    @inject(DeleteAccessRoleUsecase) protected readonly deleteUsecase: DeleteAccessRoleUsecase,
  ) {
    super();
  }
}
