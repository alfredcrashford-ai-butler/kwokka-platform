import type { CardState } from '@/game-data/card';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { ArenaItemKey, CardBackItemKey, CardSkinItemKey } from '@/game-data/item-key';

export interface PwsmGameConfig {
  items: {
    arena: ArenaItemKey;
    cardBack: CardBackItemKey;
    cardSkins: CardSkinItemKey[];
  };
  gameInstance: PwsmGameInstanceEntity;
  turnDuration: number;
  translations: any;
  playerId: string;
  onCardPlay: (cardState: CardState) => any;
  onInteract: (data: any) => any;
  onSkillPlay: (data: any) => any;
  onCardDraw: () => any;
  onCardStateChange: (oldState: CardState, newState: CardState) => any;
  onSkillClick: () => any;
  onSkillPlayed: () => any;
  onReady: () => any;
  onCardPlayed: () => any;
  onSkipTurn: () => any;
  onSkillPlayCancel: () => any;
}
