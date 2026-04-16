import { ProfileDecorationsEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class ProfileDecorationsV1Adapter extends Adapter<ProfileDecorationsEntity> {
  public override deserialize(dto: PublicProps<ProfileDecorationsEntity>): ProfileDecorationsEntity {
    return new ProfileDecorationsEntity({
      id: dto.id,
      profileId: dto.profileId,
      decorations: dto.decorations,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: ProfileDecorationsEntity): PublicProps<ProfileDecorationsEntity> {
    return {
      id: entity.id,
      profileId: entity.profileId,
      decorations: entity.decorations,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
