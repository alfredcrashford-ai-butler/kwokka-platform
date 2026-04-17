import { GameObjects } from 'phaser';
import { CardEffectId } from '@/game-data/card';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { Resource } from '@/game/resource';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmText } from '../pwsm-text';

const EffectToIconResource = {
  [CardEffectId.Transform]: Resource.Card.Effect.Transform,
  [CardEffectId.Burn]: Resource.Card.Effect.Burn,
};

export class CardEffect extends GameObjects.Container {
  private backgroundContracted: GameObjects.Image;
  private backgroundExpanded: GameObjects.Image;
  private icon: GameObjects.Image;
  private text: PwsmText;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    x: number,
    y: number,
    private readonly effectId: CardEffectId,
  ) {
    super(scene, x, y);
    this.setSize(PwsmGameConstants.Card.EffectWidth, PwsmGameConstants.Card.EffectHeight);

    this.createBackground();
    this.createIcon();
    this.createText();
  }

  public setExpanded(isExpanded: boolean): void {
    this.text.setVisible(isExpanded);
    this.backgroundExpanded.setVisible(isExpanded);
    this.backgroundContracted.setVisible(!isExpanded);
  }

  private get iconKey(): string {
    return EffectToIconResource[this.effectId];
  }

  private get effectTranslation(): string {
    return this.scene.translations.effect[this.effectId]?.title;
  }

  private createBackground(): void {
    this.backgroundExpanded = new GameObjects.Image(this.scene, 0, 0, Resource.Card.Effect.BackgroundExpanded)
      .setOrigin(0)
      .setDisplaySize(PwsmGameConstants.Card.EffectWidth, PwsmGameConstants.Card.EffectHeight)
      .setVisible(false);
    this.backgroundContracted = new GameObjects.Image(this.scene, 0, 0, Resource.Card.Effect.BackgroundContracted)
      .setOrigin(0)
      .setDisplaySize(PwsmGameConstants.Card.EffectWidth, PwsmGameConstants.Card.EffectHeight);
    this.add(this.backgroundContracted);
    this.add(this.backgroundExpanded);
  }

  private createIcon(): void {
    this.icon = new GameObjects.Image(
      this.scene,
      PwsmGameConstants.Card.EffectIconOffsetLeft,
      PwsmGameConstants.Card.EffectIconOffsetTop,
      this.iconKey,
    )
      .setOrigin(0)
      .setDisplaySize(PwsmGameConstants.Card.EffectIconSize, PwsmGameConstants.Card.EffectIconSize);
    this.add(this.icon);
  }

  private createText(): void {
    this.text = new PwsmText(
      this.scene,
      PwsmGameConstants.Card.EffectTextOffsetLeft + PwsmGameConstants.Card.EffectTextWidth / 2,
      PwsmGameConstants.Card.EffectTextOffsetTop + PwsmGameConstants.Card.EffectTextHeight / 2,
      this.effectTranslation,
      { fontSize: PwsmGameConstants.Card.EffectFontSize },
    ).setOrigin(0.5);
    this.text.setVisible(false);
    this.add(this.text);
  }
}
