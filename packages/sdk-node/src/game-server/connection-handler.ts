import { IncomingMessage } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Duplex } from 'stream';
import { KwokkaSdkNodeConfig } from '../config';
import { Logger, Scheduler } from '../util';
import { GameAPI } from '../game';
import { Broadcaster } from './broadcaster';
import { ClientRegistry } from './client-registry';
import { MessageProcessor } from './message-processor';
import { GameInstanceRegistry } from './game-instance-registry';
import {
  GameInstanceConnectTokenValidationResponse,
  NewConnectionDisconnectReason,
  GameServerClient,
  DisconnectReason,
} from './interface';
import { GameController, GameControllerMethods } from './game-controller';
import { GameServerConfig } from './game-server-config';
import { CommandCenter, DisconnectPlayerCommand, PlayerConnectedCommand, PlayerDisconnectedCommand } from './command';
import { ShutdownProcessor } from './shutdown-processor';
import { CleanupDanglingGameInstancesScheduledJob } from './scheduled-job';

export class ConnectionHandler {
  private readonly wss: WebSocketServer;
  private readonly broadcaster: Broadcaster;
  private readonly clientRegistry: ClientRegistry;
  private readonly gameInstanceRegistry: GameInstanceRegistry;
  private readonly messageProcessor: MessageProcessor;
  private readonly commandCenter: CommandCenter;
  private readonly scheduler: Scheduler;
  private shutdownProcessor: ShutdownProcessor;

  public constructor(
    private readonly gameApi: GameAPI,
    private readonly sdkConfig: KwokkaSdkNodeConfig,
    private readonly config: GameServerConfig,
  ) {
    this.scheduler = new Scheduler();
    this.wss = new WebSocketServer({ noServer: true, path: this.config.path });
    this.gameInstanceRegistry = new GameInstanceRegistry(this.gameApi, this.config);
    this.clientRegistry = new ClientRegistry();
    this.broadcaster = new Broadcaster(this.clientRegistry, this.sdkConfig);
    this.commandCenter = new CommandCenter(
      this.gameApi,
      this.broadcaster,
      this.clientRegistry,
      this.gameInstanceRegistry,
      this.sdkConfig,
      this.config,
    );
    this.messageProcessor = new MessageProcessor(this.broadcaster, this.commandCenter, this.sdkConfig);
    this.setupShutdownProcessor();
    this.setupAutoCleanup();
    this.injectGameControllerMethods(config.controller);
  }

  private get logger(): Logger {
    return this.sdkConfig.logger;
  }

  public connect(
    request: IncomingMessage,
    socket: Duplex,
    head: Buffer,
    validationResponse: GameInstanceConnectTokenValidationResponse,
  ) {
    this.wss.handleUpgrade(request, socket, head, async (ws: WebSocket) => {
      // Step 1: remove old connections of same account
      const { accountId, gameInstanceId } = validationResponse.content;
      this.disconnectAccountDueToNewConnection(accountId);

      // Step 2: save connection
      const client = this.clientRegistry.storeClient(ws, accountId, gameInstanceId);

      // Step 2: setup handlers for ws events
      this.setupWebsocketEventHandlers(client);

      // Step 3: call connected hook
      await this.onConnected(client);

      // Step 3: confirm connection
      this.wss.emit('connection', ws, request);
    });
  }

  private async onConnected(client: GameServerClient): Promise<void> {
    this.commandCenter.execute(client.gameInstanceId, new PlayerConnectedCommand(client));
  }

  private async onDisconnected(client: GameServerClient): Promise<void> {
    this.commandCenter.execute(client.gameInstanceId, new PlayerDisconnectedCommand(client));
  }

  private disconnectAccountDueToNewConnection(accountId: string): void {
    this.disconnectAccount(accountId, NewConnectionDisconnectReason);
  }

  private disconnectAccount(accountId: string, reason: DisconnectReason): void {
    const clients = this.clientRegistry.cleanupClient(accountId);
    clients.forEach((el) => this.commandCenter.execute(el.gameInstanceId, new DisconnectPlayerCommand(el, reason)));
  }

  private async onMessage(client: GameServerClient, message: Buffer) {
    // need to find the current state of client on each message, as the state can change
    client = this.clientRegistry.getClientByAccountId(client.accountId);
    this.messageProcessor.onMessage(client, message);
  }

  private setupWebsocketEventHandlers(client: GameServerClient): void {
    client.websocket.on('message', async (message: Buffer) => this.onMessage(client, message));
    client.websocket.on('close', () => this.onDisconnected(client));
    client.websocket.on('error', (error) => this.logger.error(`Unhandled error in websocket, message: ${error.stack}`));
  }

  private injectGameControllerMethods(controller: GameController): void {
    const methods = new GameControllerMethods(
      this.commandCenter,
      this.gameInstanceRegistry,
      this.clientRegistry,
      this.sdkConfig,
    );
    methods.inject(controller);
  }

  private setupShutdownProcessor(): void {
    this.shutdownProcessor = new ShutdownProcessor(
      this.sdkConfig,
      this.config,
      this.commandCenter,
      this.gameInstanceRegistry,
      this.scheduler,
      this.broadcaster,
      this.clientRegistry,
    );
    this.shutdownProcessor.setup();
  }

  private setupAutoCleanup(): void {
    if (this.config.autoCleanup.enabled === false) {
      return;
    }

    const autoCleanupJob = new CleanupDanglingGameInstancesScheduledJob(
      this.scheduler,
      this.clientRegistry,
      this.gameInstanceRegistry,
      this.commandCenter,
      this.config,
    );
    autoCleanupJob.start();
  }
}
