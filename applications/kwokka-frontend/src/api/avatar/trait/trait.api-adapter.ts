import type { Dto } from '@/api/dto';
import { TraitEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';

export class TraitApiAdapter extends Adapter<TraitEntity, Dto<TraitEntity>> {
  public deserialize(dto: Dto<TraitEntity>): TraitEntity {
    return new TraitEntity({
      id: dto.id,
      key: dto.key,
      type: dto.type,
      applicationAccountId: dto.applicationAccountId,
      defaultValue: dto.defaultValue,
      isOwnerEditable: dto.isOwnerEditable,
      isPubliclyVisible: dto.isPubliclyVisible,
      config: dto.config,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: TraitEntity): Dto<TraitEntity> {
    return {
      id: entity.id,
      key: entity.key,
      type: entity.type,
      applicationAccountId: entity.applicationAccountId,
      defaultValue: entity.defaultValue,
      isOwnerEditable: entity.isOwnerEditable,
      isPubliclyVisible: entity.isPubliclyVisible,
      config: entity.config,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
