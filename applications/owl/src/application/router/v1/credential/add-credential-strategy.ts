import { Request } from 'express';
import {
  CredentialEntity,
  CredentialEntityType,
  DiscordCredentialEntity,
  GoogleCredentialEntity,
} from '@kwokka/entities';
import { UuidUtil } from '@kwokka/utils';
import { LoggerService, RequestQueryUtil, ControllerException } from '@kwokka/common-node';
import { CreateCredentialUsecase } from '../../../../usecase/credential/create-credential.usecase';
import { CredentialV1Adapter } from './credential-v1.adapter';
import { GoogleOauth2Service } from '../../../service/google-oauth2.service';
import { ExceptionCode } from '../../../../usecase/exception-code';
import { DiscordOauth2Service } from '../../../service/discord-oauth2.service';
import { EmailPasswordCredentialEntity, SecretCredentialEntity } from '../../../../entity';

const FAILED_TO_LOAD_GOOGLE_USER_INFO_MESSAGE = 'Can not load user info to perform oauth with google.';
const FAILED_TO_LOAD_DISCORD_USER_INFO_MESSAGE = 'Can not load user info to perform oauth with discord.';

export class AddCredentialStrategyContext {
  protected addCredentialStrategy: AddCredentialStrategy;
  protected addCredentialGoogleOauth2Strategy: AddGoogleOauth2CredentialStrategy;
  protected addDiscordOauth2CredentialStrategy: AddDiscordOauth2CredentialStrategy;
  protected addEmailPasswordCredentialStrategy: AddEmailPasswordCredentialStrategy;
  protected addSecretCredentialStrategy: AddSecretCredentialStrategy;

  public constructor(
    protected createUsecase: CreateCredentialUsecase,
    protected adapter: CredentialV1Adapter,
    protected logger: LoggerService,
    protected googleOauth2Service: GoogleOauth2Service,
    protected discordOauth2Service: DiscordOauth2Service,
  ) {
    this.addCredentialStrategy = new AddCredentialStrategy(this.createUsecase, this.adapter, this.logger);
    this.addCredentialGoogleOauth2Strategy = new AddGoogleOauth2CredentialStrategy(
      this.createUsecase,
      this.adapter,
      this.logger,
      this.googleOauth2Service,
    );
    this.addDiscordOauth2CredentialStrategy = new AddDiscordOauth2CredentialStrategy(
      this.createUsecase,
      this.adapter,
      this.logger,
      this.discordOauth2Service,
    );
    this.addEmailPasswordCredentialStrategy = new AddEmailPasswordCredentialStrategy(
      this.createUsecase,
      this.adapter,
      this.logger,
    );
    this.addSecretCredentialStrategy = new AddSecretCredentialStrategy(this.createUsecase, this.adapter, this.logger);
  }

  public async runStrategy(req: Request, accountId?: string) {
    if (req.body.type === CredentialEntityType.Google) {
      return this.addCredentialGoogleOauth2Strategy.execute(req, accountId);
    }

    if (req.body.type === CredentialEntityType.Discord) {
      return this.addDiscordOauth2CredentialStrategy.execute(req, accountId);
    }

    if (req.body.type === CredentialEntityType.EmailPassword) {
      return this.addEmailPasswordCredentialStrategy.execute(req, accountId);
    }

    if (req.body.type === CredentialEntityType.Secret) {
      return this.addSecretCredentialStrategy.execute(req, accountId);
    }

    return this.addCredentialStrategy.execute(req, accountId);
  }
}

export class AddCredentialStrategy {
  public constructor(
    protected createUsecase: CreateCredentialUsecase,
    protected adapter: CredentialV1Adapter,
    protected logger: LoggerService,
  ) {}

  public async execute(req: Request, accountId?: string): Promise<CredentialEntity> {
    let entity = this.adapter.deserialize(req.body);
    if (accountId) {
      entity.accountId = accountId;
    }
    entity.isVerified = false;
    return await this.createUsecase.perform(entity);
  }
}

export class AddGoogleOauth2CredentialStrategy extends AddCredentialStrategy {
  public constructor(
    createUsecase: CreateCredentialUsecase,
    adapter: CredentialV1Adapter,
    logger: LoggerService,
    protected oauthService: GoogleOauth2Service,
  ) {
    super(createUsecase, adapter, logger);
  }

