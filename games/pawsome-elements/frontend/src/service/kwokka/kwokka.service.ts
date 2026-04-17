import { inject, injectable } from 'inversify';
import { GameConnection, GameController, KwokkaSdkJsClient } from '@kwokka/sdk-js';
import {
  GameInstanceEntityStatus,
  ItemEntity,
  ItemInstanceEntity,
  TraitEntity,
  type GameEntity,
  type GameInstanceEntity,
} from '@kwokka/entities';
import { ArrayUtil } from '@kwokka/utils';
import { ActiveSkillItemKey, GameKey, LobbyKey } from '@/game-data';
import { TraitKey } from '@/game-data/trait-key';
import { PawsomeElementsCardSet } from '@/game-data/game-instance';
import { ConfigService } from '../config';
import { LoggerService } from '../logger';
import { ItemTradeKey } from '@/game-data/item-trade-key';
import { NoteItemKeys } from '@/game-data/item-key';

const RANKED_MATCH_RATING_GAP = 100;

@injectable()
export class KwokkaService {
  public readonly client: KwokkaSdkJsClient;
  private game: GameEntity;

  public constructor(
    @inject(ConfigService) private configService: ConfigService,
    @inject(LoggerService) private logger: LoggerService,
  ) {
    this.client = new KwokkaSdkJsClient({
      endpoint: this.configService.frontendConfig.kwokkaEndpoint,
      logger: this.logger,
    });
    this.client.initialize();
  }

  public async getNotesItems(): Promise<ItemEntity[]> {
    const result = await this.client.inventory.getItemsByKeys(NoteItemKeys);
    // We need to ensure the order is the same as the keys
    return result.sort((a, b) => {
      return NoteItemKeys.indexOf(a.key as any) - NoteItemKeys.indexOf(b.key as any);
    });
  }

  public async getNotesItemsInstances(): Promise<ItemInstanceEntity[]> {
    const promises = NoteItemKeys.map((key) => this.client.inventory.getOwnItemInstanceByItemKey(key));
    return Promise.all(promises);
  }

  public async unlockFirstSpell(): Promise<void> {
    const skillKey = ActiveSkillItemKey.SelectedPlayerDrawsCards;
    let itemInstance = await this.client.inventory.getOwnItemInstanceByItemKey(skillKey);
    if (!itemInstance?.quantity) {
      itemInstance = await this.client.inventory.runOwnItemTradeByKey(ItemTradeKey.SpellSelectedPlayerDrawsCards);
    }
    const trait = await this.client.trait.getOwnTraitInstanceByTraitKey(TraitKey.EquippedSkill);
    if (!trait.value) {
      await this.client.trait.updateOwnTraitInstanceByTraitId(trait.traitId, itemInstance.itemId);
    }
  }

  public connect(controller: GameController, gameInstanceId: string): Promise<GameConnection> {
    const config = {
      controller,
      gameInstanceId,
      gameServerUrl: this.configService.frontendConfig.gameServerUrl,
    };
    return this.client.game.connect(config);
  }

  public async getGame(): Promise<GameEntity> {
    if (!this.game) {
      this.game = await this.client.game.getGameByKey(GameKey.PawsomeElements);
    }
    return this.game;
  }

  public async getMyActiveGame(): Promise<GameInstanceEntity> {
    const game = await this.getGame();
    const params = { filter: { gameId: game.id, status: GameInstanceEntityStatus.InProgress }, offset: 0, limit: 1 };
    let gameInstances = await this.client.game.listOwnGameInstances(params);
    const gameInstance = ArrayUtil.first(gameInstances.data);

    if (gameInstance) {
      return gameInstance;
    }

    params.filter.status = GameInstanceEntityStatus.Initial;
    gameInstances = await this.client.game.listOwnGameInstances(params);
    return ArrayUtil.first(gameInstances.data);
  }

  public async createRoomMatch(isPubliclyVisible: boolean, name: string): Promise<GameInstanceEntity> {
    const [game, lobby] = await Promise.all([this.getGame(), this.client.game.getLobbyByKey(LobbyKey.Room)]);
    const lobbySettings = {
      name,
      hostAccountId: this?.client?.profile?.myProfile?.accountId,
      visibility: isPubliclyVisible ? 'private' : 'public',
      cardSet: PawsomeElementsCardSet.Standard,
    };
    return await this.client.game.createGameInstance({
      gameId: game.id,
      lobbyId: lobby.id,
      isPubliclyVisible,
      lobbySettings,
    });
  }

