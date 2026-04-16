import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { ItemInstanceEntity, ItemTradeEntity } from '@kwokka/entities';
import { CapybaraAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { ItemTradeV1Controller } from './item-trade-v1.controller';
import { ItemTradeV1ViewModel } from './item-trade-v1.view-model';

@injectable()
@injectFromBase()
export class ItemTradeV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(ItemTradeV1Controller) private controller: ItemTradeV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.CreateItemTrade]),
        this.validation.withViewModel(ItemTradeV1ViewModel.Create),
      ],
      this.createItemTrade,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadItemTrade]),
        this.validation.withViewModel(ItemTradeV1ViewModel.List),
      ],
      this.listItemTrades,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadItemTrade]),
        this.validation.withViewModel(ItemTradeV1ViewModel.GetById),
      ],
      this.getItemTradeById,
    );

    this.get(
      '/key/:key',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadItemTrade]),
        this.validation.withViewModel(ItemTradeV1ViewModel.GetByKey),
      ],
      this.getItemTradeByKey,
    );

    this.post(
      '/:id/my/run',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.RunOwnItemTrade]),
        this.validation.withViewModel(ItemTradeV1ViewModel.RunOwnById),
      ],
      this.runOwnItemTradeById,
    );

    this.post(
      '/key/:key/my/run',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.RunOwnItemTrade]),
        this.validation.withViewModel(ItemTradeV1ViewModel.RunOwnByKey),
      ],
      this.runOwnItemTradeByKey,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateItemTrade]),
        this.validation.withViewModel(ItemTradeV1ViewModel.Patch),
      ],
      this.patchItemTrade,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.DeleteItemTrade]),
        this.validation.withViewModel(ItemTradeV1ViewModel.Delete),
      ],
      this.deleteItemTrade,
    );
  }

  public createItemTrade = async (req: Request): Promise<ApiResult<ItemTradeEntity>> => {
    return this.controller.create(req);
  };

  public listItemTrades = async (req: Request): Promise<ApiResult<ItemTradeEntity[]>> => {
    return this.controller.list(req);
  };

  public patchItemTrade = async (req: Request): Promise<ApiResult<ItemTradeEntity>> => {
    return this.controller.patch(req);
  };

  public deleteItemTrade = async (req: Request): Promise<ApiResult<ItemTradeEntity>> => {
    return this.controller.delete(req);
  };

  public getItemTradeById = async (req: Request): Promise<ApiResult<ItemTradeEntity>> => {
    return this.controller.getById(req);
  };

  public getItemTradeByKey = async (req: Request): Promise<ApiResult<ItemTradeEntity>> => {
    return this.controller.getItemTradeByKey(req);
  };

  public runOwnItemTradeById = async (req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.controller.runOwnItemTradeById(req, res);
  };

  public runOwnItemTradeByKey = async (req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.controller.runOwnItemTradeByKey(req, res);
  };
}
