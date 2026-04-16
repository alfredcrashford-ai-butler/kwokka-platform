import { GameInstanceEntity } from '@kwokka/entities';
import { Command } from './command';
import { PersistGameInstanceCommand } from './persist-game-instance.command';

export class UpdateGameInstanceCommand extends Command {
  protected override readonly commandName = 'UpdateGameInstance';

  public constructor(private gameInstance: GameInstanceEntity) {
    super();
  }

  protected override get context(): any {
    return { gameInstanceId: this.gameInstance.id, status: this.gameInstance.status };
  }

  protected override run(): void {
    this.gameInstanceRegistry.updateGameInstance(this.gameInstance);

    if (this.gameInstanceRegistry.isReadyForPersist(this.gameInstance.id)) {
      this.commandCenter.execute(this.gameInstance.id, new PersistGameInstanceCommand(this.gameInstance));
    }

    this.broadcaster.broadcastGameUpdated(this.gameInstance);
  }
}
