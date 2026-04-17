const BASE_ESSENCE_PER_GAME = 25 * 2;
const GAME_DURATION_SECONDS = 5 * 60;
const ESSENCE_MULTIPLIERS_PRICES = [100, 500, 1500, 2500, 5000, 7500, 10000, 20000, 30000];
const SPELLS_PRICES = [25, 100, 1000, 1000, 5000, 5000, 30000];
const JOURNEY_PRICES = [
  ...Array(10).fill(100),
  ...Array(10).fill(200),
  ...Array(10).fill(500),
  ...Array(10).fill(1000),
  ...Array(5).fill(2000),
  ...Array(5).fill(3000),
];

(function essenceSimulation() {
  console.log('🚀 Starting simulation');

  const results = { essence: 0, duration: 0, count: 0, multiplier: 1 };

  let essencePrices = [...ESSENCE_MULTIPLIERS_PRICES];
  let spellsPrices = [...SPELLS_PRICES];
  let journeyPrices = [...JOURNEY_PRICES];

  while (essencePrices.length) {
    if (results.essence >= essencePrices[0]) {
      results.essence -= essencePrices.shift()!;
      results.multiplier++;
      continue;
    }

    playMatch(results);
  }

  console.log(`👀 Collected essence multipliers, results: ${JSON.stringify(results)}`);

  while (spellsPrices.length) {
    if (results.essence >= spellsPrices[0]) {
      results.essence -= spellsPrices.shift()!;
      continue;
    }

    playMatch(results);
  }

  console.log(`👀 Bought all spells, results: ${JSON.stringify(results)}`);

  while (journeyPrices.length) {
    if (results.essence >= journeyPrices[0]) {
      results.essence -= journeyPrices.shift()!;
      continue;
    }

    playMatch(results);
  }

  console.log(`👀 Completed journey, results: ${JSON.stringify(results)}`);

  console.log(`✅ Completed simulation, results: ${JSON.stringify(results)}`);
  console.log(`✅ Total games: ${results.count}`);
  console.log(`✅ Total duration: ${results.duration / 60 / 60}`);
})();

function playMatch(results: { essence: number; duration: number; count: number; multiplier: number }): void {
  results.duration += GAME_DURATION_SECONDS;
  results.essence += BASE_ESSENCE_PER_GAME * results.multiplier;
  results.count++;
}
