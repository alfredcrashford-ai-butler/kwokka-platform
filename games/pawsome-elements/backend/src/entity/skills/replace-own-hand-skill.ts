import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';
import { Skill } from './skill';

export class ReplaceOwnHandSkill extends Skill {
  public override playEffect(game: PwsmGameInstanceEntity, playerId: string, payload: any): void {
    const cards = game.state.playerState[playerId].cards;
    const cardsCount = cards.length;
    game.shuffleCardsFromPlayersHand(playerId, cards);
    game.drawCardsFromPile(game.state, playerId, cardsCount);
    super.playEffect(game, playerId, payload);
  }
}
