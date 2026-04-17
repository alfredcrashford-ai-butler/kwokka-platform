import { PawsomeElementsConfig } from '../../config';
import { PwsmGameInstanceEntity } from '../../game-instance';
import { CompetitiveInteractionCard } from '../competitive-interaction-card';

export class SounboardCard extends CompetitiveInteractionCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    super.playEffect(game, playerId);
    game.state.publicState.turnEndAt = Date.now() + PawsomeElementsConfig.hydrantMaxDuration;
  }
}
