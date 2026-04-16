import { inject, injectable } from 'inversify';
import { GameInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { GameInstanceUsecaseValidations } from './game-instance-usecase-validations';
import { GameInstanceRepository } from '../ports';

@injectable()
export class UpdateGameInstanceUsecase implements Usecase {
  public constructor(@inject(GameInstanceRepository) private gameInstanceRepository: GameInstanceRepository) {}

  public async perform(id: string, gameInstance: Partial<GameInstanceEntity>): Promise<GameInstanceEntity> {
    GameInstanceUsecaseValidations.validateNoGameId(gameInstance);
    GameInstanceUsecaseValidations.validateNoLobbyId(gameInstance);
    await GameInstanceUsecaseValidations.validateExists(this.gameInstanceRepository, id);

    return await this.gameInstanceRepository.update({ filter: { id } }, gameInstance);
  }
}
