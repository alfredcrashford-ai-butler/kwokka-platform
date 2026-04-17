import type { InteractionState } from './interaction-state';
import type { PauseState } from './pause-state';
import type { SkillState } from './skill-state';
import type { CardState } from '../card';

export interface PublicState<T = any> {
  discardPile: CardState[];
  pileCardCount: number;
  turnEndAt: number;
  currentTurnPlayerId: string;
  playerCardCount: { [playerId: string]: number };
  interaction: InteractionState;
  cardSetState?: T;
  skills: SkillState;
  pause?: PauseState;
}
