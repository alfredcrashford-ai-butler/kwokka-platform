import { GameObjects, Tweens } from 'phaser';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import type { PwsmPlayableScene } from '@/game/scenes';
import { Resource } from '@/game/resource';
import type { ActiveSkillItemKey } from '@/game-data';
import { EventKey } from '@/game/event-key';
import { PhaserInputEvent } from '@/game/phaser';
import { PwsmText } from '../pwsm-text';

export class Skill extends GameObjects.Container {
  private frame: GameObjects.Image;
  private skillImage: GameObjects.Image;
  private skillKey: ActiveSkillItemKey;
  private tweens: (Tweens.Tween | Tweens.TweenChain)[] = [];
  private isReady: boolean;
  private isClickable: boolean = false;
  private cooldownText: PwsmText;
  private cooldown: number;
  private outline: GameObjects.Image;
  private highlight: GameObjects.Image;
  private darken: GameObjects.Image;
  private particleEmitter: GameObjects.Particles.ParticleEmitter;

  public constructor(public readonly scene: PwsmPlayableScene) {
    super(scene, 0, 0);
    this.setSize(this.skillWidth, this.skillHeight);

    this.outline = new GameObjects.Image(this.scene, 0, 0, Resource.PlayerPanel.SkillSilhouetteWhite);
    this.outline.alpha = 0;
    this.outline.setDisplaySize(
      this.skillWidth + PwsmGameConstants.PlayerPanel.SkillOutlineWidth,
      this.skillHeight + PwsmGameConstants.PlayerPanel.SkillOutlineWidth,
    );
    this.add(this.outline);

    this.frame = new GameObjects.Image(this.scene, 0, 0, Resource.PlayerPanel.SkillFrame);
    this.frame.setDisplaySize(this.skillWidth, this.skillHeight);
    this.add(this.frame);

    this.highlight = new GameObjects.Image(this.scene, 0, 0, Resource.PlayerPanel.SkillSilhouetteWhite);
    this.highlight.alpha = 0;
    this.highlight.setDisplaySize(this.skillWidth, this.skillHeight);
    this.add(this.highlight);

    this.darken = new GameObjects.Image(this.scene, 0, 0, Resource.PlayerPanel.SkillSilhouetteBlack);
    this.darken.alpha = 0;
    this.darken.setDisplaySize(this.skillWidth, this.skillHeight);
    this.add(this.darken);

    this.cooldownText = new PwsmText(this.scene, 0, PwsmGameConstants.PlayerPanel.SkillCooldownVerticalOffset, '', {
      fontSize: PwsmGameConstants.PlayerPanel.SkillCooldownFontSize,
    });
    this.cooldownText.setOrigin(0.5);
    this.cooldownText.setFixedSize(this.skillWidth, 0);
    this.cooldownText.alpha = 0;
    this.add(this.cooldownText);

    this.particleEmitter = new GameObjects.Particles.ParticleEmitter(
      this.scene,
      0,
      0,
      Resource.Particle.Flare,
      PwsmGameConstants.PlayerPanel.SkillParticlesConfig,
    );
    this.add(this.particleEmitter);

    this.setInteractive();

    this.on(PhaserInputEvent.PointerOver, () => this.onPointerOver());
    this.on(PhaserInputEvent.PointerOut, () => this.onPointerOut());
    this.on(PhaserInputEvent.PointerDown, () => this.onPointerDown());
  }

  private get skillWidth(): number {
    return PwsmGameConstants.PlayerPanel.SkillWidth;
  }

  private get skillHeight(): number {
    return this.skillWidth / PwsmGameConstants.PlayerPanel.SkillAspectRatio;
  }

  private tweenHighlight(): Tweens.Tween {
    return this.scene.add.tween({
      targets: this.highlight,
      alpha: PwsmGameConstants.PlayerPanel.HighlightAlpha,
      yoyo: true,
      duration: PwsmGameConstants.PlayerPanel.SkillTweenDuration,
      ease: PwsmGameConstants.PlayerPanel.SkillTweenEase,
    });
  }

  private setOutlined(isOutlined: boolean): void {
    this.outline.alpha = isOutlined ? 1 : 0;
  }

  private setDarkened(isDarkened: boolean): void {
    this.darken.alpha = isDarkened ? PwsmGameConstants.PlayerPanel.SkillDarkenAlpha : 0;
  }

  public setClickable(isClickable: boolean): void {
    if (this.isClickable !== isClickable && !isClickable) {
      this.setOutlined(false);
    }

    this.isClickable = isClickable;
  }

  public setSkill(key: ActiveSkillItemKey): void {
    this.stopTweens();

    if (this.skillImage) {
      this.remove(this.skillImage, true);
    }

    this.skillKey = key;

    this.skillImage = new GameObjects.Image(this.scene, 0, 0, this.skillResource);
    this.skillImage.setDisplaySize(this.skillWidth * 0.65, this.skillHeight * 0.65);
    this.skillImage.y = -this.skillHeight * 0.05;
    this.add(this.skillImage);
    this.moveBelow(this.skillImage, this.darken);
  }

  public setCooldown(cooldown: number): void {
    if (this.cooldown === cooldown) {
      return;
    }

    this.cooldown = cooldown;
    this.cooldownText.text = `${cooldown}`;
    this.scene.tweens.add({
      targets: this.cooldownText,
      yoyo: true,
      duration: PwsmGameConstants.PlayerPanel.SkillCooldownTweenDuration,
      scale: `+=${PwsmGameConstants.PlayerPanel.SkillCooldownTweenScale}`,
      ease: PwsmGameConstants.PlayerPanel.SkillCooldownTweenEase,
    });
    this.cooldownText.alpha = cooldown ? 1 : 0;
  }

  public emitParticles(): void {
    this.particleEmitter.emitParticle();
  }

  public setSkillReady(isReady: boolean): void {
    if (this.isReady === isReady) {
      return;
    }

    if (this.isReady === true && isReady === false) {
      this.scene.eventBus.emit(EventKey.OuterSkillPlayed);
      this.emitParticles();
      this.scene.shakeCamera(
        PwsmGameConstants.SkillRenderer.CameraShakeOnSkillDuration,
        PwsmGameConstants.SkillRenderer.CameraShakeOnSkillIntensity,
      );
    }

    this.stopTweens();
    this.isReady = isReady;

    if (isReady) {
      this.setDarkened(false);
      this.tweens = [
        this.scene.tweenScale(this, PwsmGameConstants.PlayerPanel.SkillTweenDuration),
        this.tweenHighlight(),
      ];
    } else {
      this.setDarkened(true);
    }
  }

  private stopTweens(): void {
    this.scene.removeTweens(this.tweens);
    this.tweens = [];
  }

  private get skillResource(): string {
    return Resource.Skill[this.skillKey];
  }

  private onPointerOver(): void {
    if (!this.isClickable) {
      return;
    }

    this.setOutlined(true);
  }

  private onPointerOut(): void {
    this.setOutlined(false);
  }

  private onPointerDown(): void {
    if (!this.isClickable) {
      return;
    }

    this.scene.eventBus.emit(EventKey.SkillClick);
  }
}
