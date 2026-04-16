import type { Logger } from '../util';
import type { WebSocketMessage } from './interface';

export class Communicator {
  public constructor(
    private readonly ws: WebSocket,
    private readonly logger: Logger,
  ) {}

  public send<T extends WebSocketMessage>(message: T): void {
    this.logger.debug('Sending message', message);
    this.ws.send(JSON.stringify(message));
  }
}
