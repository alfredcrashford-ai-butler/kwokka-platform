import type { CardConfig } from './card-config';
import type { CardEffectId } from './card-effect-id';
import type { CardId } from './card-id';

export interface EffectState<T = any> {
  id: CardEffectId;
  data: T;
}

export interface CardState {
  cardInGameId: string;
  cardId: CardId;
  config: CardConfig;
  effects: EffectState[];
}
