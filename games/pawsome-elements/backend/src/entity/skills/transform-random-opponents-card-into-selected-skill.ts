import { RandomUtil } from '@kwokka/utils';
import { CardTransformEffect } from '../effects';
import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Skill } from './skill';

export class TransformRandomOpponentsCardIntoSelectedSkill extends Skill {
  public override playEffect(game: PwsmGameInstanceEntity, playerId: string, payload: { cardId: string }): void {
    const allCards = game.getPlayersCards(playerId);
    const targetCard = allCards.find((card) => card.cardInGameId === payload.cardId);
    const targetCards = Object.entries(game.state.playerState)
      .filter(([id]) => id !== playerId)
      .map(([_, state]) => state)
      .map((player) => RandomUtil.randomInArray(player.cards));
    targetCards.forEach((card) => CardTransformEffect.apply(card, targetCard.cardId));
    super.playEffect(game, playerId, payload);
  }

  public override isPayloadValid(game: PwsmGameInstanceEntity, playerId: string, payload: { cardId: string }): boolean {
    const cards = game.getPlayersCards(playerId);
    return payload?.cardId && cards.some((card) => card.cardInGameId === payload?.cardId);
  }
}
