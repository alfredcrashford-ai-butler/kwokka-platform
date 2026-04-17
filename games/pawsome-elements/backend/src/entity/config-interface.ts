import { CardId, CardConfig, CardSet } from './card';

export interface CardSetConfig {
  count: number;
}

export interface PawsomeElementsConfigInterface {
  turnDuration: number;
  skillCooldownTurns: number;
  firstTurnDuration: number;
  hydrantMaxDuration: number;
  soundboardMaxDuration: number;
  tambourineMaxDuration: number;
  lesserRitualMaxDuration: number;
  ballOfFortuneMaxDuration: number;
  peacePipeMaxDuration: number;
  startCardsCount: number;
  fireTotemMaxDuration: number;
  waterTotemMaxDuration: number;
  spiritTotemMaxDuration: number;
  botMinTurnDurationMultiplier: number;
  botMaxTurnDurationMultiplier: number;
  botMinOutOfTurnDurationMultiplier: number;
  botMaxOutOfTurnDurationMultiplier: number;
  botMinInteractionDurationMultiplier: number;
  botMaxInteractionDurationMultiplier: number;
  botRandomDelayChance: number;
  botSpellUseChance: number;
  cards: { [id in CardId]: CardConfig };
  cardSets: { [id in CardSet]: { [id in CardId]?: CardSetConfig } };
}
