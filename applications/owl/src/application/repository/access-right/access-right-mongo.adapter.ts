import { MongoDTO } from '@kwokka/common-node';
import { AccessRightEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';

export class AccessRightMongoAdapter extends Adapter<AccessRightEntity, MongoDTO<AccessRightEntity>> {
  public deserialize(dto: MongoDTO<AccessRightEntity>): AccessRightEntity {
    return new AccessRightEntity({
      id: dto._id.toString(),
      name: dto.name,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: AccessRightEntity): MongoDTO<AccessRightEntity> {
    return {
      _id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
