import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Skill } from './skill';

export class EmptySkill extends Skill {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    game.drawCardsFromPile(game.state, playerId, 1);
    this.transferTurnToNextPlayer(game);
  }

  public canPlay(): boolean {
    return false;
  }
}
