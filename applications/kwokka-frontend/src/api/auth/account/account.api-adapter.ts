import type { Dto } from '@/api/dto';
import { AccountEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';

export class AccountApiAdapter extends Adapter<AccountEntity, Dto<AccountEntity>> {
  public deserialize(dto: Dto<AccountEntity>): AccountEntity {
    return new AccountEntity({
      id: dto.id,
      type: dto.type,
      isActive: dto.isActive,
      isVerified: dto.isVerified,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: AccountEntity): Dto<AccountEntity> {
    return {
      id: entity.id,
      type: entity.type,
      isActive: entity.isActive,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
