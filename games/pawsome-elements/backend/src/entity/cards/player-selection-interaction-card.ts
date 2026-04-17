import { PwsmGameInstanceEntity, PlayerSelectionInteractionState } from '../game-instance';
import { InteractionCard } from './interaction-card';

// TODO: merge with selection interaction card
export abstract class PlayerSelectionInteractionCard extends InteractionCard {
  public canInteract(game: PwsmGameInstanceEntity, userId: string, targetPlayerId: string): boolean {
    const interactionState = game.state.publicState.interaction.state as PlayerSelectionInteractionState;
    return interactionState.playerId === userId && targetPlayerId !== userId && !interactionState.targetPlayerId;
  }

  public interactCard(game: PwsmGameInstanceEntity, userId: string, targetPlayerId: string): void {
    const interactionState = game.state.publicState.interaction.state as PlayerSelectionInteractionState;
    interactionState.targetPlayerId = targetPlayerId;
  }

  public isInteractionDone(game: PwsmGameInstanceEntity): boolean {
    const interactionState = game.state.publicState.interaction.state as PlayerSelectionInteractionState;
    return Boolean(interactionState.targetPlayerId);
  }

  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    super.playEffect(game, playerId);
    const interactionState: PlayerSelectionInteractionState = { playerId, targetPlayerId: null };
    game.state.publicState.interaction.state = interactionState;
  }
}
