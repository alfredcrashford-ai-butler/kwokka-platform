import { Adapter } from '@kwokka/utils';
import { TraitInstanceEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class TraitInstanceMongoAdapter extends Adapter<TraitInstanceEntity, MongoDTO<TraitInstanceEntity>> {
  public deserialize(dto: MongoDTO<TraitInstanceEntity>): TraitInstanceEntity {
    return new TraitInstanceEntity({
      id: dto._id.toString(),
      accountId: dto.accountId.toString(),
      traitId: dto.traitId.toString(),
      value: dto.value,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: TraitInstanceEntity): MongoDTO<TraitInstanceEntity> {
    return {
      _id: entity.id,
      accountId: entity.accountId,
      traitId: entity.traitId,
      value: entity.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
