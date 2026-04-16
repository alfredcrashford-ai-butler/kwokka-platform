import { Adapter } from '@kwokka/utils';
import { ItemInstanceEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class ItemInstanceMongoAdapter extends Adapter<ItemInstanceEntity, MongoDTO<ItemInstanceEntity>> {
  public deserialize(dto: MongoDTO<ItemInstanceEntity>): ItemInstanceEntity {
    return new ItemInstanceEntity({
      id: dto._id.toString(),
      accountId: dto.accountId?.toString(),
      itemId: dto.itemId?.toString(),
      quantity: dto.quantity,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: ItemInstanceEntity): MongoDTO<ItemInstanceEntity> {
    return {
      _id: entity.id,
      accountId: entity.accountId,
      itemId: entity.itemId,
      quantity: entity.quantity,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
