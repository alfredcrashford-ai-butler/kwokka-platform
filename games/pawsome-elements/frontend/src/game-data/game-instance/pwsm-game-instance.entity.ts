import { GameInstanceEntity, GameInstanceEntityStatus, type GameInstanceEntityState } from '@kwokka/entities';
import { ArrayUtil } from '@kwokka/utils';
import type { LobbyPlayer, ProfileConfig, LobbySettings as PwsmLobbySettings } from './lobby-settings';
import type { PlayerState } from './player-state';
import type { PrivateState } from './private-state';
import { CardId, type CardState } from '../card';
import type { PublicState } from './public-state';
import type { Results } from './results';
import type { CompetitiveInteractionState, SelectionInteractionState } from './interaction-state';
import { ActivePlayableSkillItemKeys, type ActiveSkillItemKey } from '../skills';

export type PwsmGameInstanceState = GameInstanceEntityState<PublicState, PrivateState, PlayerState>;

export class PwsmGameInstanceEntity<
  LobbySettings extends PwsmLobbySettings = PwsmLobbySettings,
> extends GameInstanceEntity<PublicState, PrivateState, PlayerState, LobbySettings, Results> {
  public get isFinished(): boolean {
    return this.status === GameInstanceEntityStatus.Finished;
  }

  public isPlayersTurn(playerId: string): boolean {
    return this.state?.publicState?.currentTurnPlayerId === playerId;
  }

  public get opponentsCount(): number {
    return (this.players.length || 1) - 1;
  }

  public getOpponents(playerId: string): LobbyPlayer[] {
    const playerIndex = this.players.findIndex((el) => el.id === playerId);
    const begin = this.players.slice(0, playerIndex);
    const end = this.players.slice(playerIndex + 1);
    return [...end, ...begin];
  }

  public getPlayersSkillCooldown(playerId: string): number {
    return this.state?.publicState?.skills?.[playerId]?.cooldown;
  }

  public isPlayersSkillReady(playerId: string): boolean {
    return this.getPlayersSkillCooldown(playerId) === 0;
  }

  public hasPlayableSkill(playerId: string): boolean {
    const skill = this.getPlayersSkill(playerId);
    return ActivePlayableSkillItemKeys.includes(skill);
  }

  public getPlayersSkill(playerId: string): ActiveSkillItemKey {
    return this.state?.publicState?.skills?.[playerId]?.key;
  }

  public hasSkill(playerId: string): boolean {
    return Boolean(this.getPlayersSkill(playerId));
  }

  public getPlayersCards(playerId: string): CardState[] {
    return this.state.playerState[playerId].cards;
  }

  public getPlayersCardsCount(playerId: string): number {
    return this.state.publicState.playerCardCount[playerId];
  }

  public getPlayersProfileConfig(playerId: string) {
    const lobbyPlayer = this.players.find((el) => el.id === playerId);
    return lobbyPlayer?.config;
  }

  public hasPlayer(playerId: string): boolean {
    return (this.players || []).some((el) => el.id === playerId);
  }

  public get players(): LobbyPlayer[] {
    return this.lobbySettings.players;
  }

  public canPlayCard(card: CardState): boolean {
    if (this.state.publicState.interaction.cardId) {
      return false;
    }

    const lastPlayedCard = this.getLastCardInDiscardPile();
    if (!lastPlayedCard) {
      return true;
    }

    if (!card) {
      return false;
    }

    if (card.config.element === 'multimatter') {
      return true;
    }

    if (lastPlayedCard.config.element === 'multimatter') {
      return true;
    }

    if (card.config.element === lastPlayedCard.config.element) {
      return true;
    }

    if (card.config.power === lastPlayedCard.config.power) {
      return true;
    }

    return false;
  }

  public getLastCardInDiscardPile(): CardState {
    return ArrayUtil.first(this.getLastCardsInDiscardPile(1));
  }

  public getLastCardsInDiscardPile(n: number): CardState[] {
    return (this.state.publicState.discardPile || []).slice(-n);
  }

  public get isPaused(): boolean {
    return Boolean(this.state.publicState.pause);
  }

  public getCardState(cardInGameId: string): CardState {
    let cardState = this.state.publicState.discardPile.find((el) => el.cardInGameId === cardInGameId);
    if (cardState) {
      return cardState;
    }

    const playerIds = this.players.map((el) => el.id);
    for (const playerId of playerIds) {
      cardState = this.state.playerState[playerId]?.cards.find((el) => el.cardInGameId === cardInGameId);

      if (cardState) {
        return cardState;
      }
    }

    // TODO: when going to share same class on backend and frontend - ensure the private state is also handled here

    return null;
  }

  public canPlayCardInOthersTurn(card: CardState): boolean {
    if (this.state.publicState.interaction.cardId) {
      return false;
    }

    const lastPlayedCard = this.getLastCardInDiscardPile();
    if (!lastPlayedCard) {
      return false;
    }

    const cardConfig = card.config;
    const lastPlayedCardConfig = lastPlayedCard.config;

    return cardConfig.element === lastPlayedCardConfig.element && cardConfig.power === lastPlayedCardConfig.power;
  }

  public canPlayerSkipTurn(playerId: string): boolean {
    if (!this.isPlayersTurn(playerId)) {
      return false;
    }

    if (this.state.publicState.interaction.cardId) {
      return false;
    }

    return true;
  }

  public isHydrantInteraction(): boolean {
    // return [CardId.ArcaneHydrant, CardId.NatureHydrant, CardId.FilthHydrant].includes(
    //   this.state.publicState.interaction?.cardId,
    // );
    return false;
  }

  public isSoundboardInteraction(): boolean {
    // return [CardId.ArcaneSoundboard, CardId.NatureSoundboard, CardId.FilthSoundboard].includes(
    //   this.state.publicState.interaction.cardId,
    // );
    return false;
  }

  public isBallOfFortuneInteraction(): boolean {
    return this.state.publicState.interaction.cardId === CardId.BallOfFortune;
  }

  public isPlayerInteracting(playerId: string): boolean {
    const interactionState = this.state.publicState.interaction?.state;
    const isActiveInSelection = (interactionState as SelectionInteractionState)?.playerId === playerId;
    const isActiveInCompetitive = (interactionState as CompetitiveInteractionState)?.[playerId] === false;
    return isActiveInSelection || isActiveInCompetitive;
  }

  public get lastPlayedCardId(): string {
    if (!this.state.publicState.discardPile.length) {
      return null;
    }
    return this.state.publicState.discardPile[this.state.publicState.discardPile.length - 1].cardInGameId;
  }

  public isBot(accountId: string): boolean {
    return this.players?.find((el) => el.id === accountId)?.isBot;
  }

  public get isInteraction(): boolean {
    return Boolean(this.state?.publicState?.interaction?.cardId);
  }

  public getBotConfig(accountId: string): ProfileConfig {
    return this.players?.find((el) => el.id === accountId)?.config;
  }
}
