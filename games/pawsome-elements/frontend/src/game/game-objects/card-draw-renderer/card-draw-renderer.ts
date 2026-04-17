import { GameObjects, Tweens } from 'phaser';
import type { PwsmPlayableScene } from '@/game/scenes';
import type { PublicState, PwsmGameInstanceEntity } from '@/game-data/game-instance';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { EventKey } from '@/game/event-key';
import type { Resizable } from '../resizable';
import type { Stateful } from '../stateful';
import { CardBack } from '../card-back';

// TODO: take scale of original objects into account
type CardToTween = { from: { x: number; y: number }; to: { x: number; y: number } };

export class CardDrawRenderer extends GameObjects.Container implements Resizable, Stateful {
  private gameInstance: PwsmGameInstanceEntity;
  private tweens: Tweens.Tween[] = [];

  public constructor(public scene: PwsmPlayableScene) {
    super(scene, scene.width / 2, scene.height / 2);

    this.onResize();
  }

  public onResize(): void {
    this.scene.removeTweens(this.tweens);
    this.removeAll(true);

    this.setPosition(this.scene.width / 2, this.scene.height / 2);
    this.setSize(this.scene.width, this.scene.height);
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    if (!this.gameInstance) {
      this.gameInstance = gameInstance;
      return;
    }

    const cards = this.getCardsToTween(this.gameInstance.state.publicState, gameInstance.state.publicState);
    this.tweenCardDraws(cards);

    this.gameInstance = gameInstance;
  }

  private getCardsToTween(before: PublicState, after: PublicState): CardToTween[] {
    const result = [];
    const discardPilePosition = this.scene.getDiscardPilePosition();
    const deckPosition = this.scene.getDeckPosition();
    const playersPositions = this.scene.getPlayersPositions();

    // from player to discard pile
    Object.keys(after.playerCardCount).forEach((playerId) => {
      const afterCount = after.playerCardCount[playerId];
      const beforeCount = before.playerCardCount[playerId];
      if (afterCount < beforeCount) {
        const pos = playersPositions[playerId];
        const newCardsInDiscardPile = Math.max(after.discardPile.length - before.discardPile.length, 0);
        const cardsPlayedByPlayer = Math.max(beforeCount - afterCount, 0);
        const cardsCount = Math.min(
          cardsPlayedByPlayer,
          newCardsInDiscardPile,
          PwsmGameConstants.DrawRenderer.DirectionMaxCards,
        );
        result.push(...Array(cardsCount).fill({ from: pos, to: discardPilePosition }));
      }
    });

    // from player to deck
    if (after.pileCardCount > before.pileCardCount) {
      Object.keys(after.playerCardCount).forEach((playerId) => {
        const afterCount = after.playerCardCount[playerId];
        const beforeCount = before.playerCardCount[playerId];
        if (afterCount < beforeCount) {
          const pos = playersPositions[playerId];
          const cardsCount = Math.min(beforeCount - afterCount, PwsmGameConstants.DrawRenderer.DirectionMaxCards);
          result.push(...Array(cardsCount).fill({ from: pos, to: deckPosition }));
        }
      });
    }

    // from discard pile to deck
    if (before.discardPile.length > after.discardPile.length && after.pileCardCount > before.pileCardCount) {
      const cardsCount = Math.min(
        after.pileCardCount - before.pileCardCount,
        PwsmGameConstants.DrawRenderer.DirectionMaxCards,
      );
      result.push(...Array(cardsCount).fill({ from: discardPilePosition, to: deckPosition }));
    }

    // from discard pile to player
    Object.keys(after.playerCardCount).forEach((playerId) => {
      const afterCount = after.playerCardCount[playerId];
      const beforeCount = before.playerCardCount[playerId];
      if (afterCount > beforeCount && after.discardPile.length < before.discardPile.length) {
        const pos = playersPositions[playerId];
        const cardsCount = Math.min(afterCount - beforeCount, PwsmGameConstants.DrawRenderer.DirectionMaxCards);
        result.push(...Array(cardsCount).fill({ from: discardPilePosition, to: pos }));
      }
    });

    // from deck to player
    Object.keys(after.playerCardCount).forEach((playerId) => {
      const afterCount = after.playerCardCount[playerId];
      const beforeCount = before.playerCardCount[playerId];
      if (afterCount > beforeCount && after.pileCardCount < before.pileCardCount) {
        const pos = playersPositions[playerId];
        const cardsCount = Math.min(afterCount - beforeCount, PwsmGameConstants.DrawRenderer.DirectionMaxCards);
        result.push(...Array(cardsCount).fill({ from: deckPosition, to: pos }));
      }
    });

    return result;
  }

  private tweenCardDraws(cardsToTween: CardToTween[]): void {
    this.tweens = cardsToTween.map((el, i) => this.tweenCardDraw(el, i * PwsmGameConstants.DrawRenderer.Delay));
  }

  private tweenCardDraw(cardToTween: CardToTween, delay: number): Tweens.Tween {
    const cardBack = new CardBack(this.scene, cardToTween.from.x, cardToTween.from.y);
    const sceneWidth = this.scene.width;
    const sceneHeight = this.scene.height;
    cardBack.alpha = 0;
    const width = this.scene.isLandscape
      ? this.scene.width * PwsmGameConstants.DrawRenderer.CardScale
      : this.scene.height * PwsmGameConstants.DrawRenderer.CardScale * PwsmGameConstants.Card.AspectRatio;
    const height = this.scene.isPortrait
      ? this.scene.height * PwsmGameConstants.DrawRenderer.CardScale
      : (this.scene.width * PwsmGameConstants.DrawRenderer.CardScale) / PwsmGameConstants.Card.AspectRatio;
    cardBack.setDisplaySize(width, height);
    cardBack.setOrigin(0.5);
    const u = PwsmGameConstants.DrawRenderer.AlphaUpThreshold;
    const d = PwsmGameConstants.DrawRenderer.AlphaDownThreshold;
    const r = PwsmGameConstants.DrawRenderer.Rotation;
    return this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      delay,
      duration: PwsmGameConstants.DrawRenderer.Duration,
      ease: PwsmGameConstants.DrawRenderer.Ease,
      onUpdate: (tween: Tweens.Tween) => {
        const v = tween.getValue();
        if (v < u) {
          cardBack.alpha = v / u;
        } else if (v > d) {
          cardBack.alpha = 1 - (v - d) / (1 - d);
        } else if (cardBack.alpha !== 1) {
          cardBack.alpha = 1;
        }

        cardBack.x = -sceneWidth / 2 + cardToTween.from.x + (cardToTween.to.x - cardToTween.from.x) * v;
        cardBack.y = -sceneHeight / 2 + cardToTween.from.y + (cardToTween.to.y - cardToTween.from.y) * v;

        cardBack.angle = v * r;
      },
      onStart: () => {
        this.add(cardBack);
        this.scene.eventBus.emit(EventKey.OuterCardDraw);
      },
      onComplete: (tween: Tweens.Tween) => {
        this.remove(cardBack, true);
        this.tweens = this.tweens.filter((el) => el !== tween);
      },
    });
  }
}
