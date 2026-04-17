import { PwsmGameInstanceEntity, SelectionInteractionState } from '../game-instance';
import { InteractionCard } from './interaction-card';

export abstract class SelectionInteractionCard extends InteractionCard {
  public canInteract(game: PwsmGameInstanceEntity, userId: string): boolean {
    const interactionState = game.state.publicState.interaction.state as SelectionInteractionState;
    return interactionState.playerId === userId && !interactionState.selection;
  }

  public interactCard(game: PwsmGameInstanceEntity, userId: string, selection: any): void {
    const interactionState = game.state.publicState.interaction.state as SelectionInteractionState;
    interactionState.selection = selection;
  }

  public isInteractionDone(game: PwsmGameInstanceEntity): boolean {
    const interactionState = game.state.publicState.interaction.state as SelectionInteractionState;
    return Boolean(interactionState.selection);
  }

  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    super.playEffect(game, playerId);
    const interactionState: SelectionInteractionState = { playerId, options: [], selection: null };
    game.state.publicState.interaction.state = interactionState;
  }

  public endTurnEffect(game: PwsmGameInstanceEntity): void {
    const interactionState = game.state.publicState.interaction.state as SelectionInteractionState;
    if (!game.state.publicState.interaction.cardId || !interactionState) {
      super.endTurnEffect(game);
      return;
    }

    this.transferTurnToNextPlayer(game);
  }
}
