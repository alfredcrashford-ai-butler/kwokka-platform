import { Adapter } from '@kwokka/utils';
import { ItemEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class ItemMongoAdapter extends Adapter<ItemEntity, MongoDTO<ItemEntity>> {
  public deserialize(dto: MongoDTO<ItemEntity>): ItemEntity {
    return new ItemEntity({
      id: dto._id.toString(),
      key: dto.key,
      applicationAccountId: dto.applicationAccountId?.toString(),
      isTransferrable: dto.isTransferrable,
      actions: dto.actions,
      tags: dto.tags,
      rarity: dto.rarity,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: ItemEntity): MongoDTO<ItemEntity> {
    return {
      _id: entity.id,
      key: entity.key,
      applicationAccountId: entity.applicationAccountId,
      isTransferrable: entity.isTransferrable,
      actions: entity.actions,
      tags: entity.tags,
      rarity: entity.rarity,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
