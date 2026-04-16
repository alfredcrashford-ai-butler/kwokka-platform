import { KwokkaSdkNodeConfig } from '../../config';
import { Logger } from '../../util';
import { Broadcaster } from '../broadcaster';
import { CommandCenter, BroadcastErrorCommand, PlayerActionCommand } from '../command';
import { GameServerClient, ErrorCode } from '../interface';
import {
  IncomingMessageSchema,
  GameServerCmdMessage,
  GameServerMessage,
  GameServerPingMessage,
  IncomingMessageType,
  PlayerActionIncomingMessage,
} from '../message';

type MessageHandler = (message: GameServerCmdMessage, client: GameServerClient) => void;

export class MessageProcessor {
  public constructor(
    private readonly broadcaster: Broadcaster,
    private readonly commandCenter: CommandCenter,
    private readonly sdkConfig: KwokkaSdkNodeConfig,
  ) {}

  public async onMessage(client: any, message: any) {
    let messagePayload;
    try {
      messagePayload = this.deserializeMessage(message);
      this.logger.info(`Received message, accountId: ${client?.accountId}, data:`, messagePayload);
      this.handleAnyMessage(messagePayload, client);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to process message, accountId: ${client?.accountId}, messagePayload:`,
        messagePayload || '[unparsed]',
        error,
      );
      this.broadcaster.broadcastError(client, ErrorCode.UnexpectedError, 'Processing failed.');
    }
  }

  private handleAnyMessage(message: GameServerMessage, client: GameServerClient): void {
    if (message.type === 'cmd') {
      this.handleMessage(message as GameServerCmdMessage, client);
      return;
    }
    if (message.type === 'ping' || message.type === 'pong') {
      this.handlePingMessage(message as GameServerPingMessage, client);
      return;
    }

    this.logger.warn(`Got message from account: ${client.accountId} with unsupported type:`, message);
  }

  private handleMessage(message: GameServerCmdMessage, client: GameServerClient): void {
    if (!this.isValidMessage(message)) {
      const command = new BroadcastErrorCommand(client, ErrorCode.InvalidMessage, 'Message structure is invalid');
      this.commandCenter.execute(client?.gameInstanceId, command);
      return;
    }

    const handler = this.getMessageHandler(message?.payload?.type as IncomingMessageType);
    handler(message, client);
  }

  protected async handlePlayerAction(message: PlayerActionIncomingMessage, client: GameServerClient): Promise<void> {
    this.commandCenter.execute(client.gameInstanceId, new PlayerActionCommand(message, client));
  }

  private async handleUnsupportedMessageType(message: GameServerCmdMessage, client: GameServerClient): Promise<void> {
    this.logger.warn(`Got message with unsupported type: ${message.type}, from account with id: ${client.accountId}`);
    const command = new BroadcastErrorCommand(client, ErrorCode.InvalidMessage, 'Message type is not supported');
    this.commandCenter.execute(client.gameInstanceId, command);
  }

  private getMessageHandler(messageType: IncomingMessageType): MessageHandler {
    const handlers = {
      [IncomingMessageType.PlayerAction]: this.handlePlayerAction,
    };
    return (handlers[messageType] || this.handleUnsupportedMessageType).bind(this);
  }

  private isValidMessage(message: GameServerMessage): boolean {
    const result = IncomingMessageSchema.validate(message);
    return Boolean(result.error);
  }

  private deserializeMessage(message: Buffer): GameServerMessage {
    try {
      const messageStr = message.toString();
      return JSON.parse(messageStr);
    } catch (e: unknown) {
      this.logger.error('Failed to parse message, error:', e);
      throw e;
    }
  }

  private async handlePingMessage(message: GameServerPingMessage, client: GameServerClient) {
    if (message?.type === 'ping') {
      this.broadcaster.broadcast(client, { type: 'pong', meta: { timestamp: Date.now() } });
    }
  }

  private get logger(): Logger {
    return this.sdkConfig.logger;
  }
}
