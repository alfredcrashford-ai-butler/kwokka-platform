import { AccountRolesEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class AccountRolesV1Adapter extends Adapter<AccountRolesEntity> {
  public override deserialize(dto: PublicProps<AccountRolesEntity>): AccountRolesEntity {
    return new AccountRolesEntity({
      id: dto.id,
      accountId: dto.accountId,
      accessRoles: dto.accessRoles,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: AccountRolesEntity): PublicProps<AccountRolesEntity> {
    return {
      id: entity.id,
      accountId: entity.accountId,
      accessRoles: entity.accessRoles,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
