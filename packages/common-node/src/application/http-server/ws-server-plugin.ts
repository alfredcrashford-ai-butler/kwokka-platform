import { IncomingMessage, Server } from 'http';
import { AuthService, LoggerService } from '../service';
import { WebsocketHandler } from './websocket-handler';
import { Socket } from 'net';

export class WsServerPlugin {
  private handlers: { path: string; handler: WebsocketHandler }[] = [];

  public constructor(
    private readonly host: string,
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  public start(server: Server): void {
    if (this.handlers.length) {
      this.logger.info(`Found ${this.handlers.length} WebSocket handlers, setting up upgrade listener.`);
      this.addUpgradeListener(server);
    }
  }

  public addWebsocketHandler(path: string, handler: WebsocketHandler): void {
    this.handlers.push({ path, handler });
  }

  private getWebsocketHandler(url: string): WebsocketHandler {
    const pathname = new URL(url, this.host).pathname;
    return this.handlers.find((el) => el.path === pathname)?.handler;
  }

  private addUpgradeListener(server: Server): void {
    server.addListener('upgrade', async (request: IncomingMessage, socket?: Socket, head?: Buffer) => {
      // Step 1: check token
      const parsedUrl = new URL(request.url, this.host);
      const query = parsedUrl.searchParams;
      const token = query.get('accessToken');
      const authInfo = await this.authService.getAuthInfo(token);
      if (!authInfo.isAuthenticated) {
        this.logger.warn(
          `Failed to establish the connection, url: ${request.url}, query: ${query}, token: ${token}, authInfo:`,
          authInfo,
        );
        return socket.destroy();
      }

      // Step 2: find handler by path
      const handler = this.getWebsocketHandler(request.url);
      if (!handler) {
        this.logger.warn(`Failed to establish the connection, no WS handler found for given url: ${request.url}`);
        return socket.destroy();
      }

      // Step 3: connect
      handler.connect(request, socket, head, authInfo);
    });
  }
}
