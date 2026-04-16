import { Adapter } from '@kwokka/utils';
import { GameInstanceEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class GameInstanceMongoAdapter extends Adapter<GameInstanceEntity, MongoDTO<GameInstanceEntity>> {
  public deserialize(dto: MongoDTO<GameInstanceEntity>): GameInstanceEntity {
    return new GameInstanceEntity({
      id: dto._id.toString(),
      gameId: dto.gameId.toString(),
      lobbyId: dto.lobbyId.toString(),
      lobbySettings: dto.lobbySettings,
      status: dto.status,
      state: dto.state,
      playerIds: dto.playerIds.map((id) => id.toString()),
      isPubliclyVisible: dto.isPubliclyVisible,
      startedAt: dto.startedAt,
      finishedAt: dto.finishedAt,
      results: dto.results,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: GameInstanceEntity): MongoDTO<GameInstanceEntity> {
    return {
      _id: entity.id,
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
