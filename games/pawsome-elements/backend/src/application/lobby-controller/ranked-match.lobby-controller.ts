import { GameController, KwokkaSdkNodeClient } from '@kwokka/sdk-node';
import { GameInstanceEntityStatus, LobbyEntity } from '@kwokka/entities';
import { NumberUtil } from '@kwokka/utils';
import { BotLobbyController } from './bot-lobby-controller';
import {
  PwsmGameInstanceEntity,
  LobbyKey,
  RankedLobbyConfig,
  TraitKey,
  Results,
  RatingResults,
  RatingResult,
} from '../../entity';
import { ErrorTrackerUtil, Logger } from '../../util';
import { PlayerLeftDisconnectReason } from '../disconnect-reason';

const MAX_SEARCH_DURATION_MS = 20000;

export class RankedMatchLobbyController extends BotLobbyController {
  private logPrefix = `#${this.constructor.name}:`;
  private scanInterval: NodeJS.Timeout;
  public override readonly botDifficulty = 1;

  public constructor(
    protected gameController: GameController,
    protected client: KwokkaSdkNodeClient,
  ) {
    super(gameController, client);
    this.scanInterval = setInterval(this.scanAndProcessMatches.bind(this), 1000);
  }

  protected override async setupLobbySettings(gameInstance: PwsmGameInstanceEntity, lobby: LobbyEntity<RankedLobbyConfig>): Promise<void> {
    super.setupLobbySettings(gameInstance, lobby);
    if (!gameInstance.lobbySettings.rating) {
      const config = lobby.config.rating;
      gameInstance.lobbySettings.rating = {
        players: {},
        average: 0,
        reward: config.reward,
        softCap: config.softCap,
        hardCap: config.hardCap,
        hardCapMultiplier: config.hardCapMultiplier,
        cardPenalty: config.cardPenalty,
        leavePenalty: config.leavePenalty,
      };
    }

    const noRatingIds = gameInstance.playerIds.filter(
      (id) => typeof gameInstance.lobbySettings.rating.players[id] !== 'number',
    );

    const ratingSeasonTrait = await this.client.trait.getOwnTraitInstanceByTraitKey(TraitKey.CurrentRatingSeason);

    await Promise.all(
      noRatingIds.map(async (id) => {
        const trait = await this.client.trait.getTraitInstanceByTraitKey(id, ratingSeasonTrait.value);
        gameInstance.lobbySettings.rating.players[id] = trait.value;
      }),
    );

    const ratings = Object.values(gameInstance.lobbySettings.rating.players);
    gameInstance.lobbySettings.rating.average = NumberUtil.mean(ratings);
  }

  protected override async handlePauseOnDisconnect(gameInstance: PwsmGameInstanceEntity): Promise<void> {
    this.abandonGame(gameInstance);

    const connectivity = this.gameController.getConnectivity(gameInstance.id);
    const playerIds = gameInstance.getDisconnectedPlayersIds(connectivity);
    const ratingSeasonTrait = await this.client.trait.getOwnTraitInstanceByTraitKey(TraitKey.CurrentRatingSeason);
    await Promise.all(
      playerIds.map(async (id) => {
        const trait = await this.client.trait.getTraitInstanceByTraitKey(id, ratingSeasonTrait.value);
        const newValue = Math.max(0, trait.value + gameInstance.lobbySettings.rating?.leavePenalty);
        await this.client.trait.updateTraitInstanceByTraitKey(id, ratingSeasonTrait.value, newValue);
      }),
    );

    Object.keys(connectivity)
      .filter((id) => connectivity[id])
      .forEach((id) => this.disconnectPlayer(id, PlayerLeftDisconnectReason));

    this.updateGame(gameInstance);
  }

  protected override async getResults(gameInstance: PwsmGameInstanceEntity): Promise<Results> {
    let results = await super.getResults(gameInstance);
    const playerIds = gameInstance.getSortedPlayerIds();
    const rating: RatingResults = {};
    playerIds.forEach((id, index) => (rating[id] = this.calculateRating(gameInstance, id, index)));
    results.rating = rating;

    await this.giveRatings(rating);

    return results;
  }

  private async giveRatings(rating: RatingResults): Promise<void> {
    const ratingSeasonTrait = await this.client.trait.getOwnTraitInstanceByTraitKey(TraitKey.CurrentRatingSeason);

    const promises = Object.keys(rating)
      .filter((playerId) => rating[playerId] !== null)
      .map((playerId) => {
        const newRating = rating[playerId].newRating;
        return this.client.trait.updateTraitInstanceByTraitKey(playerId, ratingSeasonTrait.value, newRating);
      });

    await Promise.all(promises);
  }

  private calculateRating(gameInstance: PwsmGameInstanceEntity, playerId: string, index: number): RatingResult {
    if (gameInstance.isBot(playerId)) {
      return null;
    }

    const config = gameInstance.lobbySettings.rating;
    const oldRating = gameInstance.lobbySettings.rating.players[playerId];
    let matchPoints = config.reward[index];
    if (matchPoints > 0) {
      let multiplier = NumberUtil.minmax(oldRating, config.softCap, config.hardCap, 1, 0);
      multiplier = NumberUtil.clamp(multiplier, config.hardCapMultiplier, 1);
      matchPoints *= multiplier;
      matchPoints = Math.ceil(matchPoints);
    }

    const cards = gameInstance.getPlayersCards(playerId).length;
    const cardsPoints = cards * config.cardPenalty;
    const diff = matchPoints + cardsPoints;
    return {
      diff,
      oldRating,
      newRating: Math.max(oldRating + diff, 0),
      positionReward: matchPoints,
      cardPenalty: cardsPoints,
    };
  }

  private async scanAndProcessMatches(): Promise<void> {
    try {
      const lobby = await this.getLobby(LobbyKey.RankedMatch);
      const now = Date.now();
      const gameInstances = this.gameController.activeGameInstances
        .filter((el) => el.lobbyId === lobby.id)
        .filter((el) => el.status === GameInstanceEntityStatus.Initial)
        .filter((el) => now - el.createdAt.getTime() > MAX_SEARCH_DURATION_MS);
      gameInstances.forEach((el) => this.processAwaitingMatch(lobby, PwsmGameInstanceEntity.toPwsm(el)));
    } catch (e: any) {
      Logger.error(`${this.logPrefix} Failed to scan and process matches.`);
      ErrorTrackerUtil.captureException(e);
    }
  }

  private async processAwaitingMatch(lobby: LobbyEntity, gameInstance: PwsmGameInstanceEntity): Promise<void> {
    this.fillGameInstanceWithBots(lobby, gameInstance);
    await this.startGame(gameInstance, lobby);
    this.updateGame(gameInstance);
  }
}
