import { GameInstanceEntityStatus, LobbyEntity } from '@kwokka/entities';
import { RandomUtil } from '@kwokka/utils';
import { PwsmGameInstanceEntity } from '../../entity/game-instance/pwsm-game-instance.entity';
import { PlayerAction } from '../player-action';
import { LobbyController } from './lobby-controller';
import { Bot } from '../../entity/bot';
import { Logger } from '../../util';
import { CardId, CardState } from '../../entity/card';
import { PwsmGameControllerHookParam } from '../hook-param';
import { RealActiveSkillItemKeys, SkillFactory, SkillState } from '../../entity';
import { PawsomeElementsConfig } from '../../entity/config';

export abstract class BotLobbyController extends LobbyController {
  // 0 - is easiest, 1 - is hardest
  public readonly botDifficulty: number = 0.75;

  public override onPlayerSentAction(data: PwsmGameControllerHookParam.PlayerAction): void {
    if (data.name === PlayerAction.AddBot) {
      this.onAddBot(data);
      return;
    }

    return super.onPlayerSentAction(data);
  }

  protected override cleanup(gameInstance: PwsmGameInstanceEntity): void {
    super.cleanup(gameInstance);
    this.cleanupBotsDecisions(gameInstance);
  }

  private cleanupBotsDecisions(gameInstance: PwsmGameInstanceEntity): void {
    const botsIds = gameInstance.getBotIds();
    botsIds.forEach((botId) => this.cleanupBotDescision(botId, gameInstance));
  }

  protected cleanupBotDescision(botId: string, gameInstance: PwsmGameInstanceEntity): void {
    const timeoutName = this.getTimeoutSignature(gameInstance.id, botId);
    this.client.scheduler.clear(timeoutName);
  }

  protected runBotsDecisions(gameInstance: PwsmGameInstanceEntity): void {
    const botsIds = gameInstance.getBotIds();
    this.cleanupBotsDecisions(gameInstance);
    if (!botsIds?.length || !gameInstance.isInProgress) {
      return;
    }

    botsIds.forEach((botId) => this.runBotDecision(botId, gameInstance));
  }

  protected fillGameInstanceWithBots(lobby: LobbyEntity, gameInstance: PwsmGameInstanceEntity): void {
    Array(lobby.maxPlayers - gameInstance.players.length)
      .fill(null)
      .forEach(() => gameInstance.addBot());
  }

  protected override runTimeouts(gameInstance: PwsmGameInstanceEntity): void {
    super.runTimeouts(gameInstance);
    if (gameInstance.isInProgress && !gameInstance.isPaused) {
      this.runBotsDecisions(gameInstance);
    }
  }

  private runBotDecision(botId: string, gameInstance: PwsmGameInstanceEntity): void {
    if (gameInstance.isInteraction()) {
      this.scheduleBotInteractionDecision(botId, gameInstance);
    } else if (gameInstance.isPlayersTurn(botId)) {
      this.scheduleBotTurnDecision(botId, gameInstance);
    } else {
      this.scheduleBotOutOfTurnDecision(botId, gameInstance);
    }
  }

  private scheduleBotInteractionDecision(botId: string, gameInstance: PwsmGameInstanceEntity): void {
    const delayMs = Bot.getInteractionDecisionDelayMs(gameInstance);
    Logger.debug(`Scheduled turn decision for bot: ${botId} in ${delayMs}ms`);
    this.scheduleBotDecision(gameInstance, botId, delayMs, this.runBotInteractionDecision.bind(this));
  }

  private scheduleBotTurnDecision(botId: string, gameInstance: PwsmGameInstanceEntity): void {
    const delayMs = Bot.getTurnDecisionDelayMs(gameInstance);
    Logger.debug(`Scheduled turn decision for bot: ${botId} in ${delayMs}ms`);
    this.scheduleBotDecision(gameInstance, botId, delayMs, this.runBotTurnDecision.bind(this));
  }

  private runBotTurnDecision(botId: string, gameInstance: PwsmGameInstanceEntity): void {
    Logger.debug(`Running turn decision for bot: ${botId}`);
    if (Bot.isRandomlyLoosing(gameInstance, this.botDifficulty)) {
      Logger.debug(`Bot: ${botId} skips turn`);
      this.skipTurn(gameInstance);
      return;
    }

    const skillKey = gameInstance.getPlayersSkillKey(botId);
    const skill = SkillFactory.getActiveSkillInstance(skillKey);
    const botSpellUseChanceRoll = RandomUtil.randomInRange(0, 1);
    const isSpellProced = botSpellUseChanceRoll < PawsomeElementsConfig.botSpellUseChance;
    const canPlaySkill = skill.canPlay(gameInstance, botId);
    if (canPlaySkill && isSpellProced) {
      Logger.debug(`Bot: ${botId} plays skill`);
      const content = Bot.getSkillContent(botId, gameInstance);
      this.playSkill(gameInstance, botId, content);
      return;
    }

    const card = Bot.getPlayableCard(botId, gameInstance);
    if (!card) {
      Logger.debug(`Bot: ${botId} skips turn`);
      this.skipTurn(gameInstance);
      return;
    }

    Logger.debug(`Bot: ${botId} plays card: ${card.cardId} (in game id: ${card.cardInGameId})`);
    this.playCard(gameInstance, botId, card.cardInGameId);
  }