  public async createPracticeMatch(): Promise<GameInstanceEntity> {
    const [game, lobby] = await Promise.all([this.getGame(), this.client.game.getLobbyByKey(LobbyKey.Practice)]);

    const lobbySettings = {
      hostAccountId: this?.client?.profile?.myProfile?.accountId,
      cardSet: PawsomeElementsCardSet.Standard,
    };

    return this.client.game.createGameInstance({
      gameId: game.id,
      lobbyId: lobby.id,
      isPubliclyVisible: false,
      lobbySettings,
    });
  }

  public async findQuickMatch(cardSet: PawsomeElementsCardSet): Promise<GameInstanceEntity> {
    const [game, lobby] = await Promise.all([this.getGame(), this.client.game.getLobbyByKey(LobbyKey.QuickMatch)]);
    const filter = {
      gameId: game.id,
      lobbyId: lobby.id,
      status: GameInstanceEntityStatus.Initial,
      lobbySettings: { cardSet: { eq: cardSet } },
    };
    const sort = { players: 'desc', createdAt: 'asc' } as any;
    const listResult = await this.client.game.listGameInstances({ filter, sort, offset: 0, limit: 1 });
    let [gameInstance] = listResult.data;

    if (!gameInstance) {
      gameInstance = await this.client.game.createGameInstance({
        gameId: game.id,
        lobbyId: lobby.id,
        isPubliclyVisible: true,
        lobbySettings: {
          hostAccountId: this?.client?.profile?.myProfile?.accountId,
          cardSet,
        },
      });
    }

    return gameInstance;
  }

  public async findRankedMatch(rating: number): Promise<GameInstanceEntity> {
    const [game, lobby] = await Promise.all([this.getGame(), this.client.game.getLobbyByKey(LobbyKey.RankedMatch)]);
    const filter = {
      gameId: game.id,
      lobbyId: lobby.id,
      status: GameInstanceEntityStatus.Initial,
      lobbySettings: { rating: { min: rating - RANKED_MATCH_RATING_GAP, max: rating + RANKED_MATCH_RATING_GAP } },
    };
    const sort = { players: 'desc', createdAt: 'asc' } as any;
    const listResult = await this.client.game.listGameInstances({ filter, sort, offset: 0, limit: 1 });
    let [gameInstance] = listResult.data;

    if (!gameInstance) {
      gameInstance = await this.client.game.createGameInstance({
        gameId: game.id,
        lobbyId: lobby.id,
        isPubliclyVisible: true,
        lobbySettings: {
          hostAccountId: this?.client?.profile?.myProfile?.accountId,
          cardSet: PawsomeElementsCardSet.Standard,
        },
      });
    }

    return gameInstance;
  }

  public async getTotalRankedMatchesCount(): Promise<number> {
    const [game, lobby] = await Promise.all([this.getGame(), this.client.game.getLobbyByKey(LobbyKey.RankedMatch)]);
    const filter = { gameId: game.id, lobbyId: lobby.id, status: GameInstanceEntityStatus.Finished };
    const result = await this.client.game.listOwnGameInstances({ filter, offset: 0, limit: 1 });
    return result?.meta?.count || 0;
  }

  public async getWonRankedMatchesCount(): Promise<number> {
    const [game, lobby] = await Promise.all([this.getGame(), this.client.game.getLobbyByKey(LobbyKey.RankedMatch)]);
    const filter = {
      gameId: game.id,
      lobbyId: lobby.id,
      status: GameInstanceEntityStatus.Finished,
      results: { positionByPlayer: { [this.client.accountId]: { eq: 0 } } },
    };
    const result = await this.client.game.listOwnGameInstances({ filter, offset: 0, limit: 1 });
    return result?.meta?.count || 0;
  }

  public async getCurrentRankedSeasonRating(): Promise<number> {
    const rankedSeasonTrait = await this.getCurrentRankedSeason();
    const ratingTrait = await this.client.trait.getOwnTraitInstanceByTraitKey(rankedSeasonTrait.key);
    return ratingTrait.value;
  }

  public async getCurrentRankedSeason(): Promise<TraitEntity> {
    const game = await this.getGame();
    const seasonTrait = await this.client.trait.getTraitInstanceByTraitKey(
      game.applicationAccountId,
      TraitKey.CurrentRatingSeason,
    );
    return await this.client.trait.getTraitByKey(seasonTrait.value);
  }
}
