import { inject, injectable } from 'inversify';
import { GameInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { GameRepository } from '../ports/game.repository';
import { GameInstanceUsecaseValidations } from './game-instance-usecase-validations';
import { GameInstanceRepository } from '../ports/game-instance.repository';
import { LobbyRepository } from '../ports/lobby.repository';

@injectable()
export class CreateGameInstanceUsecase implements Usecase {
  public constructor(
    @inject(GameInstanceRepository) private gameInstanceRepository: GameInstanceRepository,
    @inject(GameRepository) private gameRepository: GameRepository,
    @inject(LobbyRepository) private lobbyRepository: LobbyRepository,
  ) {}

  public async perform(gameInstance: GameInstanceEntity): Promise<GameInstanceEntity> {
    await GameInstanceUsecaseValidations.validateGameExists(this.gameRepository, gameInstance.gameId);
    await GameInstanceUsecaseValidations.validateLobbyExists(this.lobbyRepository, gameInstance.lobbyId);
    return await this.gameInstanceRepository.create(gameInstance);
  }
}
