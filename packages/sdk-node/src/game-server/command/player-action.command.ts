import { GameServerClient } from '../interface';
import { PlayerActionIncomingMessage } from '../message';
import { Command } from './command';

export class PlayerActionCommand extends Command {
  protected override readonly commandName = 'PlayerAction';

  public constructor(
    private readonly message: PlayerActionIncomingMessage,
    private readonly client: GameServerClient,
  ) {
    super();
  }

  protected override get context(): any {
    return { accountId: this.client.accountId, gameInstanceId: this.client.gameInstanceId, message: this.message };
  }

  protected override async run(): Promise<void> {
    try {
      const gameInstance = await this.gameInstanceRegistry.getGameInstanceById(this.client.gameInstanceId);
      const lobby = await this.gameApi.getLobbyById(gameInstance.lobbyId);

      await this.config.controller.onPlayerAction({
        name: this.message.payload.data.name,
        content: this.message.payload.data.content,
        accountId: this.client.accountId,
        gameInstance,
        lobby,
      });
    } catch (e: any) {
      await this.config.controller.onUnhandledError(e);
      throw e;
    }
  }
}
