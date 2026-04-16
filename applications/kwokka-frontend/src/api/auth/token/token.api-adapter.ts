import { TokenEntity, TokenFactory } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { TokenDto } from './token.dto';

export class TokenApiAdapter extends Adapter<TokenEntity, TokenDto> {
  public deserialize(dto: TokenDto): TokenEntity {
    return TokenFactory.get({
      id: dto.id,
      type: dto.type,
      content: dto.content,
      accountId: dto.accountId,
      credentialId: dto.credentialId,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      correlationId: dto.correlationId,
      revokedAt: dto.revokedAt ? new Date(dto.revokedAt) : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: TokenEntity): TokenDto {
    return {
      id: entity.id,
      type: entity.type,
      content: entity.content,
      accountId: entity.accountId,
      credentialId: entity.credentialId,
      expiresAt: entity.expiresAt?.toISOString(),
      correlationId: entity.correlationId,
      revokedAt: entity.revokedAt?.toISOString(),
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
