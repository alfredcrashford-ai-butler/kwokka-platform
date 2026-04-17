import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { PwsmPlayableScene } from '@/game/scenes';
import { InteractiveSkill } from './interactive-skill';
import { OpponentsRenderer } from '../opponents-renderer';

export class PlayerSelectSkill extends InteractiveSkill {
  private readonly opponentsRenderer: OpponentsRenderer;

  public constructor(public readonly scene: PwsmPlayableScene) {
    super(scene);

    this.opponentsRenderer = new OpponentsRenderer(scene, this.scene.config.playerId);
    this.opponentsRenderer.setOpponentsClickable(true);
    this.opponentsRenderer.setCursor('pointer');
    this.opponentsRenderer.on(OpponentsRenderer.Events.OpponentClick, (playerId: string) =>
      this.emit(InteractiveSkill.Events.SkillPlay, { playerId }),
    );
    this.add(this.opponentsRenderer);

    this.onResize();
  }

  protected doResize(): void {
    this.opponentsRenderer.setPosition(-this.scene.width / 2, -this.scene.height / 2);
    this.opponentsRenderer.onResize();
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    this.opponentsRenderer.setGameState(gameInstance);
  }
}
