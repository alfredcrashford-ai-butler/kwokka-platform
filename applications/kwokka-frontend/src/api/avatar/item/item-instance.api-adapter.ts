import { ItemInstanceEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class ItemInstanceApiAdapter extends Adapter<ItemInstanceEntity, Dto<ItemInstanceEntity>> {
  public deserialize(dto: Dto<ItemInstanceEntity>): ItemInstanceEntity {
    return new ItemInstanceEntity({
      id: dto.id,
      accountId: dto.accountId,
      itemId: dto.itemId,
      quantity: dto.quantity,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: ItemInstanceEntity): Dto<ItemInstanceEntity> {
    return {
      id: entity.id,
      accountId: entity.accountId,
      itemId: entity.itemId,
      quantity: entity.quantity,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
