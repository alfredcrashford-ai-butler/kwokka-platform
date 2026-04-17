import { Resource } from '@/game/resource';
import { Arena } from './arena';

export class LoneMountainArena extends Arena {
  protected override get tableResourceKey(): string {
    return Resource.GameTable.Arena.LoneMountain.Table;
  }

  protected override get backgroundResourceKey(): string {
    return Resource.GameTable.Arena.LoneMountain.Background;
  }
}
