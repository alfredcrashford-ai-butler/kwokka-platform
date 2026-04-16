import { AccountEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class AccountV1Adapter extends Adapter<AccountEntity> {
  public override deserialize(dto: PublicProps<AccountEntity>): AccountEntity {
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

  public serialize(entity: AccountEntity): PublicProps<AccountEntity> {
    return {
      id: entity.id,
      type: entity.type,
      isActive: entity.isActive,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
