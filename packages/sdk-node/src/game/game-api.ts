import { GameEntity, GameInstanceEntity, GameInstanceEntityStatus, LobbyEntity } from '@kwokka/entities';
import { ObjectUtil } from '@kwokka/utils';
import { AuthAPI } from '../auth';
import { KwokkaSdkNodeConfig } from '../config';
import { Dto, HttpUtil } from '../util';
import { Cache } from '../cache';

type SortOption = 'asc' | 'desc';
type ListSort = { createdAt?: SortOption; players?: SortOption };
type ListFilter = { gameId: string; lobbyId?: string; status?: GameInstanceEntityStatus };

export class GameAPI {
  private zebraUrl: string;
  private cache = new Cache();

  public constructor(
    private readonly config: KwokkaSdkNodeConfig,
    private readonly auth: AuthAPI,
  ) {
    this.zebraUrl = `${this.config.endpoint}/zebra`;
  }

  public getGameByKey(key: string): Promise<GameEntity> {
    return this.auth.withAuth(() => {
      return this.withCache(`game_by_key__${key}`, async () => {
        const url = `${this.zebraUrl}/v1/games/key/${key}`;
        const response = await HttpUtil.get<{ data: Dto<GameEntity> }>(url, this.auth.authHeaders);
        return this.deserializeGame(response.data);
      });
    });
  }

  public getGameById(id: string): Promise<GameEntity> {
    return this.auth.withAuth(async () => {
      return this.withCache(`game_by_id__${id}`, async () => {
        const url = `${this.zebraUrl}/v1/games/${id}`;
        const response = await HttpUtil.get<{ data: Dto<GameEntity> }>(url, this.auth.authHeaders);
        return this.deserializeGame(response.data);
      });
    });
  }

