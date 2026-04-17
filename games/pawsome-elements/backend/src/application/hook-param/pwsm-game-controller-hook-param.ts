import { GameControllerHookParam } from '@kwokka/sdk-node';
import { PwsmGameInstanceEntity } from '../../entity/game-instance';

export interface PlayerAction extends GameControllerHookParam.PlayerAction {
  gameInstance: PwsmGameInstanceEntity;
}

export interface PlayerDisconnected extends GameControllerHookParam.PlayerDisconnected {
  gameInstance: PwsmGameInstanceEntity;
}

export interface PlayerConnected extends GameControllerHookParam.PlayerConnected {
  gameInstance: PwsmGameInstanceEntity;
}
