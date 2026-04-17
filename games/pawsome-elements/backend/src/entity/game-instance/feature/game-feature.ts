import { GameInstanceEntity } from '@kwokka/entities';
import { PublicState } from '../public-state';
import { PlayerState } from '../player-state';
import { PrivateState } from '../private-state';
import { LobbySettings } from '../lobby-settings';

export class GameFeature {
  public constructor(protected game: GameInstanceEntity<PublicState, PrivateState, PlayerState, LobbySettings>) {}
}
