import type { DecorationEntityType } from '@kwokka/entities';
import { PawsomeElementsCardSet } from './card-set';

export interface ProfileConfig {
  name: string;
  decorations: { [type in DecorationEntityType]: string };
}

export interface LobbyPlayer {
  id: string;
  isBot: boolean;
  config?: ProfileConfig;
}

export interface LobbySettings {
  turnDuration?: number;
  firstTurnDuration?: number;
  hydrantMaxDuration?: number;
  soundboardMaxDuration?: number;
  hostAccountId: string;
  startCardsCount: number;
  cardSet: PawsomeElementsCardSet;
  players: LobbyPlayer[];
  visibility?: 'public' | 'private';
  name?: string;
  rating?: {
    players: Record<string, number>;
    average: number;
    reward: number;
    penalty: number;
    softCap: number;
    hardCap: number;
    hardCapMultiplier: number;
    cardPenalty: number;
    leavePenalty: number;
  };
}
