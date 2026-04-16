import { inject, injectable } from 'inversify';
import { ConfigService } from '../config/config.service';
import {
  type DuplexConnection,
  type DuplexMessageListener,
  type DuplexIncomingMessage,
  type DuplexOutgoingMessage,
  DuplexManagerService,
} from './duplex-manager.service';

class WebsocketDuplexConnection<T> implements DuplexConnection<T> {
  private messageListeners: DuplexMessageListener<T>[] = [];

  private closeListener: () => void;

  private isClosed = false;

  public isOpened(): boolean {
    return !this.isClosed;
  }

  public constructor(private websocket: WebSocket) {
    this.websocket.onmessage = (event) => this.onmessage(event.data);
    this.websocket.onclose = () => this.onclose();
  }

  public addMessageListener(listener: (res: DuplexIncomingMessage<T>) => void): void {
    if (this.isClosed) {
      throw new Error('Duplex connection is already closed!');
    }
    this.messageListeners.push(listener);
  }

  public setCloseListener(listener: () => void): void {
    if (this.isClosed) {
      throw new Error('Duplex connection is already closed!');
    }
    this.closeListener = listener;
  }

  public send(req: DuplexOutgoingMessage): void {
    if (this.isClosed) {
      throw new Error('Duplex connection is already closed!');
    }
    const message = JSON.stringify(req);
    this.websocket.send(message);
  }

  public close(): void {
    if (this.isClosed) {
      throw new Error('Duplex connection is already closed!');
    }
    this.messageListeners = [];
    this.closeListener = null;
    this.websocket.close();
    this.websocket = null;
    this.isClosed = true;
  }

  private onmessage(data: string) {
    this.messageListeners.forEach((listener) => {
      try {
        const parsedData = JSON.parse(data) as DuplexIncomingMessage<T>;
        listener(parsedData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Could not process message. Data: ${data}. Error: ${error.stack}`);
      }
    });
  }

  private onclose() {
    if (this.closeListener) {
      this.closeListener();
    }
  }
}

@injectable()
export class WebsocketDuplexManagerServiceImpl<T> extends DuplexManagerService<T> {
  public constructor(@inject(ConfigService) private configService: ConfigService) {
    super();
  }

  public initConnection(token: string): Promise<DuplexConnection<T>> {
    const url = `${this.configService.frontendConfig.wsGateway}?token=${token}`;
    return new Promise((resolve) => {
      const socket = new WebSocket(url);
      socket.addEventListener('open', () => {
        const connection = new WebsocketDuplexConnection<T>(socket);
        // TODO: set timestamp offset
        // connection.addMessageListener(message => this.store.commit('app/setTimestampOffset', message.meta?.timestamp));
        resolve(connection);
      });
    });
  }
}
