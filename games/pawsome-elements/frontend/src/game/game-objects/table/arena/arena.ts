import { GameObjects, Tweens } from 'phaser';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import type { Resizable } from '../../resizable';
import type { CardDeck } from '../card-deck';
import type { DiscardPile } from '../discard-pile';

export abstract class Arena extends GameObjects.Container implements Resizable {
  protected background: GameObjects.Image;
  protected middleground: GameObjects.Container;
  protected table: GameObjects.Image;
  protected foreground: GameObjects.Container;
  protected middlegroundTween: Tweens.Tween;
  protected foregroundTween: Tweens.Tween;
  protected backgroundTween: Tweens.Tween;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    private readonly cardDeck: CardDeck,
    private readonly discardPile: DiscardPile,
  ) {
    super(scene, 0, 0);
    this.setSize(PwsmGameConstants.Table.Width, PwsmGameConstants.Table.Height);

    this.createBackground();
    this.createMiddleground();
    this.createForeground();

    this.middlegroundTween = this.scaleIn(this.middleground);
    this.foregroundTween = this.scaleIn(this.foreground);
    this.backgroundTween = this.fadeIn(this.background);
  }

  public onResize(): void {
    if (this.middlegroundTween?.isPlaying) {
      this.middlegroundTween.stop();
      this.middlegroundTween.destroy();
    }

    if (this.foregroundTween?.isPlaying) {
      this.foregroundTween.stop();
      this.foregroundTween.destroy();
    }

    if (this.backgroundTween?.isPlaying) {
      this.backgroundTween.stop();
      this.backgroundTween.destroy();
    }
  }

  protected abstract get tableResourceKey(): string;
  protected abstract get backgroundResourceKey(): string;

  protected createMiddleground(): void {
    this.middleground = new GameObjects.Container(this.scene, 0, 0);
    this.middleground.setSize(PwsmGameConstants.Table.Width, PwsmGameConstants.Table.Height);

    this.table = new GameObjects.Image(this.scene, 0, 0, this.tableResourceKey);
    this.table.setDisplaySize(this.middleground.width, this.middleground.height);

    this.middleground.add(this.table);
    this.middleground.add(this.discardPile);
    this.middleground.add(this.cardDeck);
    this.add(this.middleground);
  }

  protected createBackground(): void {
    this.background = new GameObjects.Image(this.scene, 0, 0, this.backgroundResourceKey);
    this.background.setSize(PwsmGameConstants.Table.Width, PwsmGameConstants.Table.Height);
    this.add(this.background);
  }

  protected createForeground(): void {
    this.foreground = new GameObjects.Container(this.scene, 0, 0);
    this.foreground.setSize(PwsmGameConstants.Table.Width, PwsmGameConstants.Table.Height);
    this.add(this.foreground);
  }

  protected scaleIn(target: GameObjects.Image | GameObjects.Container): Tweens.Tween {
    const scaleXTo = target.scaleX;
    const scaleYTo = target.scaleY;
    const scaleXFrom = scaleXTo * PwsmGameConstants.Table.ArenaScaleInStartValue;
    const scaleYFrom = scaleYTo * PwsmGameConstants.Table.ArenaScaleInStartValue;
    target.scaleX = scaleXFrom;
    target.scaleY = scaleYFrom;
    return this.scene.add.tween({
      targets: target,
      duration: PwsmGameConstants.Table.ArenaScaleInDuration,
      scaleX: scaleXTo,
      scaleY: scaleYTo,
      ease: PwsmGameConstants.Table.ArenaScaleInEase,
    });
  }

  protected fadeIn(target: GameObjects.Image): Tweens.Tween {
    target.alpha = 0;
    return this.scene.add.tween({
      targets: target,
      duration: PwsmGameConstants.Table.ArenaFadeInDuration,
      alpha: 1,
      ease: PwsmGameConstants.Table.ArenaFadeInEase,
    });
  }
}
