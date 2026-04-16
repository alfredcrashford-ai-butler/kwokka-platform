import { inject, injectable } from 'inversify';
import { GameEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { GameRepository } from '../ports';

@injectable()
export class GetGameByIdUsecase implements Usecase {
  public constructor(@inject(GameRepository) private gameRepository: GameRepository) {}

  public async perform(id: string): Promise<GameEntity> {
    const game = await this.gameRepository.find({ filter: { id } });

    if (!game) {
      return null;
    }

    return game;
  }
}
