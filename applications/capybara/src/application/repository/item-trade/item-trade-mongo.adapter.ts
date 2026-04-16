import { Adapter } from '@kwokka/utils';
import { ItemTradeEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class ItemTradeMongoAdapter extends Adapter<ItemTradeEntity, MongoDTO<ItemTradeEntity>> {
  public deserialize(dto: MongoDTO<ItemTradeEntity>): ItemTradeEntity {
    return new ItemTradeEntity({
      id: dto._id.toString(),
      itemId: dto.itemId.toString(),
      key: dto.key,
      quantity: dto.quantity,
      maxQuantity: dto.maxQuantity,
      tradedItemId: dto.tradedItemId.toString(),
      tradedItemQuantity: dto.tradedItemQuantity,
      requiredItems: (dto.requiredItems || []).map((el) => ({ ...el, itemId: el.itemId.toString() })),
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: ItemTradeEntity): MongoDTO<ItemTradeEntity> {
    return {
      _id: entity.id,
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
