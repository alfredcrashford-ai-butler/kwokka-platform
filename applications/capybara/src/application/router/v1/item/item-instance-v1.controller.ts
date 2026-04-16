import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccountEntity, ItemInstanceEntity } from '@kwokka/entities';
import { ApiResult, ControllerException, CrudController, HttpStatus } from '@kwokka/common-node';
import {
  GetItemByIdUsecase,
  GetItemByKeyUsecase,
  GetItemInstanceByIdUsecase,
  GetItemInstanceByItemIdUsecase,
  GetItemInstanceByItemKeyUsecase,
  GiveItemInstanceByItemKeyUsecase,
  GiveItemInstanceUsecase,
  ListItemInstancesUsecase,
  RunItemInstanceActionByItemIdUsecase,
  RunItemInstanceActionByItemKeyUsecase,
  RunItemInstanceActionUsecase,
  TakeItemInstanceByItemKeyUsecase,
  TakeItemInstanceUsecase,
} from '../../../../usecase';
import { ItemInstanceV1Adapter } from './item-instance-v1.adapter';
import { ExceptionCode } from '../../../../usecase/exception-code';

@injectable()
@injectFromBase()
export class ItemInstanceV1Controller extends CrudController<ItemInstanceEntity> {
  protected readonly adapter: ItemInstanceV1Adapter = new ItemInstanceV1Adapter();

  public constructor(
    @inject(GetItemByIdUsecase) protected readonly getItemByIdUsecase: GetItemByIdUsecase,
    @inject(GetItemByKeyUsecase) protected readonly getItemByKeyUsecase: GetItemByKeyUsecase,
    @inject(GetItemInstanceByIdUsecase) protected readonly getByIdUsecase: GetItemInstanceByIdUsecase,
    @inject(ListItemInstancesUsecase) protected readonly listUsecase: ListItemInstancesUsecase,
    @inject(RunItemInstanceActionUsecase) protected readonly runItemInstanceActionUsecase: RunItemInstanceActionUsecase,
    @inject(GiveItemInstanceUsecase) protected readonly giveItemInstanceUsecase: GiveItemInstanceUsecase,
    @inject(TakeItemInstanceUsecase) protected readonly takeItemInstanceUsecase: TakeItemInstanceUsecase,
    @inject(GetItemInstanceByItemIdUsecase)
    protected readonly getItemInstanceByItemIdUsecase: GetItemInstanceByItemIdUsecase,
    @inject(GetItemInstanceByItemKeyUsecase)
    protected readonly getItemInstanceByItemKeyUsecase: GetItemInstanceByItemKeyUsecase,
    @inject(GiveItemInstanceByItemKeyUsecase)
    protected readonly giveItemInstanceByItemKeyUsecase: GiveItemInstanceByItemKeyUsecase,
    @inject(TakeItemInstanceByItemKeyUsecase)
    protected readonly takeItemInstanceByItemKeyUsecase: TakeItemInstanceByItemKeyUsecase,
    @inject(RunItemInstanceActionByItemIdUsecase)
    protected readonly runItemInstanceActionByItemIdUsecase: RunItemInstanceActionByItemIdUsecase,
    @inject(RunItemInstanceActionByItemKeyUsecase)
    protected readonly runItemInstanceActionByItemKeyUsecase: RunItemInstanceActionByItemKeyUsecase,
  ) {
    super();
  }

  public async list(req: Request): Promise<ApiResult<ItemInstanceEntity[]>> {
    const offset = this.parseOffset(req);
    const limit = this.parseLimit(req);
    const usecaseResult = await this.listUsecase.perform(offset, limit, req.params.accountId);
    const data = this.adapter.serializeList(usecaseResult.payload);
    return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
  }

