import { GameObjects, Input, Time, Tweens } from 'phaser';
import { NumberUtil } from '@kwokka/utils';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PhaserInputEvent } from '@/game/phaser';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import type { Card } from '../card';
import { CardBack } from '../card-back';
import { CardDrawIndicator } from '../card-draw-indicator';

type CardAndPosition<T> = { card: T; x: number; y: number; angle: number; scale: number };

export class Fan<T extends Card | CardBack> extends GameObjects.Container {
  public static readonly Events = {
    CardClick: 'card_click',
    CardDragStart: 'card_drag_start',
    CardDragEnd: 'card_drag_end',
    DropZoneCardLeave: 'drop_zone_card_leave',
    DropZoneCardDrop: 'drop_zone_card_drop',
    DropZoneCardEnter: 'drop_zone_card_enter',
    CardSelected: 'card_selected',
  };

  protected cards: T[] = [];
  protected tweens: Tweens.Tween[] = [];
  protected hoveredCard: T;
  protected draggedCard: T;
  protected isDraggable: boolean = false;
  protected isHoverable: boolean = false;
  protected isSelectable: boolean = false;
  protected dragLocked: boolean = true;
  protected dragLockTimeout: Time.TimerEvent;
  protected cardDrawIndicator: CardDrawIndicator;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    this.setAspectRatio(PwsmGameConstants.Fan.AspectRatio);

