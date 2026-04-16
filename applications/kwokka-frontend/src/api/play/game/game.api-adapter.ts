import { GameEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';
import type { GameStats } from './game.api';

export class GameApiAdapter extends Adapter<GameEntity, Dto<GameEntity>> {
  public deserialize(dto: Dto<GameEntity>): GameEntity {
    return new GameEntity({
      id: dto.id,
      key: dto.key,
      applicationAccountId: dto.applicationAccountId,
      url: dto.url,
      tags: dto.tags,
      availableSince: dto.availableSince ? new Date(dto.availableSince) : undefined,
      availableTill: dto.availableTill ? new Date(dto.availableTill) : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public deserializeGameStats(dto: GameStats): GameStats {
    return {
      ...dto,
      periods: dto.periods.map((period) => ({
        ...period,
        period: {
          from: period.period.from ? new Date(period.period.from) : undefined,
          to: period.period.to ? new Date(period.period.to) : undefined,
        },
      })),
    };
  }

  public serialize(entity: GameEntity): Dto<GameEntity> {
    return {
      id: entity.id,
      key: entity.key,
      applicationAccountId: entity.applicationAccountId,
      url: entity.url,
      tags: entity.tags,
      availableSince: entity.availableSince,
      availableTill: entity.availableTill,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
