import { GameInstanceEntity, LobbyEntity } from '@kwokka/entities';

export interface PlayerAction {
  name: string;
  content: any;
  accountId: string;
  gameInstance: GameInstanceEntity;
  lobby: LobbyEntity;
}

export interface PlayerDisconnected {
  accountId: string;
  gameInstance: GameInstanceEntity;
  lobby: LobbyEntity;
}

export interface PlayerConnected {
  accountId: string;
  gameInstance: GameInstanceEntity;
  lobby: LobbyEntity;
}
