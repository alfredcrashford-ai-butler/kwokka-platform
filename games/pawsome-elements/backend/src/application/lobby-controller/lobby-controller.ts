import {
  GameEntity,
  GameInstanceEntity,
  GameInstanceEntityStatus,
  ItemEntity,
  LobbyEntity,
  TraitInstanceEntity,
} from '@kwokka/entities';
import { GameController, KwokkaSdkNodeClient } from '@kwokka/sdk-node';
import { PwsmGameInstanceEntity } from '../../entity/game-instance/pwsm-game-instance.entity';
import { ActiveSkillItemKey, CardFactory, ItemKey, SkillFactory, TraitKey } from '../../entity';
import { PawsomeElementsConfig } from '../../entity/config';
import { CardEffectFactory } from '../../entity/effects';
import { ErrorCode } from '../../error';
import { Results } from '../../entity/game-instance/results';
import { GameKey } from '../../entity/game-key';
import { LobbyKey } from '../../entity';
import {
  GameAbandonedDisconnectReason,
  TooManyPlayersDisconnectReason,
  GameAlreadyInProgressDisconnectReason,
  DisconnectReason,
} from '../disconnect-reason';
import { PlayerAction } from '../player-action';
import { SkillState } from '../../entity/game-instance/skill-state';
import { CardState } from '../../entity/card';
import { PwsmGameControllerHookParam } from '../hook-param';
import { RewardCalculator } from '../reward';

enum TimeoutMethodNames {
  handleTurnEnd = 'handleTurnEnd',
  handlePauseOnDisconnect = 'handlePauseOnDisconnect',
}

export abstract class LobbyController {
  protected rewardCalculator: RewardCalculator;

  public constructor(
    protected gameController: GameController,
    protected client: KwokkaSdkNodeClient,
  ) {
    this.rewardCalculator = new RewardCalculator(client);
  }

  public async onPlayerDisconnected(data: PwsmGameControllerHookParam.PlayerDisconnected): Promise<void> {
    if (data.gameInstance.status === GameInstanceEntityStatus.Initial) {
      await this.playerLeave(data.gameInstance, data.accountId);
      this.gameController.persistGameInstance(data.gameInstance);
    } else if (data.gameInstance.isInProgress && this.hasDisconnectedPlayers(data.gameInstance)) {
      this.pauseOnDisconnected(data.gameInstance, data.accountId);
    } else {
      return;
    }

    this.updateGame(data.gameInstance);
  }

  public async onPlayerConnected(data: PwsmGameControllerHookParam.PlayerConnected): Promise<void> {
    if (data.gameInstance.status === GameInstanceEntityStatus.Abandoned) {
      // Game is abandoned and you can't connect, fool
      this.disconnectPlayer(data.accountId, GameAbandonedDisconnectReason);
      return;
    }

    if (data.gameInstance.playerIds.includes(data.accountId)) {
      this.resumeAfterReconnected(data.gameInstance, data.accountId);
      this.updateGame(data.gameInstance);
      return;
    }

    const currentPlayersCount = data.gameInstance.players.length || 0;
    if (currentPlayersCount >= data.lobby.maxPlayers) {
      this.disconnectPlayer(data.accountId, TooManyPlayersDisconnectReason);
      return;
    }

    if (data.gameInstance.status !== GameInstanceEntityStatus.Initial) {
      // Game is already in progress and the user is not in the players list
      this.disconnectPlayer(data.accountId, GameAlreadyInProgressDisconnectReason);
      return;
    }

    await this.connectPlayer(data.gameInstance, data.accountId);
    const lobby = await this.client.game.getLobbyById(data.gameInstance.lobbyId);
    await this.setupLobbySettings(data.gameInstance, lobby);
    this.gameController.persistGameInstance(data.gameInstance);
    this.updateGame(data.gameInstance);
  }

