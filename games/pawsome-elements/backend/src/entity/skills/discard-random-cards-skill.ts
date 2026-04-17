import { ArrayUtil } from '@kwokka/utils';
import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Skill } from './skill';

const DISCARD_CARDS_NUM = 1;

export class DiscardRandomCardsSkill extends Skill {
  public override playEffect(game: PwsmGameInstanceEntity, playerId: string, payload: any): void {
    const allCards = game.state.playerState[playerId].cards;
    const targetCards = ArrayUtil.shuffle(allCards).slice(0, DISCARD_CARDS_NUM);
    game.shuffleCardsFromPlayersHand(playerId, targetCards);
    super.playEffect(game, playerId, payload);
  }
}
