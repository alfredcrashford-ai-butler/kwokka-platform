import { GameServerCmdMessage } from './game-server-message';

export enum IncomingMessageType {
  PlayerAction = 'player_action',
}

export interface PlayerActionIncomingMessage extends GameServerCmdMessage {
  payload: {
    type: IncomingMessageType.PlayerAction;
    data: {
      name: string;
      content: any;
    };
  };
}
