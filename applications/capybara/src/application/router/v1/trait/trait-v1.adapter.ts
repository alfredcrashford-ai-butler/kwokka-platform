import { TraitEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class TraitV1Adapter extends Adapter<TraitEntity> {
  public override deserialize(dto: PublicProps<TraitEntity>): TraitEntity {
    return new TraitEntity({
      id: dto.id,
      key: dto.key,
      type: dto.type,
      applicationAccountId: dto.applicationAccountId,
      isOwnerEditable: dto.isOwnerEditable,
      isPubliclyVisible: dto.isPubliclyVisible,
      config: dto.config,
      defaultValue: dto.defaultValue,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: TraitEntity): PublicProps<TraitEntity> {
    return {
      id: entity.id,
      key: entity.key,
      type: entity.type,
      applicationAccountId: entity.applicationAccountId,
      isOwnerEditable: entity.isOwnerEditable,
      isPubliclyVisible: entity.isPubliclyVisible,
      config: entity.config,
      defaultValue: entity.defaultValue,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
