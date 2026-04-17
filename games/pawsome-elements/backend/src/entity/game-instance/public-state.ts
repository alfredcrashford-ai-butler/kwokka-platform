import { InteractionState } from './interaction-state';
import { PauseState } from './pause-state';
import { SkillState } from './skill-state';
import { CardState } from '../card';

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
