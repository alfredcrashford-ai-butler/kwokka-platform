import { LobbyEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import type { Dto } from '@/api/dto';

export class LobbyApiAdapter extends Adapter<LobbyEntity, Dto<LobbyEntity>> {
  public deserialize(dto: Dto<LobbyEntity>): LobbyEntity {
    return new LobbyEntity({
      id: dto.id,
      key: dto.key,
      gameId: dto.gameId,
      minPlayers: dto.minPlayers,
      maxPlayers: dto.maxPlayers,
      config: dto.config,
      availableSince: dto.availableSince ? new Date(dto.availableSince) : undefined,
      availableTill: dto.availableTill ? new Date(dto.availableTill) : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  public serialize(entity: LobbyEntity): Dto<LobbyEntity> {
    return {
      id: entity.id,
      key: entity.key,
      gameId: entity.gameId,
      minPlayers: entity.minPlayers,
      maxPlayers: entity.maxPlayers,
      config: entity.config,
      availableSince: entity.availableSince,
      availableTill: entity.availableTill,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
