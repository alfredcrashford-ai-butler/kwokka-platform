import { Server } from 'http';
import { KwokkaSdkNodeConfig } from '../config';
import { ConnectionHandler } from './connection-handler';
import { HttpUtil } from '../util';
import { GameInstanceConnectTokenValidationResponse } from './interface';
import { GameAPI } from '../game';
import { AuthAPI } from '../auth';
import { GameServerConfig } from './game-server-config';
import { DefaultConfig } from './default-config';
import { GameServerConfigSchema } from './game-server-config-schema';
import { ErrorCode, KwokkaSdkNodeError } from '../error';

export class GameServerAPI {
  private readonly zebraUrl: string;

  public constructor(
    private readonly sdkConfig: KwokkaSdkNodeConfig,
    private readonly auth: AuthAPI,
    private readonly game: GameAPI,
  ) {
    this.zebraUrl = `${this.sdkConfig.endpoint}/zebra`;
  }

  public setupGameServer(server: Server, config: GameServerConfig): void {
    config = this.injectDefaultConfig(config);
    this.validateConfig(config);
    const handler = new ConnectionHandler(this.game, this.sdkConfig, config);

    server.on('upgrade', async (request, socket, head) => {
      const parsedUrl = new URL(request.url, config.host);
      if (parsedUrl.pathname !== config.path) {
        this.sdkConfig.logger.warn(`Failed to establish the connection, incorrect path: ${parsedUrl.pathname}`);
        return socket.destroy();
      }

      const query = parsedUrl.searchParams;
      const token = query.get('connectToken');
      const validationResponse = await this.validateGameInstanceConnectToken(token);

      if (!validationResponse.isValid) {
        this.sdkConfig.logger.warn(
          `Failed to establish the connection, url: ${request.url}, query: ${query}, token: ${token}, authInfo:`,
          validationResponse,
        );
        return socket.destroy();
      }

      handler.connect(request, socket, head, validationResponse);
    });
  }

  private injectDefaultConfig(config: GameServerConfig): GameServerConfig {
    return { ...DefaultConfig, ...config };
  }

  private validateConfig(config: GameServerConfig): void {
    const result = GameServerConfigSchema.validate(config);
    if (result.error) {
      throw new KwokkaSdkNodeError(
        `Game server config validation error: ${result?.error?.message}`,
        ErrorCode.InvalidConfig,
        config,
      );
    }
  }

  private validateGameInstanceConnectToken(token: string): Promise<GameInstanceConnectTokenValidationResponse> {
    return this.auth.withAuth(async () => {
      const url = `${this.zebraUrl}/v1/game-instances/validate-connect-token`;
      const response = await HttpUtil.post<{ data: GameInstanceConnectTokenValidationResponse }>(
        url,
        { token },
        this.auth.authHeaders,
      );
      return response.data;
    });
  }
}
