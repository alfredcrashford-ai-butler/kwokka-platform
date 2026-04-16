import { IncomingMessage } from 'http';
import { inject, injectable } from 'inversify';
import { Socket } from 'net';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { UuidUtil } from '@kwokka/utils';
import { AccountEntity, AccountEntityType } from '@kwokka/entities';
import {
  WebSocketCmdMessage,
  WebSocketErrorMessage,
  WebSocketMessage,
  WebSocketPingMessage,
} from './websocket-message';
import { AuthInfo, ConfigService, LoggerService } from '../service';
import { EnvVarName } from '../../util';

export interface WebSocketClient extends AuthInfo {
  websocket: WebSocket;
  clientId: string;
  sessionId: string;
  groupId: string;
}

@injectable()
export abstract class WebsocketHandler {
  protected readonly logPrefix = `${this.constructor.name}:`;
  private _logger: LoggerService;
  private _clients: WebSocketClient[] = [];
  private wss = new WebSocketServer({ noServer: true });

  @inject(LoggerService)
  protected loggerService: LoggerService;

  @inject(ConfigService)
  protected config: ConfigService;

  public connect(request: IncomingMessage, socket: Socket, head: Buffer, authInfo: AuthInfo): void {
    this.wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
      // Step 1: save connection
      const sessionId = this.getQueryParamFromRequest(request, 'sessionId');
      if (!sessionId && authInfo.account.type !== AccountEntityType.Application) {
        this.logger.warn(`Disconnected client as the sessionId is missing: ${sessionId}`, authInfo);
        ws.close();
        return;
      }
      const groupId = this.getQueryParamFromRequest(request, 'groupId');
      if (!groupId) {
        this.logger.warn(`Disconnected client as the groupId is missing: ${sessionId}`, authInfo);
        ws.close();
        return;
      }
      const client = this.storeClient(ws, authInfo, sessionId, groupId);

      // Step 2: setup handlers for ws events
      this.setupWebsocketEventHandlers(client);

      // Step 3: call connected hook
      this.onConnected(client);

      // Step 3: confirm connection
      this.wss.emit('connection', ws, request);
    });
  }

  public broadcastByClientId(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.find((el) => el.clientId === clientId);
    if (!client) {
      this.logger.error(`Can not broadcast message, client not found, clientId: ${clientId}`);
      return;
    }
    this.broadcastByClient(client, message);
  }

  public broadcastByClient(client: WebSocketClient, message: WebSocketMessage): void {
    client.websocket.send(this.serializeMessage(message));
  }

  public broadcastByAccountsIds(ids: string[], message: WebSocketMessage, sessionId?: string): void {
    let clients = this.clients.filter((el) => ids.includes(el.account.id));
    if (sessionId) {
      clients = clients.filter((el) => el.sessionId === sessionId);
    }
    clients.forEach((client) => this.broadcastByClient(client, message));
  }

  public broadcastBySessionId(sessionId: string, message: WebSocketMessage): void {
    const clients = this.clients.filter((el) => el.sessionId === sessionId);
    clients.forEach((client) => this.broadcastByClient(client, message));
  }

  public get clients(): WebSocketClient[] {
    return this._clients;
  }

  protected deserializeMessage(message: Buffer): WebSocketMessage {
    try {
      const messageStr = message.toString();
      return JSON.parse(messageStr);
    } catch (e: unknown) {
      this.logger.error('Failed to parse message, error:', e);
      throw e;
    }
  }

  protected serializeMessage(message: WebSocketMessage): string {
    return JSON.stringify(message);
  }

  protected isAccountConnected(account: AccountEntity): boolean {
    return this.clients.some((el) => el.account.id === account.id);
  }

  protected abstract handleMessage(message: WebSocketCmdMessage, client: WebSocketClient): Promise<void>;

  protected abstract onConnected(client: WebSocketClient): Promise<void>;

  protected abstract onDisconnected(client: WebSocketClient): Promise<void>;

  protected async disconnectAccount(accountId: string, sessionId?: string): Promise<void> {
    let clients = this.clients.filter((el) => el.account.id === accountId);
    if (sessionId) {
      clients = clients.filter((el) => el.sessionId === el.sessionId);
    }
    await this.disconnectClients(clients);
  }

  protected async disconnectClients(clients: WebSocketClient[]): Promise<void> {
    await Promise.all(clients.map((client: WebSocketClient) => this.disconnectClient(client)));
  }

  protected async disconnectClient(client: WebSocketClient): Promise<void> {
    client.websocket.close();
  }

  protected get logger(): LoggerService {
    if (!this._logger) {
      this._logger = this.loggerService.withPrefix(this.logPrefix);
    }
    return this._logger;
  }

  private handleAnyMessage(message: WebSocketMessage, client: WebSocketClient): Promise<void> {
    if (message.type === 'cmd') {
      return this.handleMessage(message as WebSocketCmdMessage, client);
    }
    if (message.type === 'ping' || message.type === 'pong') {
      return this.handlePingMessage(message as WebSocketPingMessage, client);
    }

    this.logger.warn(`Got message from account: ${client.account.id} with unsupported type:`, message);
  }

  private async handlePingMessage(message: WebSocketPingMessage, client: WebSocketClient) {
    this.logger.debug(`Got ${message.type} message from account: ${client.account.id}`);
    if (message.type === 'ping') {
      this.broadcastByClientId(client.clientId, { type: 'pong', meta: { timestamp: Date.now() } });
    }
  }

  private setupWebsocketEventHandlers(client: WebSocketClient): void {
    client.websocket.on('message', async (message: Buffer) => {
      // need to find the current state of client on each message, as the state can change
      client = this.clients.find((el) => el.clientId === client.clientId);
      let messagePayload;
      try {
        messagePayload = this.deserializeMessage(message);
        this.logger.debug(`Received, client: ${client.account.type} ${client.account.id}, data:`, messagePayload);
        await this.handleAnyMessage(messagePayload, client);
        this.logger.debug(`Handled, client: ${client.account.type} ${client.account.id}, data:`, messagePayload);
      } catch (error: unknown) {
        this.logger.error(
          `Failed to process message, accountId: ${client.account.id}, messagePayload:`,
          messagePayload || '[unparsed]',
          error,
        );
        const errorMesage = { type: 'error', payload: { message: 'Processing failed.' } } as WebSocketErrorMessage;
        this.broadcastByClient(client, errorMesage);
      }
    });

    client.websocket.on('close', () => {
      this.onDisconnected(client);
      this.cleanupClient(client.clientId);
    });

    client.websocket.on('error', (error) => this.logger.error(`Unhandled error in websocket, message: ${error.stack}`));
  }

  private getQueryParamFromRequest(request: IncomingMessage, paramName: string): string {
    const parsedUrl = new URL(request.url, this.config.get(EnvVarName.Host));
    const sessionId = parsedUrl.searchParams.get(paramName);
    return sessionId;
  }

  private storeClient(websocket: WebSocket, authInfo: AuthInfo, sessionId: string, groupId: string): WebSocketClient {
    const client = { ...authInfo, websocket, clientId: UuidUtil.generateNoSpecialSymbols(), sessionId, groupId };
    this.clients.push(client);
    return client;
  }

  private cleanupClient(clientId: string): void {
    const clients = this.clients || [];
    if (!clients.find((el) => el.clientId === clientId)) {
      this.logger.error('Client not found, clientId:', clientId);
      return;
    }

    this._clients = clients.filter((el) => el.clientId !== clientId);
  }
}
