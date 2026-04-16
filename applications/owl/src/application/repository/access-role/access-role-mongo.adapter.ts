import { AccessRoleEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import { MongoDTO } from '@kwokka/common-node';

export class AccessRoleMongoAdapter extends Adapter<AccessRoleEntity, MongoDTO<AccessRoleEntity>> {
  public deserialize(dto: MongoDTO<AccessRoleEntity>): AccessRoleEntity {
    return new AccessRoleEntity({
      id: dto._id.toString(),
      name: dto.name,
      description: dto.description,
      accessRightsIds: dto.accessRightsIds.map((el) => el.toString()),
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: AccessRoleEntity): MongoDTO<AccessRoleEntity> {
    return {
      _id: entity.id,
      name: entity.name,
      description: entity.description,
      accessRightsIds: entity.accessRightsIds,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
