import { inject, injectable } from 'inversify';
import { GameEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { GameRepository } from '../ports';
import { GameUsecaseValidations } from './game-usecase-validations';

@injectable()
export class UpdateGameUsecase implements Usecase {
  public constructor(@inject(GameRepository) private gameRepository: GameRepository) {}

  public async perform(id: string, game: Partial<GameEntity>): Promise<GameEntity> {
    GameUsecaseValidations.validateNoApplicationAccountId(game);
    await GameUsecaseValidations.validateExists(this.gameRepository, id);
    if (game.key) {
      await GameUsecaseValidations.validateUniqueKey(this.gameRepository, game.key, id);
    }

    return await this.gameRepository.update({ filter: { id } }, game);
  }
}
