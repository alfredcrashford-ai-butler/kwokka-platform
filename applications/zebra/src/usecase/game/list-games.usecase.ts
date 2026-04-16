import { inject, injectable } from 'inversify';
import { GameEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { GameRepository } from '../ports';

@injectable()
export class ListGamesUsecase implements Usecase {
  public constructor(@inject(GameRepository) private gameRepository: GameRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<GameEntity>> {
    return await this.gameRepository.list({ offset, limit });
  }
}
