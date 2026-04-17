import { CardId } from '@/game-data/card';
import { Resource } from '@/game/resource';

export const CardIdToValueResource = {
  [CardId.ArcaneHydrant]: Resource.Card.Value.Hydrant,
  [CardId.FilthHydrant]: Resource.Card.Value.Hydrant,
  [CardId.NatureHydrant]: Resource.Card.Value.Hydrant,
  // [CardId.FilthSoundboard]: Resource.Card.Value.Soundboard,
  // [CardId.ArcaneSoundboard]: Resource.Card.Value.Soundboard,
  // [CardId.NatureSoundboard]: Resource.Card.Value.Soundboard,
  [CardId.ArcaneShaking]: Resource.Card.Value.Shaking,
  [CardId.FilthShaking]: Resource.Card.Value.Shaking,
  [CardId.NatureShaking]: Resource.Card.Value.Shaking,
  [CardId.ArcaneTrashCanDiving]: Resource.Card.Value.TrashCanDiving,
  [CardId.FilthTrashCanDiving]: Resource.Card.Value.TrashCanDiving,
  [CardId.NatureTrashCanDiving]: Resource.Card.Value.TrashCanDiving,
  [CardId.ArcaneTreatHiding]: Resource.Card.Value.TreatHiding,
  [CardId.FilthTreatHiding]: Resource.Card.Value.TreatHiding,
  [CardId.NatureTreatHiding]: Resource.Card.Value.TreatHiding,
  [CardId.Multimatter]: Resource.Card.Value.Multimatter,
  [CardId.BallOfFortune]: Resource.Card.Value.BallOfFortune,
  [CardId.BallOfFate]: Resource.Card.Value.BallOfFortune,
  [CardId.BallOfCurse]: Resource.Card.Value.BallOfFortune,
  [CardId.BallOfLuck]: Resource.Card.Value.BallOfFortune,
  [CardId.BallOfWisdom]: Resource.Card.Value.BallOfFortune,
  [CardId.BallOfWish]: Resource.Card.Value.BallOfFortune,
};
