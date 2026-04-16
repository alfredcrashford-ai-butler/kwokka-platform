import { GameEntity, GameInstanceEntity, GameInstanceEntityStatus, LobbyEntity } from '@kwokka/entities';
import type { AuthAPI } from '../auth';
import type { KwokkaSdkJsConfig } from '../config';
import { HttpUtil, QuerySortOption, Dto, QueryUtil, QueryListDto } from '../util';
import { GameConnection } from './game-connection';
import { GameConnectionConfig } from './game-connection-config';
import { DeepSearchParameter } from '../deep-search-parameter';
import { KwokkaSdkJsError } from '../error';
import { AuthInternalAPI } from '../auth-internal';

type ListSort = { createdAt?: QuerySortOption; players?: QuerySortOption };
type ListOwnFilter = {
  gameId: string;
  lobbyId?: string;
  status?: GameInstanceEntityStatus;
  results?: DeepSearchParameter;
  lobbySettings?: DeepSearchParameter;
};
type ListFilter = ListOwnFilter & { playerIds?: string[] };

export class GameAPI {
  private readonly zebraUrl: string;

  public constructor(
    private readonly config: KwokkaSdkJsConfig,
    private readonly authInternal: AuthInternalAPI,
  ) {
    this.zebraUrl = `${this.config.endpoint}/zebra`;
  }

  public async connect(config: GameConnectionConfig): Promise<GameConnection> {
    if (typeof config.gameInstanceId !== 'string') {
      throw new KwokkaSdkJsError(`gameInstanceId is not provided in config. Current value: ${config.gameInstanceId}`);
    }

    const connectToken = await this.generateConnectToken(config.gameInstanceId);
    const connection = new GameConnection(config.controller, this.authInternal, this.config);
    await connection.start(connectToken, config.gameServerUrl);
    return connection;
  }

  public getGameByKey(key: string): Promise<GameEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/games/key/${key}`;
      const response = await HttpUtil.get<{ data: Dto<GameEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeGame(response.data);
    });
  }

  public getGameById(id: string): Promise<GameEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/games/${id}`;
      const response = await HttpUtil.get<{ data: Dto<GameEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeGame(response.data);
    });
  }

  public createGameInstance(data: {
    gameId: string;
    lobbyId: string;
    lobbySettings: Record<any, any>;
    isPubliclyVisible?: boolean;
  }): Promise<GameInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/game-instances`;
      const response = await HttpUtil.post<{ data: Dto<GameInstanceEntity> }>(url, data, this.authInternal.authHeaders);
      return this.deserializeGameInstance(response.data);
    });
  }

  public async getGameInstanceById(id: string): Promise<GameInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/game-instances/${id}`;
      const response = await HttpUtil.get<{ data: Dto<GameInstanceEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeGameInstance(response.data);
    });
  }

  public async listGameInstances(params: {
    offset: number;
    limit: number;
    filter: ListFilter;
    sort?: ListSort;
  }): Promise<QueryListDto<GameInstanceEntity>> {
    return this.authInternal.withAuth(async () => {
      const url = this.getListGameInstancesUrl(params);
      const response = await HttpUtil.get<QueryListDto<Dto<GameInstanceEntity>>>(url, this.authInternal.authHeaders);
      const data = response.data.map((el) => this.deserializeGameInstance(el));
      return { data, meta: response.meta };
    });
  }

  public async listOwnGameInstances(params: {
    offset: number;
    limit: number;
    filter: ListOwnFilter;
    sort?: ListSort;
  }): Promise<QueryListDto<GameInstanceEntity>> {
    return this.authInternal.withAuth(async () => {
      const url = this.getListOwnGameInstancesUrl(params);
      const response = await HttpUtil.get<QueryListDto<Dto<GameInstanceEntity>>>(url, this.authInternal.authHeaders);
      const data = response.data.map((el) => this.deserializeGameInstance(el));
      return { data, meta: response.meta };
    });
  }

  private getListGameInstancesUrl(params: {
    offset: number;
    limit: number;
    filter: ListFilter;
    sort?: ListSort;
  }): string {
    const query = QueryUtil.buildQuery(params);
    return `${this.zebraUrl}/v1/game-instances${query}`;
  }

  private getListOwnGameInstancesUrl(params: {
    offset: number;
    limit: number;
    filter: ListFilter;
    sort?: ListSort;
  }): string {
    const query = QueryUtil.buildQuery(params);
    return `${this.zebraUrl}/v1/game-instances/my${query}`;
  }

  public async getLobbyByKey(key: string): Promise<LobbyEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/lobbies/key/${key}`;
      const response = await HttpUtil.get<{ data: Dto<LobbyEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeLobby(response.data);
    });
  }

  public async getLobbyById(id: string): Promise<LobbyEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/lobbies/${id}`;
      const response = await HttpUtil.get<{ data: Dto<LobbyEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeLobby(response.data);
    });
  }

  private async generateConnectToken(gameInstanceId: string): Promise<string> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/game-instances/${gameInstanceId}/generate-connect-token`;
      const response = await HttpUtil.post<{ data: { token: string } }>(url, {}, this.authInternal.authHeaders);
      return response.data?.token;
    });
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
}
