import { Server } from 'http';
import { GameServerConfig, KwokkaSdkNodeClient, KwokkaSdkNodeConfig } from '@kwokka/sdk-node';
import { ConfigUtil, EnvVarName, Logger } from '../util';
import { ErrorTrackerUtil } from '../util/error-tracker.util';
import { PawsomeElementsGameController } from './pawsome-elements-game-controller';

export class KwokkaClient {
  private logPrefix = '#KwokkaClient:';
  private client: KwokkaSdkNodeClient;
  private controller: PawsomeElementsGameController;

  public constructor(config: KwokkaSdkNodeConfig) {
    this.client = new KwokkaSdkNodeClient(config);
    this.controller = new PawsomeElementsGameController(this.client);
  }

  public async start(server: Server): Promise<void> {
    try {
      Logger.info(`${this.logPrefix} Starting game server`);

      await this.initialize();
      this.setupGameServer(server);

      Logger.info(`${this.logPrefix} Game server started`);
    } catch (e: unknown) {
      Logger.error(`${this.logPrefix} Error occured during game server start:`, e);
      ErrorTrackerUtil.captureException(e);
      throw e;
    }
  }

  private async initialize(): Promise<void> {
    Logger.info(`${this.logPrefix} Initializing client`);
    await this.client.initialize();
    Logger.info(`${this.logPrefix} Client initialized`);
  }

  private setupGameServer(server: Server): void {
    Logger.info(`${this.logPrefix} Setting up game server`);
    const gameServerConfig = this.getGameServerConfig();
    this.client.setupGameServer(server, gameServerConfig);
    Logger.info(`${this.logPrefix} Game server is set up`);
  }

  private getGameServerConfig(): GameServerConfig {
    return {
      controller: this.controller,
      path: ConfigUtil.get(EnvVarName.GameServerPath),
      host: ConfigUtil.get(EnvVarName.GameServerHost),
      persistOnShutdown: true,
    };
  }
}
