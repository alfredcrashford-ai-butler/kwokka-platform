import { ItemEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class ItemApiAdapter extends Adapter<ItemEntity, Dto<ItemEntity>> {
  public deserialize(dto: Dto<ItemEntity>): ItemEntity {
    return new ItemEntity({
      id: dto.id,
      key: dto.key,
      applicationAccountId: dto.applicationAccountId,
      isTransferrable: dto.isTransferrable,
      actions: dto.actions,
      tags: dto.tags,
      rarity: dto.rarity,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: ItemEntity): Dto<ItemEntity> {
    return {
      id: entity.id,
      key: entity.key,
      applicationAccountId: entity.applicationAccountId,
      isTransferrable: entity.isTransferrable,
      actions: entity.actions,
      tags: entity.tags,
      rarity: entity.rarity,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
