import { GameEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { GameRepository } from '../ports';

export class GameUsecaseValidations {
  public static async validateExists(gameRepository: GameRepository, id: string): Promise<void> {
    const game = await gameRepository.find({ filter: { id } });
    if (!game) {
      throw new UsecaseException(ExceptionCode.GameDoesNotExist, `Game does not exist: ${id}`);
    }
  }

  public static validateNoApplicationAccountId(game: Partial<GameEntity>): void {
    if (game.applicationAccountId) {
      throw new UsecaseException(
        ExceptionCode.UpdateOfApplicationAccountIdInGameNotAllowed,
        'Update of application account id in game is not allowed',
      );
    }
  }

  public static async validateUniqueKey(gameRepository: GameRepository, key: string, id?: string): Promise<void> {
    const filter: any = { key };
    if (id) {
      filter.id = { $ne: id };
    }
    const game = await gameRepository.find({ filter });
    if (game) {
      throw new UsecaseException(ExceptionCode.GameKeyIsAlreadyTaken, `Game key is already taken: ${key}`);
    }
  }
}