  public override async execute(req: Request, accountId?: string): Promise<GoogleCredentialEntity> {
    const oauthToken = RequestQueryUtil.parseStringQueryParam(req, 'oauthToken');
    const userInfo = await this.oauthService.getUserInfo(oauthToken);
    if (!userInfo) {
      this.logger.warn('Failed to retrieve user info from google');
      throw new ControllerException(ExceptionCode.FailedToLoadGoogleUserInfo, FAILED_TO_LOAD_GOOGLE_USER_INFO_MESSAGE);
    }
    const { emailVerified, ...rest } = userInfo;

    let entity = this.adapter.deserialize(req.body) as GoogleCredentialEntity;
    if (accountId) {
      entity.accountId = accountId;
    }
    entity.isVerified = true;
    entity.identifier = userInfo.sub;
    entity.data = rest;

    return (await this.createUsecase.perform(entity)) as GoogleCredentialEntity;
  }
}

export class AddDiscordOauth2CredentialStrategy extends AddCredentialStrategy {
  public constructor(
    createUsecase: CreateCredentialUsecase,
    adapter: CredentialV1Adapter,
    logger: LoggerService,
    protected oauthService: DiscordOauth2Service,
  ) {
    super(createUsecase, adapter, logger);
  }

  public override async execute(req: Request, accountId?: string): Promise<DiscordCredentialEntity> {
    const oauthToken = RequestQueryUtil.parseStringQueryParam(req, 'oauthToken');
    const userInfo = await this.oauthService.getUserInfo(oauthToken);
    if (!userInfo) {
      this.logger.warn('Failed to retrieve user info from discord');
      throw new ControllerException(
        ExceptionCode.FailedToLoadDiscordUserInfo,
        FAILED_TO_LOAD_DISCORD_USER_INFO_MESSAGE,
      );
    }

    let entity = this.adapter.deserialize(req.body) as DiscordCredentialEntity;
    if (accountId) {
      entity.accountId = accountId;
    }
    entity.isVerified = true;
    entity.identifier = userInfo.id;
    entity.data = userInfo;

    return (await this.createUsecase.perform(entity)) as DiscordCredentialEntity;
  }
}

export class AddEmailPasswordCredentialStrategy extends AddCredentialStrategy {
  public constructor(createUsecase: CreateCredentialUsecase, adapter: CredentialV1Adapter, logger: LoggerService) {
    super(createUsecase, adapter, logger);
  }

  public override async execute(req: Request, accountId?: string): Promise<EmailPasswordCredentialEntity> {
    const email = req.body.data.email;
    const password = req.body.data.password;
    const hashedPassword = await EmailPasswordCredentialEntity.hash(password);
    const entity = new EmailPasswordCredentialEntity({
      accountId,
      identifier: email,
      isVerified: false,
      data: { email, password: hashedPassword },
    });

    return (await this.createUsecase.perform(entity)) as EmailPasswordCredentialEntity;
  }
}

export class AddSecretCredentialStrategy extends AddCredentialStrategy {
  public constructor(createUsecase: CreateCredentialUsecase, adapter: CredentialV1Adapter, logger: LoggerService) {
    super(createUsecase, adapter, logger);
  }

  public override async execute(req: Request, accountId?: string): Promise<SecretCredentialEntity> {
    // TODO: add validation that only application can have it
    const clientId = UuidUtil.generateNoSpecialSymbols(40);
    const secret = UuidUtil.generateNoSpecialSymbols(64);

    const params = { accountId, identifier: clientId, isVerified: true, data: { clientId, secret } };
    const entity = new SecretCredentialEntity(params);

    const hashedSecret = await SecretCredentialEntity.hash(secret);
    const storeParams = { ...params, data: { ...params.data, secret: hashedSecret } };
    let storeEntity = new SecretCredentialEntity(storeParams);

    storeEntity = (await this.createUsecase.perform(storeEntity)) as SecretCredentialEntity;
    entity.id = storeEntity.id;
    entity.createdAt = storeEntity.createdAt;

    return entity;
  }
}
