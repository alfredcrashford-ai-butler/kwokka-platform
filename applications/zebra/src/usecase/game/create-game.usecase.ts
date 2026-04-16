import { inject, injectable } from 'inversify';
import { GameEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { GameRepository } from '../ports';
import { GameUsecaseValidations } from './game-usecase-validations';

@injectable()
export class CreateGameUsecase implements Usecase {
  public constructor(@inject(GameRepository) private gameRepository: GameRepository) {}

  public async perform(game: GameEntity): Promise<GameEntity> {
    await GameUsecaseValidations.validateUniqueKey(this.gameRepository, game.key);

    return await this.gameRepository.create(game);
  }
}
