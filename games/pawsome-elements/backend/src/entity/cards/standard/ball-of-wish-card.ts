import { RandomUtil } from '@kwokka/utils';
import { CardId } from '../../card';
import { CardTransformEffect } from '../../effects';
import { PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';

export class BallOfWishCard extends CommonCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    const randomCard = RandomUtil.randomInArray(game.state.playerState[playerId].cards);
    if (randomCard) {
      CardTransformEffect.apply(randomCard, CardId.Multimatter);
    }
    super.playEffect(game, playerId);
  }
}
