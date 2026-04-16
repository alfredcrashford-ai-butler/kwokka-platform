import { GameInstanceEntity, LobbyEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { GameRepository } from '../ports/game.repository';
import { GameInstanceRepository } from '../ports/game-instance.repository';
import { LobbyRepository } from '../ports/lobby.repository';

export class GameInstanceUsecaseValidations {
  public static async validateExists(gameInstanceRepository: GameInstanceRepository, id: string): Promise<void> {
    const gameInstance = await gameInstanceRepository.find({ filter: { id } });
    if (!gameInstance) {
      throw new UsecaseException(ExceptionCode.GameInstanceDoesNotExist, `Game instance does not exist: ${id}`);
    }
  }

  public static validateNoGameId(gameInstance: Partial<GameInstanceEntity>): void {
    if (gameInstance.gameId) {
      throw new UsecaseException(ExceptionCode.GameIdNotAllowed, 'Game id is not allowed');
    }
  }

  public static validateNoLobbyId(gameInstance: Partial<GameInstanceEntity>): void {
    if (gameInstance.lobbyId) {
      throw new UsecaseException(ExceptionCode.LobbyIdNotAllowed, 'Lobby id is not allowed');
    }
  }

  public static async validateGameExists(gameRepository: GameRepository, id: string): Promise<void> {
    const game = await gameRepository.find({ filter: { id } });
    if (!game) {
      throw new UsecaseException(ExceptionCode.GameDoesNotExist, `Game does not exist: ${id}`);
    }
  }

  public static async validateLobbyExists(lobbyRepository: LobbyRepository, id: string): Promise<LobbyEntity> {
    const lobby = await lobbyRepository.find({ filter: { id } });
    if (!lobby) {
      throw new UsecaseException(ExceptionCode.LobbyDoesNotExist, `Lobby does not exist: ${id}`);
    }
    return lobby;
  }
}
