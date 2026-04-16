import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import {
  AccountEntity,
  CredentialEntity,
  CredentialEntityType,
  AccountRolesEntity,
  TokenContent,
  RestoreTokenContent,
  TokenEntityType,
  GoogleCredentialEntity,
  DiscordCredentialEntity,
  DiscordCredentialData,
} from '@kwokka/entities';
import {
  Controller,
  ApiResult,
  HttpStatus,
  ControllerException,
  ConfigService,
  EmailService,
  TokenService,
} from '@kwokka/common-node';
import { CreateAccountRolesUsecase } from '../../../../usecase/account-roles/create-account-roles.usecase';
import { CreateAccountUsecase } from '../../../../usecase/account/create-account.usecase';
import { GetAccountByIdUsecase } from '../../../../usecase/account/get-account-by-id.usecase';
import { CreateCredentialUsecase } from '../../../../usecase/credential/create-credential.usecase';
import { DeleteCredentialUsecase } from '../../../../usecase/credential/delete-credential.usecase';
import { GetCredentialByIdentifierUsecase } from '../../../../usecase/credential/get-credential-by-identifier.usecase';
import { GetTokenByIdUsecase } from '../../../../usecase/token/get-token-by-id.usecase';
import { ExceptionCode } from '../../../../usecase/exception-code';
import { IssueRestoreTokenUsecase } from '../../../../usecase/token/issue-restore-token.usecase';
import { IssueTokenPairUsecase } from '../../../../usecase/token/issue-token-pair.usecase';
import { EmailPasswordCredentialEntity, SecretCredentialEntity } from '../../../../entity';
import { RestoreEmailPasswordAccessTemplate } from '../../../email-template/restore-email-password-access.template';
import { IssueVerifyTokenUsecase } from '../../../../usecase/token/issue-verify-token.usecase';
import { GoogleOauth2Service, GoogleOauth2UserInfo, DiscordOauth2Service } from '../../../service';
import { VerifyEmailPasswordCredentialTemplate } from '../../../email-template';

export type SignUpResponse = { accountId: string };
export type SignInResponse = { access: string; refresh: string };
export type RestoreEmailTokenData = { email: string; accountId: string };

const EMAIL_INVALID_MESSAGE = 'The email must be provided with a propper address. Example: john.doe@example.com.';
const CREDENTIAL_INVALID_MESSAGE = 'Provided credential is not valid.';
const RESTORE_TOKEN_INVALID_MESSAGE = 'Restore token is not valid.';
const INACTIVE_ACCOUNT_MESSAGE = 'Can not sign in to this account, as it is not active.';
const RESTORE_INACTIVE_ACCOUNT_CREDENTIAL_MESSAGE = 'Can not restore a credential of an inactive account.';
const CREDENTIAL_ALREADY_USED_MESSAGE = 'Can not sign up with this credential as it is already used.';
const FAILED_TO_LOAD_GOOGLE_USER_INFO_MESSAGE = 'Can not load user info to perform oauth with google.';
const FAILED_TO_LOAD_DISCORD_USER_INFO_MESSAGE = 'Can not load user info to perform oauth with discord.';
const PASSWORD_INVALID_MESSAGE =
  'The password must consist of 6-30 characters, include at least one small letter, one capital letter, and one number, it should consist of alphanumeric characters or the following special characters: ?!$%&.';

@injectable()
@injectFromBase()
export class OnboardingV1Controller extends Controller {
  public constructor(
    @inject(CreateCredentialUsecase) protected readonly createCredentialUsecase: CreateCredentialUsecase,
    @inject(GetCredentialByIdentifierUsecase)
    protected readonly getCredentialByIdentifierUsecase: GetCredentialByIdentifierUsecase,
    @inject(GetAccountByIdUsecase) protected readonly getAccountByIdUsecase: GetAccountByIdUsecase,
    @inject(CreateAccountUsecase) protected readonly createAccountUsecase: CreateAccountUsecase,
    @inject(CreateAccountRolesUsecase) protected readonly createAccountRolesUsecase: CreateAccountRolesUsecase,
    @inject(IssueTokenPairUsecase) protected readonly issueTokenPairUsecase: IssueTokenPairUsecase,
    @inject(IssueVerifyTokenUsecase) protected readonly issueVerifyTokenUsecase: IssueVerifyTokenUsecase,
    @inject(DeleteCredentialUsecase) protected readonly deleteCredentialUsecase: DeleteCredentialUsecase,
    @inject(IssueRestoreTokenUsecase) protected readonly issueRestoreTokenUsecase: IssueRestoreTokenUsecase,
    @inject(GetTokenByIdUsecase) protected readonly getTokenByIdUsecase: GetTokenByIdUsecase,
    @inject(TokenService) protected readonly tokenService: TokenService,
    @inject(EmailService) protected readonly emailService: EmailService,
    @inject(GoogleOauth2Service) protected readonly googleOauth2Service: GoogleOauth2Service,
    @inject(DiscordOauth2Service) protected readonly discordOauth2Service: DiscordOauth2Service,
    @inject(ConfigService) protected readonly configService: ConfigService,
  ) {
    super();
  }

