import { Adapter } from '@kwokka/utils';
import { ProfileDecorationsEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class ProfileDecorationsMongoAdapter extends Adapter<ProfileDecorationsEntity, MongoDTO<ProfileDecorationsEntity>> {
  public deserialize(dto: MongoDTO<ProfileDecorationsEntity>): ProfileDecorationsEntity {
    return new ProfileDecorationsEntity({
      id: dto._id.toString(),
      profileId: dto.profileId?.toString(),
      decorations: dto.decorations,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: ProfileDecorationsEntity): MongoDTO<ProfileDecorationsEntity> {
    return {
      _id: entity.id,
      profileId: entity.profileId,
      decorations: entity.decorations,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
