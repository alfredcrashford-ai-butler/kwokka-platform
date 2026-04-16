export interface GameServerMessage {
  type: 'error' | 'cmd' | 'ping' | 'pong';
  meta?: {
    timestamp?: number;
  };
}

export interface GameServerErrorMessage extends GameServerMessage {
  type: 'error';
  payload?: {
    message?: string;
    code?: string;
  };
}

export interface GameServerCmdMessage extends GameServerMessage {
  type: 'cmd';
  payload: {
    type: string;
    data: any;
  };
}

export interface GameServerPingMessage extends GameServerMessage {
  type: 'ping' | 'pong';
}
