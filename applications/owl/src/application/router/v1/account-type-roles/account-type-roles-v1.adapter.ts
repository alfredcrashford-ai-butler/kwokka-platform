import { AccountTypeRolesEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class AccountTypeRolesV1Adapter extends Adapter<AccountTypeRolesEntity> {
  public override deserialize(dto: PublicProps<AccountTypeRolesEntity>): AccountTypeRolesEntity {
    return new AccountTypeRolesEntity({
      id: dto.id,
      type: dto.type,
      accessRolesIds: dto.accessRolesIds,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: AccountTypeRolesEntity): PublicProps<AccountTypeRolesEntity> {
    return {
      id: entity.id,
      type: entity.type,
      accessRolesIds: entity.accessRolesIds,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
