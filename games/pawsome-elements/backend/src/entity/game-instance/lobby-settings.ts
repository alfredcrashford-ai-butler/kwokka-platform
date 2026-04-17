import { DecorationEntityType } from '@kwokka/entities';
import { CardSet } from '../card';

export interface ProfileConfig {
  name: string;
  decorations: { [type in DecorationEntityType]: string };
}

export interface LobbyPlayer {
  id: string;
  isBot: boolean;
  config?: ProfileConfig;
}

export interface EssenceRewardConfig {
  base: number;
  multipliers: number[];
}

export interface RatingRewardConfig {
  players: Record<string, number>;
  average: number;
  reward: number[];
  softCap: number;
  hardCap: number;
  hardCapMultiplier: number;
  cardPenalty: number;
  leavePenalty: number;
}

export interface LobbySettings {
  turnDuration?: number;
  firstTurnDuration?: number;
  hydrantMaxDuration?: number;
  soundboardMaxDuration?: number;
  hostAccountId: string;
  startCardsCount: number;
  cardSet: CardSet;
  players: LobbyPlayer[];
  visibility?: 'public' | 'private';
  name?: string;
  essence: EssenceRewardConfig;
  rating?: RatingRewardConfig;
}
