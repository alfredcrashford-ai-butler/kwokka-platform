import type { CardState } from '@/game-data/card';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { Card } from '../card';
import { Fan } from './fan';

export class CardFan extends Fan<Card> {
  public constructor(
    public readonly scene: PwsmPlayableScene,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
  }

  public setCards(cards: CardState[]): void {
    const newCardsIds = cards.map((el) => el.cardInGameId);
    const oldCardsIds = this.cards.map((el) => el.cardState.cardInGameId);

    // step 1: discard cards
    const discardCardsIds = oldCardsIds.filter((id) => !newCardsIds.includes(id));
    discardCardsIds.forEach((id) => this.discardCard(id));

    // step 2: add cards
    const addCardsIds = newCardsIds.filter((id) => !oldCardsIds.includes(id));
    const addCards = addCardsIds.map((id) => cards.find((el) => el.cardInGameId === id));
    addCards.forEach((card) => this.addCard(this.createCard(card)));
    if (oldCardsIds.length && newCardsIds.length !== oldCardsIds.length && addCardsIds.length) {
      this.cardDrawIndicator.show(`+${addCardsIds.length}`, PwsmGameConstants.Fan.CardDrawIndicatorTransformY);
    }

    // step 3: update cards states
    cards.forEach((card) =>
      this.cards.find((el) => el.cardState.cardInGameId === card.cardInGameId).setCardState(card),
    );

    // step 4: tween card positions
    if (addCardsIds.length || discardCardsIds.length) {
      this.repositionCards();
    }
  }

  private createCard(cardState: CardState): Card {
    const card = new Card(this.scene, 0, 0, cardState);
    card.setPosition(this.cardStartPosition.x, this.cardStartPosition.y);
    this.setCardInteractive(card);
    return card;
  }

  private discardCard(id: string): void {
    const card = this.cards.find((el) => el.cardState.cardInGameId === id);
    this.cards = this.cards.filter((el) => el.cardState.cardInGameId !== id);
    this.tweenDiscardCard(card);
  }
}
