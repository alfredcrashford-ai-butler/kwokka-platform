import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { GameInstanceRepository, GameRepository } from '../ports';
import { GameUsecaseValidations } from './game-usecase-validations';

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
  totalPlayers: number;
  totalInstances: number;
  finishedInstances: number;
  abandonedInstances: number;
}

export interface GameStats {
  current: CurrentGameStats;
  periods?: PeriodicGameStats[];
}

@injectable()
export class GetGameStatsUsecase implements Usecase {
  public constructor(
    @inject(GameRepository) private gameRepository: GameRepository,
    @inject(GameInstanceRepository) private gameInstanceRepository: GameInstanceRepository,
  ) {}

  public async perform(timeMarks: GameStatsPeriod[] = [], gameId?: string): Promise<GameStats> {
    if (gameId) {
      GameUsecaseValidations.validateExists(this.gameRepository, gameId);
    }

    const current = await this.gameInstanceRepository.getCurrentStats(gameId);
    const periods = await this.getPeriods(timeMarks, gameId);

    return { current, periods };
  }

  private getPeriods(timeMarks: GameStatsPeriod[] = [], gameId?: string): Promise<PeriodicGameStats[]> {
    const promises = (timeMarks || []).map((el) => this.gameInstanceRepository.getPeriodicStats(el, gameId));
    return Promise.all(promises);
  }
}
