import { GameController, KwokkaSdkNodeClient } from '@kwokka/sdk-node';
import { LobbyController } from './lobby-controller';
import { RoomLobbyController } from './room.lobby-controller';
import { LobbyKey } from '../../entity';
import { PracticeLobbyController } from './practice.lobby-controller';
import { QuickMatchLobbyController } from './quick-match.lobby-controller';
import { RankedMatchLobbyController } from './ranked-match.lobby-controller';

type PwmGameController = GameController & { client: KwokkaSdkNodeClient };

export class LobbyControllerFactory {
  private static _controllers: Record<LobbyKey, LobbyController> = null;

  public static get(gameController: PwmGameController, key: string): LobbyController {
    if (!this._controllers) {
      this._controllers = {
        [LobbyKey.Room]: new RoomLobbyController(gameController, gameController.client),
        [LobbyKey.Practice]: new PracticeLobbyController(gameController, gameController.client),
        [LobbyKey.QuickMatch]: new QuickMatchLobbyController(gameController, gameController.client),
        [LobbyKey.RankedMatch]: new RankedMatchLobbyController(gameController, gameController.client),
      };
    }

    return this._controllers[key];
  }
}
