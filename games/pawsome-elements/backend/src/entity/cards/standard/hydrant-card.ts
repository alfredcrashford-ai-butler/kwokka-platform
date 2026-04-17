import { RandomUtil } from '@kwokka/utils';
import { CardId } from '../../card';
import { PawsomeElementsConfig } from '../../config';
import { CardTransformEffect } from '../../effects';
import { PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';

export class HydrantCard extends CommonCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    const opponents = game.players.filter((player) => player.id !== playerId);
    const possibleCardsIds = this.getPossibleCardsIds(game);

    opponents.forEach((opponent) => {
      const cards = game.getPlayersCards(opponent.id);
      if (cards.length === 0) {
        return;
      }

      const targetCard = RandomUtil.randomInArray(cards);
      const targetCardId = RandomUtil.randomInArray(possibleCardsIds);
      CardTransformEffect.apply(targetCard, targetCardId);
    });

    super.playEffect(game, playerId);
  }

  private getPossibleCardsIds(game: PwsmGameInstanceEntity): CardId[] {
    const cardSet = game.lobbySettings.cardSet;
    const cardsIds = Object.keys(PawsomeElementsConfig.cardSets[cardSet]);
    return cardsIds as CardId[];
  }
}
