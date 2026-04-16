import type { Dto } from '@/api/dto';
import { TraitInstanceEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';

export class TraitInstanceApiAdapter extends Adapter<TraitInstanceEntity, Dto<TraitInstanceEntity>> {
  public deserialize(dto: Dto<TraitInstanceEntity>): TraitInstanceEntity {
    return new TraitInstanceEntity({
      id: dto.id,
      accountId: dto.accountId,
      traitId: dto.traitId,
      value: dto.value,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: TraitInstanceEntity): Dto<TraitInstanceEntity> {
    return {
      id: entity.id,
      accountId: entity.accountId,
      traitId: entity.traitId,
      value: entity.value,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
