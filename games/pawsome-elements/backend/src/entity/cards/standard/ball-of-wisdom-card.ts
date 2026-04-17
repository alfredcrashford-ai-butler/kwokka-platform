import { PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';

export class BallOfWisdomCard extends CommonCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    game.setSkillCooldown(playerId, 0);
    super.playEffect(game, playerId);
  }
}
