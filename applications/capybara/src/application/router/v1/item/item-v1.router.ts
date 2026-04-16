import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { ItemEntity, ItemInstanceEntity } from '@kwokka/entities';
import { CapybaraAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { ItemV1ViewModel } from './item-v1.view-model';
import { ItemV1Controller } from './item-v1.controller';
import { ItemInstanceV1Controller } from './item-instance-v1.controller';

@injectable()
@injectFromBase()
export class ItemV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(ItemV1Controller) private controller: ItemV1Controller,
    @inject(ItemInstanceV1Controller) private itemInstanceController: ItemInstanceV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.CreateItem]),
        this.validation.withViewModel(ItemV1ViewModel.Create),
      ],
      this.createItem,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadItem]),
        this.validation.withViewModel(ItemV1ViewModel.List),
      ],
      this.listItems,
    );

    this.get(
      '/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.ListItemInstancesByAccountId),
      ],
      this.listItemInstancesByAccountId,
    );

    this.get(
      '/my',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadOwnItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.ListOwnItemInstances),
      ],
      this.listOwnItemInstances,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadItem]),
        this.validation.withViewModel(ItemV1ViewModel.GetById),
      ],
      this.getItemById,
    );

    this.get(
      '/key/:key',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadItem]),
        this.validation.withViewModel(ItemV1ViewModel.GetByKey),
      ],
      this.getItemByKey,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateItem]),
        this.validation.withViewModel(ItemV1ViewModel.Patch),
      ],
      this.patchItem,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.DeleteItem]),
        this.validation.withViewModel(ItemV1ViewModel.Delete),
      ],
      this.deleteItem,
    );

    this.get(
      '/:id/my',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadOwnItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.GetOwnItemInstanceByItemId),
      ],
      this.getOwnItemInstanceByItemId,
    );

    this.get(
      '/:id/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.GetItemInstanceByItemId),
      ],
      this.getItemInstanceByItemId,
    );

    this.get(
      '/key/:key/my',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadOwnItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.GetOwnItemInstanceByItemKey),
      ],
      this.getOwnItemInstanceByItemKey,
    );

    this.get(
      '/key/:key/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.GetItemInstanceByItemKey),
      ],
      this.getItemInstanceByItemKey,
    );

    this.post(
      '/:id/give',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.GiveItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.GiveItemInstanceByItemId),
      ],
      this.giveItemInstanceByItemId,
    );

    this.post(
      '/:id/take',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.TakeItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.TakeItemInstanceByItemId),
      ],
      this.takeItemInstanceByItemId,
    );

    this.post(
      '/key/:key/give',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.GiveItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.GiveItemInstanceByItemKey),
      ],
      this.giveItemInstanceByItemKey,
    );

    this.post(
      '/key/:key/take',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.TakeItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.TakeItemInstanceByItemKey),
      ],
      this.takeItemInstanceByItemKey,
    );

    this.post(
      '/my-application/:id/give',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.GiveApplicationItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.GiveItemInstanceByItemId),
      ],
      this.giveItemInstanceByApplicationsItemId,
    );

    this.post(
      '/my-application/key/:key/give',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.GiveApplicationItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.GiveItemInstanceByItemKey),
      ],
      this.giveItemInstanceByApplicationsItemKey,
    );

    this.post(
      '/my-application/:id/take',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.TakeApplicationItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.TakeItemInstanceByItemId),
      ],
      this.takeItemInstanceByApplicationsItemId,
    );

    this.post(
      '/my-application/key/:key/take',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.TakeApplicationItemInstance]),
        this.validation.withViewModel(ItemV1ViewModel.TakeItemInstanceByItemKey),
      ],
      this.takeItemInstanceByApplicationsItemKey,
    );

    this.post(
      '/:id/my/run-action',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.RunOwnItemInstanceAction]),
        this.validation.withViewModel(ItemV1ViewModel.RunOwnActionByItemId),
      ],
      this.runOwnActionByItemId,
    );

    this.post(
      '/key/:key/my/run-action',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.RunOwnItemInstanceAction]),
        this.validation.withViewModel(ItemV1ViewModel.RunOwnActionByItemKey),
      ],
      this.runOwnActionItemKey,
    );

    this.post(
      '/:id/account/:accountId/run-action',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.RunItemInstanceAction]),
        this.validation.withViewModel(ItemV1ViewModel.RunActionByItemId),
      ],
      this.runAction,
    );
  }

  public createItem = async (req: Request): Promise<ApiResult<ItemEntity>> => {
    return this.controller.create(req);
  };

  public listItems = async (req: Request): Promise<ApiResult<ItemEntity[]>> => {
    return this.controller.list(req);
  };

  public patchItem = async (req: Request): Promise<ApiResult<ItemEntity>> => {
    return this.controller.patch(req);
  };

  public deleteItem = async (req: Request): Promise<ApiResult<ItemEntity>> => {
    return this.controller.delete(req);
  };

  public getItemById = async (req: Request): Promise<ApiResult<ItemEntity>> => {
    return this.controller.getById(req);
  };

  public getItemByKey = async (req: Request): Promise<ApiResult<ItemEntity>> => {
    return this.controller.getItemByKey(req);
  };

  public getItemInstanceByItemId = async (req: Request): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.getItemInstanceByItemId(req);
  };

  public getItemInstanceByItemKey = async (req: Request): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.getItemInstanceByItemKey(req);
  };

  public getOwnItemInstanceByItemId = async (req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.getOwnItemInstanceByItemId(req, res);
  };

  public getOwnItemInstanceByItemKey = async (req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.getOwnItemInstanceByItemKey(req, res);
  };

  public giveItemInstanceByItemId = async (req: Request): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.giveItemInstanceByItemId(req);
  };

  public takeItemInstanceByItemId = async (req: Request): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.takeItemInstanceByItemId(req);
  };

  public giveItemInstanceByItemKey = async (req: Request): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.giveItemInstanceByItemKey(req);
  };

  public takeItemInstanceByItemKey = async (req: Request): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.takeItemInstanceByItemKey(req);
  };

  public giveItemInstanceByApplicationsItemId = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.giveItemInstanceByApplicationsItemId(req, res);
  };

  public giveItemInstanceByApplicationsItemKey = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.giveItemInstanceByApplicationsItemKey(req, res);
  };

  public takeItemInstanceByApplicationsItemId = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.takeItemInstanceByApplicationsItemId(req, res);
  };

  public takeItemInstanceByApplicationsItemKey = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.takeItemInstanceByApplicationsItemKey(req, res);
  };

  public listItemInstancesByAccountId = async (req: Request): Promise<ApiResult<ItemInstanceEntity[]>> => {
    return this.itemInstanceController.list(req);
  };

  public listOwnItemInstances = async (req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity[]>> => {
    return this.itemInstanceController.listOwnItemInstances(req, res);
  };

  public runOwnActionByItemId = async (req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.runOwnActionByItemId(req, res);
  };

  public runOwnActionItemKey = async (req: Request, res: Response): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.runOwnActionByItemKey(req, res);
  };

  public runAction = async (req: Request): Promise<ApiResult<ItemInstanceEntity>> => {
    return this.itemInstanceController.runAction(req);
  };
}
