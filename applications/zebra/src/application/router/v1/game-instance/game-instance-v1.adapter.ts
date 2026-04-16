import { GameInstanceEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class GameInstanceV1Adapter extends Adapter<GameInstanceEntity> {
  public override deserialize(dto: PublicProps<GameInstanceEntity>): GameInstanceEntity {
    return new GameInstanceEntity({
      id: dto.id,
      gameId: dto.gameId,
      lobbyId: dto.lobbyId,
      lobbySettings: dto.lobbySettings,
      status: dto.status,
      state: dto.state,
      playerIds: dto.playerIds,
      isPubliclyVisible: dto.isPubliclyVisible,
      startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
      finishedAt: dto.finishedAt ? new Date(dto.finishedAt) : undefined,
      results: dto.results,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: GameInstanceEntity): PublicProps<GameInstanceEntity> {
    return {
      id: entity.id,
      gameId: entity.gameId,
      lobbyId: entity.lobbyId,
      lobbySettings: entity.lobbySettings,
      status: entity.status,
      state: entity.state,
      playerIds: entity.playerIds,
      isPubliclyVisible: entity.isPubliclyVisible,
      startedAt: entity.startedAt,
      finishedAt: entity.finishedAt,
      results: entity.results,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
