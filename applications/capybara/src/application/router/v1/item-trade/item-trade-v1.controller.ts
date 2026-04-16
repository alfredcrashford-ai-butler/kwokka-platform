import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccountEntity, ItemInstanceEntity, ItemTradeEntity } from '@kwokka/entities';
import { ApiResult, CrudController, EntityNotFoundControllerException, HttpStatus } from '@kwokka/common-node';
import {
  CreateItemTradeUsecase,
  DeleteItemTradeUsecase,
  GetItemTradeByIdUsecase,
  GetItemTradeByKeyUsecase,
  ListItemTradesUsecase,
  RunItemTradeUsecase,
  UpdateItemTradeUsecase,
} from '../../../../usecase';
import { ItemTradeV1Adapter } from './item-trade-v1.adapter';
import { ItemInstanceV1Adapter } from '../item/item-instance-v1.adapter';

@injectable()
@injectFromBase()
export class ItemTradeV1Controller extends CrudController<ItemTradeEntity> {
  protected readonly adapter: ItemTradeV1Adapter = new ItemTradeV1Adapter();
  protected readonly itemInstanceAdapter: ItemInstanceV1Adapter = new ItemInstanceV1Adapter();

  public constructor(
    @inject(ListItemTradesUsecase) protected readonly listUsecase: ListItemTradesUsecase,
    @inject(CreateItemTradeUsecase) protected readonly createUsecase: CreateItemTradeUsecase,
    @inject(UpdateItemTradeUsecase) protected readonly updateUsecase: UpdateItemTradeUsecase,
    @inject(GetItemTradeByIdUsecase) protected readonly getByIdUsecase: GetItemTradeByIdUsecase,
    @inject(DeleteItemTradeUsecase) protected readonly deleteUsecase: DeleteItemTradeUsecase,
    @inject(GetItemTradeByKeyUsecase) protected readonly getItemTradeByKeyUsecase: GetItemTradeByKeyUsecase,
    @inject(RunItemTradeUsecase) protected readonly runItemTradeUsecase: RunItemTradeUsecase,
  ) {
    super();
  }

  public async getItemTradeByKey(req: Request): Promise<ApiResult<ItemTradeEntity>> {
    const itemTrade = await this.fetchItemTradeByKey(req.params.key);
    const data = this.adapter.serialize(itemTrade);
    return { status: HttpStatus.Ok, data };
  }

  public async runOwnItemTradeById(req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> {
    const itemTrade = await this.fetchItemTradeById(req.params.id);
    const account = res.locals.account as AccountEntity;
    const itemInstance = await this.runItemTradeUsecase.perform(itemTrade, account);
    const data = this.itemInstanceAdapter.serialize(itemInstance);
    return { status: HttpStatus.Ok, data };
  }

  public async runOwnItemTradeByKey(req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> {
    const itemTrade = await this.fetchItemTradeByKey(req.params.key);
    const account = res.locals.account as AccountEntity;
    const itemInstance = await this.runItemTradeUsecase.perform(itemTrade, account);
    const data = this.itemInstanceAdapter.serialize(itemInstance);
    return { status: HttpStatus.Ok, data };
  }

  private async fetchItemTradeByKey(key: string): Promise<ItemTradeEntity> {
    const itemTrade = await this.getItemTradeByKeyUsecase.perform(key);

    if (!itemTrade) {
      throw new EntityNotFoundControllerException(`key: ${key}`);
    }

    return itemTrade;
  }

  private async fetchItemTradeById(id): Promise<ItemTradeEntity> {
    const itemTrade = await this.getByIdUsecase.perform(id);

    if (!itemTrade) {
      throw new EntityNotFoundControllerException(`id: ${id}`);
    }

    return itemTrade;
  }
}