  protected async playerLeave(gameInstance: PwsmGameInstanceEntity, accountId: string): Promise<void> {
    gameInstance.removePlayer(accountId);

    const realPlayerIds = gameInstance.getRealPlayersIds();
    if (!realPlayerIds.length) {
      this.abandonGame(gameInstance);
      return;
    }

    if (gameInstance.players.length === 1 && gameInstance.isInProgress) {
      await this.finish(gameInstance);
    }

    if (accountId === gameInstance.lobbySettings.hostAccountId) {
      gameInstance.lobbySettings = { ...gameInstance.lobbySettings, hostAccountId: realPlayerIds[0] };
    }
  }

  protected pauseOnDisconnected(gameInstance: PwsmGameInstanceEntity, accountId: string): void {
    gameInstance.pauseOnDisconnected(accountId);
  }

  protected setPauseOnDisconnectTimeout(gameInstance: PwsmGameInstanceEntity): void {
    const timeoutName = this.getTimeoutSignature(gameInstance.id, TimeoutMethodNames.handlePauseOnDisconnect);
    const duration = gameInstance.getMillisecondsTillPauseEnd();
    this.client.scheduler.set(
      async () => {
        gameInstance = await this.fetchGameInstance(gameInstance.id);
        await this.handlePauseOnDisconnect(gameInstance);
      },
      duration,
      timeoutName,
    );
  }

  // TODO: there is a bug: when current user is the one that disconnects - the timer
  // advances by 30s + pause duration. Should be just 30s instead.
  protected async handlePauseOnDisconnect(gameInstance: PwsmGameInstanceEntity): Promise<void> {
    const connectivity = this.gameController.getConnectivity(gameInstance.id);
    gameInstance.removeDisconnectedPlayers(connectivity);
    if (!gameInstance.hasRealPlayers && gameInstance.status !== GameInstanceEntityStatus.Finished) {
      this.abandonGame(gameInstance);
    } else if (gameInstance.players.length === 1 && gameInstance.status !== GameInstanceEntityStatus.Finished) {
      await this.finish(gameInstance);
    } else {
      this.resumeGameInstance(gameInstance);
    }

    this.updateGame(gameInstance);
  }

  protected hasDisconnectedPlayers(gameInstance: GameInstanceEntity): boolean {
    const connectivity = this.gameController.getConnectivity(gameInstance.id);
    return gameInstance.playerIds.some((id) => !connectivity[id]);
  }

  public resumeAfterReconnected(gameInstance: PwsmGameInstanceEntity, accountId: string): void {
    if (gameInstance.status === GameInstanceEntityStatus.Finished) {
      return;
    }

    gameInstance.resumeAfterReconnected(accountId);
    if (!gameInstance.isPaused && gameInstance.status === GameInstanceEntityStatus.InProgress) {
      this.resumeGameInstance(gameInstance);
    }
  }

  public onPlayerSentAction(data: PwsmGameControllerHookParam.PlayerAction): void {
    if (data.name === PlayerAction.StartGame) {
      this.onStartGame(data);
      return;
    }

    if (data.name === PlayerAction.PlayCard) {
      this.onPlayCard(data);
      return;
    }

    if (data.name === PlayerAction.SkipTurn) {
      this.onSkipTurn(data);
      return;
    }

    if (data.name === PlayerAction.PlayCardInOthersTurn) {
      this.onPlayCardInOthersTurn(data);
      return;
    }

    if (data.name === PlayerAction.InteractCard) {
      this.onInteractCard(data);
      return;
    }

    if (data.name === PlayerAction.PlaySkill) {
      this.onPlaySkill(data);
      return;
    }

    if (data.name === PlayerAction.DoubleReward) {
      this.onDoubleReward(data);
      return;
    }

    // TODO: uncomment after implementation of sequential handling of actions
    // if (data.name === PlayerAction.Leave) {
    //   this.onLeave(data, gameInstance);
    //   return;
    // }

    this.sendForbiddenError(data.accountId);
  }

