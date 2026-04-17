import { GameObjects } from 'phaser';
import { PhaserEase } from '@/game/phaser';
import { Resource } from '@/game/resource';
import type { PwsmScene } from '@/game/scenes';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { Arena } from './arena';

export class FlowerFieldArena extends Arena {
  protected override get tableResourceKey(): string {
    return Resource.GameTable.Arena.FlowerField.Table;
  }

  protected override get backgroundResourceKey(): string {
    return Resource.GameTable.Arena.FlowerField.Background;
  }

  protected override createForeground(): void {
    super.createForeground();

    this.foreground.add(this.getParticleEmitter(this.scene, 0.06, 0.42, PwsmGameConstants.Colors.Pink));
    this.foreground.add(this.getParticleEmitter(this.scene, 0.07, 0.44, PwsmGameConstants.Colors.Purple));
    this.foreground.add(this.getParticleEmitter(this.scene, 0.08, 0.46, PwsmGameConstants.Colors.White));

    this.foreground.add(this.getParticleEmitter(this.scene, 0.92, 0.42, PwsmGameConstants.Colors.Pink));
    this.foreground.add(this.getParticleEmitter(this.scene, 0.91, 0.44, PwsmGameConstants.Colors.Purple));
    this.foreground.add(this.getParticleEmitter(this.scene, 0.9, 0.46, PwsmGameConstants.Colors.White));

    this.foreground.add(this.getParticleEmitter(this.scene, 0.51, 0.03, PwsmGameConstants.Colors.White));
    this.foreground.add(this.getParticleEmitter(this.scene, 0.47, 0.05, PwsmGameConstants.Colors.SkyBlue));

    this.foreground.add(this.getParticleEmitter(this.scene, 0.51, 0.93, PwsmGameConstants.Colors.White));
    this.foreground.add(this.getParticleEmitter(this.scene, 0.47, 0.95, PwsmGameConstants.Colors.SkyBlue));

    this.foreground.add(this.getParticleEmitter(this.scene, 0.21, 0.03, PwsmGameConstants.Colors.White));
    this.foreground.add(this.getParticleEmitter(this.scene, 0.23, 0.05, PwsmGameConstants.Colors.Purple));
  }

  private getParticleEmitter(
    scene: PwsmScene,
    x: number,
    y: number,
    tint: number,
  ): GameObjects.Particles.ParticleEmitter {
    const emitter = new Phaser.GameObjects.Particles.ParticleEmitter(
      scene,
      -PwsmGameConstants.Table.Width * 0.5 + PwsmGameConstants.Table.Width * x,
      -PwsmGameConstants.Table.Height * 0.5 + PwsmGameConstants.Table.Height * y,
      Resource.Particle.BaseSquare,
      {
        lifespan: 15000,
        speed: { min: PwsmGameConstants.Table.Width * 0.005, max: PwsmGameConstants.Table.Width * 0.01 },
        scale: { start: 0.005, end: 0.01 },
        rotate: { start: 0, end: 180 },
        alpha: { values: [0, 0.5, 0] },
        quantity: 1,
        frequency: 100,
        emitting: true,
        tint: tint,
      },
    );
    this.scene.tweens.add({
      targets: emitter,
      duration: 60000,
      angle: 360,
      ease: PhaserEase.Linear,
      repeat: -1,
    });
    return emitter;
  }
}
