import { ArrayUtil } from '@kwokka/utils';
import { PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';

const TOTAL_DISCARD_CARDS = 1;

export class BallOfFateCard extends CommonCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    const allCards = game.state.playerState[playerId].cards;
    const targetCards = ArrayUtil.shuffle(allCards).slice(0, TOTAL_DISCARD_CARDS);
    game.shuffleCardsFromPlayersHand(playerId, targetCards);

    super.playEffect(game, playerId);
  }
}
