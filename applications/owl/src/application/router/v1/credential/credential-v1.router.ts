import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { CredentialEntity } from '@kwokka/entities';
import { OwlAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { CredentialV1Controller } from './credential-v1.controller';
import { CredentialV1ViewModel } from './credential-v1.view-model';

@injectable()
@injectFromBase()
export class CredentialV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(CredentialV1Controller) private controller: CredentialV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.CreateCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.Create),
      ],
      this.createCredential,
    );

    this.post(
      '/my',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.CreateOwnCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.CreateOwn),
      ],
      this.createOwnCredential,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.List),
      ],
      this.listCredentials,
    );

    this.get(
      '/my',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadOwnCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.MyList),
      ],
      this.listOwnCredentials,
    );

    this.get(
      '/my/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadOwnCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.GetById),
      ],
      this.getOwnCredentialById,
    );

    this.post(
      '/my/:id/verify',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.VerifyOwnCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.VerifyCredential),
      ],
      this.verifyOwnCredential,
    );

    this.post(
      '/my/:id/complete-verify',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.VerifyOwnCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.CompleteVerifyCredential),
      ],
      this.completeVerifyOwnCredential,
    );

    this.post(
      '/:id/verify',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.VerifyCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.VerifyCredential),
      ],
      this.verifyCredential,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.ReadCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.GetById),
      ],
      this.getCredentialById,
    );

    this.delete(
      '/my/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.DeleteOwnCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.Delete),
      ],
      this.deleteOwnCredential,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([OwlAccessRight.DeleteCredential]),
        this.validation.withViewModel(CredentialV1ViewModel.Delete),
      ],
      this.deleteCredential,
    );
  }

  public listCredentials = async (req: Request): Promise<ApiResult<CredentialEntity[]>> => {
    return this.controller.list(req);
  };

  public createCredential = async (req: Request): Promise<ApiResult<CredentialEntity>> => {
    return this.controller.create(req);
  };

  public deleteCredential = async (req: Request): Promise<ApiResult<CredentialEntity>> => {
    return this.controller.delete(req);
  };

  public getCredentialById = async (req: Request): Promise<ApiResult<CredentialEntity>> => {
    return this.controller.getById(req);
  };

  public createOwnCredential = async (req: Request, res: Response): Promise<ApiResult<CredentialEntity>> => {
    return this.controller.createOwnCredential(req, res);
  };

  public getOwnCredentialById = async (req: Request, res: Response): Promise<ApiResult<CredentialEntity>> => {
    return this.controller.getOwnCredentialById(req, res);
  };

  public listOwnCredentials = async (req: Request, res: Response): Promise<ApiResult<CredentialEntity[]>> => {
    return this.controller.listOwnCredentials(req, res);
  };

  public deleteOwnCredential = async (req: Request, res: Response): Promise<ApiResult<CredentialEntity>> => {
    return this.controller.deleteOwnCredential(req, res);
  };

  public verifyCredential = async (req: Request, res: Response): Promise<ApiResult<void>> => {
    return this.controller.verifyCredential(req);
  };

  public verifyOwnCredential = async (req: Request, res: Response): Promise<ApiResult<void>> => {
    return this.controller.verifyOwnCredential(req, res);
  };

  public completeVerifyOwnCredential = async (req: Request, res: Response): Promise<ApiResult<void>> => {
    return this.controller.completeVerifyOwnCredential(req, res);
  };
}
