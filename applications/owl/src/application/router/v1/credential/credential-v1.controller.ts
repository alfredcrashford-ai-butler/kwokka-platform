import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import {
  CredentialEntity,
  AccountEntity,
  CredentialEntityType,
  VerifyTokenContent,
  TokenEntityType,
  VerifyTokenEntity,
} from '@kwokka/entities';
import { ApiResult, HttpStatus, ControllerException, CrudController, EmailService, TokenService } from '@kwokka/common-node';
import { CreateCredentialUsecase } from '../../../../usecase/credential/create-credential.usecase';
import { DeleteCredentialUsecase } from '../../../../usecase/credential/delete-credential.usecase';
import { GetCredentialByIdUsecase } from '../../../../usecase/credential/get-credential-by-id.usecase';
import { ListCredentialsByAccountIdUsecase } from '../../../../usecase/credential/list-credentials-by-account-id.usecase';
import { IssueVerifyTokenUsecase } from '../../../../usecase/token/issue-verify-token.usecase';
import { ListCredentialsUsecase } from '../../../../usecase/credential/list-credentials.usecase';
import { UpdateCredentialUsecase } from '../../../../usecase/credential/update-credential.usecase';
import { ExceptionCode } from '../../../../usecase/exception-code';
import { CredentialV1Adapter } from './credential-v1.adapter';
import { GetTokenByIdUsecase } from '../../../../usecase/token/get-token-by-id.usecase';
import { RevokeTokenByIdUsecase } from '../../../../usecase/token/revoke-token-by-id.usecase';
import { AddCredentialStrategyContext } from './add-credential-strategy';
import { GoogleOauth2Service } from '../../../service/google-oauth2.service';
import { DiscordOauth2Service } from '../../../service/discord-oauth2.service';
import { VerifyEmailPasswordCredentialTemplate } from '../../../email-template';

@injectable()
@injectFromBase()
export class CredentialV1Controller extends CrudController<CredentialEntity> {
  private addCredentialStrategyContext: AddCredentialStrategyContext;
  protected adapter: CredentialV1Adapter = new CredentialV1Adapter();

  public constructor(
    @inject(ListCredentialsUsecase) protected readonly listUsecase: ListCredentialsUsecase,
    @inject(ListCredentialsByAccountIdUsecase)
    protected readonly listByAccountIdUsecase: ListCredentialsByAccountIdUsecase,
    @inject(CreateCredentialUsecase) protected readonly createUsecase: CreateCredentialUsecase,
    @inject(UpdateCredentialUsecase) protected readonly updateUsecase: UpdateCredentialUsecase,
    @inject(GetCredentialByIdUsecase) protected readonly getByIdUsecase: GetCredentialByIdUsecase,
    @inject(DeleteCredentialUsecase) protected readonly deleteUsecase: DeleteCredentialUsecase,
    @inject(IssueVerifyTokenUsecase) protected readonly issueVerifyTokenUsecase: IssueVerifyTokenUsecase,
    @inject(GetTokenByIdUsecase) protected readonly getTokenByIdUsecase: GetTokenByIdUsecase,
    @inject(RevokeTokenByIdUsecase) protected readonly revokeTokenByIdUsecase: RevokeTokenByIdUsecase,
    @inject(EmailService) protected readonly emailService: EmailService,
    @inject(TokenService) protected readonly tokenService: TokenService,
    @inject(GoogleOauth2Service) protected readonly googleOauth2Service: GoogleOauth2Service,
    @inject(DiscordOauth2Service) protected readonly discordOauth2Service: DiscordOauth2Service,
  ) {
    super();
    this.addCredentialStrategyContext = new AddCredentialStrategyContext(
      this.createUsecase,
      this.adapter,
      this.logger,
      this.googleOauth2Service,
      this.discordOauth2Service,
    );
  }

  public override async create(req: Request): Promise<ApiResult<CredentialEntity>> {
    const entity = await this.addCredentialStrategyContext.runStrategy(req, req.body.accountId);
    this.logger.info(`${this.logPrefix} created credential: ${entity.identifier}`);
    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }

  public async createOwnCredential(req: Request, res: Response): Promise<ApiResult<CredentialEntity>> {
    const account = res.locals.account as AccountEntity;
    const entity = await this.addCredentialStrategyContext.runStrategy(req, account.id);
    this.logger.info(`${this.logPrefix} created own credential: ${entity.identifier}`);
    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }

