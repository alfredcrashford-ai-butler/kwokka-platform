import { ItemTradeEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class ItemTradeV1Adapter extends Adapter<ItemTradeEntity> {
  public override deserialize(dto: PublicProps<ItemTradeEntity>): ItemTradeEntity {
    return new ItemTradeEntity({
      id: dto.id,
      itemId: dto.itemId,
      key: dto.key,
      quantity: dto.quantity,
      maxQuantity: dto.maxQuantity,
      tradedItemId: dto.tradedItemId,
      tradedItemQuantity: dto.tradedItemQuantity,
      requiredItems: dto.requiredItems,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: ItemTradeEntity): PublicProps<ItemTradeEntity> {
    return {
      id: entity.id,
      itemId: entity.itemId,
      key: entity.key,
      quantity: entity.quantity,
      maxQuantity: entity.maxQuantity,
      tradedItemId: entity.tradedItemId,
      tradedItemQuantity: entity.tradedItemQuantity,
      requiredItems: entity.requiredItems,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
