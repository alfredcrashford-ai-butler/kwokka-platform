import type { CardId } from '../card';

export type SelectionInteractionState<Option = any, Selection = any> = {
  playerId: string;
  options: Option[];
  selection: Selection;
};

export type CompetitiveInteractionState = { [id in string]: boolean };

export type PlayerSelectionInteractionState = { playerId: string; targetPlayerId: string };

export interface InteractionState {
  startedBy: string;
  cardId: CardId;
  state: CompetitiveInteractionState | SelectionInteractionState | PlayerSelectionInteractionState;
}
