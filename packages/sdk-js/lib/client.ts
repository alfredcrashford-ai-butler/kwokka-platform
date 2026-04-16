import { CredentialEntity } from '@kwokka/entities';
import type { KwokkaSdkJsConfig } from './config';
import { ErrorCode, KwokkaSdkJsError } from './error';
import { GameAPI } from './game';
import { DefaultLogger } from './util';
import { AuthAPI } from './auth';
import { InventoryAPI } from './inventory/inventory-api';
import { ProfileAPI } from './profile';
import { TraitAPI } from './trait';
import { AuthInternalAPI } from './auth-internal';

export class KwokkaSdkJsClient {
  public readonly defaultEndpoint = 'https://api.kwokka.co';
  private readonly _auth: AuthAPI;
  private readonly _authInternal: AuthInternalAPI;
  private readonly _game: GameAPI;
  private readonly _inventory: InventoryAPI;
  private readonly _profile: ProfileAPI;
  private readonly _trait: TraitAPI;

  public constructor(public readonly config: KwokkaSdkJsConfig) {
    this.config.endpoint ||= this.defaultEndpoint;
    this.verifyConfigOption('endpoint');

    this.config.logger ||= new DefaultLogger();
    this.verifyConfigOption('logger');

    this._auth = new AuthAPI(this.config);
    this._authInternal = new AuthInternalAPI(this.config);
    this._game = new GameAPI(this.config, this._authInternal);
    this._inventory = new InventoryAPI(this.config, this._authInternal);
    this._profile = new ProfileAPI(this.config, this._authInternal);
    this._trait = new TraitAPI(this.config, this._authInternal);
  }

  public get accountId(): string {
    this.verifyAuthenticated();
    return this._authInternal.accountId;
  }

  public get game(): GameAPI {
    this.verifyAuthenticated();
    return this._game;
  }

  public get inventory(): InventoryAPI {
    this.verifyAuthenticated();
    return this._inventory;
  }

  public get profile(): ProfileAPI {
    this.verifyAuthenticated();
    return this._profile;
  }

  public get trait(): TraitAPI {
    this.verifyAuthenticated();
    return this._trait;
  }

  public get auth(): AuthAPI {
    return this._auth;
  }

  public async initialize(): Promise<void> {
    await this._authInternal.initialize();
  }

  public authorize(accessToken: string, refreshToken: string): void {
    this._authInternal.authorize(accessToken, refreshToken);
  }

  public async uninitialize(): Promise<void> {
    this._authInternal.uninitialize();
  }

  public get isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }

  public get accessToken(): string {
    return this._authInternal.accessToken;
  }

  public get refreshToken(): string {
    return this._authInternal.refreshToken;
  }

  public getCredentials(): Promise<CredentialEntity[]> {
    this.verifyAuthenticated();
    return this._authInternal.getCredentials();
  }

  private verifyAuthenticated(): void {
    if (!this.isAuthenticated) {
      throw new KwokkaSdkJsError('Client has not been authenticated yet!', ErrorCode.ClientNotAuthenticated);
    }
  }

  private verifyConfigOption(name: string): void {
    if (!this.config[name]) {
      throw new KwokkaSdkJsError(`${name} is not provided in the config!`, ErrorCode.InvalidConfig);
    }
  }
}
