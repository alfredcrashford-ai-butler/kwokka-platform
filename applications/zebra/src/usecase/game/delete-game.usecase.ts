import { inject, injectable } from 'inversify';
import { GameEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { GameInstanceRepository, GameRepository, LobbyRepository } from '../ports';
import { GameUsecaseValidations } from './game-usecase-validations';

@injectable()
export class DeleteGameUsecase implements Usecase {
  public constructor(
    @inject(GameRepository) private gameRepository: GameRepository,
    @inject(GameInstanceRepository) private gameInstanceRepository: GameInstanceRepository,
    @inject(LobbyRepository) private lobbyRepository: LobbyRepository,
  ) {}

  public async perform(id: string): Promise<GameEntity> {
    await GameUsecaseValidations.validateExists(this.gameRepository, id);

    await this.gameInstanceRepository.delete({ filter: { gameId: id } });
    await this.lobbyRepository.delete({ filter: { gameId: id } });
    return await this.gameRepository.delete({ filter: { id } });
  }
}
