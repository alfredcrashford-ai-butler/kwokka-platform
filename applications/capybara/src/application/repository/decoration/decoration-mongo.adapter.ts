import { Adapter } from '@kwokka/utils';
import { DecorationEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class DecorationMongoAdapter extends Adapter<DecorationEntity, MongoDTO<DecorationEntity>> {
  public deserialize(dto: MongoDTO<DecorationEntity>): DecorationEntity {
    return new DecorationEntity({
      id: dto._id.toString(),
      applicationAccountId: dto.applicationAccountId?.toString(),
      key: dto.key,
      type: dto.type,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: DecorationEntity): MongoDTO<DecorationEntity> {
    return {
      _id: entity.id,
      applicationAccountId: entity.applicationAccountId,
      key: entity.key,
      type: entity.type,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
