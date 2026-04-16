import { WebSocket } from 'ws';
import { GameServerClient } from '../interface';

export class ClientRegistry {
  private _clients: GameServerClient[] = [];

  public get clients(): GameServerClient[] {
    return this._clients;
  }

  public get count(): number {
    return this.clients.length;
  }

  public storeClient(websocket: WebSocket, accountId: string, gameInstanceId: string): GameServerClient {
    const client = { accountId, gameInstanceId, websocket };
    this.clients.push(client);
    return client;
  }

  public cleanupClient(accountId: string): GameServerClient[] {
    const clients = this.clients || [];
    const removedClients = clients.filter((el) => el.accountId === accountId);
    this._clients = clients.filter((el) => el.accountId !== accountId);
    return removedClients;
  }

  public getClientByAccountId(accountId: string): GameServerClient {
    return this.clients.find((el) => el.accountId === accountId);
  }

  public getClientsByGameInstanceId(gameInstanceId: string): GameServerClient[] {
    return this.clients.filter((el) => el.gameInstanceId === gameInstanceId);
  }

  public getConnectivity(gameInstanceId: string): Record<string, boolean> {
    const clients = this.getClientsByGameInstanceId(gameInstanceId);
    return clients.reduce((res, client) => ({ ...res, [client.accountId]: true }), {});
  }
}
