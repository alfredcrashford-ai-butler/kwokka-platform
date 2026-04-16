import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { TraitEntity, TraitInstanceEntity } from '@kwokka/entities';
import { CapybaraAccessRight } from '@kwokka/rights';
import { TraitV1Controller } from './trait-v1.controller';
import { TraitV1ViewModel } from './trait-v1.view-model';
import { TraitInstanceV1Controller } from './trait-instance-v1.controller';

@injectable()
@injectFromBase()
export class TraitV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(TraitV1Controller) private controller: TraitV1Controller,
    @inject(TraitInstanceV1Controller) private traitInstanceController: TraitInstanceV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.CreateTrait]),
        this.validation.withViewModel(TraitV1ViewModel.Create),
      ],
      this.createTrait,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadTrait]),
        this.validation.withViewModel(TraitV1ViewModel.List),
      ],
      this.listTraits,
    );

    this.get(
      '/key/:key',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadTrait]),
        this.validation.withViewModel(TraitV1ViewModel.GetByKey),
      ],
      this.getTraitByKey,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadTrait]),
        this.validation.withViewModel(TraitV1ViewModel.GetById),
      ],
      this.getTraitById,
    );

    this.get(
      '/:id/instances',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadTrait]),
        this.validation.withViewModel(TraitV1ViewModel.ListTraitInstancesByTraitId),
      ],
      this.listTraitInstancesByTraitId,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateTrait]),
        this.validation.withViewModel(TraitV1ViewModel.Patch),
      ],
      this.patchTrait,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.DeleteTrait]),
        this.validation.withViewModel(TraitV1ViewModel.Delete),
      ],
      this.deleteTrait,
    );

    this.get(
      '/key/:key/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadTraitInstance]),
        this.validation.withViewModel(TraitV1ViewModel.GetTraitInstanceByTraitKey),
      ],
      this.getTraitInstanceByTraitKey,
    );

    this.get(
      '/:id/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadTraitInstance]),
        this.validation.withViewModel(TraitV1ViewModel.GetTraitInstanceByTraitId),
      ],
      this.getTraitInstanceByTraitId,
    );

    this.put(
      '/key/:key/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateTraitInstance]),
        this.validation.withViewModel(TraitV1ViewModel.UpdateTraitInstanceByTraitKey),
      ],
      this.updateTraitInstanceByTraitKey,
    );

    this.put(
      '/:id/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateTraitInstance]),
        this.validation.withViewModel(TraitV1ViewModel.UpdateTraitInstanceByTraitId),
      ],
      this.updateTraitInstanceByTraitId,
    );

    this.put(
      '/:id/my',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateOwnTraitInstance]),
        this.validation.withViewModel(TraitV1ViewModel.UpdateOwnTraitInstanceByTraitId),
      ],
      this.updateOwnTraitInstanceByTraitId,
    );

    this.put(
      '/key/:key/my',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateOwnTraitInstance]),
        this.validation.withViewModel(TraitV1ViewModel.UpdateOwnTraitInstanceByTraitKey),
      ],
      this.updateOwnTraitInstanceByTraitKey,
    );

    this.delete(
      '/key/:key/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.DeleteTraitInstance]),
        this.validation.withViewModel(TraitV1ViewModel.DeleteTraitInstanceByTraitKey),
      ],
      this.deleteTraitInstanceByTraitKey,
    );

    this.delete(
      '/:id/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.DeleteTraitInstance]),
        this.validation.withViewModel(TraitV1ViewModel.DeleteTraitInstanceByTraitId),
      ],
      this.deleteTraitInstanceByTraitId,
    );
  }

  public createTrait = async (req: Request): Promise<ApiResult<TraitEntity>> => {
    return this.controller.create(req);
  };

  public listTraits = async (req: Request): Promise<ApiResult<TraitEntity[]>> => {
    return this.controller.list(req);
  };

  public patchTrait = async (req: Request): Promise<ApiResult<TraitEntity>> => {
    return this.controller.patch(req);
  };

  public deleteTrait = async (req: Request): Promise<ApiResult<TraitEntity>> => {
    return this.controller.delete(req);
  };

  public getTraitById = async (req: Request): Promise<ApiResult<TraitEntity>> => {
    return this.controller.getById(req);
  };

  public getTraitByKey = async (req: Request): Promise<ApiResult<TraitEntity>> => {
    return this.controller.getByKey(req);
  };

  public getTraitInstanceByTraitKey = async (req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> => {
    return this.traitInstanceController.getByTraitKey(req, res);
  };

  public getTraitInstanceByTraitId = async (req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> => {
    return this.traitInstanceController.getByTraitId(req, res);
  };

  public updateTraitInstanceByTraitKey = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<TraitInstanceEntity>> => {
    return this.traitInstanceController.updateByTraitKey(req, res);
  };

  public updateTraitInstanceByTraitId = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<TraitInstanceEntity>> => {
    return this.traitInstanceController.updateByTraitId(req, res);
  };

  public listTraitInstancesByTraitId = async (req: Request): Promise<ApiResult<TraitInstanceEntity[]>> => {
    return this.traitInstanceController.listByTraitId(req);
  };

  public updateOwnTraitInstanceByTraitId = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<TraitInstanceEntity>> => {
    return this.traitInstanceController.updateOwnByTraitId(req, res);
  };

  public updateOwnTraitInstanceByTraitKey = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<TraitInstanceEntity>> => {
    return this.traitInstanceController.updateOwnByTraitKey(req, res);
  };

  public deleteTraitInstanceByTraitKey = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<TraitInstanceEntity>> => {
    return this.traitInstanceController.deleteByTraitKey(req, res);
  };

  public deleteTraitInstanceByTraitId = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<TraitInstanceEntity>> => {
    return this.traitInstanceController.deleteByTraitId(req, res);
  };
}
