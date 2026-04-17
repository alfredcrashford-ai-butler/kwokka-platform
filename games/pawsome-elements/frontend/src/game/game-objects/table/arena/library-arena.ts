import { Resource } from '@/game/resource';
import { Arena } from './arena';

export class LibraryArena extends Arena {
  protected override get tableResourceKey(): string {
    return Resource.GameTable.Arena.Library.Table;
  }

  protected override get backgroundResourceKey(): string {
    return Resource.GameTable.Arena.Library.Background;
  }
}