    this.cardDrawIndicator = new CardDrawIndicator(
      this.scene,
      this.width * PwsmGameConstants.CardDrawIndicator.TransformX,
      this.height * PwsmGameConstants.CardDrawIndicator.TransformY,
    );
    this.add(this.cardDrawIndicator);
  }

  public setCardsDraggable(isDraggable: boolean): void {
    if (this.isDraggable !== isDraggable && !isDraggable) {
      this.draggedCard = null;
      this.repositionCards();
    }

    this.isDraggable = isDraggable;
  }

  public setCardsHoverable(isHoverable: boolean): void {
    if (this.isHoverable !== isHoverable && !isHoverable) {
      this.hoveredCard = null;
      this.repositionCards();
    }

    this.isHoverable = isHoverable;
  }

  public setCardsSelectable(isSelectable: boolean): void {
    this.isSelectable = isSelectable;
  }

  public setAspectRatio(ratio: number): void {
    const width = PwsmGameConstants.Fan.Width;
    const height = width / ratio;
    this.setSize(width, height);

    this.repositionCards();
  }

  public setCardDrawIndicatorFontSize(size: number): void {
    this.cardDrawIndicator.setFontSize(size);
  }

  protected repositionCards(): void {
    this.cards.forEach((el) => this.setCardSize(el));
    this.tweenCardsPositions();

    this.bringToTop(this.cardDrawIndicator);
  }

  protected tweenCardsPositions(): void {
    // Step 1: calculate positions
    const cardsAndPositions = this.calculatePositions();

    // Step 2: stop old tweens
    this.stopTweens();

    // Step 3: tween
    this.tweens = cardsAndPositions.map((el) => this.tweenCardPosition(el));
  }

  protected tweenCardPosition(el: CardAndPosition<T>): Tweens.Tween {
    if (el.card === this.draggedCard) {
      return;
    }

    const tween = this.scene.add.tween({
      targets: el.card,
      x: el.x,
      y: el.y,
      angle: el.angle,
      scale: `*=${el.scale}`,
      duration: PwsmGameConstants.Fan.CardTweenDuration,
      ease: PwsmGameConstants.Fan.CardTweenEase,
      onComplete: () => {
        this.scene.removeTweens(tween);
        this.tweens.filter((el) => el !== tween);
      },
    });
    return tween;
  }

  protected calculatePositions(): CardAndPosition<T>[] {
    return this.cards.map((card, i) => ({
      card,
      x: this.getCardX(i),
      y: this.getCardY(i),
      angle: this.getCardAngle(i),
      scale: this.getCardScale(i),
    }));
  }

  protected getCardX(i: number): number {
    if (this.cards.length === 1) {
      return 0;
    }

    const width = Math.min(this.width, this.cardSize.width * this.cards.length);
    const leftX = -width / 2 + this.cardSize.width / 2;
    const rightX = width / 2 - this.cardSize.width / 2;
    const maxIndex = this.cards.length - 1;

    let x = NumberUtil.minmax(i, 0, maxIndex, leftX, rightX);

    if (this.hoveredCard && this.hoveredCard !== this.cards[i]) {
      const push = PwsmGameConstants.Fan.HoverHorizontalPushFactor * this.cardSize.width;
      const hoveredCardIndex = this.cards.indexOf(this.hoveredCard);
      x += i > hoveredCardIndex ? push : -push;
    }

    return x;
  }

  protected getCardY(i: number): number {
    const maxIndex = this.cards.length - 1;
    const middleIndex = maxIndex / 2;
    const indexDistance = Math.abs(i - middleIndex);
    const multiply = this.cards.length === 1 ? 1 : NumberUtil.minmax(indexDistance, 0, middleIndex, 1, 0);

    let y = PwsmGameConstants.Fan.VerticalPushFactor * this.cardSize.height * multiply;
    if (this.cards.length <= PwsmGameConstants.Fan.AdditionalVerticalPushThreshold) {
      y += PwsmGameConstants.Fan.AdditionalVerticalPushFactor * this.cardSize.height;
    }

    if (this.hoveredCard && this.hoveredCard === this.cards[i]) {
      y += PwsmGameConstants.Fan.HoverVerticalPushFactor * this.cardSize.height;
    }

    return y;
  }

  protected getCardAngle(i: number): number {
    if (this.cards.length === 1) {
      return 0;
    }

    const maxIndex = this.cards.length - 1;
    const middleIndex = maxIndex / 2;
    const indexDistance = Math.abs(i - middleIndex);
    const multiply = NumberUtil.minmax(indexDistance, 0, middleIndex, 0, i > middleIndex ? 1 : -1);
    return PwsmGameConstants.Fan.RotateFactor * multiply;
  }

  protected getCardScale(i: number): number {
    if (this.draggedCard && this.draggedCard === this.cards[i]) {
      return PwsmGameConstants.Fan.DragScaleFactor;
    }

    if (this.hoveredCard && this.hoveredCard === this.cards[i]) {
      return PwsmGameConstants.Fan.HoverScaleFactor;
    }

    return 1;
  }

  protected stopTweens(): void {
    this.scene.removeTweens(this.tweens);
    this.tweens = [];
  }

  protected setCardSize(card: T): void {
    card.setDisplaySize(this.cardSize.width, this.cardSize.height);
  }

  protected addCard(card: T): void {
    this.cards.push(card);
    this.add(card);
  }

  protected get cardSize(): { width: number; height: number } {
    const height = this.height;
    const width = height * PwsmGameConstants.Card.AspectRatio;
    return { width, height };
  }

  protected get cardStartPosition(): { x: number; y: number } {
    return { x: this.width / 2 - this.cardSize.width / 2, y: 0 };
  }

  protected tweenDiscardCard(card: T): void {
    if (this.hoveredCard === card) {
      this.hoveredCard = null;
    }

    if (this.draggedCard === card) {
      this.draggedCard = null;
    }

    card.removeInteractive(true);
    card.setOutlined(true);
    this.scene.add.tween({
      targets: card,
      duration: PwsmGameConstants.Fan.DiscardCardTweenDuration,
      alpha: 0,
      scale: `*=${PwsmGameConstants.Fan.DiscardCardTweenScale}`,
      ease: PwsmGameConstants.Fan.DiscardCardTweenEase,
      onComplete: () => this.remove(card, true),
    });
  }

  protected setCardInteractive(card: T): void {
    card.on(PhaserInputEvent.DragStart, () => this.onCardDragStart(card));
    card.on(PhaserInputEvent.PointerOver, () => this.onCardPointerOver(card));
    card.on(PhaserInputEvent.PointerOut, () => this.onCardPointerOut(card));
    card.on(PhaserInputEvent.Drag, (pointer) => this.onCardDrag(card, pointer));
    card.on(PhaserInputEvent.DragEnd, () => this.onCardDragEnd(card));
    card.on(PhaserInputEvent.Drop, (_, zone: GameObjects.Zone) => this.onCardDrop(card, zone));
    card.on(PhaserInputEvent.DragEnter, (_, zone: GameObjects.Zone) => this.onCardDragEnter(card, zone));
    card.on(PhaserInputEvent.DragLeave, (_, zone: GameObjects.Zone) => this.onCardDragLeave(card, zone));

    this.scene.input.setDraggable(card);
  }

  private onCardDragStart(card: T): void {
    if (!this.isDraggable) {
      return;
    }

    this.dragLocked = true;
    this.draggedCard = card;
    this.dragLockTimeout = this.scene.time.addEvent({
      delay: PwsmGameConstants.Fan.DragLockDelay,
      callback: () => {
        if (card) {
          this.dragLocked = false;
          this.emit(Fan.Events.CardDragStart, card);
          const scale = this.hoveredCard === card ? card.scale / PwsmGameConstants.Fan.HoverScaleFactor : card.scale;
          card.scale = scale * PwsmGameConstants.Fan.DragScaleFactor;
          if (card.input) {
            card.input.cursor = 'grabbing';
          }
        }
      },
    });
  }

  private onCardPointerOver(card: T): void {
    if (this.draggedCard) {
      return;
    }

    if (this.hoveredCard === card) {
      return;
    }

    this.hoveredCard = card;
    card.input.cursor = 'pointer';
    card.setOutlined(true);
    this.repositionCards();
  }

  private onCardPointerOut(card: T): void {
    if (this.draggedCard) {
      return;
    }

    card.input.cursor = 'pointer';
    card.setOutlined(false);
    if (this.hoveredCard === card) {
      this.hoveredCard = null;
      this.repositionCards();
    }
  }

  private onCardDrag(card: T, pointer: Input.Pointer): void {
    if (!this.isDraggable) {
      return;
    }

    if (!card) {
      return;
    }

    if (this.dragLocked) {
      return;
    }

    const point = card.getWorldPoint();
    card.x += pointer.x - point.x;
    card.y += pointer.y - point.y;
    card.angle = 0;
  }

  private onCardDragEnd(card: T): void {
    this.draggedCard = null;

    if (this.isSelectable && this.dragLocked) {
      // handle click click
      this.dragLockTimeout?.remove();
      delete this.dragLockTimeout;
      this.emit(Fan.Events.CardSelected, card);
      return;
    }

    if (this.isDraggable && !this.dragLocked) {
      // handle drag drag
      this.hoveredCard = null;
      this.emit(Fan.Events.CardDragEnd, card);
      this.repositionCards();
      return;
    }
  }

  private onCardDrop(card: T, zone: GameObjects.Zone): void {
    if (!this.isDraggable) {
      return;
    }

    if (zone.name === PwsmGameConstants.GameObjectName.TableDropZone) {
      this.emit(Fan.Events.DropZoneCardDrop, card);
    }
  }

  private onCardDragEnter(card: T, zone: GameObjects.Zone): void {
    if (!this.isDraggable) {
      return;
    }

    if (zone.name === PwsmGameConstants.GameObjectName.TableDropZone) {
      this.emit(Fan.Events.DropZoneCardEnter, card);
    }
  }

  private onCardDragLeave(card: T, zone: GameObjects.Zone): void {
    if (!this.isDraggable) {
      return;
    }

    if (zone.name === PwsmGameConstants.GameObjectName.TableDropZone) {
      this.emit(Fan.Events.DropZoneCardLeave, card);
    }
  }
}
