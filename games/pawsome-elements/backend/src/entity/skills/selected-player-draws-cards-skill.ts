import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Skill } from './skill';

const DRAW_CARDS_NUM = 1;

export class SelectedPlayerDrawsCardsSkill extends Skill {
  public override playEffect(game: PwsmGameInstanceEntity, playerId: string, payload: { playerId: string }): void {
    game.drawCardsFromPile(game.state, payload.playerId, DRAW_CARDS_NUM);
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
