import { AccessRightEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class AccessRightApiAdapter extends Adapter<AccessRightEntity, Dto<AccessRightEntity>> {
  public deserialize(dto: Dto<AccessRightEntity>): AccessRightEntity {
    return new AccessRightEntity({
      id: dto.id,
      name: dto.name,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: AccessRightEntity): Dto<AccessRightEntity> {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
