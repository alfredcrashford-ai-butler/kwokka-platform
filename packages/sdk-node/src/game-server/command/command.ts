import { KwokkaSdkNodeConfig } from '../../config';
import { GameAPI } from '../../game';
import { Logger } from '../../util';
import { Broadcaster } from '../broadcaster';
import { ClientRegistry } from '../client-registry';
import { GameInstanceRegistry } from '../game-instance-registry';
import { GameServerConfig } from '../game-server-config';
import { CommandExecuter } from './command-executer';

export abstract class Command {
  declare protected broadcaster: Broadcaster;
  declare protected gameInstanceRegistry: GameInstanceRegistry;
  declare protected clientRegistry: ClientRegistry;
  declare protected config: GameServerConfig;
  declare protected sdkConfig: KwokkaSdkNodeConfig;
  declare protected gameApi: GameAPI;
  declare protected commandCenter: CommandExecuter;

  public async execute(): Promise<void> {
    try {
      this.logInfo('Started');
      await this.run();
      this.logInfo('Finished');
    } catch (e: any) {
      this.logError('Failed', e);
    }
  }

  protected abstract run(): void | Promise<void>;

  protected abstract get commandName(): string;

  protected abstract get context(): any;

  protected get logPrefix(): string {
    return `[CommandCenter][${this.commandName}]: `;
  }

  protected get logger(): Logger {
    return this.sdkConfig.logger;
  }

  protected logInfo(message: string): void {
    this.logger.info(this.logPrefix, message, ', context: ', this.context);
  }

  protected logError(message: string, e: any): void {
    this.logger.error(this.logPrefix, message, ', context: ', this.context, ', error: ', e);
  }
}
