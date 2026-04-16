import { AccessRightEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';

export class AccessRightV1Adapter extends Adapter<AccessRightEntity> {
  public override deserialize(dto: PublicProps<AccessRightEntity>): AccessRightEntity {
    return new AccessRightEntity({
      id: dto.id,
      name: dto.name,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: AccessRightEntity): PublicProps<AccessRightEntity> {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
