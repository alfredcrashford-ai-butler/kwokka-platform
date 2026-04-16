import { AccountEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import { MongoDTO } from '@kwokka/common-node';

export class AccountMongoAdapter extends Adapter<AccountEntity, MongoDTO<AccountEntity>> {
  public deserialize(dto: MongoDTO<AccountEntity>): AccountEntity {
    return new AccountEntity({
      id: dto._id.toString(),
      type: dto.type,
      isActive: dto.isActive,
      isVerified: dto.isVerified,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: AccountEntity): MongoDTO<AccountEntity> {
    return {
      _id: entity.id,
      type: entity.type,
      isActive: entity.isActive,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
