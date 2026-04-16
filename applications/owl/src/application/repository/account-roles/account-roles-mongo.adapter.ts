import { AccountRolesEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import { MongoDTO } from '@kwokka/common-node';

export class AccountRolesMongoAdapter extends Adapter<AccountRolesEntity, MongoDTO<AccountRolesEntity>> {
  public deserialize(dto: MongoDTO<AccountRolesEntity>): AccountRolesEntity {
    return new AccountRolesEntity({
      id: dto._id.toString(),
      accountId: dto.accountId.toString(),
      accessRoles: dto.accessRoles.map((el) => ({ ...el, id: el.id.toString() })),
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: AccountRolesEntity): MongoDTO<AccountRolesEntity> {
    return {
      _id: entity.id,
      accountId: entity.accountId,
      accessRoles: entity.accessRoles,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
