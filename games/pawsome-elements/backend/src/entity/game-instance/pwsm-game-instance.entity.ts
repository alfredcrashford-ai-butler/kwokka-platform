import { GameInstanceEntity, GameInstanceEntityState, GameInstanceEntityStatus } from '@kwokka/entities';
import { ArrayUtil, PublicProps } from '@kwokka/utils';
import { LobbyPlayer, LobbySettings } from './lobby-settings';
import { PlayerState } from './player-state';
import { PrivateState } from './private-state';
import { PublicState } from './public-state';
import { Results } from './results';
import { PawsomeElementsConfig } from '../config';
import { drawCardsFromPile } from '../draw-cards-from-pile';
import { CardEffectFactory } from '../effects';
import { ActiveSkillItemKey } from '../skills';
import { CompetitiveInteractionState, SelectionInteractionState } from './interaction-state';
import { BotGameFeature, PauseGameFeature, StartGameFeature } from './feature';
import { CardState, CardId, CardConfig } from '../card';

export class PwsmGameInstanceEntity extends GameInstanceEntity<
  PublicState,
  PrivateState,
  PlayerState,
  LobbySettings,
  Results
> {
  public override id: string;
  private readonly pauseGameFeature = new PauseGameFeature(this);
  private readonly botGameFeature = new BotGameFeature(this);
  private readonly startGameFeature = new StartGameFeature(this);

  public get players(): LobbyPlayer[] {
    this.lobbySettings.players ??= [];
    return this.lobbySettings.players;
  }

  public set players(players: LobbyPlayer[]) {
    this.lobbySettings.players = players;
  }

  public override addPlayer(id: string): void {
    super.addPlayer(id, { cards: [] });
    this.players ||= [];
    this.players.push({ id, isBot: false });
    if (this.playerIds.length === 1) {
      this.lobbySettings.hostAccountId = id;
    }
  }

  public get isInProgress(): boolean {
    return this.status === GameInstanceEntityStatus.InProgress;
  }

  public removeDisconnectedPlayers(connectivity: Record<string, boolean>): void {
    const disconnectedPlayersIds = this.getDisconnectedPlayersIds(connectivity);
    disconnectedPlayersIds.forEach((id) => this.removePlayer(id));
  }

  public getDisconnectedPlayersIds(connectivity: Record<string, boolean>): string[] {
    return this.playerIds.filter((id) => !connectivity[id]);
  }

  public override removePlayer(id: string): void {
    this.players = this.players.filter((el) => el.id !== id);

    // shuffle all cards back to the deck
    const playerState = this.state.playerState[id];
    if (playerState) {
      this.shuffleCardsFromPlayersHand(id, playerState.cards);
      delete this.state.playerState[id];
    }
    if (this.state.publicState?.playerCardCount?.[id]) {
      delete this.state.publicState.playerCardCount[id];
    }

    // transfer turn if needed
    const opponentsIds = this.getOpponentsIds(id);
    if (this.isPlayersTurn(id) && opponentsIds.length) {
      this.transferTurnToNextPlayer(this.lobbySettings.turnDuration);
    }

    // needs to go last as it cleans the player state
    super.removePlayer(id);
  }

  public getStartingState() {
    return this.startGameFeature.getStartingState();
  }

  public finish(results: Results): void {
    this.finishedAt = new Date();
    this.status = GameInstanceEntityStatus.Finished;
    this.results = results;
  }

  public static toPwsm(gameInstance: PublicProps<GameInstanceEntity>): PwsmGameInstanceEntity {
    return new PwsmGameInstanceEntity(gameInstance);
  }

  public isPlayersTurn(playerId: string): boolean {
    return this.state.publicState.currentTurnPlayerId === playerId;
  }

  public getOpponentsIds(playerId: string): string[] {
    const playersIds = this.players.map((el) => el.id);
    return playersIds.filter((id) => id !== playerId);
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

  public canPlayCard(playerId: string, cardInGameId: string): boolean {
    if (this.state.publicState.interaction.cardId) {
      return false;
    }

    const lastPlayedCard = this.getLastCardInDiscardPile();
    if (!lastPlayedCard) {
      return true;
    }

    const cardInGame = this.state.playerState[playerId].cards.find((el) => el.cardInGameId === cardInGameId);
    if (!cardInGame) {
      return false;
    }

    if (!this.canPlayCardByEffect(cardInGame)) {
      return false;
    }

    const cardConfig = this.getCardConfig(cardInGame.cardId);
    if (cardConfig.element === 'multimatter') {
      return true;
    }

    if (lastPlayedCard.config.element === cardConfig.element) {
      return true;
    }

    if (lastPlayedCard.config.element === 'multimatter') {
      return true;
    }

    if (lastPlayedCard.config.power === cardConfig.power) {
      return true;
    }

    return false;
  }

  public canPlayCardInOthersTurn(playerId: string, cardInGameId: string): boolean {
    if (this.state.publicState.interaction.cardId) {
      return false;
    }

    const lastPlayedCard = this.getLastCardInDiscardPile();
    if (!lastPlayedCard) {
      return false;
    }

    const cardInGame = this.state.playerState[playerId].cards.find((el) => el.cardInGameId === cardInGameId);
    if (!cardInGame) {
      return false;
    }

    if (!this.canPlayCardByEffect(cardInGame)) {
      return false;
    }

    const isSameElement = cardInGame.config.element === lastPlayedCard.config.element;
    const isSamePower = cardInGame.config.power === lastPlayedCard.config.power;
    return isSameElement && isSamePower;
  }

  public playCard(playerId: string, cardInGameId: string): void {
    const playerState = this.state.playerState[playerId];
    const card = playerState.cards.find((el) => el.cardInGameId === cardInGameId);
    playerState.cards = playerState.cards.filter((el) => el.cardInGameId !== cardInGameId);
    this.state.publicState.discardPile.push(card);
    this.syncPublicState();
  }

  public get canFinish(): boolean {
    const hasPlayerWithoutCards = Object.values(this.state.playerState)
      .map((el) => el.cards)
      .some((el) => el.length === 0);
    return hasPlayerWithoutCards && !this.isInteraction();
  }

  public getLastCardInDiscardPile(): CardState {
    const pile = this.state.publicState.discardPile;
    if (pile.length === 0) {
      return null;
    }

    return pile[pile.length - 1];
  }

  public getMillisecondsTillEndTurn(): number {
    const now = Date.now();
    return Math.max(this.state.publicState.turnEndAt - now, 0);
  }

  public transferTurnToNextPlayer(duration: number): void {
    const nextPlayerId = this.getNextPlayerId();
    this.transferTurnToPlayer(nextPlayerId, duration);
    this.decrementSkillCooldown(this.state.publicState.currentTurnPlayerId);
  }

  public transferTurnToPlayer(playerId: string, duration: number): void {
    this.state.publicState.currentTurnPlayerId = playerId;
    this.state.publicState.turnEndAt = Date.now() + duration;
    this.resetInteraction();
  }

  public isInteraction(): boolean {
    return Boolean(this.state.publicState?.interaction?.cardId);
  }

  public isPlayerSelectionInteractionCard(cardId: CardId): boolean {
    return false;
    // return [].includes(cardId);
  }

  public isSelectionInteractionCard(cardId: CardId): boolean {
    return [CardId.BallOfFortune].includes(cardId);
  }

  public isCompetitiveInteractionCard(cardId: CardId): boolean {
    return false;
    // return [].includes(cardId);
  }

  public isPlayerInteractingInSelection(playerId: string): boolean {
    const interactionState = this.state.publicState.interaction.state as SelectionInteractionState;
    return interactionState?.playerId === playerId;
  }

  // TODO: this is the compy of the method in competitive card interaction, need to unite them
  public hasPlayerInteractedInCompetitive(playerId: string): boolean {
    const interactionState = this.state.publicState.interaction.state as CompetitiveInteractionState;
    return !!interactionState?.[playerId];
  }

  public getSelectionInteractionOptions(): any[] {
    const interactionState = this.state.publicState.interaction.state as SelectionInteractionState;
    return interactionState?.options || [];
  }

  public getPlayersSkillKey(playerId: string): ActiveSkillItemKey {
    return this.state.publicState.skills[playerId]?.key;
  }

  public playerHasSkill(playerId: string): boolean {
    return Boolean(this.getPlayersSkillKey(playerId));
  }

  public setSkillCooldown(playerId: string, cooldown: number): void {
    if (this.state.publicState.skills[playerId]) {
      this.state.publicState.skills[playerId].cooldown = cooldown;
    }
  }

  public hasPlayer(playerId: string): boolean {
    return this.players.some((el) => el.id === playerId);
  }

  public isSkillOnCooldown(playerId: string): boolean {
    return this.state.publicState.skills[playerId]?.cooldown !== 0;
  }

  public decrementSkillCooldown(playerId: string): void {
    if (this.state.publicState.skills[playerId]?.cooldown) {
      const targetCooldown = Math.max(this.state.publicState.skills[playerId].cooldown - 1, 0);
      this.state.publicState.skills[playerId].cooldown = targetCooldown;
    }
  }

  private getCardConfig(cardId: CardId): CardConfig {
    return PawsomeElementsConfig.cards[cardId];
  }

  public drawCardsFromPile(
    state: GameInstanceEntityState<PublicState, PrivateState, PlayerState>,
    playerId: string,
    count: number,
  ): void {
    drawCardsFromPile(state, playerId, count);
  }

  public getNextPlayerId(): string {
    const currentPlayerId = this.state.publicState.currentTurnPlayerId;
    const currentPlayerIndex = this.players.findIndex((player) => player.id === currentPlayerId);
    let nextPlayerIndex = currentPlayerIndex + 1;
    if (nextPlayerIndex === this.players.length) {
      nextPlayerIndex = 0;
    }
    return this.players[nextPlayerIndex].id;
  }

  private resetInteraction(): void {
    this.state.publicState.interaction.state = null;
    this.state.publicState.interaction.cardId = null;
    this.state.publicState.interaction.startedBy = null;
  }

  private canPlayCardByEffect(card: CardState): boolean {
    return card.effects.reduce((result, effect) => {
      const cardEffect = CardEffectFactory.getCardEffect(effect.id);
      return result && cardEffect.canPlay(this, effect, card);
    }, true);
  }

  public getPlayersCards(playerId: string): CardState[] {
    return this.state.playerState[playerId].cards;
  }

  public canInteract(playerId: string) {
    if (!this.isInteraction()) {
      return false;
    }

    const lastPlayedCard = this.getLastCardInDiscardPile();
    if (this.isSelectionInteractionCard(lastPlayedCard.cardId) && this.isPlayerInteractingInSelection(playerId)) {
      return true;
    }

    if (this.isCompetitiveInteractionCard(lastPlayedCard.cardId) && !this.hasPlayerInteractedInCompetitive(playerId)) {
      return true;
    }

    return false;
  }

  public shuffleCardsFromDiscardPile(cardsToShuffle: CardState[]) {
    const idsToShuffle = cardsToShuffle.map((el) => el.cardInGameId);
    this.state.publicState.discardPile = this.state.publicState.discardPile.filter(
      (el) => !idsToShuffle.includes(el.cardInGameId),
    );
    this.state.privateState.pile = ArrayUtil.shuffle([...cardsToShuffle, ...this.state.privateState.pile]);
    cardsToShuffle.forEach((card) => {
      card.effects.forEach((effect) => CardEffectFactory.getCardEffect(effect.id).onShuffle(this, effect, card));
    });
    this.syncPublicState();
  }

  public shuffleCardsFromPlayersHand(playerId: string, cardsToShuffle: CardState[]): void {
    if (!this.state.playerState[playerId] || !this.state.privateState.pile) {
      return;
    }

    const idsToShuffle = cardsToShuffle.map((el) => el.cardInGameId);
    this.state.playerState[playerId].cards = this.state.playerState[playerId].cards.filter(
      (el) => !idsToShuffle.includes(el.cardInGameId),
    );
    this.state.privateState.pile = ArrayUtil.shuffle([...cardsToShuffle, ...this.state.privateState.pile]);
    cardsToShuffle.forEach((card) => {
      card.effects.forEach((effect) => CardEffectFactory.getCardEffect(effect.id).onShuffle(this, effect, card));
    });
    this.syncPublicState();
  }

  public static getCardPlaceholder(): CardState {
    return {
      cardInGameId: 'placeholder',
      cardId: CardId.Placeholder,
      config: PawsomeElementsConfig.cards[CardId.Placeholder],
      effects: [],
    };
  }

  public isDrawPileEmpty(): boolean {
    return this.state.privateState.pile.length === 0;
  }

  public syncPublicState(): void {
    this.state.publicState.pileCardCount = this.state.privateState.pile.length;
    this.players.forEach(
      (el) => (this.state.publicState.playerCardCount[el.id] = this.state.playerState[el.id].cards.length),
    );
  }

  /**
   * @returns Array of player ids in ascending order in respect to the amount of cards they have (i.e. [1, 2, 3] cards).
   */
  public getSortedPlayerIds(): string[] {
    const playerState = this.state.playerState;
    const playersIds = this.players.map((el) => el.id);
    return [...playersIds].sort((a, b) => playerState[a].cards.length - playerState[b].cards.length);
  }

  public canPlayerDoubleEssence(playerId: string): boolean {
    return this.results?.canDoubleEssence[playerId] || false;
  }

  public doubleEssence(playerId: string): void {
    this.results.essence[playerId] *= 2;
    this.results.canDoubleEssence[playerId] = false;
  }

  // Bot feature

  public addBot(): void {
    this.botGameFeature.addBot();
  }

  public getBotIds(): string[] {
    return this.botGameFeature.botIds;
  }

  public getRealPlayersIds(): string[] {
    return this.botGameFeature.realPlayersIds;
  }

  public get hasRealPlayers(): boolean {
    return this.botGameFeature.hasRealPlayers;
  }

  public isBot(playerId: string): boolean {
    return this.botGameFeature.isBot(playerId);
  }

  // Pause feature

  public get canPause(): boolean {
    return this.pauseGameFeature.canPause;
  }

  public get isPaused(): boolean {
    return this.pauseGameFeature.isPaused;
  }

  public pauseOnDisconnected(accountId: string): void {
    return this.pauseGameFeature.pauseOnDisconnected(accountId);
  }

  public getMillisecondsTillPauseEnd(): number {
    return this.pauseGameFeature.getMillisecondsTillPauseEnd();
  }

  public get canResume(): boolean {
    return this.pauseGameFeature.canResume;
  }

  public get isPausedForPlayerDisconnect(): boolean {
    return this.pauseGameFeature.isPausedForPlayerDisconnect;
  }

  public resume(): void {
    return this.pauseGameFeature.resume();
  }

  public resumeAfterReconnected(accountId: string): void {
    return this.pauseGameFeature.resumeAfterDisconnected(accountId);
  }
}