  public async getGameInstanceById(id: string): Promise<GameInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/game-instances/${id}`;
      const response = await HttpUtil.get<{ data: Dto<GameInstanceEntity> }>(url, this.auth.authHeaders);
      return this.deserializeGameInstance(response.data);
    });
  }

  public async getLobbyByKey(key: string): Promise<LobbyEntity> {
    return this.auth.withAuth(async () => {
      return this.withCache(`lobby_by_key__${key}`, async () => {
        const url = `${this.zebraUrl}/v1/lobbies/key/${key}`;
        const response = await HttpUtil.get<{ data: Dto<LobbyEntity> }>(url, this.auth.authHeaders);
        return this.deserializeLobby(response.data);
      });
    });
  }

  public async getLobbyById(id: string): Promise<LobbyEntity> {
    return this.auth.withAuth(async () => {
      return this.withCache(`lobby_by_id__${id}`, async () => {
        const url = `${this.zebraUrl}/v1/lobbies/${id}`;
        const response = await HttpUtil.get<{ data: Dto<LobbyEntity> }>(url, this.auth.authHeaders);
        return this.deserializeLobby(response.data);
      });
    });
  }

  public async createGameInstance(data: {
    gameId: string;
    lobbyId: string;
    lobbySettings: any;
    state: any;
    playerIds?: string[];
  }): Promise<GameInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/game-instances`;
      const body = {
        gameId: data.gameId,
        lobbyId: data.lobbyId,
        lobbySettings: data.lobbySettings || {},
        state: data.state || {},
        playerIds: data.playerIds || [],
        status: GameInstanceEntityStatus.Initial,
      };
      const response = await HttpUtil.post<{ payload: Dto<GameInstanceEntity> }>(url, body, this.auth.authHeaders);
      return this.deserializeGameInstance(response.payload);
    });
  }

  public async setGameInstanceStatus(id: string, status: GameInstanceEntityStatus): Promise<GameInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/game-instances/${id}`;
      const body = { status };
      const response = await HttpUtil.post<{ payload: Dto<GameInstanceEntity> }>(url, body, this.auth.authHeaders);
      return this.deserializeGameInstance(response.payload);
    });
  }

  public async updateGameInstance(id: string, gameInstance: Partial<GameInstanceEntity>): Promise<GameInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/game-instances/${id}`;
      const body = this.serializeGameInstance(gameInstance);
      const response = await HttpUtil.patch<{ payload: Dto<GameInstanceEntity> }>(url, body, this.auth.authHeaders);
      return this.deserializeGameInstance(response.payload);
    });
  }

  public async listGameInstances(
    params: { filter: ListFilter; sort?: ListSort },
    offset: number,
    limit: number,
  ): Promise<GameInstanceEntity[]> {
    return this.auth.withAuth(async () => {
      const url = this.getListGameInstancesUrl(params, offset, limit);
      const response = await HttpUtil.get<{ data: Dto<GameInstanceEntity>[] }>(url, this.auth.authHeaders);
      return response.data.map((el) => this.deserializeGameInstance(el));
    });
  }

  private getListGameInstancesUrl(
    params: { filter: ListFilter; sort?: ListSort },
    offset: number,
    limit: number,
  ): string {
    let url = `${this.zebraUrl}/v1/game-instances?gameId=${params.filter.gameId}`;
    url += params.filter.lobbyId ? `&lobbyId=${params.filter.lobbyId}` : '';
    url += params.filter.status ? `&status=${params.filter.status}` : '';
    const sortKeys = [];
    const sortOrders = [];
    Object.keys(params.sort || {}).forEach((key) => {
      if (params.sort?.[key]) {
        sortKeys.push(key);
        sortOrders.push(params.sort?.[key]);
      }
    });
    url += sortKeys.length ? `&sort=${sortKeys.join(',')}&order=${sortOrders.join(',')}` : '';
    url += `&offset=${offset}`;
    url += `&limit=${limit}`;
    return url;
  }

  private deserializeGame(dto: Dto<GameEntity>): GameEntity {
    if (!dto) {
      return null;
    }

    return new GameEntity({
      id: dto.id,
      key: dto.key,
      applicationAccountId: dto.applicationAccountId,
      url: dto.url,
      tags: dto.tags,
      availableSince: dto.availableSince ? new Date(dto.availableSince) : undefined,
      availableTill: dto.availableTill ? new Date(dto.availableTill) : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  private deserializeGameInstance(dto: Dto<GameInstanceEntity>): GameInstanceEntity {
    if (!dto) {
      return null;
    }

    return new GameInstanceEntity({
      id: dto.id,
      gameId: dto.gameId,
      lobbyId: dto.lobbyId,
      lobbySettings: dto.lobbySettings,
      status: dto.status,
      state: dto.state,
      playerIds: dto.playerIds,
      startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
      finishedAt: dto.finishedAt ? new Date(dto.finishedAt) : undefined,
      results: dto.results,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  private deserializeLobby(dto: Dto<LobbyEntity>): LobbyEntity {
    if (!dto) {
      return null;
    }

    return new LobbyEntity({
      id: dto.id,
      key: dto.key,
      gameId: dto.gameId,
      minPlayers: dto.minPlayers,
      maxPlayers: dto.maxPlayers,
      config: dto.config,
      availableSince: dto.availableSince ? new Date(dto.availableSince) : undefined,
      availableTill: dto.availableTill ? new Date(dto.availableTill) : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  private serializeGameInstance(gameInstance: Partial<GameInstanceEntity>): Dto<Partial<GameInstanceEntity>> {
    return ObjectUtil.take(gameInstance, [
      'lobbySettings',
      'status',
      'state',
      'playerIds',
      'startedAt',
      'finishedAt',
      'results',
      'isPubliclyVisible',
    ]);
  }

  private async withCache(cacheKey: string, action: () => any): Promise<any> {
    let result = this.cache.get(cacheKey);
    if (result) {
      return result;
    }

    result = await action();
    this.cache.set(cacheKey, result);

    return result;
  }
}
