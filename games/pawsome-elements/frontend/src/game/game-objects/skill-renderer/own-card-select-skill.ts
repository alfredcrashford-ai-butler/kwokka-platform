import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { PwsmPlayableScene } from '@/game/scenes';
import { InteractiveSkill } from './interactive-skill';
import { Player } from '../player';
import type { Card } from '../card';

export class OwnCardSelectSkill extends InteractiveSkill {
  private player: Player;

  public constructor(public readonly scene: PwsmPlayableScene) {
    super(scene);

    this.player = new Player(scene, scene.config.playerId);
    this.player.on(Player.Events.CardSelected, (card: Card) =>
      this.emit(InteractiveSkill.Events.SkillPlay, { cardId: card.cardState.cardInGameId }),
    );
    this.add(this.player);

    this.onResize();
  }

  protected doResize(): void {
    this.player.onResize();
    this.setPosition(-this.scene.width / 2, -this.scene.height / 2);
    this.background.setPosition(this.scene.width / 2, this.scene.height / 2);
    this.particlesEmitter.setPosition(this.scene.width / 2, this.scene.height / 2);
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    this.player.setGameState(gameInstance);
  }
}
