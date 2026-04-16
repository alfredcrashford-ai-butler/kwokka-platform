import { GameInstanceEntityStatus, type GameInstanceEntityState } from '@kwokka/entities';

export enum IncomingWsMessageType {
  Broadcast = 'broadcast',
  ConnectivityUpdated = 'connectivity_updated',
  GameInstanceUpdated = 'game_instance_updated',
  SetDisconnectReason = 'set_disconnect_reason',
}

export interface GameInstanceUpdatedData {
  gameInstanceId: string;
  status?: GameInstanceEntityStatus;
  state?: GameInstanceEntityState<any, any, any>;
  playerIds?: string[];
  results?: any;
  lobbySettings?: any;
}

export interface SetDisconnectReasonData {
  code: string;
  message: string;
}

export type ConnectivityUpdatedData = Record<string, boolean>;
