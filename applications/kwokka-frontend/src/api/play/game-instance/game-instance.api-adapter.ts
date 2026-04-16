import { GameInstanceEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class GameInstanceApiAdapter extends Adapter<GameInstanceEntity, Dto<GameInstanceEntity>> {
  public deserialize(dto: Dto<GameInstanceEntity>): GameInstanceEntity {
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

  public serialize(entity: GameInstanceEntity): Dto<GameInstanceEntity> {
    return {
      id: entity.id,
      gameId: entity.gameId,
      lobbyId: entity.lobbyId,
      lobbySettings: entity.lobbySettings,
      status: entity.status,
      state: entity.state,
      playerIds: entity.playerIds,
      startedAt: entity.startedAt,
      finishedAt: entity.finishedAt,
      results: entity.results,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
