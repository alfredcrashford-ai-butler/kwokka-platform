import { ProfileEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class ProfileApiAdapter extends Adapter<ProfileEntity, Dto<ProfileEntity>> {
  public deserialize(dto: Dto<ProfileEntity>): ProfileEntity {
    return new ProfileEntity({
      id: dto.id,
      accountId: dto.accountId,
      name: dto.name,
      locale: dto.locale,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: ProfileEntity): Dto<ProfileEntity> {
    return {
      id: entity.id,
      accountId: entity.accountId,
      name: entity.name,
      locale: entity.locale,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
