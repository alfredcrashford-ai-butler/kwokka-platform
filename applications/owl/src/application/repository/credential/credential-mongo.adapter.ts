import { CredentialEntity, CredentialFactory } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import { MongoDTO } from '@kwokka/common-node';

export class CredentialMongoAdapter extends Adapter<CredentialEntity, MongoDTO<CredentialEntity>> {
  public deserialize(dto: MongoDTO<CredentialEntity>): CredentialEntity {
    return CredentialFactory.get({
      id: dto._id.toString(),
      accountId: dto.accountId.toString(),
      identifier: dto.identifier,
      type: dto.type,
      data: dto.data,
      isVerified: dto.isVerified,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: CredentialEntity): MongoDTO<CredentialEntity> {
    return {
      _id: entity.id,
      accountId: entity.accountId,
      identifier: entity.identifier,
      type: entity.type,
      data: entity.data,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
