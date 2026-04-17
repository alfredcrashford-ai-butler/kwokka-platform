import { ArrayUtil, NumberUtil, RandomUtil } from '@kwokka/utils';

const TOTAL_PLAYERS = 10000;
const START_RATING = 1000;
const PLAYERS_IN_MATCH = 4;
const MATCH_POINTS = [20, 10, 0, -10];
const CARDS_RANGES = [
  [0, 0],
  [1, 6],
  [1, 6],
  [1, 6],
];
const CARDS_PENALTIES = -2;
const SIMULATION_ROUNDS = 1000;
const OUTPUT_CHUNK_NUM = 10;
const RATING_SOFT_CAP = 2000;
const RATING_HARD_CAP = 3000;
const HARD_CAP_MULTIPLIER = 0.5;
const NEAREST_GAP = 100;
const MATCHMAKING_ALGORITHM = 'nearest_with_gap';

(function ratingSimulation() {
  const ratings = Array(TOTAL_PLAYERS).fill(START_RATING);

  console.log('🚀 Starting simulation');

  for (let i = 0; i < SIMULATION_ROUNDS; i++) {
    console.log(`Simulation round (${i + 1}/${SIMULATION_ROUNDS})`);
    const parties = getMatchmakingAlg(MATCHMAKING_ALGORITHM)(ratings);
    const results = parties.map((party) => ArrayUtil.shuffle(party));
    results.forEach((party) =>
      party.forEach((index, i) => {
        ratings[index] += calculateRating(i, ratings[index]);
        ratings[index] = Math.max(ratings[index], 0);
      }),
    );
  }

  console.log('✅ Finished calculating results, preparing output');
  ratings.sort((a, b) => a - b);

  const ratingsChunked = chunkByRange(ratings, OUTPUT_CHUNK_NUM);
  const chunkVolumes = ratingsChunked.map((chunk) => ({
    min: findMin(chunk),
    max: findMax(chunk),
    volume: chunk.length,
    mean: calculateMean(chunk),
  }));

  console.log('😎 Here is your output pal:');
  console.log('------------------------------------------------------');
  console.log('|   ID   |   MEAN   |   VOLUME   |   MIN   |   MAX   |');
  console.log('------------------------------------------------------');
  chunkVolumes.forEach((el, i) => {
    const id = `${i}`.padEnd(4, ' ').padStart(8, ' ');
    const mean = `${el.mean?.toFixed(0)}`.padEnd(7, ' ').padStart(10, ' ');
    const volume = `${el.volume}`.padEnd(8, ' ').padStart(12, ' ');
    const min = `${el.min}`.padEnd(6, ' ').padStart(9, ' ');
    const max = `${el.max}`.padEnd(6, ' ').padStart(9, ' ');
    console.log(`|${id}|${mean}|${volume}|${min}|${max}|`);
  });
  console.log('------------------------------------------------------');
  console.log('🪄 Description:');
  console.log('ℹ️  ID: chunk id');
  console.log('ℹ️  MEAN: the average rating in this chunk');
  console.log('ℹ️  VOLUME: how many players are in this chunk');
  console.log('ℹ️  MIN: minimum rating in chunk');
  console.log('ℹ️  MAX: maximum rating in chunk');
  console.log('------------------------------------------------------');
  console.log('🪄 Parameters:');
  console.log(`ℹ️  TOTAL_PLAYERS: ${TOTAL_PLAYERS}`);
  console.log(`Amount of players in simulation.\n`);
  console.log(`ℹ️  START_RATING: ${START_RATING}`);
  console.log(`Amount of rating at the start for each player.\n`);
  console.log(`ℹ️  PLAYERS_IN_MATCH: ${PLAYERS_IN_MATCH}`);
  console.log(`Amount of players in a single match.\n`);
  console.log(`ℹ️  MATCH_POINTS: ${MATCH_POINTS}`);
  console.log(`Amount of points players get in the end of match.\n`);
  console.log(`ℹ️  CARDS_PENALTIES: ${CARDS_PENALTIES}`);
  console.log(`A point penalty for each card that a player has on their hand.\n`);
  console.log(`ℹ️  SIMULATION_ROUNDS: ${SIMULATION_ROUNDS}`);
  console.log(`Amount of simulation rounds. In each round, all players in the pool play once.\n`);
  console.log(`ℹ️  MATCHMAKING_ALGORITHM: ${MATCHMAKING_ALGORITHM}`);
  console.log(`Algorithm that is used for matchmaking.\n`);
  console.log(`ℹ️  SOFT_CAP: ${RATING_SOFT_CAP}`);
  console.log(`Starting from this rating player gets less and less points, the more rating they have.\n`);
  console.log(`ℹ️  HARD_CAP: ${RATING_HARD_CAP}`);
  console.log(`At this point players stop to get less points.\n`);
  console.log(`ℹ️  HARD_CAP_MULTIPLIER: ${HARD_CAP_MULTIPLIER}`);
  console.log(`Max multiplier for win points. This is what players get after HARD_CAP.`);
  console.log(`Between SOFT_CAP and HARD_CAP player will get the multiplier between 1 and HARD_CAP_MULTIPLIER.`);
  console.log(`Example: SOFT_CAP is 2000, HARD_CAP is 3000, HARD_CAP_MULTIPLIER is 0.5, and win points is 10.`);
  console.log(
    `Player wins at 2500 and gets 10 * 0.75 = 7.5 (0.75 in between 1-0.5 is the same as 2500 in between 2000 and 3000), which rounds up to 8.`,
  );
})();

