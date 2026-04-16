import { WebSocket } from 'ws';

export interface GameServerClient {
  websocket: WebSocket;
  accountId: string;
  gameInstanceId: string;
}
