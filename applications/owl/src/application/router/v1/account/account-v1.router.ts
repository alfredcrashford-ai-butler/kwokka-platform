import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccountEntity } from '@kwokka/entities';
import { OwlAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { AccountV1Controller } from './account-v1.controller';
import { AccountV1ViewModel } from './account-v1.view-model';

@injectable()
@injectFromBase()
export class AccountV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(AccountV1Controller) private controller: AccountV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post('/user', [this.accessRightsMiddleware.get([OwlAccessRight.CreateUserAccount])], this.createUserAccount);

    this.post(
      '/app',
      [this.accessRightsMiddleware.get([OwlAccessRight.CreateApplicationAccount])],
      this.createApplicationAccount,
    );

    this.post(
      '/app-admin',
      [this.accessRightsMiddleware.get([OwlAccessRight.CreateApplicationAdminAccount])],
      this.createApplicationAdminAccount,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccount]),
        this.validation.withViewModel(AccountV1ViewModel.List),
      ],
      this.listAccounts,
    );

    this.get('/my', [this.accessRightsMiddleware.get([OwlAccessRight.ReadOwnAccount])], this.getOwnAccount);

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadAccount]),
        this.validation.withViewModel(AccountV1ViewModel.GetById),
      ],
      this.getAccountById,
    );

    this.put(
      '/:id/active',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.UpdateAccount]),
        this.validation.withViewModel(AccountV1ViewModel.SetActive),
      ],
      this.setAccountActive,
    );

    this.delete('/my', [this.accessRightsMiddleware.get([OwlAccessRight.DeleteOwnAccount])], this.deleteOwnAccount);

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.DeleteAccount]),
        this.validation.withViewModel(AccountV1ViewModel.Delete),
      ],
      this.deleteAccount,
    );
  }

  public listAccounts = async (req: Request): Promise<ApiResult<AccountEntity[]>> => {
    return this.controller.list(req);
  };

  public createUserAccount = async (): Promise<ApiResult<AccountEntity>> => {
    return this.controller.createUserAccount();
  };

  public createApplicationAdminAccount = async (): Promise<ApiResult<AccountEntity>> => {
    return this.controller.createApplicationAdminAccount();
  };

  public createApplicationAccount = async (): Promise<ApiResult<AccountEntity>> => {
    return this.controller.createApplicationAccount();
  };

  public setAccountActive = async (req: Request): Promise<ApiResult<AccountEntity>> => {
    return this.controller.setAccountActive(req);
  };

  public deleteAccount = async (req: Request): Promise<ApiResult<AccountEntity>> => {
    return this.controller.delete(req);
  };

  public getAccountById = async (req: Request): Promise<ApiResult<AccountEntity>> => {
    return this.controller.getById(req);
  };

  public getOwnAccount = async (req: Request, res: Response): Promise<ApiResult<AccountEntity>> => {
    return this.controller.getOwnAccount(res);
  };

  public deleteOwnAccount = async (req: Request, res: Response): Promise<ApiResult<AccountEntity>> => {
    return this.controller.deleteOwnAccount(res);
  };
}
