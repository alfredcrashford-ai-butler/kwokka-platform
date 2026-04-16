import { GameInstanceEntity } from '@kwokka/entities';
import { KwokkaSdkNodeConfig } from '../../config';
import { Logger } from '../../util';
import { ClientRegistry } from '../client-registry';
import { GameServerClient, ErrorCode, DisconnectReason } from '../interface';
import {
  GameServerMessage,
  GameServerErrorMessage,
  SetDisconnectReasonOutgoingMessage,
  OutgoingMessageType,
  GameInstanceUpdatedOutgoingMessage,
  ConnectivityUpdatedOutgoingMessage,
} from '../message';

export class Broadcaster {
  public constructor(
    private readonly clientRegistry: ClientRegistry,
    private readonly sdkConfig: KwokkaSdkNodeConfig,
  ) {}

  public broadcast(client: GameServerClient, message: GameServerMessage): void {
    client.websocket.send(this.serializeMessage(message));
  }

  public broadcastError(client: GameServerClient, code: string | ErrorCode, message: string): void {
    this.broadcast(client, {
      type: 'error',
      payload: { code, message },
      meta: { timestamp: Date.now() },
    } as GameServerErrorMessage);
  }

  public broadcastSetDisconnectReason(
    client: GameServerClient,
    reason: DisconnectReason,
    timestamp = Date.now(),
  ): void {
    const message: SetDisconnectReasonOutgoingMessage = {
      type: 'cmd',
      payload: {
        type: OutgoingMessageType.SetDisconnectReason,
        data: { code: reason.code, message: reason.message },
      },
      meta: { timestamp },
    };

    this.broadcast(client, message);
  }

  public broadcastGameUpdated(gameInstance: GameInstanceEntity): void {
    const clients = this.clientRegistry.getClientsByGameInstanceId(gameInstance.id);
    const timestamp = Date.now();
    clients.forEach((client) => {
      const message = this.prepareGameInstanceMessage(gameInstance, timestamp, client.accountId);
      this.broadcast(client, message);
    });
  }

  public disconnectClient(client: GameServerClient): void {
    client.websocket.close();
  }

  public disconnectClients(clients: GameServerClient[]): void {
    clients.forEach((client) => this.disconnectClient(client));
  }

  public broadcastConnectivity(id: string): void {
    const connectivity = this.clientRegistry.getConnectivity(id);
    const message = this.prepareConnectivityMessage(connectivity);
    const clients = this.clientRegistry.getClientsByGameInstanceId(id);
    clients.forEach((client) => this.broadcast(client, message));
  }

  private prepareGameInstanceMessage(
    gameInstance: GameInstanceEntity,
    timestamp: number,
    accountId: string,
  ): GameInstanceUpdatedOutgoingMessage {
    // TODO: implement differential data transfer (send only data that has been changed)
    const websocketMessage: GameInstanceUpdatedOutgoingMessage = {
      type: 'cmd',
      payload: {
        type: OutgoingMessageType.GameInstanceUpdated,
        data: {
          id: gameInstance.id,
          gameId: gameInstance.gameId,
          lobbyId: gameInstance.lobbyId,
          status: gameInstance.status,
          isPubliclyVisible: gameInstance.isPubliclyVisible,
          state: {
            publicState: gameInstance.state?.publicState || {},
            privateState: {},
            playerState: { [accountId]: gameInstance.state?.playerState?.[accountId] },
          },
          playerIds: gameInstance.playerIds,
          results: gameInstance.results,
          lobbySettings: gameInstance.lobbySettings,
          finishedAt: gameInstance.finishedAt,
        },
      },
      meta: { timestamp },
    };
    return websocketMessage;
  }

  private prepareConnectivityMessage(
    connectivity: Record<string, boolean>,
    timestamp: number = Date.now(),
  ): ConnectivityUpdatedOutgoingMessage {
    return {
      type: 'cmd',
      payload: { type: OutgoingMessageType.ConnectivityUpdated, data: connectivity },
      meta: { timestamp },
    };
  }

  private serializeMessage(message: GameServerMessage): string {
    return JSON.stringify(message);
  }

  private get logger(): Logger {
    return this.sdkConfig.logger;
  }
}