  public async signUpAnon(): Promise<ApiResult<SignUpResponse>> {
    let account = AccountEntity.getNewUserAccount();
    account = await this.createAccountUsecase.perform(account);
    this.logger.info(`${this.logPrefix} created account with id: ${account.id}`);
    let credential = new CredentialEntity({
      type: CredentialEntityType.Anonymous,
      accountId: account.id,
      identifier: account.id,
      isVerified: false,
      data: { accountId: account.id },
    });
    credential = await this.createCredentialUsecase.perform(credential);
    this.logger.info(`${this.logPrefix} created anon credential: ${credential.id} for account: ${account.id}`);
    await this.setupAccountRoles(account);

    return { status: HttpStatus.Ok, data: { accountId: account.id } };
  }

  public async signUpEmail(req: Request): Promise<ApiResult<SignUpResponse>> {
    // Step 1: validate inputs
    const isEmailValid = EmailPasswordCredentialEntity.isEmailValid(req.body.email);
    if (!isEmailValid) {
      throw new ControllerException(ExceptionCode.EmailInvalid, EMAIL_INVALID_MESSAGE);
    }
    const isPasswordValid = EmailPasswordCredentialEntity.isPasswordValid(req.body.password);
    if (!isPasswordValid) {
      throw new ControllerException(ExceptionCode.PasswordInvalid, PASSWORD_INVALID_MESSAGE);
    }

    // Step 2: check for existing credential
    let credential = (await this.getCredentialByIdentifierUsecase.perform(
      req.body.email,
    )) as EmailPasswordCredentialEntity;
    if (credential) {
      this.logger.warn(`${this.logPrefix} credential already exist: ${credential.identifier}`);
      throw new ControllerException(ExceptionCode.CredentialAlreadyExists, CREDENTIAL_ALREADY_USED_MESSAGE);
    }

    // Step 3: not found - create account, credential, account-roles mapping
    let account = AccountEntity.getNewUserAccount();
    account = await this.createAccountUsecase.perform(account);
    this.logger.info(`${this.logPrefix} created account with id: ${account.id}`);
    credential = await this.createEmailPasswordCredential(account.id, req.body.email, req.body.password);
    credential = (await this.createCredentialUsecase.perform(credential)) as EmailPasswordCredentialEntity;
    this.logger.info(`${this.logPrefix} created email credential: ${credential.id} for account: ${account.id}`);
    await this.setupAccountRoles(account);
    await this.sendVerificationEmail(credential);

    return { status: HttpStatus.Ok, data: { accountId: account.id } };
  }

  public async signInAnon(req: Request): Promise<ApiResult<SignInResponse>> {
    // Step 1: check for existing credential
    const id: string = req.body.id;
    const credential = await this.getCredentialByIdentifierUsecase.perform(id);
    if (!credential) {
      throw new ControllerException(ExceptionCode.CredentialInvalid, CREDENTIAL_INVALID_MESSAGE);
    }

    // Step 2: check account is active
    const account = await this.getAccountByIdUsecase.perform(credential.accountId);
    if (!account || !account.isActive) {
      this.logger.warn(`${this.logPrefix} account is inactive or deleted: ${credential.accountId}`);
      throw new ControllerException(ExceptionCode.SignInToInactiveAccountNotPossible, INACTIVE_ACCOUNT_MESSAGE);
    }

    // Step 3: issue tokens
    const tokenPair = await this.issueTokenPairUsecase.perform(account, credential.id);
    const access = this.tokenService.sign<TokenContent>(tokenPair.access.content);
    const refresh = this.tokenService.sign<TokenContent>(tokenPair.refresh.content);
    this.logger.info(`${this.logPrefix} new token pair issued for account: ${credential.accountId}`);

    return { status: HttpStatus.Ok, data: { access, refresh } };
  }