  private runBotInteractionDecision(botId: string, gameInstance: PwsmGameInstanceEntity): void {
    Logger.debug(`Running interaction decision for bot: ${botId}`);
    this.runBotInteract(botId, gameInstance);
    return;
  }

  private scheduleBotOutOfTurnDecision(botId: string, gameInstance: PwsmGameInstanceEntity): void {
    const delayMs = Bot.getOutOfTurnDecisionDelayMs(gameInstance);
    Logger.debug(`Scheduled out of turn decision for bot: ${botId} in ${delayMs}ms`);
    this.scheduleBotDecision(gameInstance, botId, delayMs, this.runBotOutOfTurnDecision.bind(this));
  }

  private runBotOutOfTurnDecision(botId: string, gameInstance: PwsmGameInstanceEntity): void {
    Logger.debug(`Running out of turn decision for bot: ${botId}`);
    if (gameInstance.isInteraction()) {
      if (Bot.isRandomlyLoosing(gameInstance, this.botDifficulty)) {
        return;
      }
      Logger.debug(`Bot: ${botId} interacts`);
      this.runBotInteract(botId, gameInstance);
      return;
    }

    const card = Bot.getPlayableCard(botId, gameInstance);
    if (card && !Bot.isRandomlyLoosing(gameInstance, this.botDifficulty)) {
      Logger.debug(`Bot: ${botId} plays card in others turn: ${card.cardId} (in game id: ${card.cardInGameId})`);
      this.playCardInOthersTurn(gameInstance, botId, card.cardInGameId);
    }
  }

  protected override async getSkillsStartingState(game: PwsmGameInstanceEntity): Promise<SkillState> {
    const skills = await super.getSkillsStartingState(game);

    // check if there is at least one bot
    const botsIds = game.getBotIds();
    if (!botsIds.length) {
      return skills;
    }

    // check if at least one player has a skill
    if (!Object.values(skills).some(Boolean)) {
      return skills;
    }

    botsIds.forEach((id) => {
      skills[id] = this.getSkillStartingState(RandomUtil.randomInArray(RealActiveSkillItemKeys));
    });

    return skills;
  }

  private onAddBot(data: PwsmGameControllerHookParam.PlayerAction): void {
    if (data.gameInstance.status !== GameInstanceEntityStatus.Initial) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (data.accountId !== data.gameInstance.lobbySettings.hostAccountId) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (data.gameInstance.players.length >= data.lobby.maxPlayers) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    data.gameInstance.addBot();
    this.gameController.persistGameInstance(data.gameInstance);
    this.updateGame(data.gameInstance);
  }

  private scheduleBotDecision(
    gameInstance: PwsmGameInstanceEntity,
    botId: string,
    delayMs: number,
    decisionFn: (botId: string, gameInstance: PwsmGameInstanceEntity) => void,
  ): void {
    const timeoutName = this.getTimeoutSignature(gameInstance.id, botId);
    this.client.scheduler.set(
      async () => {
        // After delay the game can be already updated due to interactions and other things.
        // Need to fetch new game instance in that case.
        const freshGameInstance = await this.fetchGameInstance(gameInstance.id);
        decisionFn(botId, freshGameInstance);
      },
      delayMs,
      timeoutName,
    );
  }

  private runBotInteract(botId: string, gameInstance: PwsmGameInstanceEntity): void {
    if (!gameInstance.canInteract(botId)) {
      return;
    }

    const lastPlayedCard = gameInstance.getLastCardInDiscardPile();
    let content: any = undefined;
    if (gameInstance.isPlayerSelectionInteractionCard(lastPlayedCard.cardId)) {
      const opponentsIds = gameInstance.getOpponentsIds(botId);
      content = RandomUtil.randomInArray(opponentsIds);
    }
    if (lastPlayedCard.cardId === CardId.BallOfFortune) {
      if (gameInstance.isPlayerInteractingInSelection(botId)) {
        const options = gameInstance.getSelectionInteractionOptions();
        const cardState: CardState = RandomUtil.randomInArray(options);
        content = cardState.cardId;
      } else {
        return;
      }
    }
    this.interactCard(gameInstance, botId, content);
  }
}
