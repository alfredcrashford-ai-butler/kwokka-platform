import type { Dto } from '@/api/dto';
import { AccountRolesEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';

export class AccountRolesApiAdapter extends Adapter<AccountRolesEntity, Dto<AccountRolesEntity>> {
  public deserialize(dto: Dto<AccountRolesEntity>): AccountRolesEntity {
    return new AccountRolesEntity({
      id: dto.id,
      accountId: dto.accountId,
      accessRoles: dto.accessRoles,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: AccountRolesEntity): Dto<AccountRolesEntity> {
    return {
      id: entity.id,
      accountId: entity.accountId,
      accessRoles: entity.accessRoles,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
