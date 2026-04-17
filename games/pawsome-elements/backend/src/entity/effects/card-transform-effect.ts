import { CardId, CardState, CardEffectId, EffectState } from '../card';
import { PawsomeElementsConfig } from '../config';
import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { CardEffect } from './card-effect';

interface TransformEffectData {
  originalCardId: CardId;
}

export class CardTransformEffect extends CardEffect {
  public static apply(card: CardState, targetCardId: CardId): void {
    const effect = { id: CardEffectId.Transform, data: { originalCardId: card.cardId } };
    card.effects = [...card.effects, effect];
    card.cardId = targetCardId;
    card.config = PawsomeElementsConfig.cards[targetCardId];
  }

  public onShuffle(game: PwsmGameInstanceEntity, effect: EffectState<TransformEffectData>, card: CardState): void {
    card.cardId = effect.data.originalCardId;
    card.config = PawsomeElementsConfig.cards[effect.data.originalCardId];
    super.onShuffle(game, effect, card);
  }
}
