import { CardEffectId, CardState, EffectState } from '../card';
import { drawCardsFromPile } from '../draw-cards-from-pile';
import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { CardEffect } from './card-effect';

export class CardBurnEffect extends CardEffect {
  private static readonly CARDS_TO_DRAW = 2;

  public static apply(card: CardState): void {
    const effect = { id: CardEffectId.Burn, data: null };
    card.effects = [...(card.effects || []), effect];
  }

  public onPlay(game: PwsmGameInstanceEntity, effect: EffectState, playerId: string, card: CardState): void {
    drawCardsFromPile(game.state, playerId, CardBurnEffect.CARDS_TO_DRAW);
    card.effects = card.effects.filter((el) => el !== effect);
  }
}
