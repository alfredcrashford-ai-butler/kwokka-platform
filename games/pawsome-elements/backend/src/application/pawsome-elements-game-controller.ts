import { KwokkaSdkNodeClient, GameController, GameControllerHookParam } from '@kwokka/sdk-node';
import { GameInstanceEntity } from '@kwokka/entities';
import { PwsmGameInstanceEntity } from '../entity/game-instance/pwsm-game-instance.entity';
import { LobbyControllerFactory } from './lobby-controller';
import { LobbyController } from './lobby-controller/lobby-controller';
import { Logger } from '../util';

export class PawsomeElementsGameController extends GameController {
  private readonly logPrefix = '#PawsomeElementsGameController:';

  public constructor(public readonly client: KwokkaSdkNodeClient) {
    super();
  }

  private getController(key: string): LobbyController {
    return LobbyControllerFactory.get(this, key);
  }

  public override async onUnhandledError(error: any): Promise<any> {
    Logger.error(`${this.logPrefix} Unhandled error occured`, error);
  }

  public override async onPlayerConnected(data: GameControllerHookParam.PlayerConnected): Promise<void> {
    const pwsmData = this.toPwsm(data);
    const lobbyController = this.getController(data.lobby.key);
    await lobbyController.onPlayerConnected(pwsmData);
  }

  public override async onPlayerDisconnected(data: GameControllerHookParam.PlayerDisconnected): Promise<any> {
    const pwsmData = this.toPwsm(data);
    const lobbyController = this.getController(data.lobby.key);
    await lobbyController.onPlayerDisconnected(pwsmData);
  }

  public override async onPlayerAction(data: GameControllerHookParam.PlayerAction): Promise<any> {
    const pwsmData = this.toPwsm(data);
    const lobbyController = this.getController(data.lobby.key);
    await lobbyController.onPlayerSentAction(pwsmData);
  }

  private toPwsm<T extends { gameInstance: GameInstanceEntity }>(
    data: T,
  ): T & { gameInstance: PwsmGameInstanceEntity } {
    return { ...data, gameInstance: PwsmGameInstanceEntity.toPwsm(data.gameInstance) };
  }
}
