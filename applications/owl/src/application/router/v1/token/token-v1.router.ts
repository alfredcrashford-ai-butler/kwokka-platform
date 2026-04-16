import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { TokenEntity } from '@kwokka/entities';
import { OwlAccessRight } from '@kwokka/rights';
import { PublicProps } from '@kwokka/utils';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { TokenV1Controller } from './token-v1.controller';
import { TokenV1ViewModel } from './token-v1.view-model';

@injectable()
@injectFromBase()
export class TokenV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(TokenV1Controller) private controller: TokenV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.get(
      '/',
      [
        this.authMiddleware,
        this.accessRightsMiddleware.get([OwlAccessRight.ReadToken]),
        this.validation.withViewModel(TokenV1ViewModel.List),
      ],
      this.listTokens,
    );

    this.get(
      '/:id',
      [
        this.authMiddleware,
        this.accessRightsMiddleware.get([OwlAccessRight.ReadToken]),
        this.validation.withViewModel(TokenV1ViewModel.GetById),
      ],
      this.getTokenById,
    );

    this.post(
      '/revoke/correlation-id/:correlationId',
      [
        this.authMiddleware,
        this.accessRightsMiddleware.get([OwlAccessRight.RevokeToken]),
        this.validation.withViewModel(TokenV1ViewModel.RevokeAccessByCorrelationId),
      ],
      this.revokeAccessByCorrelationId,
    );

    this.post(
      '/revoke/account-id/:accountId',
      [
        this.authMiddleware,
        this.accessRightsMiddleware.get([OwlAccessRight.RevokeAccess]),
        this.validation.withViewModel(TokenV1ViewModel.RevokeAccessByAccountId),
      ],
      this.revokeAccessByAccountId,
    );

    this.post(
      '/refresh',
      [
        this.authMiddleware.skipExpiryCheck(),
        this.accessRightsMiddleware.get([OwlAccessRight.RefreshAccess]),
        this.validation.withViewModel(TokenV1ViewModel.RefreshAccess),
      ],
      this.refreshAccess,
    );
  }

  public listTokens = async (req: Request): Promise<ApiResult<PublicProps<TokenEntity>[]>> => {
    return this.controller.list(req);
  };

  public getTokenById = async (req: Request): Promise<ApiResult<PublicProps<TokenEntity>>> => {
    return this.controller.getById(req);
  };

  public revokeAccessByCorrelationId = async (req: Request): Promise<ApiResult<void>> => {
    return this.controller.revokeAccessByCorrelationId(req);
  };

  public revokeAccessByAccountId = async (req: Request): Promise<ApiResult<void>> => {
    return this.controller.revokeAccessByAccountId(req);
  };

  public refreshAccess = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<{ access: string; refresh: string }>> => {
    return this.controller.refreshAccess(req, res);
  };
}
