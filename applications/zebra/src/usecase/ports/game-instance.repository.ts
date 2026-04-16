import { injectable } from 'inversify';
import { GameInstanceEntity } from '@kwokka/entities';
import { Repository, RepositoryFilterListParams, RepositoryListResult } from '@kwokka/common-node';
import { CurrentGameStats, GameStatsPeriod, PeriodicGameStats } from '../game/get-game-stats.usecase';

@injectable()
export abstract class GameInstanceRepository extends Repository<GameInstanceEntity> {
  public abstract iterateActive(
    params: RepositoryFilterListParams,
    action: (payload: RepositoryListResult<GameInstanceEntity[]>) => any,
  ): Promise<void>;
  public abstract getCurrentStats(gameId?: string): Promise<CurrentGameStats>;
  public abstract getPeriodicStats(period: GameStatsPeriod, gameId?: string): Promise<PeriodicGameStats>;
}
