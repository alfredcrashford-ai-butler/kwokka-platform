import { PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';

const CARDS_TO_DRAW = 1;

export class BallOfCurseCard extends CommonCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    game.players
      .filter((player) => player.id !== game.state.publicState.currentTurnPlayerId)
      .forEach((player) => game.drawCardsFromPile(game.state, player.id, CARDS_TO_DRAW));

    super.playEffect(game, playerId);
  }
}
