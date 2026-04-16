import { GameInstanceEntity, LobbyEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { LobbyRepository, GameRepository } from '../ports';

export class LobbyUsecaseValidations {
  public static validatePlayersRange(lobby: Partial<LobbyEntity>): void {
    if (!LobbyEntity.isPlayerRangeValid(lobby.minPlayers, lobby.maxPlayers)) {
      throw new UsecaseException(
        ExceptionCode.LobbyPlayersRangeIsIncorrect,
        `Lobby player range is incorrect, minPlayers: ${lobby.minPlayers}, maxPlayers: ${lobby.maxPlayers}`,
      );
    }
  }

  public static validateAvailabilityRange(lobby: Partial<LobbyEntity>): void {
    if (!LobbyEntity.isAvailabilityRangeValid(lobby.availableSince, lobby.availableTill)) {
      throw new UsecaseException(
        ExceptionCode.LobbyAvailabilityRangeIsIncorrect,
        `Lobby availability range is incorrect, available since: ${lobby.availableSince}, till: ${lobby.availableTill}`,
      );
    }
  }

  public static async validateExists(lobbyRepository: LobbyRepository, id: string): Promise<void> {
    const lobby = await lobbyRepository.find({ filter: { id } });
    if (!lobby) {
      throw new UsecaseException(ExceptionCode.LobbyDoesNotExist, `Lobby does not exist: ${id}`);
    }
  }

  public static validateNoGameId(gameInstance: Partial<GameInstanceEntity>): void {
    if (gameInstance.gameId) {
      throw new UsecaseException(ExceptionCode.GameIdNotAllowed, 'Game id is not allowed');
    }
  }

  public static async validateUniqueKey(lobbyRepository: LobbyRepository, key: string, id?: string): Promise<void> {
    const filter: any = { key };
    if (id) {
      filter.id = { $ne: id };
    }
    const game = await lobbyRepository.find({ filter });
    if (game) {
      throw new UsecaseException(ExceptionCode.LobbyKeyIsAlreadyTaken, `Lobby key is already taken: ${key}`);
    }
  }

  public static async validateGameExists(gameRepository: GameRepository, id: string): Promise<void> {
    const game = await gameRepository.find({ filter: { id } });
    if (!game) {
      throw new UsecaseException(ExceptionCode.GameDoesNotExist, `Game does not exist: ${id}`);
    }
  }
}
