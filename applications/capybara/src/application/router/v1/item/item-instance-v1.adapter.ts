import { ItemInstanceEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class ItemInstanceV1Adapter extends Adapter<ItemInstanceEntity> {
  public override deserialize(dto: PublicProps<ItemInstanceEntity>): ItemInstanceEntity {
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

  public serialize(entity: ItemInstanceEntity): PublicProps<ItemInstanceEntity> {
    return {
      id: entity.id,
      accountId: entity.accountId,
      itemId: entity.itemId,
      quantity: entity.quantity,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
