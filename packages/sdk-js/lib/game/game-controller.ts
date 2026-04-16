import { Communicator } from './communicator';
import {
  DisconnectReason,
  OutgoingWsMessageType,
  type GameInstanceUpdatedData,
  type PlayerActionData,
  type WebSocketErrorMessagePayload,
} from './interface';

export abstract class GameController {
  declare private communicator: Communicator;

  public abstract onConnected(): any;
  public abstract onDisconnected(reason: DisconnectReason): any;
  public abstract onUnhandledError(error: any): any;
  public abstract onErrorMessage(error: WebSocketErrorMessagePayload): any;
  public abstract onGameInstanceUpdated(data: GameInstanceUpdatedData): any;
  public abstract onConnectivityUpdated(connectivity: Record<string, boolean>): any;
  public abstract onBroadcast(data: any): any;

  public sendAction(data: PlayerActionData): void {
    this.communicator.send({
      type: 'cmd',
      payload: { type: OutgoingWsMessageType.PlayerAction, data },
      meta: { timestamp: Date.now() }
    });
  }

  public ping(): void {
    this.communicator.send({ type: 'ping', meta: { timestamp: Date.now() } });
  }
}
