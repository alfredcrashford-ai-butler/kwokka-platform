import { ArrayUtil, RandomUtil, UuidUtil } from '@kwokka/utils';
import { CardId, CardEffectId, CardState } from '../../card';
import { PawsomeElementsConfig } from '../../config';
import { SelectionInteractionState, PwsmGameInstanceEntity } from '../../game-instance';
import { CommonCard } from '../common-card';
import { SelectionInteractionCard } from '../selection-interaction-card';
import { BallOfCurseCard } from './ball-of-curse-card';
import { BallOfFateCard } from './ball-of-fate-card';
import { BallOfWisdomCard } from './ball-of-wisdom-card';
import { BallOfWishCard } from './ball-of-wish-card';
import { BallOfLuckCard } from './ball-of-luck-card';

type PossibleCardId =
  | CardId.BallOfCurse
  | CardId.BallOfFate
  | CardId.BallOfWisdom
  | CardId.BallOfWish
  | CardId.BallOfLuck;
const POSSIBLE_CARDS = [
  CardId.BallOfCurse,
  CardId.BallOfFate,
  CardId.BallOfWisdom,
  CardId.BallOfWish,
  CardId.BallOfLuck,
];

export class BallOfFortuneCard extends SelectionInteractionCard {
  public playEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    super.playEffect(game, playerId);
    game.state.publicState.turnEndAt = Date.now() + PawsomeElementsConfig.ballOfFortuneMaxDuration;
    const options = this.getOptions();
    game.state.publicState.interaction.state = {
      ...game.state.publicState.interaction.state,
      options,
    } as SelectionInteractionState;
  }

  public interactionDoneEffect(game: PwsmGameInstanceEntity): void {
    const interactionState = game.state.publicState.interaction.state as SelectionInteractionState<
      CardState,
      PossibleCardId
    >;
    this.applyEffect(game, interactionState.selection);
  }

  public endTurnEffect(game: PwsmGameInstanceEntity): void {
    const interactionState = game.state.publicState.interaction.state as SelectionInteractionState<
      CardState,
      PossibleCardId
    >;
    if (!interactionState.selection) {
      const randomOption = RandomUtil.randomInArray(interactionState.options);
      const selection = randomOption.cardId;
      this.applyEffect(game, selection);
    }
    super.endTurnEffect(game);
  }

  private applyEffect(game: PwsmGameInstanceEntity, targetCardId: CardId): void {
    if (!POSSIBLE_CARDS.includes(targetCardId)) {
      return this.endTurnEffect(game);
    }

    // Transform ball of fortune into target card
    const topCard = game.getLastCardInDiscardPile();
    const effect = { id: CardEffectId.Transform, data: { originalCardId: topCard.cardId } };
    topCard.effects = [...topCard.effects, effect];
    topCard.cardId = targetCardId;
    topCard.config = PawsomeElementsConfig.cards[targetCardId];

    // Apply effect of target card
    const targetCard = this.getTargetCard(targetCardId);
    targetCard.playEffect(game, game.state.publicState.currentTurnPlayerId);
  }

  private getTargetCard(cardId: CardId): CommonCard {
    const cardsMap = {
      [CardId.BallOfCurse]: BallOfCurseCard,
      [CardId.BallOfFate]: BallOfFateCard,
      [CardId.BallOfWisdom]: BallOfWisdomCard,
      [CardId.BallOfWish]: BallOfWishCard,
      [CardId.BallOfLuck]: BallOfLuckCard,
    };

    return new cardsMap[cardId]();
  }

  private getOptions(): CardState[] {
    const optionsIds = ArrayUtil.shuffle(POSSIBLE_CARDS).slice(0, 2);
    const options: CardState[] = optionsIds.map((cardId) => ({
      cardInGameId: UuidUtil.generate(8),
      cardId,
      config: PawsomeElementsConfig.cards[cardId],
      effects: [],
    }));
    return options;
  }
}
