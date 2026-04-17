import { ArrayUtil } from '@kwokka/utils';
import { CardBurnEffect } from '../effects';
import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Skill } from './skill';

const BURN_CARDS_NUM = 1;

export class SelectedPlayerBurnsCardsSkill extends Skill {
  public override playEffect(game: PwsmGameInstanceEntity, playerId: string, payload: { playerId: string }): void {
    const allCards = game.getPlayersCards(payload.playerId);
    const targetCards = ArrayUtil.shuffle(allCards).slice(0, BURN_CARDS_NUM);
    targetCards.forEach((card) => CardBurnEffect.apply(card));
    super.playEffect(game, playerId, payload);
  }

  public override isPayloadValid(
    game: PwsmGameInstanceEntity,
    playerId: string,
    payload: { playerId: string },
  ): boolean {
    return payload?.playerId && game.hasPlayer(playerId);
  }
}
