import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'http';
import * as Sentry from '@sentry/node';
import { gitDescribeSync } from 'git-describe';
import { KwokkaSdkNodeConfig } from '@kwokka/sdk-node';
import { ConfigUtil, EnvVarName, Logger } from './util';
import { KwokkaClient } from './application';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: APP_VERSION } = require('../package.json');

const COMMIT_HASH = gitDescribeSync().hash;

export class HttpServer {
  private readonly port: string;
  private app: Application;

  public constructor() {
    this.port = ConfigUtil.get(EnvVarName.Port);
  }

  public start(): void {
    this.app = express();
    this.app.disable('x-powered-by');

    this.setupMiddlewares();

    this.setupHealthCheck();

    this.setupCors();

    this.setupNotFound();

    this.setupErrorHandling();

    const server = this.app.listen(this.port, () => {
      Logger.info(`Listening to ${this.port} port`);
    });

    this.setupGameServer(server);
  }

  private setupCors(): void {
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'user-agent'],
        optionsSuccessStatus: 200,
      }),
    );
  }

  private setupErrorHandling(): void {
    if (ConfigUtil.get(EnvVarName.NodeEnv) === 'production') {
      Sentry.setupExpressErrorHandler(this.app);
    }
  }

  private setupGameServer(server: Server): void {
    const config: KwokkaSdkNodeConfig = {
      clientId: ConfigUtil.get(EnvVarName.KwokkaClientId),
      secret: ConfigUtil.get(EnvVarName.KwokkaSecret),
      endpoint: ConfigUtil.get(EnvVarName.KwokkaEndpoint),
      logger: Logger,
    };
    const client = new KwokkaClient(config);

    client.start(server);
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
      res.send({
        data: {
          message: 'Api is ready',
          version: APP_VERSION,
          hash: COMMIT_HASH,
        },
      });

    this.app.get('/healthcheck', handler);
  }
}
