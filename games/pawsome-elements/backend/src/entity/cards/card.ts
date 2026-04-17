import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';

export abstract class Card {
  public abstract playEffect(game: PwsmGameInstanceEntity, playerId: string): void;

  public endTurnEffect(game: PwsmGameInstanceEntity): void {
    game.drawCardsFromPile(game.state, game.state.publicState.currentTurnPlayerId, 1);
    this.transferTurnToNextPlayer(game);
  }

  public transferTurnToNextPlayer(game: PwsmGameInstanceEntity): void {
    game.transferTurnToNextPlayer(game.lobbySettings.turnDuration);
  }

  public transferTurnToPlayer(game: PwsmGameInstanceEntity, playerId: string): void {
    game.transferTurnToPlayer(playerId, game.lobbySettings.turnDuration);
  }
}
