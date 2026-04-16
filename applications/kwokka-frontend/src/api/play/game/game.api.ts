import { injectable, injectFromBase } from 'inversify';
import type { GameEntity } from '@kwokka/entities';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import { GameApiAdapter } from './game.api-adapter';

export interface CurrentGameStats {
  currentPlayers: number;
  currentActiveInstances: number;
}

export interface GameStatsPeriod {
  from?: Date;
  to?: Date;
}

export interface PeriodicGameStats {
  period: GameStatsPeriod;
  averagePlayers: number;
  averageDuration: number;
  totalInstances: number;
  totalPlayers: number;
  finishedInstances: number;
  abandonedInstances: number;
}

export interface GameStats {
  current: CurrentGameStats;
  periods?: PeriodicGameStats[];
}

@injectable()
@injectFromBase()
export class GameApi extends CrudApi<GameEntity, Dto<GameEntity>> {
  protected override readonly baseUrl = '/zebra/v1/games';
  protected override readonly adapter = new GameApiAdapter();

  public async getGameStats(gameId: string): Promise<GameStats> {
    const url = `${this.baseUrl}/${gameId}/stats`;
    const response = await this.http.get<GameStats>(url);
    return this.adapter.deserializeGameStats(response.data);
  }
}
