import { CredentialEntity, CredentialFactory } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class CredentialV1Adapter extends Adapter<CredentialEntity> {
  public override deserialize(dto: PublicProps<CredentialEntity>): CredentialEntity {
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

  public serialize(entity: CredentialEntity): PublicProps<CredentialEntity> {
    return {
      id: entity.id,
      accountId: entity.accountId,
      type: entity.type,
      identifier: entity.identifier,
      data: entity.data,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      isVerified: entity.isVerified,
    };
  }
}
