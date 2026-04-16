import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccountTypeRolesEntity } from '@kwokka/entities';
import { OwlAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { AccountTypeRolesV1Controller } from './account-type-roles-v1.controller';
import { AccountTypeRolesViewModel } from './account-type-roles-v1.view-model';

@injectable()
@injectFromBase()
export class AccountTypeRolesV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(AccountTypeRolesV1Controller) private controller: AccountTypeRolesV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.CreateAccountTypeRoles]),
        this.validation.withViewModel(AccountTypeRolesViewModel.Create),
      ],
      this.createAccountTypeRoles,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccountTypeRoles]),
        this.validation.withViewModel(AccountTypeRolesViewModel.List),
      ],
      this.listAccountTypeRoles,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccountTypeRoles]),
        this.validation.withViewModel(AccountTypeRolesViewModel.GetById),
      ],
      this.getAccountTypeRolesById,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.UpdateAccountTypeRoles]),
        this.validation.withViewModel(AccountTypeRolesViewModel.Patch),
      ],
      this.patchAccountTypeRoles,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.DeleteAccountTypeRoles]),
        this.validation.withViewModel(AccountTypeRolesViewModel.Delete),
      ],
      this.deleteAccountTypeRoles,
    );
  }

  public listAccountTypeRoles = async (req: Request): Promise<ApiResult<AccountTypeRolesEntity[]>> => {
    return this.controller.list(req);
  };

  public createAccountTypeRoles = async (req: Request): Promise<ApiResult<AccountTypeRolesEntity>> => {
    return this.controller.create(req);
  };

  public patchAccountTypeRoles = async (req: Request): Promise<ApiResult<AccountTypeRolesEntity>> => {
    return this.controller.patch(req);
  };

  public deleteAccountTypeRoles = async (req: Request): Promise<ApiResult<AccountTypeRolesEntity>> => {
    return this.controller.delete(req);
  };

  public getAccountTypeRolesById = async (req: Request): Promise<ApiResult<AccountTypeRolesEntity>> => {
    return this.controller.getById(req);
  };
}
