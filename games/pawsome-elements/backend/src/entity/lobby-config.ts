import { CardSet } from './card';

export interface PwsmLobbyConfig {
  startCardsCount: number;
  essence: {
    base: number;
    multipliers: number[];
  };
}

export interface RankedLobbyConfig extends PwsmLobbyConfig {
  cardSet: CardSet;
  rating: {
    reward: number[];
    softCap: number;
    hardCap: number;
    hardCapMultiplier: number;
    cardPenalty: number;
    leavePenalty: number;
  };
}
