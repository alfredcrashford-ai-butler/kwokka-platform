import { inject, injectable } from 'inversify';
import { GameInstanceEntity, GameInstanceEntityStatus } from '@kwokka/entities';
import { Usecase, UsecaseDeepSearchParameter, UsecaseListResult } from '@kwokka/common-node';
import { GameInstanceRepository } from '../ports';

@injectable()
export class ListGameInstancesUsecase implements Usecase {
  public constructor(@inject(GameInstanceRepository) private gameInstanceRepository: GameInstanceRepository) {}

  public async perform(
    filter: {
      gameId: string;
      lobbyId?: string;
      status?: GameInstanceEntityStatus;
      playerIds?: string[];
      isPubliclyVisible?: boolean;
      lobbySettings?: UsecaseDeepSearchParameter,
    },
    sort: Record<string, 'asc' | 'desc'>,
    offset: number,
    limit: number,
  ): Promise<UsecaseListResult<GameInstanceEntity>> {
    return await this.gameInstanceRepository.list({ filter, sort, offset, limit });
  }
}
