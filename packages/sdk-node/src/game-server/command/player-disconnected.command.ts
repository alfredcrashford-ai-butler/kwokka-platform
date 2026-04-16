import { GameInstanceEntity } from '@kwokka/entities';
import { GameServerClient } from '../interface';
import { Command } from './command';
import { CleanupDanglingGameInstanceCommand } from './cleanup-dangling-game-instance.command';

export class PlayerDisconnectedCommand extends Command {
  protected override readonly commandName = 'PlayerDisconnected';

  public constructor(private readonly client: GameServerClient) {
    super();
  }

  protected override get context(): any {
    return { accountId: this.accountId, gameInstanceId: this.gameInstanceId };
  }

  protected override async run(): Promise<void> {
    this.clientRegistry.cleanupClient(this.accountId);
    let gameInstance = await this.gameInstanceRegistry.getGameInstanceById(this.gameInstanceId);
    if (!gameInstance) {
      this.logInfo('Game not found, finishing without calling game controller');
      return;
    }

    gameInstance = await this.runControllerHook(gameInstance);
    this.commandCenter.execute(gameInstance.id, new CleanupDanglingGameInstanceCommand(this.gameInstanceId));
    this.broadcaster.broadcastConnectivity(this.gameInstanceId);
  }

  private get gameInstanceId(): string {
    return this.client.gameInstanceId;
  }

  private get accountId(): string {
    return this.client.accountId;
  }

  private async runControllerHook(gameInstance: GameInstanceEntity): Promise<GameInstanceEntity> {
    const lobby = await this.gameApi.getLobbyById(gameInstance.lobbyId);
    const data = { accountId: this.accountId, gameInstance, lobby };
    await this.config.controller.onPlayerDisconnected(data);
    return gameInstance;
  }
}
