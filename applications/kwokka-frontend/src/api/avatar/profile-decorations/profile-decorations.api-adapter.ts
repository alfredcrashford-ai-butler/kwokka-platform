import { ProfileDecorationsEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class ProfileDecorationsApiAdapter extends Adapter<ProfileDecorationsEntity, Dto<ProfileDecorationsEntity>> {
  public deserialize(dto: Dto<ProfileDecorationsEntity>): ProfileDecorationsEntity {
    return new ProfileDecorationsEntity({
      id: dto.id,
      profileId: dto.profileId,
      decorations: dto.decorations,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: ProfileDecorationsEntity): Dto<ProfileDecorationsEntity> {
    return {
      id: entity.id,
      profileId: entity.profileId,
      decorations: entity.decorations,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
