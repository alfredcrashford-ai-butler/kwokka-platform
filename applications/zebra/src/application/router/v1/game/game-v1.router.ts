import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { GameEntity } from '@kwokka/entities';
import { ZebraAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { GameV1Controller } from './game-v1.controller';
import { GameV1ViewModel } from './game-v1.view-model';
import { GameStats } from '../../../../usecase/game/get-game-stats.usecase';

@injectable()
@injectFromBase()
export class GameV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(GameV1Controller) private controller: GameV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.CreateGame]),
        this.validation.withViewModel(GameV1ViewModel.Create),
      ],
      this.createGame,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadGame]),
        this.validation.withViewModel(GameV1ViewModel.List),
      ],
      this.listGames,
    );

    this.get(
      '/stats',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadGameStats]),
        this.validation.withViewModel(GameV1ViewModel.GetGameStats),
      ],
      this.getGameStats,
    );

    this.get(
      '/key/:key',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadGame]),
        this.validation.withViewModel(GameV1ViewModel.GetByKey),
      ],
      this.getGameByKey,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadGame]),
        this.validation.withViewModel(GameV1ViewModel.GetById),
      ],
      this.getGameById,
    );

    this.get(
      '/:id/stats',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadGameStats]),
        this.validation.withViewModel(GameV1ViewModel.GetGameStatsById),
      ],
      this.getGameStatsById,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.UpdateGame]),
        this.validation.withViewModel(GameV1ViewModel.Patch),
      ],
      this.patchGame,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.DeleteGame]),
        this.validation.withViewModel(GameV1ViewModel.Delete),
      ],
      this.deleteGame,
    );
  }

  public createGame = async (req: Request): Promise<ApiResult<GameEntity>> => {
    return this.controller.create(req);
  };

  public listGames = async (req: Request): Promise<ApiResult<GameEntity[]>> => {
    return this.controller.list(req);
  };

  public getGameStats = async (req: Request): Promise<ApiResult<GameStats>> => {
    return this.controller.getGameStats();
  };

  public patchGame = async (req: Request): Promise<ApiResult<GameEntity>> => {
    return this.controller.patch(req);
  };

  public deleteGame = async (req: Request): Promise<ApiResult<GameEntity>> => {
    return this.controller.delete(req);
  };

  public getGameById = async (req: Request): Promise<ApiResult<GameEntity>> => {
    return this.controller.getById(req);
  };

  public getGameStatsById = async (req: Request): Promise<ApiResult<GameStats>> => {
    return this.controller.getGameStatsById(req);
  };

  public getGameByKey = async (req: Request): Promise<ApiResult<GameEntity>> => {
    return this.controller.getByKey(req);
  };
}
