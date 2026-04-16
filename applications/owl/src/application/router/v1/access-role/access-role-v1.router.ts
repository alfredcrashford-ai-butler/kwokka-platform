import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccessRoleEntity } from '@kwokka/entities';
import { OwlAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { AccessRoleV1Controller } from './access-role-v1.controller';
import { AccessRoleViewModel } from './access-role-v1.view-model';

@injectable()
@injectFromBase()
export class AccessRoleV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(AccessRoleV1Controller) private controller: AccessRoleV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.CreateAccessRole]),
        this.validation.withViewModel(AccessRoleViewModel.Create),
      ],
      this.createAccessRole,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccessRole]),
        this.validation.withViewModel(AccessRoleViewModel.List),
      ],
      this.listAccessRoles,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccessRole]),
        this.validation.withViewModel(AccessRoleViewModel.GetById),
      ],
      this.getAccessRoleById,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.UpdateAccessRole]),
        this.validation.withViewModel(AccessRoleViewModel.Patch),
      ],
      this.patchAccessRole,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.DeleteAccessRole]),
        this.validation.withViewModel(AccessRoleViewModel.Delete),
      ],
      this.deleteAccessRole,
    );
  }

  public listAccessRoles = async (req: Request): Promise<ApiResult<AccessRoleEntity[]>> => {
    return this.controller.list(req);
  };

  public createAccessRole = async (req: Request): Promise<ApiResult<AccessRoleEntity>> => {
    return this.controller.create(req);
  };

  public patchAccessRole = async (req: Request): Promise<ApiResult<AccessRoleEntity>> => {
    return this.controller.patch(req);
  };

  public deleteAccessRole = async (req: Request): Promise<ApiResult<AccessRoleEntity>> => {
    return this.controller.delete(req);
  };

  public getAccessRoleById = async (req: Request): Promise<ApiResult<AccessRoleEntity>> => {
    return this.controller.getById(req);
  };
}