  protected async onPlayCardInOthersTurn(data: PwsmGameControllerHookParam.PlayerAction): Promise<void> {
    const gameInstance = data.gameInstance;
    if (!gameInstance.isInProgress) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (gameInstance.isPaused) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!data.content?.cardInGameId) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (gameInstance.isPlayersTurn(data.accountId)) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!gameInstance.canPlayCardInOthersTurn(data.accountId, data.content.cardInGameId)) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    await this.playCardInOthersTurn(gameInstance, data.accountId, data.content.cardInGameId);
  }

  protected async playCardInOthersTurn(
    gameInstance: PwsmGameInstanceEntity,
    accountId: string,
    cardInGameId: string,
  ): Promise<void> {
    const previousCard = gameInstance.getLastCardInDiscardPile();
    gameInstance.playCard(accountId, cardInGameId);

    const lastCard = gameInstance.getLastCardInDiscardPile();
    this.applyCardPlayEffect(gameInstance, lastCard, accountId, previousCard);

    if (gameInstance.canFinish) {
      await this.finish(gameInstance);
    }

    this.updateGame(gameInstance);
  }

  protected async onPlayCard(data: PwsmGameControllerHookParam.PlayerAction): Promise<void> {
    const gameInstance = data.gameInstance;
    if (!gameInstance.isInProgress) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (gameInstance.isPaused) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!data.content?.cardInGameId) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!gameInstance.isPlayersTurn(data.accountId)) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!gameInstance.canPlayCard(data.accountId, data.content.cardInGameId)) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    await this.playCard(gameInstance, data.accountId, data.content?.cardInGameId);
  }

  protected async playCard(
    gameInstance: PwsmGameInstanceEntity,
    accountId: string,
    cardInGameId: string,
  ): Promise<void> {
    const previousCard = gameInstance.getLastCardInDiscardPile();
    gameInstance.playCard(accountId, cardInGameId);

    const lastCard = gameInstance.getLastCardInDiscardPile();
    this.applyCardPlayEffect(gameInstance, lastCard, accountId, previousCard);

    if (gameInstance.canFinish) {
      await this.finish(gameInstance);
    }

    this.updateGame(gameInstance);
  }

  protected async onPlaySkill(data: PwsmGameControllerHookParam.PlayerAction): Promise<void> {
    const gameInstance = data.gameInstance;
    if (gameInstance.status !== GameInstanceEntityStatus.InProgress) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (gameInstance.isPaused) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    const skillKey = gameInstance.getPlayersSkillKey(data.accountId);
    const skill = SkillFactory.getActiveSkillInstance(skillKey);

    if (!skill.canPlay(gameInstance, data.accountId)) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!skill.isPayloadValid(gameInstance, data.accountId, data.content)) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    this.playSkill(gameInstance, data.accountId, data.content);
  }

  protected async playSkill(gameInstance: PwsmGameInstanceEntity, accountId: string, content: any): Promise<void> {
    const skillKey = gameInstance.getPlayersSkillKey(accountId);
    const skill = SkillFactory.getActiveSkillInstance(skillKey);

    skill.playEffect(gameInstance, accountId, content);

    if (gameInstance.canFinish) {
      await this.finish(gameInstance);
    }

    this.updateGame(gameInstance);
  }

  // private async onLeave(data: PlayerSentActionData, gameInstance: PwsmGameInstanceEntity): Promise<void> {
  //   // this.disconnectPlayer(data.accountId, gameInstance.id, LeaveDisconnectReason);
  //   await this.playerLeave(gameInstance, data.accountId);
  //   this.updateGame(gameInstance);
  // }

  protected async onDoubleReward(data: PwsmGameControllerHookParam.PlayerAction): Promise<void> {
    const gameInstance = data.gameInstance;
    if (gameInstance.status !== GameInstanceEntityStatus.Finished) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (gameInstance.isPaused) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!gameInstance.canPlayerDoubleEssence(data.accountId)) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    gameInstance.doubleEssence(data.accountId);
    await this.giveReward(ItemKey.Essence, data.accountId, gameInstance.results.essence[data.accountId] / 2);

    await this.gameController.persistGameInstance(gameInstance);

    this.updateGame(gameInstance);
  }

  protected resumeGameInstance(gameInstance: PwsmGameInstanceEntity): void {
    gameInstance.resume();
  }

  protected async onStartGame(data: PwsmGameControllerHookParam.PlayerAction): Promise<void> {
    const gameInstance = data.gameInstance;
    if (data.accountId !== gameInstance.lobbySettings.hostAccountId) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (gameInstance.status !== GameInstanceEntityStatus.Initial) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (gameInstance.isPaused) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!data.lobby.isPlayerRangeValid()) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    await this.startGame(gameInstance, data.lobby);
    this.updateGame(gameInstance);
  }

  protected onSkipTurn(data: PwsmGameControllerHookParam.PlayerAction): void {
    const gameInstance = data.gameInstance;
    if (!gameInstance.isInProgress) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (gameInstance.isPaused) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!gameInstance.canPlayerSkipTurn(data.accountId)) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    this.skipTurn(gameInstance);
  }

  protected skipTurn(gameInstance: PwsmGameInstanceEntity): void {
    if (!gameInstance.isDrawPileEmpty()) {
      gameInstance.drawCardsFromPile(gameInstance.state, gameInstance.state.publicState.currentTurnPlayerId, 1);
    }
    gameInstance.transferTurnToNextPlayer(gameInstance.lobbySettings.turnDuration);
    this.updateGame(gameInstance);
  }

  protected cleanup(gameInstance: PwsmGameInstanceEntity): void {
    this.clearEndTurnTimeout(gameInstance);
    this.clearPauseOnDisconnectTimeout(gameInstance);
  }

  protected async finish(gameInstance: PwsmGameInstanceEntity): Promise<void> {
    this.cleanup(gameInstance);
    const results = await this.getResults(gameInstance);
    gameInstance.finish(results);
    await this.gameController.persistGameInstance(gameInstance);
  }

  protected getTimeoutSignature(gameInstanceId: string, timeoutId: string): string {
    return `${gameInstanceId}__${timeoutId}`;
  }

  protected getRewards(gameInstance: PwsmGameInstanceEntity, positions: string[]): Promise<Record<string, number>> {
    return this.rewardCalculator.calculateRewards(gameInstance, positions);
  }

  protected async getResults(gameInstance: PwsmGameInstanceEntity): Promise<Results> {
    const positions = gameInstance.getSortedPlayerIds();
    const positionByPlayer = positions.reduce((m, playerId, i) => ({ ...m, [playerId]: i }), {});
    const essence = await this.getRewards(gameInstance, positions);
    await this.giveRewards(gameInstance, essence);
    const canDoubleEssence = gameInstance.getRealPlayersIds().reduce((m, playerId) => ({ ...m, [playerId]: true }), {});
    return { essence, canDoubleEssence, positions, positionByPlayer };
  }

  private applyCardPlayEffect(
    game: PwsmGameInstanceEntity,
    card: CardState,
    playerId: string,
    previousCard?: CardState,
  ): void {
    const cardInstance = CardFactory.getCardInstance(card.cardId);
    if (previousCard) {
      previousCard.effects.forEach((el) => CardEffectFactory.getCardEffect(el.id).onTopPlay(game, el, card));
    }
    cardInstance.playEffect(game, playerId);
    card.effects.forEach((el) => CardEffectFactory.getCardEffect(el.id).onPlay(game, el, playerId, card));

    const playersCards = game.getPlayersCards(playerId);

    playersCards.forEach((otherCard) => {
      otherCard.effects.forEach((el) => CardEffectFactory.getCardEffect(el.id).onOtherCardPlay(game, el, card));
    });
  }

  protected async onInteractCard(data: PwsmGameControllerHookParam.PlayerAction): Promise<void> {
    const gameInstance = data.gameInstance;
    if (gameInstance.status !== GameInstanceEntityStatus.InProgress) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (gameInstance.isPaused) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!gameInstance.isInteraction()) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    await this.interactCard(data.gameInstance, data.accountId, data.content);
  }

  protected async interactCard(gameInstance: PwsmGameInstanceEntity, accountId: string, content: any): Promise<void> {
    const cardInstance = CardFactory.getInteractionCardInstance(gameInstance.state.publicState.interaction.cardId);

    if (!cardInstance.canInteract(gameInstance, accountId, content)) {
      this.sendForbiddenError(accountId);
      return;
    }

    cardInstance.interactCard(gameInstance, accountId, content);

    if (cardInstance.isInteractionDone(gameInstance)) {
      this.clearEndTurnTimeout(gameInstance);
      cardInstance.interactionDoneEffect(gameInstance, accountId);

      if (gameInstance.canFinish) {
        await this.finish(gameInstance);
      }
    }

    this.updateGame(gameInstance);
  }

  protected updateGame(gameInstance: PwsmGameInstanceEntity): void {
    this.runTimeouts(gameInstance);
    this.gameController.updateGameInstance(gameInstance);
  }

  protected sendForbiddenError(accountId: string): void {
    this.gameController.broadcastError(accountId, ErrorCode.Forbidden, 'Forbidden to perform this action');
  }

  protected async handleTurnEnd(gameInstance: PwsmGameInstanceEntity): Promise<void> {
    const lastCard = gameInstance.getLastCardInDiscardPile();
    if (lastCard) {
      this.applyCardTurnEndEffect(gameInstance, lastCard);
    } else {
      this.applyCardTurnEndEffect(gameInstance, PwsmGameInstanceEntity.getCardPlaceholder());
    }

    if (gameInstance.canFinish) {
      await this.finish(gameInstance);
    }

    this.updateGame(gameInstance);
  }

  protected async startGame(gameInstance: PwsmGameInstanceEntity, lobby: LobbyEntity): Promise<void> {
    gameInstance.status = GameInstanceEntityStatus.InProgress;
    gameInstance.lobbySettings.turnDuration = PawsomeElementsConfig.turnDuration;
    gameInstance.lobbySettings.firstTurnDuration = PawsomeElementsConfig.firstTurnDuration;
    gameInstance.lobbySettings.hydrantMaxDuration = PawsomeElementsConfig.hydrantMaxDuration;
    gameInstance.lobbySettings.soundboardMaxDuration = PawsomeElementsConfig.soundboardMaxDuration;
    gameInstance.lobbySettings.startCardsCount = PawsomeElementsConfig.startCardsCount;
    gameInstance.state = gameInstance.getStartingState();
    gameInstance.state.publicState.skills = await this.getSkillsStartingState(gameInstance);
    this.applySkillsStartEffect(gameInstance);
    this.gameController.persistGameInstance(gameInstance);
  }

  protected getLobby(key: LobbyKey): Promise<LobbyEntity> {
    return this.client.game.getLobbyByKey(key);
  }

  protected getGame(): Promise<GameEntity> {
    return this.client.game.getGameByKey(GameKey);
  }

  protected async getSkillsStartingState(game: PwsmGameInstanceEntity): Promise<SkillState> {
    const playerIds = game.getRealPlayersIds();
    const promises = playerIds.map(async (id) => {
      const trait = await this.client.trait.getTraitInstanceByTraitKey(id, TraitKey.EquippedSkill);
      if (!trait.value) {
        return null;
      }
      const item = await this.client.inventory.getItemById(trait.value);
      return { trait, item };
    });
    let traitItems: { trait: TraitInstanceEntity; item: ItemEntity }[] = await Promise.all(promises);
    traitItems = traitItems.filter(Boolean);

    const skillState: SkillState = {};
    traitItems.forEach(({ trait, item }) => {
      skillState[trait.accountId] = this.getSkillStartingState(item.key as ActiveSkillItemKey);
    });
    return skillState;
  }

  protected getSkillStartingState(skillKey: ActiveSkillItemKey): { key: ActiveSkillItemKey; cooldown: number } {
    const skill = SkillFactory.getActiveSkillInstance(skillKey);
    return { key: skillKey, cooldown: skill.cooldown };
  }

  protected disconnectPlayer(accountId: string, reason: DisconnectReason): void {
    this.gameController.disconnectPlayer(accountId, reason);
  }

  protected async connectPlayer(gameInstance: PwsmGameInstanceEntity, accountId: string): Promise<void> {
    gameInstance.addPlayer(accountId);
  }

  protected async setupLobbySettings(gameInstance: PwsmGameInstanceEntity, lobby: LobbyEntity): Promise<void> {
    if (!gameInstance.lobbySettings.essence) {
      gameInstance.lobbySettings.essence = {
        base: lobby.config.essence.base,
        multipliers: lobby.config.essence.multipliers,
      };
    }
  }

  protected abandonGame(gameInstance: PwsmGameInstanceEntity): void {
    gameInstance.status = GameInstanceEntityStatus.Abandoned;
    this.cleanup(gameInstance);
    this.gameController.persistGameInstance(gameInstance);
  }

  private applySkillsStartEffect(game: PwsmGameInstanceEntity): void {
    const playerIds = Object.keys(game.state.publicState.skills);
    playerIds.forEach((playerId) => {
      const skillKey = game.state.publicState.skills[playerId].key;
      const skill = SkillFactory.getActiveSkillInstance(skillKey);
      skill.startEffect(game, playerId);
    });
  }

  private clearEndTurnTimeout(gameInstance: PwsmGameInstanceEntity): void {
    const timeoutName = this.getTimeoutSignature(gameInstance.id, TimeoutMethodNames.handleTurnEnd);
    this.client.scheduler.clear(timeoutName);
  }

  private clearPauseOnDisconnectTimeout(gameInstance: PwsmGameInstanceEntity): void {
    const timeoutName = this.getTimeoutSignature(gameInstance.id, TimeoutMethodNames.handlePauseOnDisconnect);
    this.client.scheduler.clear(timeoutName);
  }

  private setEndTurnTimeout(gameInstance: PwsmGameInstanceEntity): void {
    const duration = gameInstance.getMillisecondsTillEndTurn();

    if (duration <= 0) {
      return;
    }

    const timeoutName = this.getTimeoutSignature(gameInstance.id, TimeoutMethodNames.handleTurnEnd);
    this.client.scheduler.clear(timeoutName);
    this.client.scheduler.set(
      async () => {
        // In the end of the turn game instance can be already updated due to interaction, or else.
        // We need to fetch the instance again before running the end turn logic.
        gameInstance = await this.fetchGameInstance(gameInstance.id);
        await this.handleTurnEnd(gameInstance);
      },
      duration,
      timeoutName,
    );
  }

  private applyCardTurnEndEffect(game: PwsmGameInstanceEntity, card: CardState): void {
    const cardInstance = CardFactory.getCardInstance(card.cardId);
    cardInstance.endTurnEffect(game);
  }

  private async giveRewards(gameInstance: PwsmGameInstanceEntity, rewards: Record<string, number>): Promise<void> {
    const playersIds = gameInstance.getRealPlayersIds();
    await Promise.all(playersIds.map((id) => this.giveReward(ItemKey.Essence, id, rewards[id])));
  }

  private async giveReward(key: ItemKey, playerId: string, quantity: number): Promise<void> {
    await this.client.inventory.giveItemInstanceByItemKey(key, playerId, quantity);
  }

  protected async fetchGameInstance(id: string): Promise<PwsmGameInstanceEntity> {
    const gameInstance = await this.gameController.getGameInstance(id);
    return PwsmGameInstanceEntity.toPwsm(gameInstance) as PwsmGameInstanceEntity;
  }

  protected runTimeouts(gameInstance: PwsmGameInstanceEntity): void {
    this.cleanup(gameInstance);
    if (!gameInstance.isInProgress) {
      return;
    }

    if (gameInstance.isPausedForPlayerDisconnect) {
      this.setPauseOnDisconnectTimeout(gameInstance);
      return;
    }

    if (!gameInstance.isPaused) {
      this.setEndTurnTimeout(gameInstance);
      return;
    }
  }
}
