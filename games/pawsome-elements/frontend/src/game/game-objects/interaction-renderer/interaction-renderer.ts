import { GameObjects, Math } from 'phaser';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { PwsmPlayableScene } from '@/game/scenes';
import { Resource } from '@/game/resource';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import type { Resizable } from '../resizable';
import type { Stateful } from '../stateful';

export class InteractionRenderer extends GameObjects.Container implements Resizable, Stateful {
  private interactionParticlesEmitters: Record<string, GameObjects.Particles.ParticleEmitter> = {};

  public constructor(
    public readonly scene: PwsmPlayableScene,
    private readonly playerId: string,
  ) {
    super(scene, 0, 0);

    this.onResize();
  }

  public onResize(): void {
    this.setSize(this.scene.width, this.scene.height);
    Object.entries(this.interactionParticlesEmitters).forEach(([playerId, emitter]) => {
      emitter.setPosition(this.scene.width / 2, this.scene.height / 2);
      this.aimInteractionParticlesEmitter(emitter, playerId);
    });
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    gameInstance.players
      .filter((el) => el.id !== this.playerId)
      .forEach((el) => {
        const emitter = this.getInteractionParticlesEmitter(el.id);
        emitter.visible = gameInstance.isPlayerInteracting(el.id);
      });
  }

  private createInteractionParticlesEmitter(playerId: string): void {
    const emitter = new GameObjects.Particles.ParticleEmitter(
      this.scene,
      this.scene.width / 2,
      this.scene.height / 2,
      Resource.Particle.Flare,
      PwsmGameConstants.InteractionRenderer.ParticlesRayConfig,
    );
    this.add(emitter);
    this.interactionParticlesEmitters[playerId] = emitter;
    this.aimInteractionParticlesEmitter(emitter, playerId);
  }

  private getInteractionParticlesEmitter(playerId: string): GameObjects.Particles.ParticleEmitter {
    if (!this.interactionParticlesEmitters[playerId]) {
      this.createInteractionParticlesEmitter(playerId);
    }

    return this.interactionParticlesEmitters[playerId];
  }

  private aimInteractionParticlesEmitter(emitter: GameObjects.Particles.ParticleEmitter, playerId: string): void {
    const emitterPos = emitter.getWorldPoint();
    const playerPos = this.scene.getPlayerPosition(playerId);
    const angleRadians = Math.Angle.BetweenPoints(emitterPos, playerPos);
    const angle = Math.RadToDeg(angleRadians);
    const delta = PwsmGameConstants.InteractionRenderer.ParticlesAnglesDelta;
    emitter.setConfig({
      ...PwsmGameConstants.InteractionRenderer.ParticlesRayConfig,
      angle: {
        min: angle - delta,
        max: angle + delta,
      },
    });
  }
}
