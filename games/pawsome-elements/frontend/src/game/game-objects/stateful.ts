import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';

export interface Stateful {
  setGameState(gameInstance: PwsmGameInstanceEntity): void;
}
