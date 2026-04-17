export interface RatingResult {
  positionReward: number;
  cardPenalty: number;
  diff: number;
  oldRating: number;
  newRating: number;
}

export type RatingResults = Record<string, RatingResult>;

export interface Results {
  positions: string[];
  positionByPlayer: Record<string, number>;
  essence: Record<string, number>;
  canDoubleEssence: Record<string, boolean>;
  rating?: RatingResults;
}
