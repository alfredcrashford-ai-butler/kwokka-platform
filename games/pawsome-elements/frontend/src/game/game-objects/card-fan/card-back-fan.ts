import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { CardBack } from '../card-back';
import { Fan } from './fan';

export class CardBackFan extends Fan<CardBack> {
  public constructor(
    public readonly scene: PwsmPlayableScene,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
  }

  public setCards(n: number): void {
    if (this.cards.length === n) {
      return;
    }

    if (this.cards.length < n) {
      const count = n - this.cards.length;

      if (this.cards.length) {
        this.cardDrawIndicator.show(`+${count}`, PwsmGameConstants.Fan.CardDrawIndicatorTransformY);
      }

      Array(count)
        .fill(null)
        .map(() => new CardBack(this.scene, 0, 0))
        .forEach((card) => this.addCard(card));
    }

    if (this.cards.length > n) {
      const count = this.cards.length - n;
      this.discardCards(count, n);
    }

    this.repositionCards();
  }

  protected discardCard(index: number): void {
    const card = this.cards[index];
    this.cards = this.cards.filter((_, i) => i !== index);
    this.tweenDiscardCard(card);
  }

  private discardCards(count: number, n: number): void {
    Array(count)
      .fill(null)
      .forEach(() => this.discardCard(Math.ceil((n - 1) / 2)));
  }
}
