import { PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';

const CARDS_TO_DRAW = 2;

export class TrashCanDivingCard extends CommonCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    const nextPlayerId = game.getNextPlayerId();
    const maxCardsToDraw = Math.max(game.state.publicState.discardPile.length - 1, 0);
    const cardsToDraw = Math.min(maxCardsToDraw, CARDS_TO_DRAW);
    const drawnCards = game.state.publicState.discardPile.slice(0, cardsToDraw);
    const discardPile = game.state.publicState.discardPile.slice(cardsToDraw);
    game.state.playerState[nextPlayerId].cards = [...game.state.playerState[nextPlayerId].cards, ...drawnCards];
    game.state.publicState.discardPile = discardPile;

    game.syncPublicState();
    super.playEffect(game, playerId);
  }
}
