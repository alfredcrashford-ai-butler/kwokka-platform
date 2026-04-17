import { GameObjects, Tweens, type Types } from 'phaser';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmText } from '../pwsm-text';

export class Tooltip extends GameObjects.Container {
  private tween: Tweens.Tween;
  private text: PwsmText;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    config: Types.GameObjects.Text.TextStyle,
  ) {
    super(scene, 0, 0);

    this.text = new PwsmText(scene, 0, 0, '', config);
    this.text.setOrigin(0.5);
    this.add(this.text);

    this.alpha = 0;
  }

  public setText(text: string): void {
    this.text.text = text;
  }

  public show(): void {
    this.scene.removeTweens(this.tween);
    this.tweenAlpha(1);
  }

  public hide(): void {
    this.scene.removeTweens(this.tween);
    this.tweenAlpha(0);
  }

  private tweenAlpha(alpha: number): void {
    this.tween = this.scene.add.tween({
      targets: this,
      alpha,
      duration: PwsmGameConstants.Tooltip.TweenDuration,
      ease: PwsmGameConstants.Tooltip.TweenEase,
    });
  }
}
