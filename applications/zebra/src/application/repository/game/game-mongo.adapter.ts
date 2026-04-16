import { Adapter } from '@kwokka/utils';
import { GameEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class GameMongoAdapter extends Adapter<GameEntity, MongoDTO<GameEntity>> {
  public deserialize(dto: MongoDTO<GameEntity>): GameEntity {
    return new GameEntity({
      id: dto._id.toString(),
      key: dto.key,
      applicationAccountId: dto.applicationAccountId.toString(),
      url: dto.url,
      tags: dto.tags,
      availableSince: dto.availableSince,
      availableTill: dto.availableTill,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: GameEntity): MongoDTO<GameEntity> {
    return {
      _id: entity.id,
      key: entity.key,
      applicationAccountId: entity.applicationAccountId,
      url: entity.url,
      tags: entity.tags,
      availableSince: entity.availableSince,
      availableTill: entity.availableTill,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
