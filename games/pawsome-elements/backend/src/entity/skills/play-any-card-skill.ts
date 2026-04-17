import { CardState } from '../card';
import { CardFactory } from '../cards';
import { CardEffectFactory } from '../effects';
import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Skill } from './skill';

export class PlayAnyCardSkill extends Skill {
  public override playEffect(game: PwsmGameInstanceEntity, playerId: string, payload: { cardId: string }): void {
    const previousCard = game.getLastCardInDiscardPile();
    game.playCard(playerId, payload.cardId);

    const lastCard = game.getLastCardInDiscardPile();
    game.setSkillCooldown(playerId, this.cooldown);
    this.applyCardPlayEffect(game, lastCard, playerId, previousCard);
  }

  public override isPayloadValid(game: PwsmGameInstanceEntity, playerId: string, payload: { cardId: string }): boolean {
    const cards = game.getPlayersCards(playerId);
    return payload?.cardId && cards.some((card) => card.cardInGameId === payload?.cardId);
  }

  // TODO: this is the exact same copy of mewthod in lobby controller, need to combine them properly
  private applyCardPlayEffect(
    game: PwsmGameInstanceEntity,
    card: CardState,
    playerId: string,
    previousCard?: CardState,
  ): void {
    const cardInstance = CardFactory.getCardInstance(card.cardId);
    if (previousCard) {
      previousCard.effects.forEach((el) => CardEffectFactory.getCardEffect(el.id).onTopPlay(game, el, card));
    }
    cardInstance.playEffect(game, playerId);
    card.effects.forEach((el) => CardEffectFactory.getCardEffect(el.id).onPlay(game, el, playerId, card));

    const playersCards = game.getPlayersCards(playerId);

    playersCards.forEach((otherCard) => {
      otherCard.effects.forEach((el) => CardEffectFactory.getCardEffect(el.id).onOtherCardPlay(game, el, card));
    });
  }
}
