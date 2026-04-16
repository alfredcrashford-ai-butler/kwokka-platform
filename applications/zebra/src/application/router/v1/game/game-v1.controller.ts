import { inject, injectable, injectFromBase } from 'inversify';
import { Request } from 'express';
import { GameEntity } from '@kwokka/entities';
import { ApiResult, CrudController, EntityNotFoundControllerException, HttpStatus } from '@kwokka/common-node';
import { GameV1Adapter } from './game-v1.adapter';
import {
  CreateGameUsecase,
  UpdateGameUsecase,
  GetGameByIdUsecase,
  DeleteGameUsecase,
  ListGamesUsecase,
  GetGameByKeyUsecase,
  GetGameStatsUsecase,
} from '../../../../usecase';
import { GameStats, GameStatsPeriod } from '../../../../usecase/game/get-game-stats.usecase';

const DAY_MS = 1000 * 60 * 60 * 24;

@injectable()
@injectFromBase()
export class GameV1Controller extends CrudController<GameEntity> {
  protected readonly adapter: GameV1Adapter = new GameV1Adapter();

  public constructor(
    @inject(ListGamesUsecase) protected readonly listUsecase: ListGamesUsecase,
    @inject(CreateGameUsecase) protected readonly createUsecase: CreateGameUsecase,
    @inject(UpdateGameUsecase) protected readonly updateUsecase: UpdateGameUsecase,
    @inject(GetGameByIdUsecase) protected readonly getByIdUsecase: GetGameByIdUsecase,
    @inject(GetGameByKeyUsecase) protected readonly getGameByKeyUsecase: GetGameByKeyUsecase,
    @inject(GetGameStatsUsecase) protected readonly getGameStatsUsecase: GetGameStatsUsecase,
    @inject(DeleteGameUsecase) protected readonly deleteUsecase: DeleteGameUsecase,
  ) {
    super();
  }

  public async getByKey(req: Request): Promise<ApiResult<GameEntity>> {
    const entity = await this.getGameByKeyUsecase.perform(req.params.key);
    if (!entity) {
      throw new EntityNotFoundControllerException(`key: ${req.params.key}`);
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }

  public async getGameStatsById(req: Request): Promise<ApiResult<GameStats>> {
    const periods = this.getStatsPeriods();
    const stats = await this.getGameStatsUsecase.perform(periods, req.params.id);

    const data = this.adapter.serializeStats(stats);
    return { status: HttpStatus.Ok, data };
  }

  public async getGameStats(): Promise<ApiResult<GameStats>> {
    const periods = this.getStatsPeriods();
    const stats = await this.getGameStatsUsecase.perform(periods);

    const data = this.adapter.serializeStats(stats);
    return { status: HttpStatus.Ok, data };
  }

  private getStatsPeriods(): GameStatsPeriod[] {
    return [
      { from: new Date(Date.now() - DAY_MS) },
      { from: new Date(Date.now() - 3 * DAY_MS) },
      { from: new Date(Date.now() - 7 * DAY_MS) },
      { from: new Date(Date.now() - 30 * DAY_MS) },
    ];
  }
}
