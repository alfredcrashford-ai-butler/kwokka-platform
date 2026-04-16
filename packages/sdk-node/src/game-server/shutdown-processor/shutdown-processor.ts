import process from 'node:process';
import { GameInstanceRegistry } from '../game-instance-registry';
import { KwokkaSdkNodeConfig } from '../../config';
import { Scheduler } from '../../util';
import { CommandCenter } from '../command';
import { GameServerConfig } from '../game-server-config';
import { ClientRegistry } from '../client-registry';
import { Broadcaster } from '../broadcaster';

const SIGNAL_EVENTS = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

export class ShutdownProcessor {
  private readonly logPrefix = `[${this.constructor.name}]`;
  private _isShuttingDown = false;

  public get isShuttingDown(): boolean {
    return this._isShuttingDown;
  }

  public constructor(
    private readonly sdkConfig: KwokkaSdkNodeConfig,
    private readonly config: GameServerConfig,
    private readonly commandCenter: CommandCenter,
    private readonly gameInstanceRegistry: GameInstanceRegistry,
    private readonly scheduler: Scheduler,
    private readonly broadcaster: Broadcaster,
    private readonly clientRegistry: ClientRegistry,
  ) {}

  public setup(): void {
    SIGNAL_EVENTS.forEach((event: string) => {
      process.on(event, async () => {
        this.sdkConfig.logger.info(`${this.logPrefix} Received ${event}, gracefully shutting down.`);
        const code = await this.shutdown();
        this.sdkConfig.logger.info(`${this.logPrefix} Graceful shutdown completed, exit code: ${code}.`);
        process.exit(code);
      });
    });

    process.on('uncaughtException', async (e: any) => {
      this.sdkConfig.logger.error(`${this.logPrefix} Received uncaughtException, gracefully shutting down, error: `, e);
      await this.shutdown();
      process.exit(process.exitCode || 1);
    });
  }

  private async shutdown(): Promise<number> {
    try {
      this.sdkConfig.logger.info(`${this.logPrefix} Disconnecting all clients.`);
      this.broadcaster.disconnectClients(this.clientRegistry.clients);
      this.sdkConfig.logger.info(`${this.logPrefix} Shutting down handling of incoming requests.`);
      this.commandCenter.shutdown();
      this.sdkConfig.logger.info(`${this.logPrefix} Cancelling all scheduler jobs.`);
      this.scheduler.cancelAll();
      if (this.config.persistOnShutdown) {
        this.sdkConfig.logger.info(`${this.logPrefix} Persisting games, count: ${this.gameInstanceRegistry.count}.`);
        await this.gameInstanceRegistry.persistAll();
      }
      return 0;
    } catch (e: any) {
      this.sdkConfig.logger.error(`${this.logPrefix} Failed to gracefully shutdown, error: `, e);
      return 1;
    }
  }
}
