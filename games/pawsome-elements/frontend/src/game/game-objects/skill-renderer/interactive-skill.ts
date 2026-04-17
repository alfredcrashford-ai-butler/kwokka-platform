import { GameObjects, Tweens } from 'phaser';
import { Resource } from '@/game/resource';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { Stateful } from '../stateful';
import type { Resizable } from '../resizable';

export abstract class InteractiveSkill extends GameObjects.Container implements Stateful, Resizable {
  public static readonly Events = {
    SkillPlay: 'skill_play',
  };

  protected readonly background: GameObjects.Image;
  protected readonly particlesEmitter: GameObjects.Particles.ParticleEmitter;
  private isShown = false;
  private tween: Tweens.Tween;

  public constructor(public readonly scene: PwsmPlayableScene) {
    super(scene, 0, 0);

    this.background = new GameObjects.Image(scene, 0, 0, Resource.SkillRenderer.Background);
    this.add(this.background);

    this.particlesEmitter = this.createParticlesEmitter();
    this.add(this.particlesEmitter);

    this.alpha = 0;
  }

  public show(): void {
    if (this.isShown) {
      return;
    }

    this.isShown = true;
    this.scene.removeTweens(this.tween);
    this.background.setInteractive();

    this.tween = this.scene.add.tween({
      targets: this,
      alpha: 1,
      duration: PwsmGameConstants.SkillRenderer.AlphaTweenDuration,
      onStart: () => (this.active = true),
    });
  }

  public hide(): void {
    if (!this.isShown) {
      return;
    }

    this.isShown = false;
    this.scene.removeTweens(this.tween);
    this.background.disableInteractive();

    if (!this.isShown) {
      this.tween = this.scene.add.tween({
        targets: this,
        alpha: 0,
        duration: PwsmGameConstants.SkillRenderer.AlphaTweenDuration,
        onComplete: () => (this.active = false),
      });
    }
  }

  public onResize(): void {
    this.doResize();
    this.background.setDisplaySize(this.scene.width, this.scene.height);
  }

  private createParticlesEmitter(): GameObjects.Particles.ParticleEmitter {
    const emitter = new GameObjects.Particles.ParticleEmitter(
      this.scene,
      0,
      0,
      Resource.Particle.BaseSquare,
      PwsmGameConstants.SkillRenderer.SkillParticlesEmitterConfig,
    );
    this.scene.tweens.add({
      targets: emitter,
      angle: '+=360',
      loop: -1,
      duration: PwsmGameConstants.SkillRenderer.SkillParticlesEmitterTweenDuration,
      ease: PwsmGameConstants.SkillRenderer.SkillParticlesEmitterTweenEase,
    });

    return emitter;
  }

  protected abstract doResize(): void;
  public abstract setGameState(gameInstance: PwsmGameInstanceEntity): void;
}
