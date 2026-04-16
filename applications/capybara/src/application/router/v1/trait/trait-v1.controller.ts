import { inject, injectable, injectFromBase } from 'inversify';
import { Request } from 'express';
import { TraitEntity } from '@kwokka/entities';
import { ApiResult, CrudController, EntityNotFoundControllerException, HttpStatus } from '@kwokka/common-node';
import {
  ListTraitsUsecase,
  CreateTraitUsecase,
  GetTraitByIdUsecase,
  DeleteTraitUsecase,
  GetTraitByKeyUsecase,
  UpdateTraitUsecase,
} from '../../../../usecase';
import { TraitV1Adapter } from './trait-v1.adapter';

@injectable()
@injectFromBase()
export class TraitV1Controller extends CrudController<TraitEntity> {
  protected readonly adapter: TraitV1Adapter = new TraitV1Adapter();

  public constructor(
    @inject(ListTraitsUsecase) protected readonly listUsecase: ListTraitsUsecase,
    @inject(CreateTraitUsecase) protected readonly createUsecase: CreateTraitUsecase,
    @inject(UpdateTraitUsecase) protected readonly updateUsecase: UpdateTraitUsecase,
    @inject(GetTraitByIdUsecase) protected readonly getByIdUsecase: GetTraitByIdUsecase,
    @inject(DeleteTraitUsecase) protected readonly deleteUsecase: DeleteTraitUsecase,
    @inject(GetTraitByKeyUsecase) protected readonly getTraitByKeyUsecase: GetTraitByKeyUsecase,
  ) {
    super();
  }

  public async getByKey(req: Request): Promise<ApiResult<TraitEntity>> {
    const entity = await this.getTraitByKeyUsecase.perform(req.params.key);
    if (!entity) {
      throw new EntityNotFoundControllerException(`key: ${req.params.key}`);
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }
}
