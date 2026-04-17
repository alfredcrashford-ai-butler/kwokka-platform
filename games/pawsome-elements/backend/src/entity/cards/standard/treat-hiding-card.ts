import { PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';

export class TreatHidingCard extends CommonCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    game.decrementSkillCooldown(playerId);
    super.playEffect(game, playerId);
  }
}
