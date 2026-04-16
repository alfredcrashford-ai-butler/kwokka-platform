import { ProfileEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class ProfileV1Adapter extends Adapter<ProfileEntity> {
  public override deserialize(dto: PublicProps<ProfileEntity>): ProfileEntity {
    return new ProfileEntity({
      id: dto.id,
      name: dto.name,
      locale: dto.locale,
      accountId: dto.accountId,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: ProfileEntity): PublicProps<ProfileEntity> {
    return {
      id: entity.id,
      name: entity.name,
      locale: entity.locale,
      accountId: entity.accountId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
