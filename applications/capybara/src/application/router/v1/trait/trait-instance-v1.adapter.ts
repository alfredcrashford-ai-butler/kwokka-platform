import { TraitInstanceEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class TraitInstanceV1Adapter extends Adapter<TraitInstanceEntity> {
  public override deserialize(dto: PublicProps<TraitInstanceEntity>): TraitInstanceEntity {
    return new TraitInstanceEntity({
      id: dto.id,
      accountId: dto.accountId,
      traitId: dto.traitId,
      value: dto.value,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: TraitInstanceEntity): PublicProps<TraitInstanceEntity> {
    return {
      id: entity.id,
      accountId: entity.accountId,
      traitId: entity.traitId,
      value: entity.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
