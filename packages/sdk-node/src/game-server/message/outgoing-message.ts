import { GameInstanceEntityState, GameInstanceEntityStatus } from '@kwokka/entities';
import { GameServerCmdMessage } from './game-server-message';

export enum OutgoingMessageType {
  Broadcast = 'broadcast',
  GameInstanceUpdated = 'game_instance_updated',
  ConnectivityUpdated = 'connectivity_updated',
  SetDisconnectReason = 'set_disconnect_reason',
}

export interface BroadcastOutgoingMessage extends GameServerCmdMessage {
  payload: {
    type: OutgoingMessageType.Broadcast;
    data: any;
  };
}

export interface SetDisconnectReasonOutgoingMessage extends GameServerCmdMessage {
  payload: {
    type: OutgoingMessageType.SetDisconnectReason;
    data: {
      code: string;
      message: string;
    };
  };
}

export interface GameInstanceUpdatedOutgoingMessage extends GameServerCmdMessage {
  payload: {
    type: OutgoingMessageType.GameInstanceUpdated;
    data: {
      id: string;
      gameId: string;
      lobbyId: string;
      status?: GameInstanceEntityStatus;
      state?: GameInstanceEntityState<any, any, any>;
      playerIds?: string[];
      results?: any;
      lobbySettings?: any;
      isPubliclyVisible?: boolean;
      finishedAt?: Date;
    };
  };
}

export interface ConnectivityUpdatedOutgoingMessage extends GameServerCmdMessage {
  payload: {
    type: OutgoingMessageType.ConnectivityUpdated;
    data: Record<string, boolean>;
  };
}
