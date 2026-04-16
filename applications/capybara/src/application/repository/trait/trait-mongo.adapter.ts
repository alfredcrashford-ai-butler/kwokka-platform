import { Adapter } from '@kwokka/utils';
import { MongoDTO } from '@kwokka/common-node';
import { TraitEntity } from '@kwokka/entities';

export class TraitMongoAdapter extends Adapter<TraitEntity, MongoDTO<TraitEntity>> {
  public castValue(value: any): any {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    // If castable to number - make it a number
    if (!isNaN(Number(value)) && value !== '') {
      return Number(value);
    }

    return value;
  }

  public deserialize(dto: MongoDTO<TraitEntity>): TraitEntity {
    return new TraitEntity({
      id: dto._id.toString(),
      key: dto.key,
      type: dto.type,
      applicationAccountId: dto.applicationAccountId.toString(),
      isOwnerEditable: dto.isOwnerEditable,
      isPubliclyVisible: dto.isPubliclyVisible,
      config: dto.config,
      defaultValue: dto.defaultValue,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: TraitEntity): MongoDTO<TraitEntity> {
    return {
      _id: entity.id,
      key: entity.key,
      type: entity.type,
      applicationAccountId: entity.applicationAccountId.toString(),
      isOwnerEditable: entity.isOwnerEditable,
      isPubliclyVisible: entity.isPubliclyVisible,
      config: entity.config,
      defaultValue: entity.defaultValue,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
