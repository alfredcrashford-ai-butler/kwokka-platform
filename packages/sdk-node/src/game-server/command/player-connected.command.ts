import { GameServerClient, IncorrectConnectionParamsDisconnectReason } from '../interface';
import { Command } from './command';

export class PlayerConnectedCommand extends Command {
  protected override readonly commandName = 'PlayerConnected';

  public constructor(private readonly client: GameServerClient) {
    super();
  }

  protected override get context(): any {
    return { accountId: this.client.accountId, gameInstanceId: this.client.gameInstanceId };
  }

  protected override async run(): Promise<void> {
    const gameInstance = await this.gameInstanceRegistry.getGameInstanceById(this.client.gameInstanceId);
    if (!gameInstance) {
      this.logInfo('Player tried to connect to non-existing game instance, disconnecting immediately');
      this.broadcaster.broadcastSetDisconnectReason(this.client, IncorrectConnectionParamsDisconnectReason);
      this.broadcaster.disconnectClient(this.client);
      return;
    }

    const lobby = await this.gameApi.getLobbyById(gameInstance.lobbyId);

    const data = { accountId: this.client.accountId, lobby, gameInstance };
    await this.config.controller.onPlayerConnected(data);
    this.broadcaster.broadcastConnectivity(gameInstance.id);
  }
}
