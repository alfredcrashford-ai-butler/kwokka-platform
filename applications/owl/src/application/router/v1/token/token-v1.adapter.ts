import { TokenEntity, TokenFactory } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class TokenV1Adapter extends Adapter<TokenEntity> {
  public override deserialize(dto: PublicProps<TokenEntity>): TokenEntity {
    return TokenFactory.get({
      id: dto.id,
      type: dto.type,
      revokedAt: dto.revokedAt ? new Date(dto.revokedAt) : undefined,
      content: dto.content,
      accountId: dto.accountId,
      credentialId: dto.credentialId,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      correlationId: dto.correlationId,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: TokenEntity): PublicProps<TokenEntity> {
    return {
      id: entity.id,
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
