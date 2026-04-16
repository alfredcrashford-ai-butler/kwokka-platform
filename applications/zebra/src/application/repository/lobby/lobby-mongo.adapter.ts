import { Adapter } from '@kwokka/utils';
import { LobbyEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class LobbyMongoAdapter extends Adapter<LobbyEntity, MongoDTO<LobbyEntity>> {
  public deserialize(dto: MongoDTO<LobbyEntity>): LobbyEntity {
    return new LobbyEntity({
      id: dto._id.toString(),
      key: dto.key,
      gameId: dto.gameId.toString(),
      minPlayers: dto.minPlayers,
      maxPlayers: dto.maxPlayers,
      config: dto.config,
      availableSince: dto.availableSince,
      availableTill: dto.availableTill,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: LobbyEntity): MongoDTO<LobbyEntity> {
    return {
      _id: entity.id,
      key: entity.key,
      gameId: entity.gameId,
      minPlayers: entity.minPlayers,
      maxPlayers: entity.maxPlayers,
      config: entity.config,
      availableSince: entity.availableSince,
      availableTill: entity.availableTill,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