  public async listOwnItemInstances(req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity[]>> {
    const account = res.locals.account as AccountEntity;
    const offset = this.parseOffset(req);
    const limit = this.parseLimit(req);
    const usecaseResult = await this.listUsecase.perform(offset, limit, account.id);
    const data = this.adapter.serializeList(usecaseResult.payload);
    return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
  }

  public async runOwnActionByItemId(req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> {
    const account = res.locals.account as AccountEntity;
    const itemInstance = await this.runItemInstanceActionByItemIdUsecase.perform(
      req.params.id,
      account.id,
      req.body.key,
    );
    const data = this.adapter.serialize(itemInstance);
    return { status: HttpStatus.Ok, data };
  }

  public async runOwnActionByItemKey(req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> {
    const account = res.locals.account as AccountEntity;
    const itemInstance = await this.runItemInstanceActionByItemKeyUsecase.perform(
      req.params.key,
      account.id,
      req.body.key,
    );
    const data = this.adapter.serialize(itemInstance);
    return { status: HttpStatus.Ok, data };
  }

  public async runAction(req: Request): Promise<ApiResult<ItemInstanceEntity>> {
    let itemInstance = await this.getByIdUsecase.perform(req.params.id);
    if (!itemInstance) {
      throw new ControllerException(ExceptionCode.ItemInstanceDoesNotExist, 'Item instance does not exist');
    }

    itemInstance = await this.runItemInstanceActionUsecase.perform(itemInstance, req.body.key);
    const data = this.adapter.serialize(itemInstance);

    return { status: HttpStatus.Ok, data };
  }

  public async giveItemInstanceByItemId(req: Request): Promise<ApiResult<ItemInstanceEntity>> {
    const itemId = req.params.id;
    const { accountId, quantity } = req.body;
    const itemInstance = await this.giveItemInstanceUsecase.perform(accountId, itemId, quantity);
    return { data: this.adapter.serialize(itemInstance), status: HttpStatus.Ok };
  }

  public async giveItemInstanceByItemKey(req: Request): Promise<ApiResult<ItemInstanceEntity>> {
    const itemKey = req.params.key;
    const { accountId, quantity } = req.body;
    const itemInstance = await this.giveItemInstanceByItemKeyUsecase.perform(accountId, itemKey, quantity);
    return { data: this.adapter.serialize(itemInstance), status: HttpStatus.Ok };
  }

  public async takeItemInstanceByItemId(req: Request): Promise<ApiResult<ItemInstanceEntity>> {
    const itemId = req.params.id;
    const { accountId, quantity } = req.body;
    const itemInstance = await this.takeItemInstanceUsecase.perform(accountId, itemId, quantity);
    return { data: this.adapter.serialize(itemInstance), status: HttpStatus.Ok };
  }

  public async takeItemInstanceByItemKey(req: Request): Promise<ApiResult<ItemInstanceEntity>> {
    const itemKey = req.params.key;
    const { accountId, quantity } = req.body;
    const itemInstance = await this.takeItemInstanceByItemKeyUsecase.perform(accountId, itemKey, quantity);
    return { data: this.adapter.serialize(itemInstance), status: HttpStatus.Ok };
  }

  public async giveItemInstanceByApplicationsItemId(
    req: Request,
    res: Response,
  ): Promise<ApiResult<ItemInstanceEntity>> {
    const itemId = req.params.id;
    const { accountId, quantity } = req.body;
    const account = res.locals.account as AccountEntity;
    const itemInstance = await this.giveItemInstanceUsecase.perform(accountId, itemId, quantity, account.id);
    return { data: this.adapter.serialize(itemInstance), status: HttpStatus.Ok };
  }

  public async giveItemInstanceByApplicationsItemKey(
    req: Request,
    res: Response,
  ): Promise<ApiResult<ItemInstanceEntity>> {
    const itemKey = req.params.key;
    const account = res.locals.account as AccountEntity;
    const { accountId, quantity } = req.body;
    const itemInstance = await this.giveItemInstanceByItemKeyUsecase.perform(accountId, itemKey, quantity, account.id);
    return { data: this.adapter.serialize(itemInstance), status: HttpStatus.Ok };
  }

  public async takeItemInstanceByApplicationsItemId(
    req: Request,
    res: Response,
  ): Promise<ApiResult<ItemInstanceEntity>> {
    const itemId = req.params.id;
    const { accountId, quantity } = req.body;
    const account = res.locals.account as AccountEntity;
    const itemInstance = await this.giveItemInstanceUsecase.perform(accountId, itemId, quantity, account.id);
    return { data: this.adapter.serialize(itemInstance), status: HttpStatus.Ok };
  }

  public async takeItemInstanceByApplicationsItemKey(
    req: Request,
    res: Response,
  ): Promise<ApiResult<ItemInstanceEntity>> {
    const itemKey = req.params.key;
    const account = res.locals.account as AccountEntity;
    const { accountId, quantity } = req.body;
    const itemInstance = await this.takeItemInstanceByItemKeyUsecase.perform(accountId, itemKey, quantity, account.id);
    return { data: this.adapter.serialize(itemInstance), status: HttpStatus.Ok };
  }

  public async getItemInstanceByItemId(req: Request): Promise<ApiResult<ItemInstanceEntity>> {
    const { id: itemId, accountId } = req.params;
    const itemInstance = await this.getItemInstanceByItemIdUsecase.perform(itemId, accountId);
    const data = itemInstance ? this.adapter.serialize(itemInstance) : null;
    return { data, status: HttpStatus.Ok };
  }

  public async getItemInstanceByItemKey(req: Request): Promise<ApiResult<ItemInstanceEntity>> {
    const { key, accountId } = req.params;
    const itemInstance = await this.getItemInstanceByItemKeyUsecase.perform(key, accountId);
    const data = itemInstance ? this.adapter.serialize(itemInstance) : null;
    return { data, status: HttpStatus.Ok };
  }

  public async getOwnItemInstanceByItemId(req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> {
    const account = res.locals.account as AccountEntity;
    const { id: itemId } = req.params;
    const itemInstance = await this.getItemInstanceByItemIdUsecase.perform(itemId, account.id);
    const data = itemInstance ? this.adapter.serialize(itemInstance) : null;
    return { data, status: HttpStatus.Ok };
  }

  public async getOwnItemInstanceByItemKey(req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> {
    const account = res.locals.account as AccountEntity;
    const { key } = req.params;
    const itemInstance = await this.getItemInstanceByItemKeyUsecase.perform(key, account.id);
    const data = itemInstance ? this.adapter.serialize(itemInstance) : null;
    return { data, status: HttpStatus.Ok };
  }
}
