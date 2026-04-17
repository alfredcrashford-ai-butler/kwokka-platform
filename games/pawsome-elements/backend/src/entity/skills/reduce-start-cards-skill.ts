import { ArrayUtil } from '@kwokka/utils';
import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Skill } from './skill';

const REDUCE_CARDS_NUM = 2;

export class ReduceStartCardsSkill extends Skill {
  public override readonly cooldown = 0;

  public override startEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    const allCards = game.state.playerState[playerId].cards;
    const targetCards = ArrayUtil.shuffle(allCards).slice(0, REDUCE_CARDS_NUM);
    game.shuffleCardsFromPlayersHand(playerId, targetCards);
  }

  public override canPlay(): boolean {
    return false;
  }
}
