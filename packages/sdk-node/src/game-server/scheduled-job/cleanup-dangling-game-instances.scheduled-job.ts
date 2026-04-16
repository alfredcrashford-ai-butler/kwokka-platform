import { GameInstanceEntity } from '@kwokka/entities';
import { Scheduler } from '../../util';
import { ClientRegistry } from '../client-registry';
import { CleanupDanglingGameInstanceCommand, CommandCenter } from '../command';
import { GameInstanceRegistry } from '../game-instance-registry';
import { GameServerConfig } from '../game-server-config';

export class CleanupDanglingGameInstancesScheduledJob {
  public constructor(
    private readonly scheduler: Scheduler,
    private readonly clientRegistry: ClientRegistry,
    private readonly gameInstanceRegistry: GameInstanceRegistry,
    private readonly commandCenter: CommandCenter,
    private readonly config: GameServerConfig,
  ) {}

  public start() {
    this.scheduler.schedule(this.config.autoCleanup.crontab, () => {
      // TODO: add logs
      const danglingGameInstances = this.getDanglingGameInstances();
      danglingGameInstances.forEach((gameInstance) => this.cleanupDanglingGameInstance(gameInstance));
    });
  }

  private getDanglingGameInstances(): GameInstanceEntity[] {
    return this.gameInstanceRegistry.activeGameInstances.filter((el) => !this.hasActivePlayers(el.id));
  }

  private hasActivePlayers(gameInstanceId): boolean {
    const clients = this.clientRegistry.getClientsByGameInstanceId(gameInstanceId) || [];
    return clients.length > 0;
  }

  private cleanupDanglingGameInstance(gameInstance: GameInstanceEntity): void {
    this.commandCenter.execute(gameInstance.id, new CleanupDanglingGameInstanceCommand(gameInstance.id));
  }
}
