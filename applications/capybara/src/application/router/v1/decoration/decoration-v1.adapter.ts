import { DecorationEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class DecorationV1Adapter extends Adapter<DecorationEntity> {
  public override deserialize(dto: PublicProps<DecorationEntity>): DecorationEntity {
    return new DecorationEntity({
      id: dto.id,
      applicationAccountId: dto.applicationAccountId,
      key: dto.key,
      type: dto.type,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: DecorationEntity): PublicProps<DecorationEntity> {
    return {
      id: entity.id,
      applicationAccountId: entity.applicationAccountId,
      key: entity.key,
      type: entity.type,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
