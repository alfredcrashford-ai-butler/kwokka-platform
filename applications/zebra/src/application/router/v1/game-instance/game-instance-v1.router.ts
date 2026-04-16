import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { GameInstanceEntity } from '@kwokka/entities';
import { ZebraAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { GameInstanceConnectTokenValidationResponse, GameInstanceV1Controller } from './game-instance-v1.controller';
import { GameInstanceV1ViewModel } from './game-instance-v1.view-model';

@injectable()
@injectFromBase()
export class GameInstanceV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(GameInstanceV1Controller) private controller: GameInstanceV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.CreateGameInstance]),
        this.validation.withViewModel(GameInstanceV1ViewModel.Create),
      ],
      this.createGameInstance,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadGameInstance]),
        this.validation.withViewModel(GameInstanceV1ViewModel.List),
      ],
      this.listGameInstances,
    );

    this.get(
      '/my',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadGameInstance]),
        this.validation.withViewModel(GameInstanceV1ViewModel.ListOwn),
      ],
      this.listOwnGameInstances,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadGameInstance]),
        this.validation.withViewModel(GameInstanceV1ViewModel.GetById),
      ],
      this.getGameInstanceById,
    );

    this.post(
      '/:id/generate-connect-token',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.GenerateConnectToken]),
        this.validation.withViewModel(GameInstanceV1ViewModel.GenerateConnectToken),
      ],
      this.generateConnectToken,
    );

    this.post(
      '/validate-connect-token',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ValidateConnectToken]),
        this.validation.withViewModel(GameInstanceV1ViewModel.ValidateConnectToken),
      ],
      this.validateConnectToken,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.UpdateGameInstance]),
        this.validation.withViewModel(GameInstanceV1ViewModel.Patch),
      ],
      this.patchGameInstance,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.DeleteGameInstance]),
        this.validation.withViewModel(GameInstanceV1ViewModel.Delete),
      ],
      this.deleteGameInstance,
    );
  }

  public createGameInstance = async (req: Request): Promise<ApiResult<GameInstanceEntity>> => {
    return this.controller.create(req);
  };

  public listGameInstances = async (req: Request): Promise<ApiResult<GameInstanceEntity[]>> => {
    return this.controller.list(req);
  };

  public listOwnGameInstances = async (req: Request, res: Response): Promise<ApiResult<GameInstanceEntity[]>> => {
    return this.controller.listOwnGameInstances(req, res);
  };

  public patchGameInstance = async (req: Request, res: Response): Promise<ApiResult<GameInstanceEntity>> => {
    return this.controller.patch(req, res);
  };

  public deleteGameInstance = async (req: Request): Promise<ApiResult<GameInstanceEntity>> => {
    return this.controller.delete(req);
  };

  public getGameInstanceById = async (req: Request): Promise<ApiResult<GameInstanceEntity>> => {
    return this.controller.getById(req);
  };

  public validateConnectToken = async (
    req: Request,
  ): Promise<ApiResult<GameInstanceConnectTokenValidationResponse>> => {
    return this.controller.validateConnectToken(req);
  };

  public generateConnectToken = async (req: Request, res: Response): Promise<ApiResult<{ token: string }>> => {
    return this.controller.generateConnectToken(req, res);
  };
}
