import { Adapter } from '@kwokka/utils';
import { ItemTransactionEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class ItemTransactionMongoAdapter extends Adapter<ItemTransactionEntity, MongoDTO<ItemTransactionEntity>> {
  public deserialize(dto: MongoDTO<ItemTransactionEntity>): ItemTransactionEntity {
    return new ItemTransactionEntity({
      id: dto._id.toString(),
      accountId: dto.accountId.toString(),
      type: dto.type,
      itemId: dto.itemId.toString(),
      transactionDetails: dto.transactionDetails,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: ItemTransactionEntity): MongoDTO<ItemTransactionEntity> {
    return {
      _id: entity.id,
      accountId: entity.accountId,
      type: entity.type,
      itemId: entity.itemId,
      transactionDetails: entity.transactionDetails,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
