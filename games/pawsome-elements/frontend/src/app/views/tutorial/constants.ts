import { DecorationEntityType, GameInstanceEntityStatus } from '@kwokka/entities';
import { UuidUtil } from '@kwokka/utils';
import { CardElement, CardId, CardType, type CardState } from '@/game-data/card';
import { PawsomeElementsCardSet, PwsmGameInstanceEntity } from '@/game-data/game-instance';
import {
  BackgroundDecorationKey,
  ImageDecorationKey,
  PwsmBadgeDecorationKey,
} from '@/game-data/game-instance/decoration-key';
import { ActiveSkillItemKey } from '@/game-data';

export function createCard(
  cardId: CardId,
  element: CardElement,
  power: number,
  type: CardType = CardType.Common,
  cardInGameId: string = UuidUtil.generate(),
): CardState {
  return {
    cardInGameId: cardInGameId,
    cardId,
    config: { element, type, power },
    effects: [],
  };
}

export const IDS = {
  Filth4: 'f_4',
  NatureShaking: 'n_shaking',
  Arcane5: 'a_5',
  Nature2: 'n_2',
  Filth6: 'f_6',
  ArcaneHydrant: 'a_hydrant',
  Multimatter: 'multimatter',
};

export const PLAYER_IDS = {
  PlayerId: 'player',
  Opponent1Id: 'opponent_1',
  Opponent2Id: 'opponent_2',
  Opponent3Id: 'opponent_3',
};

export const CARDS = {
  [IDS.Filth4]: createCard(CardId.Filth4, CardElement.Filth, 4, CardType.Common, IDS.Filth4),
  [IDS.NatureShaking]: createCard(CardId.NatureShaking, CardElement.Nature, 1000, CardType.Special, IDS.NatureShaking),
  [IDS.Arcane5]: createCard(CardId.Arcane5, CardElement.Arcane, 5, CardType.Common, IDS.Arcane5),
  [IDS.Nature2]: createCard(CardId.Nature2, CardElement.Nature, 2, CardType.Common, IDS.Nature2),
  [IDS.Filth6]: createCard(CardId.Filth6, CardElement.Filth, 6, CardType.Common, IDS.Filth6),
  [IDS.ArcaneHydrant]: createCard(
    CardId.ArcaneHydrant,
    CardElement.Arcane,
    1001,
    CardType.Interaction,
    IDS.ArcaneHydrant,
  ),
  [IDS.Multimatter]: createCard(CardId.Multimatter, CardElement.Multimatter, 2000, CardType.Special, IDS.Multimatter),
};

export const START_CARDS_COUNT = 6;

export const START_DATA: Partial<PwsmGameInstanceEntity> = {
  state: {
    publicState: {
      discardPile: [],
      pileCardCount: 74,
      turnEndAt: null,
      currentTurnPlayerId: PLAYER_IDS.PlayerId,
      playerCardCount: {
        [PLAYER_IDS.PlayerId]: START_CARDS_COUNT,
        [PLAYER_IDS.Opponent1Id]: START_CARDS_COUNT,
        [PLAYER_IDS.Opponent2Id]: START_CARDS_COUNT,
        [PLAYER_IDS.Opponent3Id]: START_CARDS_COUNT,
      },
      interaction: {
        startedBy: null,
        cardId: null,
        state: null,
      },
      skills: {
        [PLAYER_IDS.PlayerId]: { key: ActiveSkillItemKey.SelectedPlayerDrawsCards, cooldown: 3 },
        [PLAYER_IDS.Opponent1Id]: { key: ActiveSkillItemKey.ReplaceOwnHand, cooldown: 3 },
        [PLAYER_IDS.Opponent2Id]: { key: ActiveSkillItemKey.PlayAnyCard, cooldown: 3 },
        [PLAYER_IDS.Opponent3Id]: { key: ActiveSkillItemKey.TransformOwnCardIntoMultidog, cooldown: 3 },
      },
    },
    privateState: { pile: [] },
    playerState: {
      [PLAYER_IDS.PlayerId]: {
        cards: [
          CARDS[IDS.Filth4],
          CARDS[IDS.NatureShaking],
          CARDS[IDS.Arcane5],
          CARDS[IDS.Nature2],
          CARDS[IDS.Filth6],
          CARDS[IDS.ArcaneHydrant],
        ],
      },
      [PLAYER_IDS.Opponent1Id]: { cards: [] },
      [PLAYER_IDS.Opponent2Id]: { cards: [] },
      [PLAYER_IDS.Opponent3Id]: { cards: [] },
    },
  },
  gameId: null,
  lobbyId: null,
  lobbySettings: {
    hostAccountId: PLAYER_IDS.PlayerId,
    startCardsCount: START_CARDS_COUNT,
    cardSet: PawsomeElementsCardSet.Standard,
    players: [
      {
        id: PLAYER_IDS.PlayerId,
        isBot: false,
        config: {
          name: '(you)',
          decorations: {
            [DecorationEntityType.Image]: ImageDecorationKey.Shao,
            [DecorationEntityType.Background]: BackgroundDecorationKey.RunicBoard,
            [DecorationEntityType.Badge]: PwsmBadgeDecorationKey.Pioneer,
          },
        },
      },
      {
        id: PLAYER_IDS.Opponent1Id,
        isBot: true,
        config: {
          name: 'Jackie',
          decorations: {
            [DecorationEntityType.Image]: ImageDecorationKey.Jimmy,
            [DecorationEntityType.Background]: BackgroundDecorationKey.MoltenStone,
            [DecorationEntityType.Badge]: PwsmBadgeDecorationKey.Magician,
          },
        },
      },
      {
        id: PLAYER_IDS.Opponent2Id,
        isBot: true,
        config: {
          name: 'Sam',
          decorations: {
            [DecorationEntityType.Image]: ImageDecorationKey.Kurio,
            [DecorationEntityType.Background]: BackgroundDecorationKey.Plank,
            [DecorationEntityType.Badge]: PwsmBadgeDecorationKey.Witness,
          },
        },
      },
      {
        id: PLAYER_IDS.Opponent3Id,
        isBot: true,
        config: {
          name: 'Finn',
          decorations: {
            [DecorationEntityType.Image]: ImageDecorationKey.Carl,
            [DecorationEntityType.Background]: BackgroundDecorationKey.AsureScroll,
            [DecorationEntityType.Badge]: PwsmBadgeDecorationKey.Spellcaster,
          },
        },
      },
    ],
  },
  status: GameInstanceEntityStatus.InProgress,
  playerIds: [PLAYER_IDS.PlayerId],
  startedAt: new Date(),
};
