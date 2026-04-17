import { GameObjects, Tweens } from 'phaser';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import type { PwsmPlayableScene } from '@/game/scenes';
import { Resource } from '@/game/resource';
import { PhaserInputEvent } from '@/game/phaser';
import { EventKey } from '@/game/event-key';
import type { Stateful } from '../stateful';
import { CardBack } from '../card-back';
import { Tooltip } from '../tooltip';
import type { Translatable } from '../translatable';

export class CardDeck extends GameObjects.Container implements Stateful, Translatable {
  private deck: CardBack[] = [];
  private highlight: GameObjects.Image;
  private topCardSilhouette: GameObjects.Image;
  private bottomCardSilhouette: GameObjects.Image;
  private deckBottom: GameObjects.Image;
  private topCardGlow: GameObjects.Image;
  private topCardGlowTween: Tweens.Tween;
  private isClickable: boolean = false;
  private tooltip: Tooltip;

  public constructor(
    public override scene: PwsmPlayableScene,
    private readonly playerId: string,
  ) {
    super(scene, 0, 0);
    this.setSize(PwsmGameConstants.Table.DeckWidth, PwsmGameConstants.Table.DeckHeight);

    this.topCardSilhouette = this.createCardSilhouette();
    this.add(this.topCardSilhouette);

    this.bottomCardSilhouette = this.createCardSilhouette();
    this.add(this.bottomCardSilhouette);

    this.deckBottom = this.createDeckBottom();
    this.add(this.deckBottom);

    this.highlight = this.createHighlight();
    this.add(this.highlight);

    this.topCardGlow = this.createTopCardGlow();
    this.add(this.topCardGlow);

    this.tooltip = new Tooltip(scene, PwsmGameConstants.Table.DeckTooltipConfig);
    this.tooltip.x = PwsmGameConstants.Table.DeckTooltipX;
    this.add(this.tooltip);

    this.setInteractive();
    this.on(PhaserInputEvent.PointerOver, () => this.onPointerOver());
    this.on(PhaserInputEvent.PointerOut, () => this.onPointerOut());
    this.on(PhaserInputEvent.PointerUp, () => this.onPointerUp());

    this.setupTooltipText();
    this.scene.eventBus.addListener(EventKey.SetTranslations, this.setTranslations);
  }

  public setTranslations = () => {
    this.setupTooltipText();
  };

  public override preDestroy(): void {
    this.scene.eventBus.removeListener(EventKey.SetTranslations, this.setTranslations);
    super.preDestroy();
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    this.setCardsAmount(gameInstance.state.publicState.pileCardCount);
    this.setClickable(gameInstance);
  }

  public setCardsAmount(n: number): void {
    const cardsToDisplay = Math.ceil(n / PwsmGameConstants.Table.DeckCardPerVisualCard);
    if (cardsToDisplay > this.deck.length) {
      const newCards = Array(cardsToDisplay - this.deck.length)
        .fill(null)
        .map(() => new CardBack(this.scene, 0, 0));
      this.deck.push(...newCards);
      this.deck.forEach((el) =>
        el.setDisplaySize(PwsmGameConstants.Table.DeckWidth, PwsmGameConstants.Table.DeckHeight),
      );
      this.deck.forEach((el, i) => (el.x = i * PwsmGameConstants.Table.DeckCardOffset));
      this.add(newCards);
    }

    if (cardsToDisplay < this.deck.length) {
      const cardsToDiscard = this.deck.length - cardsToDisplay;
      const oldCards = this.deck.slice(-cardsToDiscard);
      this.deck = this.deck.slice(0, cardsToDisplay);
      this.remove(oldCards, true);
    }

    if (this.deck.length) {
      const lastCard = this.deck[this.deck.length - 1];
      this.moveAbove(this.highlight, lastCard);
      this.moveAbove(this.topCardGlow, lastCard);
      this.topCardSilhouette.setPosition(lastCard.x, lastCard.y);
      this.highlight.setPosition(lastCard.x, lastCard.y);
      this.topCardGlow.setPosition(lastCard.x, lastCard.y);
    } else {
      this.topCardSilhouette.setPosition(0, 0);
    }
    this.moveAbove<GameObjects.GameObject>(this.tooltip, this.topCardGlow);
  }

