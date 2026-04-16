import { Adapter } from '@kwokka/utils';
import { ProfileEntity } from '@kwokka/entities';
import { MongoDTO } from '@kwokka/common-node';

export class ProfileMongoAdapter extends Adapter<ProfileEntity, MongoDTO<ProfileEntity>> {
  public deserialize(dto: MongoDTO<ProfileEntity>): ProfileEntity {
    return new ProfileEntity({
      id: dto._id.toString(),
      accountId: dto.accountId?.toString(),
      name: dto.name,
      locale: dto.locale,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: ProfileEntity): MongoDTO<ProfileEntity> {
    return {
      _id: entity.id,
      name: entity.name,
      locale: entity.locale,
      accountId: entity.accountId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
