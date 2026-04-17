import { GameObjects, Tweens } from 'phaser';
import type { ProfileConfig } from '@/game-data/game-instance';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { PwsmPlayableScene } from '@/game/scenes';
import { Resource } from '@/game/resource';
import { EventKey } from '@/game/event-key';

export class Profile extends GameObjects.Container {
  private image: GameObjects.Image;
  private isActiveAnimationEnabled: boolean = false;
  private tweens: Tweens.Tween[];
  private highlight: GameObjects.Image;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    public readonly accountId: string,
    public readonly config?: ProfileConfig,
  ) {
    super(scene, 0, 0);
    const width = PwsmGameConstants.Profile.Width;
    const height = PwsmGameConstants.Profile.Width / PwsmGameConstants.Profile.AspectRatio;
    this.setSize(width, height);

    this.image = new GameObjects.Image(scene, 0, 0, Resource.PlayerPanel.DefaultProfile);
    this.image.setDisplaySize(width, height);
    this.add(this.image);

    this.highlight = new GameObjects.Image(scene, 0, 0, Resource.Misc.HighlightWhite);
    this.highlight.alpha = 0;
    this.highlight.active = false;
    this.highlight.setDisplaySize(width, height);
    this.add(this.highlight);

    this.scene.eventBus.addListener(EventKey.SetProfileTexture, this.setProfileTexture);
  }

  public override preDestroy(): void {
    this.scene.eventBus.removeListener(EventKey.SetProfileTexture, this.setProfileTexture);
    super.preDestroy();
  }

  public setActiveAnimation(isActive: boolean) {
    if (isActive === this.isActiveAnimationEnabled) {
      return;
    }

    this.isActiveAnimationEnabled = isActive;
    this.scene.removeTweens(this.tweens);

    if (!isActive) {
      this.tweens = [
        this.scene.add.tween({
          targets: this.highlight,
          alpha: 0,
          duration: PwsmGameConstants.Profile.ActiveTweenDuration,
          ease: PwsmGameConstants.Profile.ActiveTweenEase,
          onComplete: () => (this.highlight.active = false),
        }),
        this.scene.add.tween({
          targets: this,
          scale: 1,
          duration: PwsmGameConstants.Profile.ActiveTweenDuration,
          ease: PwsmGameConstants.Profile.ActiveTweenEase,
        }),
      ];
      return;
    }

    this.tweens = [
      this.scene.add.tween({
        targets: this.highlight,
        alpha: `+=${PwsmGameConstants.Profile.ActiveTweenHighlightAlpha}`,
        yoyo: true,
        duration: PwsmGameConstants.Profile.ActiveTweenDuration,
        ease: PwsmGameConstants.Profile.ActiveTweenEase,
        loop: -1,
        onStart: () => (this.highlight.active = true),
      }),
      this.scene.add.tween({
        targets: this,
        scale: `*=${PwsmGameConstants.Profile.ActiveTweenScale}`,
        duration: PwsmGameConstants.Profile.ActiveTweenDuration,
        ease: PwsmGameConstants.Profile.ActiveTweenEase,
        yoyo: true,
        loop: -1,
      }),
    ];
  }

  private setProfileTexture = (event: { accountId: string }) => {
    if (this.accountId !== event.accountId) {
      return;
    }

    this.remove(this.image, true);

    const width = PwsmGameConstants.Profile.Width;
    const height = PwsmGameConstants.Profile.Width / PwsmGameConstants.Profile.AspectRatio;
    this.image = new GameObjects.Image(this.scene, 0, 0, PwsmPlayableScene.getProfileResource(event.accountId));
    this.image.setDisplaySize(width, height);
    this.add(this.image);
  };
}
