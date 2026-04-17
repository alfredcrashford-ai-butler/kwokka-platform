import { GameObjects, Tweens } from 'phaser';
import { CardEffectId, type CardState } from '@/game-data/card';
import { Resource } from '@/game/resource';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { PhaserHook, PhaserInputEvent } from '@/game/phaser';
import { EventKey } from '@/game/event-key';
import { CardIdToCardSkins, CardSkinToResource } from './card-skin';
import { ElementToIconResource, ElementToStoneResource } from './card-element';
import { PwsmText } from '../pwsm-text';
import { CardIdToValueResource } from './card-value';
import { CardEffect } from './card-effect';
import type { Translatable } from '../translatable';

export class Card extends GameObjects.Container implements Translatable, PhaserHook.PreDestroy {
  private image: GameObjects.Image;
  private frame: GameObjects.Image;
  private stone: GameObjects.Image;
  private elementIcon: GameObjects.Image;
  private valueIcon: GameObjects.Image | PwsmText;
  private title: PwsmText;
  private caption: PwsmText;
  private effectsContainer: GameObjects.Container;
  private effects: CardEffect[];
  private tweens: (Tweens.Tween | Tweens.TweenChain)[] = [];
  private outline: GameObjects.Image;
  private highlight: GameObjects.Image;
  private interactionOverlays: GameObjects.Image[] = [];
  private interactionOverlaysTweens: Tweens.Tween[] = [];
  private isInteractionOverlayShown = false;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    x: number,
    y: number,
    public cardState: CardState,
  ) {
    super(scene, x, y);

    this.setSize(PwsmGameConstants.Card.Width, PwsmGameConstants.Card.Height);
    this.createCard();

    this.setInteractive({ draggable: true });

    this.on(PhaserInputEvent.PointerOver, () => this.setEffectsExpanded(true));
    this.on(PhaserInputEvent.PointerOut, () => this.setEffectsExpanded(false));

    this.scene.eventBus.addListener(EventKey.SetTranslations, this.setTranslations);
    this.scene.track(this.scene.getCardObjectKey(cardState.cardInGameId), this);
  }

  public override preDestroy(): void {
    this.scene.eventBus.removeListener(EventKey.SetTranslations, this.setTranslations);
    this.scene.untrack(this.scene.getCardObjectKey(this.cardState.cardInGameId), this);
    super.preDestroy();
  }

  public setTranslations = () => {
    this.title.text = this.getCardTitle();
    if (this.hasCaption && this.caption) {
      this.caption.text = this.getCardCaption();
    }
  };

  public setCardState(cardState: CardState): void {
    const oldElement = this.cardState.config.element;
    const oldCardId = this.cardState.cardId;
    const oldEffects = this.cardState.effects;
    this.cardState = cardState;
    const cardIdChanged = oldCardId !== this.cardState.cardId;
    const elementChanged = oldElement !== this.cardState.config.element;
    const effectsChanged = oldEffects?.length !== this.cardState.effects?.length;

    if (cardIdChanged || elementChanged || effectsChanged) {
      this.removeAll(true);
      this.scene.removeTweens(this.tweens);
      this.createCard();
      this.scene.eventBus.emit(EventKey.OuterCardStateChange, { old: this.cardState, new: cardState });

      this.tweens = [this.scene.tweenScale(this, PwsmGameConstants.Card.HighlightDuration), this.tweenHighlight()];
    }
  }

  public setOutlined(isOutlined: boolean): void {
    this.outline.alpha = isOutlined ? 1 : 0;
  }

  private createCard(): void {
    this.createOutline();
    this.createCardImage();
    this.createCardFrame();
    this.createCardElement();
    this.createCardValue();
    this.createCardText();
    this.createCardEffects();
    this.createHighlight();
    this.createInteractionOverlays();
  }

  private get imageKey(): string {
    return Resource.Card.Image[this.cardState.cardId];
  }

  private get frameKey(): string {
    const cardId = this.cardState.cardId;
    const skins = CardIdToCardSkins[cardId];
    const cardSkinKey = (this.scene.config.items.cardSkins || []).find((key) => skins.includes(key));
    return CardSkinToResource[cardSkinKey] || Resource.Card.Skin.Standard;
  }

  private get stoneKey(): string {
    return ElementToStoneResource[this.cardState.config.element];
  }

  private get elementIconKey(): string {
    return ElementToIconResource[this.cardState.config.element];
  }

  private get valueIconKey(): string {
    return CardIdToValueResource[this.cardState.cardId];
  }

  private tweenHighlight(): Tweens.Tween {
    return this.scene.add.tween({
      targets: this.highlight,
      alpha: PwsmGameConstants.Card.HighlightAlpha,
      yoyo: true,
      duration: PwsmGameConstants.Card.HighlightDuration,
      ease: PwsmGameConstants.Card.HighlightEase,
    });
  }

  private createCardImage(): void {
    this.image = new GameObjects.Image(
      this.scene,
      this.offsetedX(PwsmGameConstants.Card.ImageOffsetLeft),
      this.offsetedY(PwsmGameConstants.Card.ImageOffsetTop),
      this.imageKey,
    ).setOrigin(0);
    this.image.setDisplaySize(PwsmGameConstants.Card.ImageWidth, PwsmGameConstants.Card.ImageHeight);
    this.add(this.image);
  }

  private createCardFrame(): void {
    this.frame = new GameObjects.Image(this.scene, this.offsetedX(), this.offsetedY(), this.frameKey).setOrigin(0);
    this.frame.setDisplaySize(PwsmGameConstants.Card.Width, PwsmGameConstants.Card.Height);
    this.add(this.frame);

    this.stone = new GameObjects.Image(this.scene, this.offsetedX(), this.offsetedY(), this.stoneKey).setOrigin(0);
    this.stone.setDisplaySize(PwsmGameConstants.Card.Width, PwsmGameConstants.Card.Height);
    this.add(this.stone);
  }

  private createCardElement(): void {
    this.elementIcon = new GameObjects.Image(
      this.scene,
      this.offsetedX(PwsmGameConstants.Card.ElementIconOffsetLeft),
      this.offsetedY(PwsmGameConstants.Card.ElementIconOffsetTop),
      this.elementIconKey,
    ).setOrigin(0);
    this.elementIcon.setDisplaySize(PwsmGameConstants.Card.ElementIconWidth, PwsmGameConstants.Card.ElementIconHeight);
    this.add(this.elementIcon);
  }

  private createCardValue(): void {
    if (this.valueIconKey) {
      this.valueIcon = new GameObjects.Image(
        this.scene,
        this.offsetedX(PwsmGameConstants.Card.ValueOffsetLeft),
        this.offsetedY(PwsmGameConstants.Card.ValueOffsetTop),
        this.valueIconKey,
      ).setOrigin(0);
      this.valueIcon.setDisplaySize(PwsmGameConstants.Card.ValueWidth, PwsmGameConstants.Card.ValueHeight);
    } else {
      this.valueIcon = new PwsmText(
        this.scene,
        this.offsetedX(PwsmGameConstants.Card.ValueOffsetLeft),
        this.offsetedY(PwsmGameConstants.Card.ValueOffsetTop),
        `${this.cardState.config.power}`,
        { fontSize: PwsmGameConstants.Card.ValueFontSize, align: 'center', shadow: PwsmGameConstants.TextShadow },
      ).setOrigin(0);
      this.valueIcon.setFixedSize(PwsmGameConstants.Card.ValueWidth, PwsmGameConstants.Card.ValueHeight);
    }
    this.add(this.valueIcon);
  }

  private createOutline(): void {
    this.outline = new GameObjects.Image(this.scene, 0, 0, Resource.Card.Silhouette).setOrigin(0.5);
    const width = PwsmGameConstants.Card.Width + PwsmGameConstants.Card.OutlineWidth;
    const height = PwsmGameConstants.Card.Height + PwsmGameConstants.Card.OutlineWidth;
    this.outline.setDisplaySize(width, height);
    this.outline.alpha = 0;
    this.add(this.outline);
  }

  private createHighlight(): void {
    this.highlight = new GameObjects.Image(
      this.scene,
      this.offsetedX(),
      this.offsetedY(),
      Resource.Card.Silhouette,
    ).setOrigin(0);
    this.highlight.setDisplaySize(PwsmGameConstants.Card.Width, PwsmGameConstants.Card.Height);
    this.highlight.alpha = 0;
    this.add(this.highlight);
  }

  private createInteractionOverlays(): void {
    this.interactionOverlays = [
      Resource.Card.Interaction.Overlay1,
      Resource.Card.Interaction.Overlay2,
      Resource.Card.Interaction.Overlay3,
    ].map((res) =>
      new GameObjects.Image(this.scene, this.offsetedX(), this.offsetedY(), res)
        .setOrigin(0)
        .setDisplaySize(PwsmGameConstants.Card.Width, PwsmGameConstants.Card.Height)
        .setAlpha(0),
    );
    this.add(this.interactionOverlays);
  }

  public setInteractionOverlayActive(isActive: boolean): void {
    if (isActive === this.isInteractionOverlayShown) {
      return;
    }

    this.isInteractionOverlayShown = isActive;
    this.scene.removeTweens(this.interactionOverlaysTweens);

    if (isActive) {
      this.interactionOverlaysTweens = this.interactionOverlays.map((obj, i) =>
        this.scene.tweens.addCounter({
          from: PwsmGameConstants.Card.InteractionOverlayTweenAlphaMin,
          to: PwsmGameConstants.Card.InteractionOverlayTweenAlphaMax,
          yoyo: true,
          ease: PwsmGameConstants.Card.InteractionOverlayTweenEase,
          duration: PwsmGameConstants.Card.InteractionOverlayTweenDuration,
          delay: PwsmGameConstants.Card.InteractionOverlayTweenDelay * i,
          loop: -1,
          onUpdate: (tween) => {
            obj.setAlpha(tween.getValue());
          },
        }),
      );
    } else {
      this.interactionOverlaysTweens = this.interactionOverlays.map((obj) =>
        this.scene.add.tween({
          targets: obj,
          alpha: 0,
          ease: PwsmGameConstants.Card.InteractionOverlayTweenEase,
          duration: PwsmGameConstants.Card.InteractionOverlayTweenDuration,
        }),
      );
    }
  }

  private createCardText(): void {
    this.title = new PwsmText(
      this.scene,
      this.offsetedX(PwsmGameConstants.Card.TextOffsetLeft + PwsmGameConstants.Card.TextWidth / 2),
      this.offsetedY(PwsmGameConstants.Card.TitleOffsetTop + PwsmGameConstants.Card.TitleHeight / 2),
      this.getCardTitle(),
      { fontSize: PwsmGameConstants.Card.TitleFontSize, fontStyle: 'bold' },
    );
    this.title.setOrigin(0.5);
    this.title.setFixedSize(PwsmGameConstants.Card.TextWidth, 0);
    this.add(this.title);

    if (this.hasCaption) {
      this.caption = new PwsmText(
        this.scene,
        this.offsetedX(PwsmGameConstants.Card.TextOffsetLeft + PwsmGameConstants.Card.TextWidth / 2),
        this.offsetedY(PwsmGameConstants.Card.TextOffsetTop + PwsmGameConstants.Card.TextHeight / 2),
        this.getCardCaption(),
        { fontSize: PwsmGameConstants.Card.TextFontSize },
      );
      this.caption.setOrigin(0.5);
      this.caption.setFixedSize(PwsmGameConstants.Card.TextWidth, 0);
      this.add(this.caption);

      this.title.y = this.offsetedY(
        PwsmGameConstants.Card.SmallTitleOffsetTop + PwsmGameConstants.Card.SmallTitleHeight / 2,
      );
      this.title.setFontSize(PwsmGameConstants.Card.SmallTitleFontSize);
    }
  }

  private getCardTitle(): string {
    return this.scene.translations?.card?.[this.cardState.cardId]?.title;
  }

  private get hasCaption(): boolean {
    return Boolean(this.getCardCaption());
  }

  private getCardCaption(): string {
    return this.scene.translations?.card?.[this.cardState.cardId]?.caption;
  }

  private createCardEffects(): void {
    const uniqueEffectIds = this.cardState.effects.reduce((set, effect) => set.add(effect.id), new Set<CardEffectId>());
    this.effects = Array.from(uniqueEffectIds).map((id, i) => this.createCardEffect(id, i));
    this.effectsContainer = new GameObjects.Container(
      this.scene,
      0,
      PwsmGameConstants.Card.EffectOffsetTop,
      this.effects,
    );
    this.add(this.effectsContainer);
  }

  private createCardEffect(id: CardEffectId, i: number): CardEffect {
    return new CardEffect(this.scene, this.offsetedX(), this.offsetedY(i * PwsmGameConstants.Card.EffectHeight), id);
  }

  private setEffectsExpanded(isExpanded: boolean): void {
    this.effects.forEach((el) => el.setExpanded(isExpanded));
  }

  private offsetedX(n: number = 0): number {
    return -this.width / 2 + n;
  }

  private offsetedY(n: number = 0): number {
    return -this.height / 2 + n;
  }
}
