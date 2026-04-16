import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccessRightEntity } from '@kwokka/entities';
import { OwlAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { AccessRightV1Controller } from './access-right-v1.controller';
import { AccessRightViewModel } from './access-right-v1.view-model';

@injectable()
@injectFromBase()
export class AccessRightV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(AccessRightV1Controller) private controller: AccessRightV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.CreateAccessRight]),
        this.validation.withViewModel(AccessRightViewModel.Create),
      ],
      this.createAccessRight,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccessRight]),
        this.validation.withViewModel(AccessRightViewModel.List),
      ],
      this.listAccessRights,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccessRight]),
        this.validation.withViewModel(AccessRightViewModel.GetById),
      ],
      this.getAccessRightById,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.UpdateAccessRight]),
        this.validation.withViewModel(AccessRightViewModel.Patch),
      ],
      this.patchAccessRight,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.DeleteAccessRight]),
        this.validation.withViewModel(AccessRightViewModel.Delete),
      ],
      this.deleteAccessRight,
    );
  }

  /**
   * @openapi
   * '/owl/v1/access-rights':
   *  get:
   *     tags:
   *     - Access Rights
   *     summary: List access rights.
   *     responses:
   *      200:
   *        description: Returns a list of access rights.
   *      403:
   *        description: Forbidden.
   *      500:
   *        description: Server Error
   */
  public listAccessRights = async (req: Request): Promise<ApiResult<AccessRightEntity[]>> => {
    return this.controller.list(req);
  };

  public createAccessRight = async (req: Request): Promise<ApiResult<AccessRightEntity>> => {
    return this.controller.create(req);
  };

  public patchAccessRight = async (req: Request): Promise<ApiResult<AccessRightEntity>> => {
    return this.controller.patch(req);
  };

  public deleteAccessRight = async (req: Request): Promise<ApiResult<AccessRightEntity>> => {
    return this.controller.delete(req);
  };

  public getAccessRightById = async (req: Request): Promise<ApiResult<AccessRightEntity>> => {
    return this.controller.getById(req);
  };
}
