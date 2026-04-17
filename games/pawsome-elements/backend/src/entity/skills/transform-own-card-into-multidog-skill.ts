import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Skill } from './skill';
import { CardTransformEffect } from '../effects';
import { CardId } from '../card';

export class TransformOwnCardIntoMultidogSkill extends Skill {
  public override playEffect(game: PwsmGameInstanceEntity, playerId: string, payload: { cardId: string }): void {
    const allCards = game.getPlayersCards(playerId);
    const targetCard = allCards.find(card => card.cardInGameId === payload.cardId);
    CardTransformEffect.apply(targetCard, CardId.Multimatter)
    super.playEffect(game, playerId, payload);
  }

  public override isPayloadValid(game: PwsmGameInstanceEntity, playerId: string, payload: { cardId: string }): boolean {
    const cards = game.getPlayersCards(playerId);
    return payload?.cardId && cards.some((card) => card.cardInGameId === payload?.cardId);
  }
}
