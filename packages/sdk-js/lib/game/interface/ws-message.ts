export interface WebSocketMessage {
  type: 'error' | 'cmd' | 'ping' | 'pong';
  meta: {
    timestamp: number;
  };
}

export interface WebSocketErrorMessagePayload {
  message?: string;
  code?: string;
}

export interface WebSocketErrorMessage extends WebSocketMessage {
  type: 'error';
  payload?: WebSocketErrorMessagePayload;
}

export interface WebSocketCmdMessagePayload {
  type: string;
  data: any;
}

export interface WebSocketCmdMessage extends WebSocketMessage {
  type: 'cmd';
  payload: WebSocketCmdMessagePayload;
}

export interface WebSocketPingMessage extends WebSocketMessage {
  type: 'ping' | 'pong';
}