  public async signInSecret(req: Request): Promise<ApiResult<SignInResponse>> {
    // Step 1: check for existing credential
    const clientId: string = req.body.clientId;
    const credential = await this.getCredentialByIdentifierUsecase.perform(clientId);
    if (!credential) {
      this.logger.warn(`${this.logPrefix} secret credential can not be found: ${clientId}`);
      throw new ControllerException(ExceptionCode.CredentialInvalid, CREDENTIAL_INVALID_MESSAGE);
    }

    // Step 2: verify secret
    try {
      const secret: string = req.body.secret;
      const secretCredential = new SecretCredentialEntity(credential);
      const isValid = await secretCredential.verify(secret);
      if (!isValid) {
        throw new ControllerException(ExceptionCode.CredentialInvalid, CREDENTIAL_INVALID_MESSAGE);
      }
    } catch (e) {
      this.logger.error(e);
      throw new ControllerException(ExceptionCode.CredentialInvalid, CREDENTIAL_INVALID_MESSAGE);
    }

    // Step 3: check account is active
    const account = await this.getAccountByIdUsecase.perform(credential.accountId);
    if (!account || !account.isActive) {
      this.logger.warn(`${this.logPrefix} account is inactive or deleted: ${credential.accountId}`);
      throw new ControllerException(ExceptionCode.SignInToInactiveAccountNotPossible, INACTIVE_ACCOUNT_MESSAGE);
    }

    // Step 4: issue tokens
    const tokenPair = await this.issueTokenPairUsecase.perform(account, credential.id);
    const access = this.tokenService.sign<TokenContent>(tokenPair.access.content);
    const refresh = this.tokenService.sign<TokenContent>(tokenPair.refresh.content);
    this.logger.info(`${this.logPrefix} new token pair issued for account: ${credential.accountId}`);

    return { status: HttpStatus.Ok, data: { access, refresh } };
  }

  public async signInEmail(req: Request): Promise<ApiResult<SignInResponse>> {
    // Step 1: check for existing credential
    const email: string = req.body.email;
    const credential = await this.getCredentialByIdentifierUsecase.perform(email);
    if (!credential) {
      this.logger.warn(`${this.logPrefix} email credential can not be found: ${email}`);
      throw new ControllerException(ExceptionCode.CredentialInvalid, CREDENTIAL_INVALID_MESSAGE);
    }

    // Step 2: verify password
    try {
      const plainPassword: string = req.body.password;
      const emailCredential = new EmailPasswordCredentialEntity(credential);
      const isValid = await emailCredential.verify(plainPassword);
      if (!isValid) {
        throw new ControllerException(ExceptionCode.CredentialInvalid, CREDENTIAL_INVALID_MESSAGE);
      }
    } catch (e) {
      this.logger.error(e);
      throw new ControllerException(ExceptionCode.CredentialInvalid, CREDENTIAL_INVALID_MESSAGE);
    }

    // Step 3: check account is active
    const account = await this.getAccountByIdUsecase.perform(credential.accountId);
    if (!account || !account.isActive) {
      this.logger.warn(`${this.logPrefix} account is inactive or deleted: ${credential.accountId}`);
      throw new ControllerException(ExceptionCode.SignInToInactiveAccountNotPossible, INACTIVE_ACCOUNT_MESSAGE);
    }

    // Step 4: issue tokens
    const tokenPair = await this.issueTokenPairUsecase.perform(account, credential.id);
    const access = this.tokenService.sign<TokenContent>(tokenPair.access.content);
    const refresh = this.tokenService.sign<TokenContent>(tokenPair.refresh.content);
    this.logger.info(`${this.logPrefix} new token pair issued for account: ${credential.accountId}`);

    return { status: HttpStatus.Ok, data: { access, refresh } };
  }

