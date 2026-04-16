import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import { gitDescribeSync } from 'git-describe';
import { inject, injectable } from 'inversify';
import { Server } from 'http';
import { AuthService, ConfigService, ErrorTrackerService, LoggerService } from '../service';
import { Router } from '../router';
import { EnvVarName } from '../../util';
import { WebsocketHandler } from './websocket-handler';
import { WsServerPlugin } from './ws-server-plugin';
import { RouterServerPlugin } from './router-server-plugin';

@injectable()
export class HttpServer {
  private readonly port: string;
  private readonly host: string;
  private _app: Application;
  private server: Server;
  private wsServerPlugin: WsServerPlugin;
  private routerServerPlugin: RouterServerPlugin;

  public constructor(
    @inject(ErrorTrackerService) private errorTrackerService: ErrorTrackerService,
    @inject(ConfigService) private configService: ConfigService,
    @inject(LoggerService) private logger: LoggerService,
    @inject(AuthService) private authService: AuthService,
  ) {
    this.port = this.configService.get(EnvVarName.Port);
    this.host = this.configService.get(EnvVarName.Host);
    this._app = express();
    this.wsServerPlugin = new WsServerPlugin(this.host, this.logger, this.authService);
    this.routerServerPlugin = new RouterServerPlugin(this.app, this.logger);
  }

  public get app(): Application {
    return this._app;
  }

  public async start(): Promise<string> {
    this.app.disable('x-powered-by');

    if (!this.port) {
      throw new Error('Cannot start server: port is not specified!');
    }

    this.setupMiddlewares();

    this.setupHealthCheck();

    this.setupRoutes();

    this.setupNotFound();

    this.setupErrorHandling();

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, (error?: Error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(`Listening to ${this.port} port`);
      });

      this.wsServerPlugin.start(this.server);

      // TODO: implement monitoring routes to check the current state of ws service
      // this.setupMonitoringRoutes();
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((err?: Error) => (err ? reject(err) : resolve()));
    });
  }

  public addRouter(path: string, router: Router): void {
    this.routerServerPlugin.addRouter(path, router);
  }

  public addWebsocketHandler(path: string, handler: WebsocketHandler): void {
    this.wsServerPlugin.addWebsocketHandler(path, handler);
  }

  private setupErrorHandling(): void {
    this.errorTrackerService.setup(this.app);
  }

  private setupNotFound(): void {
    this.app.use((req, res, next) => {
      res.status(404).end();
    });
  }

  private setupMiddlewares(): void {
    this.app.use(cookieParser());
    this.app.use(express.json({ limit: '1mb' }));
  }

  private setupHealthCheck(): void {
    const handler = (_req, res) =>
      res.json({ data: { message: 'Api is ready', version: this.appVersion, hash: this.hash } }).end();

    this.app.get('/ready', handler);
    this.app.get('/healthcheck', handler);
  }

  private setupRoutes(): void {
    this.routerServerPlugin.start();
  }

  private get hash(): string {
    return gitDescribeSync().hash;
  }

  private get appVersion(): string {
    return process.env.npm_package_version;
  }
}
