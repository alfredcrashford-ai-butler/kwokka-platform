import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccountRolesEntity } from '@kwokka/entities';
import { OwlAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { AccountRolesV1Controller } from './account-roles-v1.controller';
import { AccountRolesViewModel } from './account-roles-v1.view-model';

@injectable()
@injectFromBase()
export class AccountRolesV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(AccountRolesV1Controller) private controller: AccountRolesV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.CreateAccountRoles]),
        this.validation.withViewModel(AccountRolesViewModel.Create),
      ],
      this.createAccountRoles,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccountRoles]),
        this.validation.withViewModel(AccountRolesViewModel.List),
      ],
      this.listAccountRoles,
    );

    this.get(
      '/account/:accountId',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccountRoles]),
        this.validation.withViewModel(AccountRolesViewModel.GetByAccountId),
      ],
      this.getAccountRolesByAccountId,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccountRoles]),
        this.validation.withViewModel(AccountRolesViewModel.GetById),
      ],
      this.getAccountRolesById,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.UpdateAccountRoles]),
        this.validation.withViewModel(AccountRolesViewModel.Patch),
      ],
      this.patchAccountRoles,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.DeleteAccountRoles]),
        this.validation.withViewModel(AccountRolesViewModel.Delete),
      ],
      this.deleteAccountRoles,
    );
  }

  public listAccountRoles = async (req: Request): Promise<ApiResult<AccountRolesEntity[]>> => {
    return this.controller.list(req);
  };

  public createAccountRoles = async (req: Request): Promise<ApiResult<AccountRolesEntity>> => {
    return this.controller.create(req);
  };

  public patchAccountRoles = async (req: Request): Promise<ApiResult<AccountRolesEntity>> => {
    return this.controller.patch(req);
  };

  public deleteAccountRoles = async (req: Request): Promise<ApiResult<AccountRolesEntity>> => {
    return this.controller.delete(req);
  };

  public getAccountRolesById = async (req: Request): Promise<ApiResult<AccountRolesEntity>> => {
    return this.controller.getById(req);
  };

  public getAccountRolesByAccountId = async (req: Request): Promise<ApiResult<AccountRolesEntity>> => {
    return this.controller.getByAccountId(req);
  };
}
