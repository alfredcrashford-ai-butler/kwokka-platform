import { inject, injectable, injectFromBase } from 'inversify';
import { AccessRightEntity } from '@kwokka/entities';
import { CrudController } from '@kwokka/common-node';
import { CreateAccessRightUsecase } from '../../../../usecase/access-right/create-access-right.usecase';
import { DeleteAccessRightUsecase } from '../../../../usecase/access-right/delete-access-right.usecase';
import { GetAccessRightByIdUsecase } from '../../../../usecase/access-right/get-access-right-by-id.usecase';
import { ListAccessRightsUsecase } from '../../../../usecase/access-right/list-access-rights.usecase';
import { UpdateAccessRightUsecase } from '../../../../usecase/access-right/update-access-right.usecase';
import { AccessRightV1Adapter } from './access-right-v1.adapter';

@injectable()
@injectFromBase()
export class AccessRightV1Controller extends CrudController<AccessRightEntity> {
  protected readonly adapter: AccessRightV1Adapter = new AccessRightV1Adapter();

  public constructor(
    @inject(ListAccessRightsUsecase) protected readonly listUsecase: ListAccessRightsUsecase,
    @inject(CreateAccessRightUsecase) protected readonly createUsecase: CreateAccessRightUsecase,
    @inject(UpdateAccessRightUsecase) protected readonly updateUsecase: UpdateAccessRightUsecase,
    @inject(GetAccessRightByIdUsecase) protected readonly getByIdUsecase: GetAccessRightByIdUsecase,
    @inject(DeleteAccessRightUsecase) protected readonly deleteUsecase: DeleteAccessRightUsecase,
  ) {
    super();
  }
}
