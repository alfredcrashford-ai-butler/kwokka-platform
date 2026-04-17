import { PwsmGameInstanceEntity } from '../game-instance';
import { Card } from './card';

export abstract class InteractionCard extends Card {
  public override playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    const lastCardInDiscardPile = game.getLastCardInDiscardPile();
    game.state.publicState.interaction.cardId = lastCardInDiscardPile.cardId;
    game.state.publicState.interaction.startedBy = playerId;
  }

  public override endTurnEffect(game: PwsmGameInstanceEntity): void {
    const currentPlayerId = game.state.publicState.currentTurnPlayerId;
    if (!game.isInteraction()) {
      super.endTurnEffect(game);
      return;
    }

    const interactionStartedBy = game.state.publicState.interaction?.startedBy;
    if (currentPlayerId !== interactionStartedBy) {
      this.transferTurnToPlayer(game, currentPlayerId);
      return;
    }

    this.transferTurnToNextPlayer(game);
  }

  public abstract interactionDoneEffect(game: PwsmGameInstanceEntity, lastPlayerId: string): void;

  public abstract canInteract(game: PwsmGameInstanceEntity, userId: string, data: any): boolean;

  public abstract interactCard(game: PwsmGameInstanceEntity, userId: string, data: any): void;

  public abstract isInteractionDone(game: PwsmGameInstanceEntity): boolean;
}
