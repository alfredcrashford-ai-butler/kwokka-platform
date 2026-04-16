import { GameInstanceEntity } from '@kwokka/entities';
import { ClientRegistry } from '../client-registry';
import { GameController, GameControllerStats } from './game-controller';
import { DisconnectReason } from '../interface';
import {
  CommandCenter,
  DisconnectPlayerCommand,
  UpdateGameInstanceCommand,
  BroadcastErrorCommand,
  PersistGameInstanceCommand,
} from '../command';
import { KwokkaSdkNodeConfig } from '../../config';
import { GameInstanceRegistry } from '../game-instance-registry';

export class GameControllerMethods {
  public constructor(
    private readonly commandCenter: CommandCenter,
    private readonly gameInstanceRegistry: GameInstanceRegistry,
    private readonly clientRegistry: ClientRegistry,
    private readonly sdkConfig: KwokkaSdkNodeConfig,
  ) {}

  public inject(controller: GameController) {
    controller.getGameInstance = this.getGameInstance.bind(this);
    controller.getConnectivity = this.getConnectivity.bind(this);
    controller.persistGameInstance = this.persistGameInstance.bind(this);
    controller.updateGameInstance = this.updateGameInstance.bind(this);
    controller.broadcastError = this.broadcastError.bind(this);
    controller.disconnectPlayer = this.disconnectPlayer.bind(this);
    Object.defineProperty(controller, 'stats', { get: () => this.stats });
    Object.defineProperty(controller, 'activeGameInstances', { get: () => this.activeGameInstances });
  }

  private get stats(): GameControllerStats {
    return {
      activeGamesCount: this.gameInstanceRegistry.count,
      activePlayersCount: this.clientRegistry.count,
    };
  }

  private get activeGameInstances(): GameInstanceEntity[] {
    return this.gameInstanceRegistry.activeGameInstances;
  }

  private updateGameInstance(gameInstance: GameInstanceEntity): GameInstanceEntity {
    this.commandCenter.execute(gameInstance.id, new UpdateGameInstanceCommand(gameInstance));
    return gameInstance;
  }

  private broadcastError(accountId: string, code: string, message: string): void {
    const client = this.clientRegistry.getClientByAccountId(accountId);
    if (!client) {
      this.sdkConfig.logger.warn(`broadcastError() was called for an account that is not connected: ${accountId}`);
      return;
    }

    this.commandCenter.execute(client.gameInstanceId, new BroadcastErrorCommand(client, code, message));
  }

  private disconnectPlayer(accountId: string, reason?: DisconnectReason): void {
    const client = this.clientRegistry.getClientByAccountId(accountId);
    this.commandCenter.execute(client.gameInstanceId, new DisconnectPlayerCommand(client, reason));
  }

  private async getGameInstance(id: string): Promise<GameInstanceEntity> {
    return this.gameInstanceRegistry.getGameInstanceById(id);
  }

  private persistGameInstance(gameInstance: GameInstanceEntity): GameInstanceEntity {
    this.commandCenter.execute(gameInstance.id, new PersistGameInstanceCommand(gameInstance));
    return gameInstance;
  }

  private getConnectivity(id: string): Record<string, boolean> {
    return this.clientRegistry.getConnectivity(id);
  }
}
