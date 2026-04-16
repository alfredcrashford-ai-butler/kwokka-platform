import type { Dto } from '@/api/dto';
import { CredentialEntity, CredentialFactory } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';

export class CredentialApiAdapter extends Adapter<CredentialEntity, Dto<CredentialEntity>> {
  public deserialize(dto: Dto<CredentialEntity>): CredentialEntity {
    return CredentialFactory.get({
      id: dto.id,
      accountId: dto.accountId,
      type: dto.type,
      identifier: dto.identifier,
      data: dto.data,
      isVerified: dto.isVerified,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: CredentialEntity): Dto<CredentialEntity> {
    return {
      id: entity.id,
      accountId: entity.accountId,
      type: entity.type,
      identifier: entity.identifier,
      data: entity.data,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