function getMatchmakingAlg(algName: string): (ratings: number[]) => number[][] {
  if (algName === 'random') return matchmakingRandom;
  if (algName === 'nearest') return matchmakingNearest;
  if (algName === 'nearest_with_gap') return matchmakingNearestWithGap;

  throw new Error(`no algorithm: ${algName}`);
}

function matchmakingRandom(ratings: number[]): number[][] {
  const indices = ArrayUtil.shuffle(Object.keys(ratings));
  return chunkArray(indices, PLAYERS_IN_MATCH);
}

function matchmakingNearest(ratings: number[]): number[][] {
  const indices = Object.keys([...ratings].sort((a, b) => a - b));
  return chunkArray(indices, PLAYERS_IN_MATCH);
}

function matchmakingNearestWithGap(ratings: number[]): number[][] {
  ratings = ArrayUtil.shuffle(ratings);
  let groups: { i: number; r: number }[][] = [];
  for (let i = 0; i < ratings.length; i++) {
    const r = ratings[i];
    const group = groups.find(
      (group) => group.length < PLAYERS_IN_MATCH && Math.abs(calculateMean(group.map((el) => el.r)) - r) <= NEAREST_GAP,
    );
    if (group) {
      group.push({ i, r });
    } else {
      groups.push([{ i, r }]);
    }
  }

  groups = groups.filter((group) => group.length === PLAYERS_IN_MATCH);

  return groups.map((group) => group.map((el) => el.i));
}

function calculateRating(i: number, rating: number): number {
  let matchPoints = MATCH_POINTS[i];
  if (matchPoints > 0) {
    let multiplier = NumberUtil.minmax(rating, RATING_SOFT_CAP, RATING_HARD_CAP, 1, 0);
    multiplier = NumberUtil.clamp(multiplier, HARD_CAP_MULTIPLIER, 1);
    matchPoints *= multiplier;
    matchPoints = Math.ceil(matchPoints);
  }

  const cards = RandomUtil.randomIntegerInRange(CARDS_RANGES[i][0], CARDS_RANGES[i][1]);
  const cardsPoints = cards * CARDS_PENALTIES;
  return matchPoints + cardsPoints;
}

function chunkArray(arr: any[], size: number): any[][] {
  const result: any[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function chunkByRange(arr, numChunks) {
  if (arr.length === 0 || numChunks <= 0) return [];

  const min = arr[0];
  const max = arr[arr.length - 1];
  const step = (max - min) / numChunks;
  const chunks: number[][] = Array.from({ length: numChunks }, () => []);

  for (const num of arr) {
    let index = Math.floor((num - min) / step);
    if (index === numChunks) index = numChunks - 1; // include max in last chunk
    chunks[index].push(num);
  }

  return chunks;
}

function findMin(arr) {
  if (arr.length === 0) return 0;
  let min = arr[0];
  for (const num of arr) {
    if (num < min) min = num;
  }
  return min;
}

function findMax(arr) {
  if (arr.length === 0) return 0;
  let max = arr[0];
  for (const num of arr) {
    if (num > max) max = num;
  }
  return max;
}

function calculateMean(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}
