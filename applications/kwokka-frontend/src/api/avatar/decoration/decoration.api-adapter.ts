import { DecorationEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class DecorationApiAdapter extends Adapter<DecorationEntity, Dto<DecorationEntity>> {
  public deserialize(dto: Dto<DecorationEntity>): DecorationEntity {
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

  public serialize(entity: DecorationEntity): Dto<DecorationEntity> {
    return {
      id: entity.id,
      applicationAccountId: entity.applicationAccountId,
      key: entity.key,
      type: entity.type,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