  public async getOwnCredentialById(req: Request, res: Response): Promise<ApiResult<CredentialEntity>> {
    const credentialId = req.params.id;
    const entity = await this.getByIdUsecase.perform(req.params.id);
    const account = res.locals.account as AccountEntity;

    if (!entity || entity.accountId !== account.id) {
      throw new ControllerException(
        ExceptionCode.CredentialOfAccountNotFound,
        `Credential with id: ${credentialId} is not found for account with id: ${account.id}`,
      );
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }

  public async listOwnCredentials(req: Request, res: Response): Promise<ApiResult<CredentialEntity[]>> {
    const offset = this.parseOffset(req);
    const limit = this.parseLimit(req);
    const account = res.locals.account as AccountEntity;
    const usecaseResult = await this.listByAccountIdUsecase.perform(account.id, offset, limit);
    const data = this.adapter.serializeList(usecaseResult.payload);
    return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
  }

  public async list(req: Request): Promise<ApiResult<CredentialEntity[]>> {
    const accountId = this.parseStringQueryParam(req, 'accountId');
    if (accountId) {
      const offset = this.parseOffset(req);
      const limit = this.parseLimit(req);
      const usecaseResult = await this.listByAccountIdUsecase.perform(accountId, offset, limit);
      const data = this.adapter.serializeList(usecaseResult.payload);

      return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
    } else {
      return super.list(req);
    }
  }

  public async deleteOwnCredential(req: Request, res: Response): Promise<ApiResult<CredentialEntity>> {
    const credentialId = req.params.id;
    let entity = await this.getByIdUsecase.perform(credentialId);
    const account = res.locals.account as AccountEntity;

    if (!entity || entity.accountId !== account.id) {
      throw new ControllerException(
        ExceptionCode.CredentialOfAccountNotFound,
        `Credential with id: ${credentialId} is not found for account with id: ${account.id}`,
      );
    }

    const usecaseResult = await this.listByAccountIdUsecase.perform(account.id, 0, 2);
    if (usecaseResult.metadata.count <= 1) {
      throw new ControllerException(
        ExceptionCode.DeleteOfSingleCredentialNotAllowed,
        `Can not delete credential with id: ${credentialId} as it is the only credential for account with id: ${account.id}`,
      );
    }

    entity = await this.deleteUsecase.perform(credentialId);
    this.logger.info(`${this.logPrefix} deleted own credential: ${entity.identifier}`);

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }

  public async verifyCredential(req: Request): Promise<ApiResult<void>> {
    const credentialId = req.params.id;
    let credential = await this.getByIdUsecase.perform(credentialId);
    return this.processVerifyCredential(credential);
  }

  public async verifyOwnCredential(req: Request, res: Response): Promise<ApiResult<void>> {
    const credentialId = req.params.id;
    let credential = await this.getByIdUsecase.perform(credentialId);
    const account = res.locals.account as AccountEntity;

    if (credential.accountId !== account.id) {
      throw new ControllerException(
        ExceptionCode.CredentialOfAccountNotFound,
        `Credential with id: ${credentialId} is not found for account with id: ${account.id}`,
      );
    }

    return this.processVerifyCredential(credential);
  }

  public async completeVerifyOwnCredential(req: Request, res: Response): Promise<ApiResult<void>> {
    const credentialId = req.params.id;
    let credential = await this.getByIdUsecase.perform(credentialId);
    const account = res.locals.account as AccountEntity;

    if (!credential || credential?.accountId !== account.id) {
      throw new ControllerException(
        ExceptionCode.CredentialOfAccountNotFound,
        `Credential with id: ${credentialId} is not found for account with id: ${account.id}`,
      );
    }

    const tokenContent = this.tokenService.verify<VerifyTokenContent>(req.body.token);
    if (
      !tokenContent ||
      tokenContent.accountId !== account.id ||
      tokenContent.credentialId !== credentialId ||
      tokenContent.type !== TokenEntityType.Verify
    ) {
      throw new ControllerException(ExceptionCode.VerifyTokenInvalid, 'Provided verification token is invalid.');
    }

    const token = (await this.getTokenByIdUsecase.perform(tokenContent.jti)) as VerifyTokenEntity;
    if (token.isExpired() || token.isRevoked()) {
      throw new ControllerException(ExceptionCode.VerifyTokenInvalid, 'Provided verification token is invalid.');
    }

    await this.revokeTokenByIdUsecase.perform(token.id);
    await this.updateUsecase.perform(credentialId, { isVerified: true });

    return { status: HttpStatus.Ok, data: null };
  }

  private async processVerifyCredential(credential: CredentialEntity): Promise<ApiResult<void>> {
    if (credential.isVerified) {
      this.logger.warn(`${this.logPrefix} credential already verified: ${credential.identifier}`);
      throw new ControllerException(
        ExceptionCode.CredentialAlreadyVerified,
        `Credential with id: ${credential.id} is already verified.`,
      );
    }

    if (credential.type === CredentialEntityType.EmailPassword) {
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
    } else {
      throw new ControllerException(
        ExceptionCode.CredentialVerificationNotSupported,
        `Credential with id: ${credential.id} has type: ${credential.type}, which is not supported for verification.`,
      );
    }

    return { status: HttpStatus.Ok, data: null };
  }
}
