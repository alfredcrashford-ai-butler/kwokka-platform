export interface WebSocketMessage {
  type: 'error' | 'cmd' | 'ping' | 'pong';
  meta: { timestamp: number };
}

export interface WebSocketErrorMessage extends WebSocketMessage {
  type: 'error';
  payload?: {
    message?: string;
    code?: string;
  };
}

export interface WebSocketCmdMessage extends WebSocketMessage {
  type: 'cmd';
  payload: {
    type: string;
    data: any;
  };
}

export interface WebSocketPingMessage extends WebSocketMessage {
  type: 'ping' | 'pong';
}
