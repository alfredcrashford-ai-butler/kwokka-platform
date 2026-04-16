import { AccessRoleEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class AccessRoleV1Adapter extends Adapter<AccessRoleEntity> {
  public override deserialize(dto: PublicProps<AccessRoleEntity>): AccessRoleEntity {
    return new AccessRoleEntity({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      accessRightsIds: dto.accessRightsIds,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: AccessRoleEntity): PublicProps<AccessRoleEntity> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      accessRightsIds: entity.accessRightsIds,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
