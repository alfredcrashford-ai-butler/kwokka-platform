import { PwsmGameInstanceEntity, CompetitiveInteractionState } from '../game-instance';
import { InteractionCard } from './interaction-card';

const CARDS_TO_DRAW = 1;

export abstract class CompetitiveInteractionCard extends InteractionCard {
  public canInteract(game: PwsmGameInstanceEntity, userId: string): boolean {
    const interactionState = game.state.publicState.interaction.state as CompetitiveInteractionState;
    return !interactionState[userId];
  }

  public interactCard(game: PwsmGameInstanceEntity, userId: string): void {
    const interactionState = game.state.publicState.interaction.state as CompetitiveInteractionState;
    interactionState[userId] = true;
  }

  public isInteractionDone(game: PwsmGameInstanceEntity): boolean {
    const interactionState = game.state.publicState.interaction.state as CompetitiveInteractionState;
    return Object.values(interactionState).filter(Boolean).length === game.players.length;
  }

  public interactionDoneEffect(game: PwsmGameInstanceEntity, lastPlayerId: string): void {
    this.applyPenalty(game, lastPlayerId);
    super.endTurnEffect(game);
  }

  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    super.playEffect(game, playerId);
    const interactionState: CompetitiveInteractionState = {};
    game.players.forEach(player => interactionState[player.id] = false);
    game.state.publicState.interaction.state = interactionState;
  }

  public endTurnEffect(game: PwsmGameInstanceEntity): void {
    if (!game.isInteraction()) {
      super.endTurnEffect(game);
      return;
    }

    const interactionState = game.state.publicState.interaction.state as CompetitiveInteractionState;
    const interactedPlayers = Object.entries(interactionState)
      .filter(([, value]) => Boolean(value))
      .map(([key]) => key);
    const notInteractedPlayers = game.players.filter((player) => !interactedPlayers.includes(player.id)).map((id) => id);

    notInteractedPlayers.forEach((player) => this.applyPenalty(game, player.id));
    super.endTurnEffect(game);
  }

  protected applyPenalty(game: PwsmGameInstanceEntity, userId: string): void {
    game.drawCardsFromPile(game.state, userId, CARDS_TO_DRAW);
  }
}
