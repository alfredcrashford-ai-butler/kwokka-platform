import { Resource } from '@/game/resource';
import { Arena } from './arena';

export class LabArena extends Arena {
  protected override get tableResourceKey(): string {
    return Resource.GameTable.Arena.Lab.Table;
  }

  protected override get backgroundResourceKey(): string {
    return Resource.GameTable.Arena.Lab.Background;
  }
}
