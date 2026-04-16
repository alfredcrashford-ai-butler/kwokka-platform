import { AccountTypeRolesEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import { MongoDTO } from '@kwokka/common-node';

export class AccountTypeRolesMongoAdapter extends Adapter<AccountTypeRolesEntity, MongoDTO<AccountTypeRolesEntity>> {
  public deserialize(dto: MongoDTO<AccountTypeRolesEntity>): AccountTypeRolesEntity {
    return new AccountTypeRolesEntity({
      id: dto._id.toString(),
      type: dto.type,
      accessRolesIds: dto.accessRolesIds.map((el) => el.toString()),
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: AccountTypeRolesEntity): MongoDTO<AccountTypeRolesEntity> {
    return {
      _id: entity.id,
      type: entity.type,
      accessRolesIds: entity.accessRolesIds,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
