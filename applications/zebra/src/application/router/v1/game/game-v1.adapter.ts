import { GameEntity } from '@kwokka/entities';
import { Adapter, PublicProps } from '@kwokka/utils';
import { GameStats } from '../../../../usecase/game/get-game-stats.usecase';

export class GameV1Adapter extends Adapter<GameEntity> {
  public override deserialize(dto: PublicProps<GameEntity>): GameEntity {
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

  public serialize(entity: GameEntity): PublicProps<GameEntity> {
    return {
      id: entity.id,
      key: entity.key,
      applicationAccountId: entity.applicationAccountId,
      url: entity.url,
      tags: entity.tags,
      availableSince: entity.availableSince,
      availableTill: entity.availableTill,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  public serializeStats(entity: GameStats): GameStats {
    return {
      current: entity.current,
      periods: entity.periods,
    };
  }
}
