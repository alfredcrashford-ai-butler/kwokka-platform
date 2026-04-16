import { AccessRoleEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class AccessRoleApiAdapter extends Adapter<AccessRoleEntity, Dto<AccessRoleEntity>> {
  public deserialize(dto: Dto<AccessRoleEntity>): AccessRoleEntity {
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

  public serialize(entity: AccessRoleEntity): Dto<AccessRoleEntity> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      accessRightsIds: entity.accessRightsIds,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
