import { CardElement } from '@/game-data/card';
import { Resource } from '@/game/resource';

export const ElementToStoneResource = {
  [CardElement.Arcane]: Resource.Card.Stone[CardElement.Arcane],
  [CardElement.Nature]: Resource.Card.Stone[CardElement.Nature],
  [CardElement.Filth]: Resource.Card.Stone[CardElement.Filth],
  [CardElement.Multimatter]: Resource.Card.Stone[CardElement.Multimatter],
};

export const ElementToIconResource = {
  [CardElement.Arcane]: Resource.Card.ElementIcon[CardElement.Arcane],
  [CardElement.Nature]: Resource.Card.ElementIcon[CardElement.Nature],
  [CardElement.Filth]: Resource.Card.ElementIcon[CardElement.Filth],
  [CardElement.Multimatter]: Resource.Card.ElementIcon[CardElement.Multimatter],
};
