import { GameInstanceEntityState } from '@kwokka/entities';
import { PublicState } from './game-instance/public-state';
import { PrivateState } from './game-instance/private-state';
import { PlayerState } from './game-instance/player-state';

// TODO: added this function to avoid cycle dependency, need to properly redesign this
export function drawCardsFromPile(state: GameInstanceEntityState<PublicState, PrivateState, PlayerState>, playerId: string, count: number): void {
  const { privateState, publicState, playerState } = state;
  const cardsToDraw = privateState.pile.slice(-count);
  privateState.pile = privateState.pile.slice(0, privateState.pile.length - cardsToDraw.length);
  publicState.pileCardCount = privateState.pile.length;
  playerState[playerId] ||= { cards: [] };
  playerState[playerId].cards = [...(playerState[playerId].cards || []), ...cardsToDraw];
  publicState.playerCardCount[playerId] = playerState[playerId].cards.length;
}
