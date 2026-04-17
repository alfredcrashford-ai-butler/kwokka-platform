import { RandomUtil } from '@kwokka/utils';
import { CardId } from '../../card';
import { PawsomeElementsConfig } from '../../config';
import { CardTransformEffect } from '../../effects';
import { PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';

export class BallOfLuckCard extends CommonCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    game.state.playerState[playerId].cards.forEach(card => {
      CardTransformEffect.apply(card, this.getRandomPossibleCardId(game))
    });

    super.playEffect(game, playerId);
  }

  private getPossibleCardsIds(game: PwsmGameInstanceEntity): CardId[] {
    const cardSet = game.lobbySettings.cardSet;
    const cardsIds = Object.keys(PawsomeElementsConfig.cardSets[cardSet]);
    return cardsIds as CardId[];
  }

  private getRandomPossibleCardId(game: PwsmGameInstanceEntity): CardId {
    return RandomUtil.randomInArray(this.getPossibleCardsIds(game));
  }
}
