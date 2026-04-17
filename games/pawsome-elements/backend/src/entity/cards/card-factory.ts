import { CardId } from '../card';
import { Card } from './card';
import { CommonCard } from './common-card';
import { InteractionCard } from './interaction-card';
import {
  BallOfFortuneCard,
  HydrantCard,
  ShakingCard,
  SounboardCard,
  TrashCanDivingCard,
  TreatHidingCard,
  BallOfCurseCard,
  BallOfWishCard,
  BallOfWisdomCard,
  BallOfLuckCard,
  BallOfFateCard,
} from './standard';

export class CardFactory {
  public static getCardInstance(cardId: CardId): Card {
    switch (cardId) {
      case CardId.ArcaneHydrant:
      case CardId.FilthHydrant:
      case CardId.NatureHydrant:
        return new HydrantCard();
      case CardId.ArcaneTrashCanDiving:
      case CardId.FilthTrashCanDiving:
      case CardId.NatureTrashCanDiving:
        return new TrashCanDivingCard();
      // case CardId.ArcaneSoundboard:
      // case CardId.FilthSoundboard:
      // case CardId.NatureSoundboard:
      //   return new SounboardCard();
      case CardId.ArcaneShaking:
      case CardId.FilthShaking:
      case CardId.NatureShaking:
        return new ShakingCard();
      case CardId.ArcaneTreatHiding:
      case CardId.FilthTreatHiding:
      case CardId.NatureTreatHiding:
        return new TreatHidingCard();
      case CardId.BallOfFortune:
        return new BallOfFortuneCard();
      case CardId.BallOfCurse:
        return new BallOfCurseCard();
      case CardId.BallOfFate:
        return new BallOfFateCard();
      case CardId.BallOfLuck:
        return new BallOfLuckCard();
      case CardId.BallOfWisdom:
        return new BallOfWisdomCard();
      case CardId.BallOfWish:
        return new BallOfWishCard();
      default:
        return new CommonCard();
    }
  }

  public static getInteractionCardInstance(cardId: CardId): InteractionCard {
    switch (cardId) {
      // case CardId.ArcaneSoundboard:
      // case CardId.FilthSoundboard:
      // case CardId.NatureSoundboard:
      //   return new SounboardCard();
      case CardId.BallOfFortune:
        return new BallOfFortuneCard();
      default:
        throw new TypeError(`Card ${cardId} is not an interaction card!`);
    }
  }
}