  public async restoreEmail(req: Request): Promise<ApiResult<void>> {
    // Step 1: check credential exists
    const credential = (await this.getCredentialByIdentifierUsecase.perform(
      req.body.email,
    )) as EmailPasswordCredentialEntity;
    if (!credential) {
      this.logger.warn(`${this.logPrefix} email credential can not be found: ${req.body.email}`);
      return { status: HttpStatus.Ok, data: undefined };
    }

    // Step 2: check account is fine
    const account = await this.getAccountByIdUsecase.perform(credential.accountId);
    if (!account || !account.isActive) {
      this.logger.warn(`${this.logPrefix} account is inactive or deleted: ${credential.accountId}`);
      return { status: HttpStatus.Ok, data: undefined };
    }

    // Step 3: create restore token
    const token = await this.issueRestoreTokenUsecase.perform(account, credential, {
      email: req.body.email,
      accountId: account.id,
    });

    // Step 4: send email with restore link
    const restoreToken = this.tokenService.sign(token.content);
    const template = new RestoreEmailPasswordAccessTemplate();
    this.emailService.sendEmailWithTemplate([credential.data.email], template, { restoreToken });
    this.logger.info(`${this.logPrefix} sent email with restore token to account: ${account.id}`);

    return { status: HttpStatus.Ok, data: undefined };
  }

  public async completeRestoreEmail(req: Request): Promise<ApiResult<SignUpResponse>> {
    // Step 1: verify token
    const tokenString = req.body.token;
    const tokenContent = await this.tokenService.verify<RestoreTokenContent<RestoreEmailTokenData>>(tokenString);
    if (
      !tokenContent ||
      !tokenContent.data?.email ||
      !tokenContent.data?.accountId ||
      tokenContent.type !== TokenEntityType.Restore
    ) {
      this.logger.warn(`${this.logPrefix} token is invalid: ${tokenContent || '[TOKEN CONTENT NOT PARSED]'}`);
      throw new ControllerException(ExceptionCode.RestoreTokenInvalid, RESTORE_TOKEN_INVALID_MESSAGE);
    }

    // Step 2: validate token not deleted or revoked
    const token = await this.getTokenByIdUsecase.perform(tokenContent.jti);
    if (!token || token.isExpired() || token.isRevoked()) {
      this.logger.warn(`${this.logPrefix} token is deleted, expired, or revoked: ${tokenContent.jti}`);
      throw new ControllerException(ExceptionCode.RestoreTokenInvalid, RESTORE_TOKEN_INVALID_MESSAGE);
    }

    // Step 3: validate password
    const isPasswordValid = EmailPasswordCredentialEntity.isPasswordValid(req.body.password);
    if (!isPasswordValid) {
      throw new ControllerException(ExceptionCode.PasswordInvalid, PASSWORD_INVALID_MESSAGE);
    }

    // Step 4: verify credential
    const credential = await this.getCredentialByIdentifierUsecase.perform(tokenContent.data.email);
    if (!credential || credential.accountId !== tokenContent.data.accountId) {
      this.logger.warn(`${this.logPrefix} email credential can not be found: ${tokenContent.data.email}`);
      throw new ControllerException(ExceptionCode.RestoreTokenInvalid, RESTORE_TOKEN_INVALID_MESSAGE);
    }

    // Step 5: check account is fine
    const account = await this.getAccountByIdUsecase.perform(credential.accountId);
    if (!account || !account.isActive) {
      this.logger.warn(`${this.logPrefix} account is deleted or not active: ${credential.accountId}`);
      throw new ControllerException(
        ExceptionCode.RestoreInactiveAccountCredentialNotPossible,
        RESTORE_INACTIVE_ACCOUNT_CREDENTIAL_MESSAGE,
      );
    }

    // Step 6: delete credential
    await this.deleteCredentialUsecase.perform(credential.id);
    this.logger.info(`${this.logPrefix} deleted old credential: ${credential.identifier}`);

    // Step 7: create new credential
    let newCredential = await this.createEmailPasswordCredential(
      account.id,
      tokenContent.data.email,
      req.body.password,
    );
    newCredential = (await this.createCredentialUsecase.perform(newCredential)) as EmailPasswordCredentialEntity;
    this.logger.info(`${this.logPrefix} created new credential: ${newCredential.identifier}`);

    return { status: HttpStatus.Ok, data: { accountId: account.id } };
  }