  private setClickable(gameInstance: PwsmGameInstanceEntity): void {
    const isClickable = gameInstance.canPlayerSkipTurn(this.playerId);

    if (isClickable === this.isClickable) {
      return;
    }

    this.isClickable = isClickable;
    this.scene.removeTweens(this.topCardGlowTween);
    if (isClickable) {
      this.input.cursor = PwsmGameConstants.Table.DeckCursor;
      this.topCardGlowTween = this.scene.tweens.addCounter({
        from: 0,
        to: PwsmGameConstants.Table.DeckGlowTweenAlpha,
        ease: PwsmGameConstants.Table.DeckGlowTweenEase,
        duration: PwsmGameConstants.Table.DeckGlowTweenDuration,
        yoyo: true,
        loop: -1,
        onUpdate: (tween) => (this.topCardGlow.alpha = tween.getValue()),
      });
    } else {
      this.setHighlighted(false);
      this.setTooltipShown(false);
      this.input.cursor = 'default';
      this.topCardGlowTween = this.scene.add.tween({
        targets: this.topCardGlow,
        alpha: 0,
        duration: PwsmGameConstants.Table.DeckGlowTweenDuration,
        ease: PwsmGameConstants.Table.DeckGlowTweenEase,
      });
    }
  }

  private createCardSilhouette(): GameObjects.Image {
    const silhouette = new GameObjects.Image(this.scene, 0, 0, Resource.Card.BackSilhouette);
    silhouette.alpha = 0;
    silhouette.setDisplaySize(
      PwsmGameConstants.Table.DeckWidth + PwsmGameConstants.Table.DeckSilhouetteOffset,
      PwsmGameConstants.Table.DeckHeight + PwsmGameConstants.Table.DeckSilhouetteOffset,
    );
    return silhouette;
  }

  private createDeckBottom(): GameObjects.Image {
    const deckBottom = new GameObjects.Image(this.scene, 0, 0, Resource.GameTable.DeckBottom);
    deckBottom.setDisplaySize(PwsmGameConstants.Table.DeckWidth, PwsmGameConstants.Table.DeckHeight);
    return deckBottom;
  }

  private createTopCardGlow(): GameObjects.Image {
    const topCardGlow = new GameObjects.Image(this.scene, 0, 0, Resource.Card.BackGlow);
    topCardGlow.alpha = 0;
    topCardGlow.setDisplaySize(
      PwsmGameConstants.Table.DeckTopCardGlowWidth,
      PwsmGameConstants.Table.DeckTopCardGlowHeight,
    );
    return topCardGlow;
  }

  private createHighlight(): GameObjects.Image {
    const highlight = new GameObjects.Image(this.scene, 0, 0, Resource.Misc.HighlightWhite);
    highlight.alpha = 0;
    highlight.setDisplaySize(PwsmGameConstants.Table.DeckHighlightWidth, PwsmGameConstants.Table.DeckHighlightHeight);
    return highlight;
  }

  private onPointerOver(): void {
    if (!this.isClickable) {
      return;
    }

    this.setHighlighted(true);
    this.setTooltipShown(true);
  }

  private onPointerOut(): void {
    this.setHighlighted(false);
    this.setTooltipShown(false);
  }

  private onPointerUp(): void {
    if (!this.isClickable) {
      return;
    }

    this.scene.eventBus.emit(EventKey.OuterSkipTurn);
  }

  private setHighlighted(isHighlighted: boolean): void {
    this.topCardSilhouette.alpha = isHighlighted ? 1 : 0;
    this.bottomCardSilhouette.alpha = isHighlighted ? 1 : 0;
    this.highlight.alpha = isHighlighted ? PwsmGameConstants.Table.DeckHighlightAlpha : 0;
  }

  private setTooltipShown(isShown: boolean): void {
    if (isShown) {
      this.setupTooltipText();
      this.tooltip.show();
    } else {
      this.tooltip.hide();
    }
  }

  private setupTooltipText(): void {
    const gameTranslations = this.scene.translations.game;
    this.tooltip.setText(this.deck.length ? gameTranslations.drawCard : gameTranslations.skipTurn);
  }
}
