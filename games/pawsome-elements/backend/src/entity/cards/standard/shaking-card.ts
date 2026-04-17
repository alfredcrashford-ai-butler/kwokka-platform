import { PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';

export class ShakingCard extends CommonCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    game.players
      .filter((player) => player.id !== playerId)
      .forEach((player) => game.drawCardsFromPile(game.state, player.id, 1));

    super.playEffect(game, playerId);
  }
}
