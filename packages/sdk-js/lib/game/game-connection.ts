import { AuthAPI } from '../auth';
import { AuthInternalAPI } from '../auth-internal';
import type { KwokkaSdkJsConfig } from '../config';
import { KwokkaSdkJsError, ErrorCode } from '../error';
import { logPrefix } from '../util';
import { Communicator } from './communicator';
import { GameController } from './game-controller';
import {
  ConnectivityUpdatedData,
  DisconnectReason,
  IncomingWsMessageType,
  SetDisconnectReasonData,
  UnknownDisconnectReason,
  type GameInstanceUpdatedData,
  type WebSocketCmdMessage,
  type WebSocketErrorMessage,
  type WebSocketMessage,
  type WebSocketPingMessage,
} from './interface';

export class GameConnection {
  private _timestampOffset: number = 0;
  private _ping: number = 0;
  private _pingTimestamps: number[] = [];
  private disconnectReason: DisconnectReason = UnknownDisconnectReason;
  private communicator: Communicator;
  private ws: WebSocket;
  private pingInterval: number;
  private pingIntervalMs = 1000;
  private _openEventListener: () => void;

  public constructor(
    private readonly controller: GameController,
    private readonly authInternal: AuthInternalAPI,
    private readonly config: KwokkaSdkJsConfig,
  ) {
  }

  public start(connectToken: string, gameServerUrl: string): Promise<void> {
    return this.authInternal.withAuth(
      () =>
        new Promise((resolve, reject) => {
          let isConnected = false;
          const url = `${gameServerUrl}?connectToken=${connectToken}`;
          this.ws = new WebSocket(url);
          this._openEventListener = () => {
            isConnected = true;
            this.communicator = new Communicator(this.ws, this.config.logger);
            this.controller['communicator'] = this.communicator
            this.controller.onConnected();
            this.onOpen();
            resolve();
          };
          this.ws.addEventListener('open', this._openEventListener);
          this.ws.onmessage = (event: MessageEvent) => this.onMessage(event);
          this.ws.onclose = () => {
            this.onClose();
            if (isConnected) {
              this.controller.onDisconnected(this.disconnectReason);
            }
          };
          this.ws.onerror = (event: Event) => {
            this.onError(event);
            if (!isConnected) {
              reject();
            }
          };
          this.disconnectReason = UnknownDisconnectReason;
        }),
    );
  }

  public close() {
    if (([WebSocket.OPEN, WebSocket.CONNECTING] as number[]).includes(this.ws.readyState)) {
      this.ws.close();
    }
  }

  public getTimestampWithOffset(timestamp: number): number {
    return timestamp + this.timestampOffset;
  }

  public get timestampOffset(): number {
    return this._timestampOffset;
  }

  public get ping(): number {
    return this._ping;
  }

  private setTimestampOffset(serverTimestamp: number): void {
    this._timestampOffset = Date.now() - serverTimestamp - this.ping;
  }

  private onClose(): void {
    clearInterval(this.pingInterval);
    this.ws.removeEventListener('open', this._openEventListener);
  }

  private onOpen(): void {
    this.pingInterval = setInterval(() => {
      this.communicator.send({ type: 'ping', meta: { timestamp: Date.now() } });
      this._pingTimestamps.push(Date.now());
    }, this.pingIntervalMs);
  }

  private async onMessage(event: MessageEvent): Promise<void> {
    const data = event.data;
    try {
      const message = JSON.parse(data) as WebSocketMessage;
      await this.handleMessage(message);
    } catch (error: any) {
      console.error(`Could not process message. Data: ${data}. Error: ${error?.stack || error?.message || error}`);
      this.controller.onUnhandledError(
        new KwokkaSdkJsError('Failed to handle message', ErrorCode.UnexpectedError, { error, data }),
      );
    }
  }

  private onError(event: Event): void {
    this.config.logger.error(`${logPrefix} Got error in WebSocket connection`, event);
    this.close();
  }

  private async handleMessage(message: WebSocketMessage): Promise<void> {
    if (message?.type === 'cmd') {
      return await this.handleCmdMessage(message as WebSocketCmdMessage);
    }

    if (message?.type === 'error') {
      return await this.handleErrorMessage(message as WebSocketErrorMessage);
    }

    if (['ping', 'pong'].includes(message?.type)) {
      return await this.handlePingMessage(message as WebSocketPingMessage);
    }

    this.controller.onUnhandledError(
      new KwokkaSdkJsError('Unknown message received', ErrorCode.UnexpectedError, message),
    );
  }

  private async handleCmdMessage(message: WebSocketCmdMessage): Promise<void> {
    this.setTimestampOffset(message.meta.timestamp);
    if (message.payload.type === IncomingWsMessageType.GameInstanceUpdated) {
      return await this.controller.onGameInstanceUpdated(message.payload.data as GameInstanceUpdatedData);
    }

    if (message.payload.type === IncomingWsMessageType.ConnectivityUpdated) {
      return await this.controller.onConnectivityUpdated(message.payload.data as ConnectivityUpdatedData);
    }

    if (message.payload.type === IncomingWsMessageType.Broadcast) {
      return await this.controller.onBroadcast(message.payload.data as any);
    }

    if (message.payload.type === IncomingWsMessageType.SetDisconnectReason) {
      this.disconnectReason = message.payload.data as SetDisconnectReasonData;
      return;
    }

    this.controller.onUnhandledError(
      new KwokkaSdkJsError('Unknown message received', ErrorCode.UnexpectedError, message),
    );
  }

  private async handleErrorMessage(message: WebSocketErrorMessage): Promise<void> {
    this.config.logger.error(`Got ${message.type} message`, message);
    this.controller.onErrorMessage(message.payload);
  }

  private async handlePingMessage(message: WebSocketPingMessage): Promise<void> {
    this.config.logger.debug(`Got ${message.type} message`);
    if (message.type === 'ping') {
      this.communicator.send({ type: 'pong', meta: { timestamp: Date.now() } });
    }
    if (message.type === 'pong') {
      const pingTimestamp = this._pingTimestamps.shift();
      this._ping = pingTimestamp ? Date.now() - pingTimestamp : 0;
    }
  }
}
