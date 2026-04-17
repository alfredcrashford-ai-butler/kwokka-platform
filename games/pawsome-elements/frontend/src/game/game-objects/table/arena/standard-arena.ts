import { GameObjects } from 'phaser';
import { Resource } from '@/game/resource';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { Arena } from './arena';

export class StandardArena extends Arena {
  protected override get tableResourceKey(): string {
    return Resource.GameTable.Arena.Standard.Table;
  }

  protected override get backgroundResourceKey(): string {
    return Resource.GameTable.Arena.Standard.Background;
  }

  protected override createForeground(): void {
    super.createForeground();

    this.foreground.add(this.getParticleEmitter(this.scene, 0.04, 0.3));
    this.foreground.add(this.getParticleEmitter(this.scene, 0.9, 0.77));
  }

  private getParticleEmitter(scene: PwsmPlayableScene, x: number, y: number): GameObjects.Particles.ParticleEmitter {
    return new Phaser.GameObjects.Particles.ParticleEmitter(
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
        tint: PwsmGameConstants.Colors.LightYellow,
      },
    );
  }
}
