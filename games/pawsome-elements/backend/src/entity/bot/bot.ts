import { RandomUtil } from '@kwokka/utils';
import { CardId, CardState } from '../card';
import { PwsmGameInstanceEntity } from '../game-instance';
import { CardPayloadSkillKeys, PlayerPayloadSkillKeys } from '../skills';
import { PawsomeElementsConfig } from '../config';

export class Bot {
  public static getDecisionDelayMs(
    gameInstance: PwsmGameInstanceEntity,
    minDelayMult: number,
    maxDelayMult: number,
  ): number {
    const now = Date.now();
    const turnEnd = gameInstance.state.publicState.turnEndAt || Date.now();
    const timeTillTurnEndMs = turnEnd - now;
    const multiplier = RandomUtil.randomInRange(minDelayMult, maxDelayMult);
    const randomDelayChanceRoll = RandomUtil.randomInRange(0, 1);
    if (randomDelayChanceRoll < PawsomeElementsConfig.botRandomDelayChance) {
      const randomDelayMult = RandomUtil.randomInRange(minDelayMult, maxDelayMult);

      return multiplier * timeTillTurnEndMs + randomDelayMult * timeTillTurnEndMs;
    }
    return multiplier * timeTillTurnEndMs;
  }

  public static getTurnDecisionDelayMs(gameInstance: PwsmGameInstanceEntity): number {
    return this.getDecisionDelayMs(gameInstance, PawsomeElementsConfig.botMinTurnDurationMultiplier, PawsomeElementsConfig.botMaxTurnDurationMultiplier);
  }

  public static getOutOfTurnDecisionDelayMs(gameInstance: PwsmGameInstanceEntity): number {
    return this.getDecisionDelayMs(gameInstance, PawsomeElementsConfig.botMinOutOfTurnDurationMultiplier, PawsomeElementsConfig.botMaxOutOfTurnDurationMultiplier);
  }

  public static getInteractionDecisionDelayMs(gameInstance: PwsmGameInstanceEntity): number {
    return this.getDecisionDelayMs(
      gameInstance,
      PawsomeElementsConfig.botMinInteractionDurationMultiplier,
      PawsomeElementsConfig.botMaxInteractionDurationMultiplier,
    );
  }

  public static getSkillContent(botId: string, gameInstance: PwsmGameInstanceEntity): any {
    const skillKey = gameInstance.getPlayersSkillKey(botId);
    if (CardPayloadSkillKeys.includes(skillKey)) {
      const cards = gameInstance.getPlayersCards(botId);
      const card = RandomUtil.randomInArray(cards);
      return { cardId: card.cardInGameId };
    }

    if (PlayerPayloadSkillKeys.includes(skillKey)) {
      const opponentsIds = gameInstance.getOpponentsIds(botId);
      return { playerId: RandomUtil.randomInArray(opponentsIds) };
    }

    return null;
  }

  public static getPlayableCard(botId: string, gameInstance: PwsmGameInstanceEntity): CardState {
    const cards = gameInstance.getPlayersCards(botId);
    let playableCards = [];
    if (gameInstance.isPlayersTurn(botId)) {
      playableCards = cards.filter((card) => gameInstance.canPlayCard(botId, card.cardInGameId));
    } else {
      playableCards = cards.filter((card) => gameInstance.canPlayCardInOthersTurn(botId, card.cardInGameId));
    }
    return RandomUtil.randomInArray(playableCards);
  }

  public static isRandomlyLoosing(gameInstance: PwsmGameInstanceEntity, difficulty: number): boolean {
    if (gameInstance.isInteraction()) {
      return false;
    }

    const lastPlayedCard = gameInstance.getLastCardInDiscardPile();
    if (!lastPlayedCard || lastPlayedCard.cardId === CardId.Multimatter) {
      return false;
    }

    const random = RandomUtil.randomInRange(0, 1);
    return random < (1 - difficulty) * 0.5;
  }
}