  public async signUpGoogleOauth2(req: Request): Promise<ApiResult<SignUpResponse>> {
    // Step 1: get google data
    const userInfo = await this.googleOauth2Service.getUserInfo(req.body.accessToken);
    if (!userInfo) {
      this.logger.warn(`${this.logPrefix} failed to retrieve user info from google`);
      throw new ControllerException(ExceptionCode.FailedToLoadGoogleUserInfo, FAILED_TO_LOAD_GOOGLE_USER_INFO_MESSAGE);
    }

    // Step 2: check for existing credential
    let credential = (await this.getCredentialByIdentifierUsecase.perform(userInfo.sub)) as GoogleCredentialEntity;
    if (credential) {
      this.logger.warn(`${this.logPrefix} google credential already exists, sub: ${userInfo.sub}`);
      throw new ControllerException(ExceptionCode.CredentialAlreadyExists, CREDENTIAL_ALREADY_USED_MESSAGE);
    }

    // Step 3: not found - create account, credential, account-roles mapping
    let account = AccountEntity.getNewUserAccount();
    account = await this.createAccountUsecase.perform(account);
    this.logger.info(`${this.logPrefix} created account with id: ${account.id}`);
    credential = await this.createGoogleCredential(account.id, userInfo);
    credential = (await this.createCredentialUsecase.perform(credential)) as GoogleCredentialEntity;
    this.logger.info(`${this.logPrefix} created google credential: ${credential.id} for account: ${account.id}`);
    await this.setupAccountRoles(account);

    return { status: HttpStatus.Ok, data: { accountId: account.id } };
  }

  public async signUpDiscordOauth2(req: Request): Promise<ApiResult<SignUpResponse>> {
    // Step 1: get discord data
    const userInfo = await this.discordOauth2Service.getUserInfo(req.body.accessToken);
    if (!userInfo) {
      this.logger.warn(`${this.logPrefix} failed to retrieve user info from discord`);
      throw new ControllerException(ExceptionCode.FailedToLoadGoogleUserInfo, FAILED_TO_LOAD_DISCORD_USER_INFO_MESSAGE);
    }

    // Step 2: check for existing credential
    let credential = (await this.getCredentialByIdentifierUsecase.perform(userInfo.id)) as DiscordCredentialEntity;
    if (credential && credential.type === CredentialEntityType.Discord) {
      this.logger.warn(`${this.logPrefix} discord credential already exists, id: ${userInfo.id}`);
      throw new ControllerException(ExceptionCode.CredentialAlreadyExists, CREDENTIAL_ALREADY_USED_MESSAGE);
    }

    // Step 3: not found - create account, credential, account-roles mapping
    let account = AccountEntity.getNewUserAccount();
    account = await this.createAccountUsecase.perform(account);
    this.logger.info(`${this.logPrefix} created account with id: ${account.id}`);
    credential = await this.createDiscordCredential(account.id, userInfo);
    credential = (await this.createCredentialUsecase.perform(credential)) as DiscordCredentialEntity;
    this.logger.info(`${this.logPrefix} created discord credential: ${credential.id} for account: ${account.id}`);
    await this.setupAccountRoles(account);

    return { status: HttpStatus.Ok, data: { accountId: account.id } };
  }

  public async signInGoogleOauth2(req: Request): Promise<ApiResult<SignInResponse>> {
    // Step 1: get google data
    const userInfo = await this.googleOauth2Service.getUserInfo(req.body.accessToken);
    if (!userInfo) {
      this.logger.warn(`${this.logPrefix} failed to retrieve user info from google`);
      throw new ControllerException(ExceptionCode.FailedToLoadGoogleUserInfo, FAILED_TO_LOAD_GOOGLE_USER_INFO_MESSAGE);
    }

    // Step 2: check for existing credential
    const credential = await this.getCredentialByIdentifierUsecase.perform(userInfo.sub);
    if (!credential) {
      this.logger.warn(`${this.logPrefix} google credential can not be found, sub: ${userInfo.sub}`);
      throw new ControllerException(ExceptionCode.CredentialInvalid, CREDENTIAL_INVALID_MESSAGE);
    }

    // Step 3: check account is active
    const account = await this.getAccountByIdUsecase.perform(credential.accountId);
    if (!account || !account.isActive) {
      this.logger.warn(`${this.logPrefix} account is inactive or deleted: ${credential.accountId}`);
      throw new ControllerException(ExceptionCode.SignInToInactiveAccountNotPossible, INACTIVE_ACCOUNT_MESSAGE);
    }

    // Step 4: issue tokens
    const tokenPair = await this.issueTokenPairUsecase.perform(account, credential.id);
    const access = this.tokenService.sign<TokenContent>(tokenPair.access.content);
    const refresh = this.tokenService.sign<TokenContent>(tokenPair.refresh.content);
    this.logger.info(`${this.logPrefix} new token pair issued for account: ${credential.accountId}`);

    return { status: HttpStatus.Ok, data: { access, refresh } };
  }

