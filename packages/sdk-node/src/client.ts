import { Server } from 'http';
import { KwokkaSdkNodeConfig } from './config';
import { ErrorCode, KwokkaSdkNodeError } from './error';
import { InventoryAPI } from './inventory';
import { Scheduler } from './scheduler';
import { Cache } from './cache';
import { TraitAPI } from './trait';
import { DefaultLogger } from './util';
import { GameServerAPI, GameServerConfig } from './game-server';
import { GameAPI } from './game';
import { AuthAPI } from './auth';

export class KwokkaSdkNodeClient {
  public readonly defaultEndpoint = 'api.kwokka.co';
  private readonly _auth: AuthAPI;
  private readonly _game: GameAPI;
  private readonly _inventory: InventoryAPI;
  private readonly _trait: TraitAPI;
  private readonly _gameServer: GameServerAPI;
  public readonly scheduler = new Scheduler();
  public readonly cache = new Cache();
  private isInitialized = false;

  public constructor(public readonly config: KwokkaSdkNodeConfig) {
    this.verifyConfigOption('secret');

    this.config.endpoint ||= this.defaultEndpoint;
    this.verifyConfigOption('endpoint');

    this.config.logger ||= new DefaultLogger();
    this.verifyConfigOption('logger');


    this._auth = new AuthAPI(this.config);
    this._game = new GameAPI(this.config, this._auth);
    this._inventory = new InventoryAPI(this.config, this._auth);
    this._trait = new TraitAPI(this.config, this._auth);
    this._gameServer = new GameServerAPI(this.config, this._auth, this._game);
  }

  public get accountId(): string {
    this.verifyInitialized();
    return this._auth.accountId;
  }

  public get game(): GameAPI {
    this.verifyInitialized();
    return this._game;
  }

  public get inventory(): InventoryAPI {
    this.verifyInitialized();
    return this._inventory;
  }

  public get trait(): TraitAPI {
    this.verifyInitialized();
    return this._trait;
  }

  public async initialize(): Promise<void> {
    await this._auth.authorize();
    this.isInitialized = true;
  }

  public setupGameServer(server: Server, config: GameServerConfig): void {
    this.verifyInitialized();
    this._gameServer.setupGameServer(server, config)
  }

  private verifyInitialized(): void {
    if (!this.isInitialized) {
      throw new KwokkaSdkNodeError('Client has not been initialized yet!', ErrorCode.ClientNotInitialized);
    }
  }

  private verifyConfigOption(name: string): void {
    if (!this.config[name]) {
      throw new KwokkaSdkNodeError(`${name} is not provided in the config!`, ErrorCode.InvalidConfig);
    }
  }
}
