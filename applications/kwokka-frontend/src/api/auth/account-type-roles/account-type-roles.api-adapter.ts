import { AccountTypeRolesEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class AccountTypeRolesApiAdapter extends Adapter<AccountTypeRolesEntity, Dto<AccountTypeRolesEntity>> {
  public deserialize(dto: Dto<AccountTypeRolesEntity>): AccountTypeRolesEntity {
    return new AccountTypeRolesEntity({
      id: dto.id,
      type: dto.type,
      accessRolesIds: dto.accessRolesIds,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: AccountTypeRolesEntity): Dto<AccountTypeRolesEntity> {
    return {
      id: entity.id,
      type: entity.type,
      accessRolesIds: entity.accessRolesIds,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
