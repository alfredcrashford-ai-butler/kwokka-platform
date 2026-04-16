import { inject, injectable } from 'inversify';
import { LobbyEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { LobbyRepository, GameRepository } from '../ports';
import { LobbyUsecaseValidations } from './lobby-usecase-validations';

@injectable()
export class CreateLobbyUsecase implements Usecase {
  public constructor(
    @inject(LobbyRepository) private lobbyRepository: LobbyRepository,
    @inject(GameRepository) private gameRepository: GameRepository,
  ) {}

  public async perform(lobby: LobbyEntity): Promise<LobbyEntity> {
    LobbyUsecaseValidations.validatePlayersRange(lobby);
    LobbyUsecaseValidations.validateAvailabilityRange(lobby);
    await LobbyUsecaseValidations.validateGameExists(this.gameRepository, lobby.gameId);
    await LobbyUsecaseValidations.validateUniqueKey(this.lobbyRepository, lobby.key);

    return await this.lobbyRepository.create(lobby);
  }
}
