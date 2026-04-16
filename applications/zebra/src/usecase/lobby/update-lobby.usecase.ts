import { inject, injectable } from 'inversify';
import { LobbyEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { LobbyRepository } from '../ports';
import { LobbyUsecaseValidations } from './lobby-usecase-validations';

@injectable()
export class UpdateLobbyUsecase implements Usecase {
  public constructor(@inject(LobbyRepository) private lobbyRepository: LobbyRepository) {}

  public async perform(id: string, lobby: Partial<LobbyEntity>): Promise<LobbyEntity> {
    LobbyUsecaseValidations.validateNoGameId(lobby);
    if (lobby.minPlayers || lobby.maxPlayers) {
      LobbyUsecaseValidations.validatePlayersRange(lobby);
    }
    if (lobby.availableSince || lobby.availableTill) {
      LobbyUsecaseValidations.validateAvailabilityRange(lobby);
    }
    await LobbyUsecaseValidations.validateExists(this.lobbyRepository, id);
    if (lobby.key) {
      await LobbyUsecaseValidations.validateUniqueKey(this.lobbyRepository, lobby.key, id);
    }

    return await this.lobbyRepository.update({ filter: { id } }, lobby);
  }
}
