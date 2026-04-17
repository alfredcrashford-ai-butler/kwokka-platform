import { GameObjects } from 'phaser';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { PwsmText } from '../pwsm-text';

export class CardDrawIndicator extends GameObjects.Container {
  private fontSize: number = 0;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    x,
    y,
  ) {
    super(scene, x, y);
  }

  public setFontSize(size: number): void {
    this.fontSize = size;
  }

  public show(str: string, transformY: number): void {
    let text: PwsmText;
    const tween = this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: PwsmGameConstants.CardDrawIndicator.TweenDuration,
      ease: PwsmGameConstants.CardDrawIndicator.TweenEase,
      onStart: () => {
        text = new PwsmText(this.scene, 0, 0, str, {
          color: PwsmGameConstants.CardDrawIndicator.Color,
          fontSize: this.fontSize,
          stroke: PwsmGameConstants.CardDrawIndicator.Stroke,
          strokeThickness: this.fontSize * PwsmGameConstants.CardDrawIndicator.StrokeWidth,
        });
        text.alpha = 0;
        this.add(text);
      },
      onUpdate: (tween) => {
        const v = tween.getValue();
        if (v > 0.5) {
          // Alpha fades out smoothly from v=0.5 to v=1
          text.alpha = 1 - (v - 0.5) * 2;
        } else {
          text.alpha = 1;
        }
        text.y = v * transformY;
      },
      onComplete: () => {
        this.remove(text, true);
        this.scene.removeTweens(tween);
      },
    });
  }
}
