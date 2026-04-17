import { GameInstanceEntityStatus } from '@kwokka/entities';
import { CardElement, CardId, type CardState } from '@/game-data/card';
import { PwsmGameInstanceEntity, type PwsmGameInstanceState } from '@/game-data/game-instance';
import { CARDS, createCard, IDS, PLAYER_IDS, START_DATA } from './constants';

export class PwsmTutorialGameInstanceEntity extends PwsmGameInstanceEntity {
  private transitions: ((state: PwsmGameInstanceState) => PwsmGameInstanceState)[][] = [];

  public constructor(private readonly onTransition: (gameInstance: PwsmTutorialGameInstanceEntity) => any) {
    super(START_DATA as any);

    // Player turn
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, CARDS[IDS.Filth6]),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.PlayerId),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent1Id),
      (state) => this.discardPlayerCard(state, IDS.Filth6),
    ]);

    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Filth9, CardElement.Filth, 9)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent2Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Filth8, CardElement.Filth, 8)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent3Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Arcane8, CardElement.Arcane, 8)),
      (state) => this.transferTurn(state, PLAYER_IDS.PlayerId),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.PlayerId),
    ]);

    // Player turn
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, CARDS[IDS.Arcane5]),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.PlayerId),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent1Id),
      (state) => this.discardPlayerCard(state, IDS.Arcane5),
    ]);

    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Nature5, CardElement.Nature, 5)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent2Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Nature2, CardElement.Nature, 2)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent3Id),
    ]);

    this.addTransition([
      (state) => this.addCardToDiscardPile(state, CARDS[IDS.Nature2]),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.PlayerId),
      (state) => this.discardPlayerCard(state, IDS.Nature2),
    ]);

    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Nature1, CardElement.Nature, 1)),
      (state) => this.transferTurn(state, PLAYER_IDS.PlayerId),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.PlayerId),
    ]);

    // Player turn
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, CARDS[IDS.NatureShaking]),
      (state) => this.discardPlayerCard(state, IDS.NatureShaking),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.PlayerId),
      (state) => this.incrementCardsCount(state, PLAYER_IDS.Opponent1Id),
      (state) => this.incrementCardsCount(state, PLAYER_IDS.Opponent2Id),
      (state) => this.incrementCardsCount(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decreasePileCardCount(state, 3),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent1Id),
    ]);

    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Nature3, CardElement.Nature, 3)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent2Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Filth3, CardElement.Filth, 3)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent3Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Arcane3, CardElement.Arcane, 3)),
      (state) => this.transferTurn(state, PLAYER_IDS.PlayerId),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.PlayerId),
    ]);

    // Player turn
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, CARDS[IDS.ArcaneHydrant]),
      (state) => this.discardPlayerCard(state, IDS.ArcaneHydrant),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.PlayerId),
      (state) => this.startInteraction(state, PLAYER_IDS.PlayerId, CardId.ArcaneHydrant),
      (state) => this.setInteracted(state, PLAYER_IDS.PlayerId, false),
      (state) => this.setInteracted(state, PLAYER_IDS.Opponent1Id, false),
      (state) => this.setInteracted(state, PLAYER_IDS.Opponent2Id, false),
      (state) => this.setInteracted(state, PLAYER_IDS.Opponent3Id, false),
    ]);
    this.addTransition([
      (state) => this.setInteracted(state, PLAYER_IDS.PlayerId, true),
      (state) => this.setInteracted(state, PLAYER_IDS.Opponent1Id, true),
      (state) => this.setInteracted(state, PLAYER_IDS.Opponent3Id, true),
    ]);
    this.addTransition([
      (state) => this.endInteraction(state),
      (state) => this.incrementCardsCount(state, PLAYER_IDS.Opponent2Id),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decreasePileCardCount(state, 1),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent1Id),
    ]);

    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Arcane7, CardElement.Arcane, 7)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent2Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Nature7, CardElement.Nature, 7)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent3Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Nature8, CardElement.Nature, 8)),
      (state) => this.transferTurn(state, PLAYER_IDS.PlayerId),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.PlayerId),
    ]);

    this.addTransition([
      (state) => this.incrementCardsCount(state, PLAYER_IDS.Opponent1Id),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent1Id),
      (state) => this.resetSkillCooldown(state, PLAYER_IDS.PlayerId),
    ]);

    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Multimatter, CardElement.Multimatter, 0)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent2Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Nature9, CardElement.Nature, 9)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent3Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Nature8, CardElement.Nature, 8)),
      (state) => this.transferTurn(state, PLAYER_IDS.PlayerId),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.PlayerId),
    ]);

    // Player turn
    this.addTransition([
      (state) => this.incrementCardsCount(state, PLAYER_IDS.PlayerId),
      (state) => this.decreasePileCardCount(state, 1),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent1Id),
      (state) => this.addCardToPlayer(state, CARDS[IDS.Multimatter]),
    ]);

    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Filth8, CardElement.Filth, 8)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent1Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent2Id),
    ]);
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Filth4, CardElement.Filth, 4)),
      (state) => this.transferTurn(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent2Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.Opponent3Id),
    ]);

    this.addTransition([
      (state) => this.decrementCardsCount(state, PLAYER_IDS.PlayerId),
      (state) => this.addCardToDiscardPile(state, CARDS[IDS.Filth4]),
      (state) => this.discardPlayerCard(state, IDS.Filth4),
    ]);

    this.addTransition([
      (state) => this.addCardToDiscardPile(state, createCard(CardId.Arcane4, CardElement.Arcane, 4)),
      (state) => this.transferTurn(state, PLAYER_IDS.PlayerId),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.Opponent3Id),
      (state) => this.decrementSkillCooldown(state, PLAYER_IDS.PlayerId),
    ]);

    // Player turn
    this.addTransition([
      (state) => this.addCardToDiscardPile(state, CARDS[IDS.Multimatter]),
      (state) => this.discardPlayerCard(state, IDS.Multimatter),
      (state) => this.decrementCardsCount(state, PLAYER_IDS.PlayerId),
    ]);
  }

  public next(): PwsmTutorialGameInstanceEntity {
    const newInstance = this.clone();
    const transitionFns = newInstance.transitions.shift();
    newInstance.state = transitionFns.reduce((state, fn) => fn(state), newInstance.state);
    this.onTransition(newInstance);
    return newInstance;
  }

  public finish(): void {
    this.finishedAt = new Date();
    this.status = GameInstanceEntityStatus.Finished;
  }

  private clone(): PwsmTutorialGameInstanceEntity {
    const res = new PwsmTutorialGameInstanceEntity(this.onTransition);
    res.transitions = [...this.transitions];
    res.state = JSON.parse(JSON.stringify(this.state));
    res.lobbySettings = this.lobbySettings;
    res.status = this.status;
    res.playerIds = this.playerIds;
    res.gameId = this.gameId;
    res.lobbyId = this.lobbyId;
    return res;
  }

  private addTransition(transitionFns: ((state: PwsmGameInstanceState) => PwsmGameInstanceState)[]): void {
    this.transitions.push(transitionFns);
  }

  private decrementCardsCount(state: PwsmGameInstanceState, playerId: string): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        playerCardCount: {
          ...state.publicState.playerCardCount,
          [playerId]: Math.max(state.publicState.playerCardCount[playerId] - 1, 0),
        },
      },
    };
  }

  private incrementCardsCount(state: PwsmGameInstanceState, playerId: string): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        playerCardCount: {
          ...state.publicState.playerCardCount,
          [playerId]: state.publicState.playerCardCount[playerId] + 1,
        },
      },
    };
  }

  private decrementSkillCooldown(state: PwsmGameInstanceState, playerId: string): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        skills: {
          ...state.publicState.skills,
          [playerId]: {
            ...state.publicState.skills[playerId],
            cooldown: Math.max(state.publicState.skills[playerId].cooldown - 1, 0),
          },
        },
      },
    };
  }

  private resetSkillCooldown(state: PwsmGameInstanceState, playerId: string): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        skills: {
          ...state.publicState.skills,
          [playerId]: {
            ...state.publicState.skills[playerId],
            cooldown: 3,
          },
        },
      },
    };
  }

  private addCardToDiscardPile(state: PwsmGameInstanceState, card: CardState): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        discardPile: [...(state.publicState.discardPile || []), card],
      },
    };
  }

  private transferTurn(state: PwsmGameInstanceState, nextPlayerId: string): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        currentTurnPlayerId: nextPlayerId,
      },
    };
  }

  private discardPlayerCard(state: PwsmGameInstanceState, cardId: string): PwsmGameInstanceState {
    return {
      ...state,
      playerState: {
        ...state.playerState,
        [PLAYER_IDS.PlayerId]: {
          cards: state.playerState[PLAYER_IDS.PlayerId].cards.filter((el) => el.cardInGameId !== cardId),
        },
      },
    };
  }

  private startInteraction(state: PwsmGameInstanceState, playerId: string, cardId: CardId): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        interaction: {
          cardId,
          startedBy: playerId,
          state: {},
        },
      },
    };
  }

  private setInteracted(state: PwsmGameInstanceState, playerId: string, isInteracted: boolean): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        interaction: {
          ...state.publicState.interaction,
          state: {
            ...state.publicState.interaction.state,
            [playerId]: isInteracted,
          },
        },
      },
    };
  }

  private endInteraction(state: PwsmGameInstanceState): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        interaction: { cardId: null, state: null, startedBy: null },
      },
    };
  }

  private decreasePileCardCount(state: PwsmGameInstanceState, count: number): PwsmGameInstanceState {
    return {
      ...state,
      publicState: {
        ...state.publicState,
        pileCardCount: state.publicState.pileCardCount - count,
      },
    };
  }

  private addCardToPlayer(state: PwsmGameInstanceState, cardState: CardState): PwsmGameInstanceState {
    return {
      ...state,
      playerState: {
        [PLAYER_IDS.PlayerId]: {
          cards: [...state.playerState[PLAYER_IDS.PlayerId].cards, cardState],
        },
      },
    };
  }
}
