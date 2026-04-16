import { GameInstanceEntity } from '@kwokka/entities';
import { Command } from './command';

export class PersistGameInstanceCommand extends Command {
  protected override readonly commandName = 'PersistGameInstance';

  public constructor(private gameInstance: GameInstanceEntity) {
    super();
  }

  protected override get context(): any {
    return { gameInstanceId: this.gameInstance.id };
  }

  protected override async run(): Promise<void> {
    await this.gameInstanceRegistry.persistGameInstance(this.gameInstance);
  }
}
