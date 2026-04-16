import { TokenEntity, TokenFactory } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import { MongoDTO } from '@kwokka/common-node';

export class TokenMongoAdapter extends Adapter<TokenEntity, MongoDTO<TokenEntity>> {
  public deserialize(dto: MongoDTO<TokenEntity>): TokenEntity {
    return TokenFactory.get({
      id: dto._id.toString(),
      type: dto.type,
      revokedAt: dto.revokedAt,
      accountId: dto.accountId.toString(),
      credentialId: dto.credentialId.toString(),
      content: dto.content,
      expiresAt: dto.expiresAt,
      correlationId: dto.correlationId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  public serialize(entity: TokenEntity): MongoDTO<TokenEntity> {
    return {
      _id: entity.id,
      type: entity.type,
      revokedAt: entity.revokedAt,
      content: entity.content,
      accountId: entity.accountId,
      credentialId: entity.credentialId,
      expiresAt: entity.expiresAt,
      correlationId: entity.correlationId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
