import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { ItemEntity } from '@kwokka/entities';
import { ApiResult, CrudController, EntityNotFoundControllerException, HttpStatus } from '@kwokka/common-node';
import { ItemV1Adapter } from './item-v1.adapter';
import {
  CreateItemUsecase,
  DeleteItemUsecase,
  GetItemByIdUsecase,
  GetItemByKeyUsecase,
  ListItemsUsecase,
  UpdateItemUsecase,
} from '../../../../usecase/item';

@injectable()
@injectFromBase()
export class ItemV1Controller extends CrudController<ItemEntity> {
  protected readonly adapter: ItemV1Adapter = new ItemV1Adapter();

  public constructor(
    @inject(ListItemsUsecase) protected readonly listUsecase: ListItemsUsecase,
    @inject(CreateItemUsecase) protected readonly createUsecase: CreateItemUsecase,
    @inject(UpdateItemUsecase) protected readonly updateUsecase: UpdateItemUsecase,
    @inject(GetItemByIdUsecase) protected readonly getByIdUsecase: GetItemByIdUsecase,
    @inject(DeleteItemUsecase) protected readonly deleteUsecase: DeleteItemUsecase,
    @inject(GetItemByKeyUsecase) protected readonly getItemByKeyUsecase: GetItemByKeyUsecase,
  ) {
    super();
  }

  public override async list(req: Request): Promise<ApiResult<ItemEntity[]>> {
    const offset = this.parseOffset(req);
    const limit = this.parseLimit(req);
    const tags = this.parseStringArrayQueryParam(req, 'tags');
    const keys = this.parseStringArrayQueryParam(req, 'keys');
    const ids = this.parseStringArrayQueryParam(req, 'ids');
    const applicationAccountId = this.parseStringQueryParam(req, 'applicationAccountId');
    const usecaseResult = await this.listUsecase.perform(offset, limit, { ids, keys, tags, applicationAccountId });
    const data = this.adapter.serializeList(usecaseResult.payload);
    return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
  }

  public async getItemByKey(req: Request): Promise<ApiResult<ItemEntity>> {
    const item = await this.getItemByKeyUsecase.perform(req.params.key);

    if (!item) {
      throw new EntityNotFoundControllerException(`key: ${req.params.key}`);
    }

    const data = this.adapter.serialize(item);
    return { status: HttpStatus.Ok, data };
  }
}
