import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { DecorationEntity } from '@kwokka/entities';
import { CapybaraAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { DecorationV1Controller } from './decoration-v1.controller';
import { DecorationV1ViewModel } from './decoration-v1.view-model';

@injectable()
@injectFromBase()
export class DecorationV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(DecorationV1Controller) private controller: DecorationV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.CreateDecoration]),
        this.validation.withViewModel(DecorationV1ViewModel.Create),
      ],
      this.createDecoration,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadDecoration]),
        this.validation.withViewModel(DecorationV1ViewModel.List),
      ],
      this.listDecorations,
    );

    this.get(
      '/available',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadDecoration]),
        this.validation.withViewModel(DecorationV1ViewModel.List),
      ],
      this.listAvailableDecorations,
    );

    this.get(
      '/key/:key',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadDecoration]),
        this.validation.withViewModel(DecorationV1ViewModel.GetByKey),
      ],
      this.getDecorationByKey,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadDecoration]),
        this.validation.withViewModel(DecorationV1ViewModel.GetById),
      ],
      this.getDecorationById,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateDecoration]),
        this.validation.withViewModel(DecorationV1ViewModel.Patch),
      ],
      this.patchDecoration,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.DeleteDecoration]),
        this.validation.withViewModel(DecorationV1ViewModel.Delete),
      ],
      this.deleteDecoration,
    );
  }

  public createDecoration = async (req: Request): Promise<ApiResult<DecorationEntity>> => {
    return this.controller.create(req);
  };

  public listDecorations = async (req: Request): Promise<ApiResult<DecorationEntity[]>> => {
    return this.controller.list(req);
  };

  public listAvailableDecorations = async (req: Request, res: Response): Promise<ApiResult<DecorationEntity[]>> => {
    return this.controller.listAvailableDecorations(req, res);
  };

  public patchDecoration = async (req: Request): Promise<ApiResult<DecorationEntity>> => {
    return this.controller.patch(req);
  };

  public deleteDecoration = async (req: Request): Promise<ApiResult<DecorationEntity>> => {
    return this.controller.delete(req);
  };

  public getDecorationById = async (req: Request): Promise<ApiResult<DecorationEntity>> => {
    return this.controller.getById(req);
  };

  public getDecorationByKey = async (req: Request): Promise<ApiResult<DecorationEntity>> => {
    return this.controller.getByKey(req);
  };
}
