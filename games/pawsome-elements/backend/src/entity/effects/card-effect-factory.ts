import { CardEffectId } from '../card';
import { CardBurnEffect } from './card-burn-effect';
import { CardEffect } from './card-effect';
import { CardTransformEffect } from './card-transform-effect';

export class CardEffectFactory {
  public static getCardEffect(effectId: CardEffectId): CardEffect {
    switch (effectId) {
      case CardEffectId.Transform:
        return new CardTransformEffect();
      case CardEffectId.Burn:
        return new CardBurnEffect();
      default:
        throw new Error(`No effect found for effectId: ${effectId}`);
    }
  }
}
