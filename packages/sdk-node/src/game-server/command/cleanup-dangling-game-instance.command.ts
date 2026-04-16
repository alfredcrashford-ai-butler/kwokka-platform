import { Command } from './command';
import { PersistGameInstanceCommand } from './persist-game-instance.command';

export class CleanupDanglingGameInstanceCommand extends Command {
  protected override readonly commandName = 'CleanupDanglingInstance';

  public constructor(private readonly gameInstanceId: string) {
    super();
  }

  protected override get context(): any {
    return { gameInstanceId: this.gameInstanceId };
  }

  protected override async run(): Promise<void> {
    const activeClients = this.clientRegistry.getClientsByGameInstanceId(this.gameInstanceId);

    // Don't cleanup a game instance that have active clients
    if (activeClients.length) {
      this.logInfo(`Skip dangling game instance clean up, game has active clients`);
      return;
    }

    // Game does not have active clients but also is not active - no cleanup
    if (!this.gameInstanceRegistry.isActiveGameInstance(this.gameInstanceId)) {
      this.logInfo(`Skip dangling game instance clean up, game is inactive`);
      return;
    }

    const gameInstance = await this.gameInstanceRegistry.getGameInstanceById(this.gameInstanceId);
    this.commandCenter.execute(this.gameInstanceId, new PersistGameInstanceCommand(gameInstance));
    this.gameInstanceRegistry.cleanupGameInstance(this.gameInstanceId);
  }
}