  public async signInDiscordOauth2(req: Request): Promise<ApiResult<SignInResponse>> {
    // Step 1: get discord data
    const userInfo = await this.discordOauth2Service.getUserInfo(req.body.accessToken);
    if (!userInfo) {
      this.logger.warn(`${this.logPrefix} failed to retrieve user info from discord`);
      throw new ControllerException(ExceptionCode.FailedToLoadGoogleUserInfo, FAILED_TO_LOAD_DISCORD_USER_INFO_MESSAGE);
    }

    // Step 2: check for existing credential
    const credential = await this.getCredentialByIdentifierUsecase.perform(userInfo.id);
    if (!credential) {
      this.logger.warn(`${this.logPrefix} discord credential can not be found, id: ${userInfo.id}`);
      throw new ControllerException(ExceptionCode.CredentialInvalid, CREDENTIAL_INVALID_MESSAGE);
    }

    // Step 3: check account is active
    const account = await this.getAccountByIdUsecase.perform(credential.accountId);
    if (!account || !account.isActive) {
      this.logger.warn(`${this.logPrefix} account is inactive or deleted: ${credential.accountId}`);
      throw new ControllerException(ExceptionCode.SignInToInactiveAccountNotPossible, INACTIVE_ACCOUNT_MESSAGE);
    }

    // // Step 4: issue tokens
    const tokenPair = await this.issueTokenPairUsecase.perform(account, credential.id);
    const access = this.tokenService.sign<TokenContent>(tokenPair.access.content);
    const refresh = this.tokenService.sign<TokenContent>(tokenPair.refresh.content);
    this.logger.info(`${this.logPrefix} new token pair issued for account: ${credential.accountId}`);

    return { status: HttpStatus.Ok, data: { access, refresh } };
  }

  private async sendVerificationEmail(credential: EmailPasswordCredentialEntity): Promise<void> {
    const verifyToken = await this.issueVerifyTokenUsecase.perform(credential);
    const tokenString = this.tokenService.sign(verifyToken.content);

    await this.emailService.sendEmailWithTemplate(
      [credential.identifier],
      new VerifyEmailPasswordCredentialTemplate(),
      {
        verifyToken: tokenString,
        credentialId: credential.id,
      },
    );
    this.logger.info(`${this.logPrefix} sent verification email: ${credential.identifier}`);
  }

  private async setupAccountRoles(account: AccountEntity): Promise<void> {
    let accountRoles = new AccountRolesEntity({ accountId: account.id, accessRoles: [] });
    accountRoles = await this.createAccountRolesUsecase.perform(accountRoles);
    this.logger.info(`${this.logPrefix} created account roles: ${accountRoles.id} for account: ${account.id}`);
  }

  private async createEmailPasswordCredential(
    accountId: string,
    email: string,
    password: string,
  ): Promise<EmailPasswordCredentialEntity> {
    const hashedPassword = await EmailPasswordCredentialEntity.hash(password);
    return new EmailPasswordCredentialEntity({
      accountId: accountId,
      identifier: email,
      isVerified: false,
      data: { email, password: hashedPassword },
    });
  }

  private async createGoogleCredential(accountId: string, data: GoogleOauth2UserInfo): Promise<GoogleCredentialEntity> {
    const { emailVerified, ...rest } = data;
    return new GoogleCredentialEntity({
      accountId: accountId,
      identifier: data.sub,
      isVerified: true,
      data: rest,
    });
  }

  private async createDiscordCredential(
    accountId: string,
    data: DiscordCredentialData,
  ): Promise<DiscordCredentialEntity> {
    return new DiscordCredentialEntity({
      accountId: accountId,
      identifier: data.id,
      isVerified: true,
      data,
    });
  }
}
