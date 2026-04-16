import { GameInstanceEntity } from '@kwokka/entities';
import { GameAPI } from '../../game';
import { AutoPersistConfig, GameServerConfig } from '../game-server-config';
import { DefaultConfig } from '../default-config';

export class GameInstanceRegistry {
  private readonly gameInstances: Map<string, GameInstanceEntity> = new Map();
  private readonly updatesCount: Map<string, number> = new Map();
  private readonly autoPersistConfig: AutoPersistConfig;

  public constructor(
    private readonly gameApi: GameAPI,
    config: GameServerConfig,
  ) {
    this.autoPersistConfig = config.autoPersist;
  }

  public get count(): number {
    return this.gameInstances.size;
  }

  public get activeGameInstances(): GameInstanceEntity[] {
    return Array.from(this.gameInstances.values());
  }

  public async getGameInstanceById(id: string): Promise<GameInstanceEntity> {
    if (this.gameInstances.has(id)) {
      return this.gameInstances.get(id);
    }

    const gameInstance = await this.gameApi.getGameInstanceById(id);
    this.gameInstances.set(id, gameInstance);
    this.resetUpdatesCount(id);
    return gameInstance;
  }

  public updateGameInstance(gameInstance: GameInstanceEntity): GameInstanceEntity {
    this.gameInstances.set(gameInstance.id, gameInstance);
    this.incrementUpdatesCount(gameInstance.id);
    return gameInstance;
  }

  public persistGameInstance(gameInstance: GameInstanceEntity): Promise<GameInstanceEntity> {
    this.resetUpdatesCount(gameInstance.id);
    return this.gameApi.updateGameInstance(gameInstance.id, gameInstance);
  }

  public cleanupGameInstance(id: string): void {
    this.gameInstances.delete(id);
    this.updatesCount.delete(id);
  }

  public async persistAll(): Promise<void> {
    // TODO: use bulk update when is implemented on platform
    const gameInstances = Array.from(this.gameInstances.values());
    const promises = gameInstances.map((gameInstance) => this.persistGameInstance(gameInstance));
    await Promise.all(promises);
  }

  public isReadyForPersist(id: string): boolean {
    if (!this.autoPersistConfig.enabled) {
      return false;
    }

    const updatesCount = this.updatesCount.get(id) || 0;
    const threshold = this.autoPersistConfig.threshold ?? DefaultConfig.autoPersist.threshold;
    return updatesCount >= threshold;
  }

  public isActiveGameInstance(gameInstanceId: string): boolean {
    return this.gameInstances.has(gameInstanceId);
  }

  private incrementUpdatesCount(id: string): void {
    if (!this.autoPersistConfig.enabled) {
      return;
    }

    this.updatesCount.set(id, (this.updatesCount.get(id) || 0) + 1);
  }

  private resetUpdatesCount(id: string): void {
    if (!this.autoPersistConfig.enabled) {
      return;
    }

    this.updatesCount.set(id, 0);
  }
}
