import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Card } from './card';

export class CommonCard extends Card {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    if (game.isPlayersTurn(playerId)) {
      this.transferTurnToNextPlayer(game);
    }
  }
}
