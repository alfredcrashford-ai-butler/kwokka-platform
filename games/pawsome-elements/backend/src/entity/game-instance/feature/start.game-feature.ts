import { GameInstanceEntityState } from '@kwokka/entities';
import { UuidUtil, RandomUtil, ArrayUtil } from '@kwokka/utils';
import { PublicState } from '../public-state';
import { PawsomeElementsConfig } from '../../config';
import { PlayerState } from '../player-state';
import { PrivateState } from '../private-state';
import { drawCardsFromPile } from '../../draw-cards-from-pile';
import { GameFeature } from './game-feature';
import { CardId, CardState } from '../../card';

export class StartGameFeature extends GameFeature {
  public getStartingState(): GameInstanceEntityState<PublicState, PrivateState, PlayerState> {
    const state = this.getDefaultState();
    // Step 1: initialize card pile
    this.initializeCardPile(state);

    // Step 2: initialize players
    this.initializePlayers(state);

    // Step 3: Select user for first turn
    this.shuffleTurnOrder(state);

    // Step 4: Start timers
    this.setupTurnEndTimer(state);

    return state;
  }

  private getDefaultState(): GameInstanceEntityState<PublicState, PrivateState, PlayerState> {
    return {
      publicState: {
        discardPile: [],
        pileCardCount: 0,
        playerCardCount: {},
        turnEndAt: null,
        currentTurnPlayerId: null,
        interaction: { cardId: null, state: null, startedBy: null },
        skills: {},
      },
      privateState: {
        pile: [],
      },
      playerState: {},
    };
  }

  private initializeCardPile(state: GameInstanceEntityState<PublicState, PrivateState, PlayerState>): void {
    const cardSet = PawsomeElementsConfig.cardSets[this.game.lobbySettings.cardSet];
    const cardIds: CardId[] = Object.entries(cardSet).reduce(
      (bucket, [cardId, config]) => [...bucket, ...Array(config.count).fill(cardId)],
      [],
    );
    const pile: CardState[] = cardIds.map((cardId) => ({
      cardId,
      cardInGameId: UuidUtil.generate(6),
      config: PawsomeElementsConfig.cards[cardId],
      effects: [],
    }));
    const shuffledPile = ArrayUtil.shuffle(pile);
    state.publicState.pileCardCount = shuffledPile.length;
    state.privateState.pile = shuffledPile;
  }

  private initializePlayers(state: GameInstanceEntityState<PublicState, PrivateState, PlayerState>): void {
    this.game.lobbySettings.players.forEach((player) =>
      // TODO: refactor
      drawCardsFromPile(state, player.id, this.game.lobbySettings.startCardsCount),
    );
  }

  private shuffleTurnOrder(state: GameInstanceEntityState<PublicState, PrivateState, PlayerState>): void {
    this.game.lobbySettings.players = ArrayUtil.shuffle(this.game.lobbySettings.players);
    state.publicState.currentTurnPlayerId = this.game.lobbySettings.players[0].id;
  }

  private setupTurnEndTimer(state: GameInstanceEntityState<PublicState, PrivateState, PlayerState>): void {
    state.publicState.turnEndAt = Date.now() + this.game.lobbySettings.firstTurnDuration;
  }
}
